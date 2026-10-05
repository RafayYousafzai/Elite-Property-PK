import { streamText, convertToModelMessages, stepCountIs, type UIMessage } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { after } from "next/server";
import { buildSystemPrompt, detectLanguage } from "@/lib/agent/prompt";
import { getAgentTools } from "@/lib/agent/tools";
import { getInventorySummary, getListingBySlug } from "@/lib/agent/properties";
import { extractPhone, saveLead } from "@/lib/agent/leads";
import { getTeamMembersServer } from "@/lib/supabase/team-server";

export const runtime = "nodejs";

// Suppress AI SDK internal warning log in dev/edge environments
(globalThis as any).AI_SDK_LOG_WARNINGS = false;

const MODEL_ID = process.env.CHAT_MODEL || "gemini-3.5-flash-lite";
const MAX_HISTORY_MESSAGES = 16;
const MAX_USER_TEXT = 1500;

// ---------------------------------------------------------------- rate limit
// Best-effort per-IP limit (per server instance) so the public endpoint can't
// be used to run up the model bill.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 40;
const hits = new Map<string, number[]>();

function rateLimited(ip: string): boolean {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_REQUESTS_PER_WINDOW;
}

// ---------------------------------------------------------------- context
let teamCache: { text: string; at: number } | null = null;

async function getTeamSummary(): Promise<string> {
  if (teamCache && Date.now() - teamCache.at < 10 * 60 * 1000) return teamCache.text;
  const members = await getTeamMembersServer();
  const text = members.length
    ? members.map((m) => `${m.name} (${m.role})`).join(", ")
    : "Our advisors are listed on /team.";
  teamCache = { text, at: Date.now() };
  return text;
}

async function getViewingListing(page: unknown) {
  if (typeof page !== "string") return null;
  const slug = page.match(/^\/explore\/([^/?#]+)/)?.[1];
  return slug ? getListingBySlug(decodeURIComponent(slug)) : null;
}

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

const textOf = (msg: UIMessage) =>
  msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join(" ");

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body?.ping) return json({ ok: true, message: "pong" }, 200);

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
    if (rateLimited(ip)) {
      return json({ error: "Too many messages. Please wait a few minutes, or WhatsApp us directly." }, 429);
    }

    const apiKey = (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || "").trim();
    if (!apiKey || apiKey.includes("YOUR_")) {
      console.warn("⚠️ GEMINI_API_KEY is missing or unconfigured.");
      return json({ error: "Chat is not configured." }, 500);
    }

    const sessionId =
      typeof body.sessionId === "string" && /^sess_[\w-]{4,40}$/.test(body.sessionId)
        ? body.sessionId
        : "anonymous";

    const tools = getAgentTools(sessionId);
    const toolNames = new Set(Object.keys(tools));

    // Keep the recent tail, cap message length, and drop tool parts from
    // older versions of the assistant whose tools no longer exist.
    const incoming: UIMessage[] = Array.isArray(body.messages) ? body.messages : [];
    let messages = incoming.slice(-MAX_HISTORY_MESSAGES).map((msg) => ({
      ...msg,
      parts: (msg.parts ?? [])
        .filter((p) => !p.type.startsWith("tool-") || toolNames.has(p.type.slice(5)))
        .map((p) =>
          msg.role === "user" && p.type === "text" ? { ...p, text: p.text.slice(0, MAX_USER_TEXT) } : p,
        ),
    })) as UIMessage[];
    while (messages.length && messages[0].role !== "user") messages = messages.slice(1);
    if (messages.length === 0) return json({ error: "No message to answer." }, 400);

    // Safety net: capture a phone number even if the model forgets to save it
    const lastUser = [...messages].reverse().find((m) => m.role === "user");
    const phone = lastUser ? extractPhone(textOf(lastUser)) : null;
    if (phone && sessionId !== "anonymous") {
      after(() => saveLead(sessionId, { phone_number: phone }).catch((err) => console.error("saveLead failed:", err)));
    }

    const [inventory, team, viewing, modelMessages] = await Promise.all([
      getInventorySummary(),
      getTeamSummary(),
      getViewingListing(body.page),
      convertToModelMessages(messages, { tools, ignoreIncompleteToolCalls: true }),
    ]);

    const google = createGoogleGenerativeAI({ apiKey });

    const result = streamText({
      model: google(MODEL_ID),
      system: buildSystemPrompt({
        language: detectLanguage(lastUser ? textOf(lastUser) : ""),
        inventory,
        team,
        viewing,
        today: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Karachi" }),
      }),
      messages: modelMessages,
      tools,
      stopWhen: stepCountIs(4),
      maxOutputTokens: 600,
      temperature: 0.3,
      providerOptions: {
        // Reasoning tokens add latency without improving this short-form chat.
        // 3.x-lite rejects thinkingBudget and expects thinkingLevel instead.
        google: { thinkingConfig: { thinkingLevel: "minimal" } },
      },
      onError: ({ error }) => console.error("=== CHAT STREAM ERROR ===", error),
    });

    return result.toUIMessageStreamResponse({
      onError: () => "Sorry, something went wrong on our side. Please try again.",
    });
  } catch (error: any) {
    console.error("Chat API error:", error);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
}
