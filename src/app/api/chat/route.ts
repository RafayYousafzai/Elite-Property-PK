import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { ELITE_SYSTEM_PROMPT } from "@/lib/agent/prompt";
import { getAgentTools } from "@/lib/agent/tools";

export const runtime = "edge";

const MODEL_ID = "gemini-3.5-flash-lite";
const MAX_HISTORY_MESSAGES = 14;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body?.ping) {
      return new Response(JSON.stringify({ ok: true, message: "pong" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { messages: allMessages = [], sessionId = "anonymous" } = body;

    // Only the tail of the conversation matters for this intake flow; sending
    // the whole transcript on every turn is the biggest avoidable token cost.
    const messages = allMessages.slice(-MAX_HISTORY_MESSAGES);

    const apiKey = (
      process.env.GEMINI_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      ""
    ).trim();

    if (!apiKey || apiKey.includes("YOUR_")) {
      console.warn("⚠️ GEMINI_API_KEY is missing or unconfigured.");
      return new Response(
        JSON.stringify({
          error: "GEMINI_API_KEY is missing. Please add your key to .env or .env.local file.",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const google = createGoogleGenerativeAI({
      apiKey,
    });

    const mergedMessages: any[] = [];
    for (const msg of messages) {
      if (
        mergedMessages.length > 0 &&
        msg.role === "assistant" &&
        mergedMessages[mergedMessages.length - 1].role === "assistant"
      ) {
        const lastMsg = mergedMessages[mergedMessages.length - 1];
        if (msg.content) {
          lastMsg.content = (lastMsg.content || "") + "\n\n" + msg.content;
        }
        if (msg.parts && lastMsg.parts) {
          lastMsg.parts = [...lastMsg.parts, ...msg.parts];
        } else if (msg.parts) {
          lastMsg.parts = msg.parts;
        }
      } else {
        mergedMessages.push({ ...msg });
      }
    }

    const sanitizedMessages = [...mergedMessages];
    while (sanitizedMessages.length > 0 && sanitizedMessages[0].role !== "user") {
      sanitizedMessages.shift();
    }

    const finalMessages = sanitizedMessages.length > 0 ? sanitizedMessages : mergedMessages;

    const messagesWithUrls = finalMessages.map((msg) => {
      if (msg.role === "user" && msg.parts) {
        const fileParts = msg.parts.filter((p: any) => p.type === "file" && p.url);
        if (fileParts.length > 0) {
          const updatedMsg = { ...msg, parts: [...msg.parts] };
          const urlList = fileParts.map((p: any) => `[Uploaded File URL: ${p.url}]`).join("\n");
          const textPartIndex = updatedMsg.parts.findIndex((p: any) => p.type === "text");
          if (textPartIndex !== -1) {
            updatedMsg.parts[textPartIndex] = {
              ...updatedMsg.parts[textPartIndex],
              text: `${updatedMsg.parts[textPartIndex].text}\n\n${urlList}`,
            };
          } else {
            updatedMsg.parts.push({
              type: "text",
              text: urlList,
            });
          }
          if (updatedMsg.content) {
            updatedMsg.content = `${updatedMsg.content}\n\n${urlList}`;
          }
          return updatedMsg;
        }
      }
      return msg;
    });

    const modelMessages = await convertToModelMessages(messagesWithUrls);

    const model = google(MODEL_ID);

    const result = streamText({
      model,
      // Replies are one short sentence; tool calls need a little more headroom
      maxOutputTokens: 400,
      temperature: 0.4,
      providerOptions: {
        // Scripted intake flow, so reasoning tokens are pure cost. Note that
        // 3.x-lite rejects thinkingBudget (400 INVALID_ARGUMENT) and expects
        // thinkingLevel instead.
        google: { thinkingConfig: { thinkingLevel: "minimal" } },
      },
      stopWhen: stepCountIs(5),
      system: ELITE_SYSTEM_PROMPT,
      messages: modelMessages,
      tools: getAgentTools(sessionId),
      onError: ({ error }) => {
        console.error("=== GEMINI STREAM ERROR ===", error);
      },
    });

    return result.toUIMessageStreamResponse();
  } catch (error: any) {
    console.error("API Crash:", error);
    return new Response(JSON.stringify({ error: error?.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
