import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { ELITE_SYSTEM_PROMPT } from "@/lib/agent/prompt";
import { getAgentTools } from "@/lib/agent/tools";

export const runtime = "nodejs";

// Suppress AI SDK internal warning log in dev/edge environments
(globalThis as any).AI_SDK_LOG_WARNINGS = false;

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

    // 1. Deduplicate consecutive identical user messages (prevents rapid double-submits)
    const dedupedMessages: any[] = [];
    for (const msg of messages) {
      const prev = dedupedMessages[dedupedMessages.length - 1];
      if (
        prev &&
        prev.role === "user" &&
        msg.role === "user" &&
        (msg.content === prev.content ||
          (msg.parts && prev.parts && JSON.stringify(msg.parts) === JSON.stringify(prev.parts)))
      ) {
        continue;
      }
      dedupedMessages.push(msg);
    }

    // 2. Merge consecutive assistant messages
    const mergedMessages: any[] = [];
    for (const msg of dedupedMessages) {
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

    // 3. Ensure parts array is properly formed for convertToModelMessages
    const messagesWithUrls = finalMessages.map((msg) => {
      const parts = msg.parts ? [...msg.parts] : [{ type: "text", text: msg.content || "" }];
      const updatedMsg = { ...msg, parts };

      if (msg.role === "user") {
        const fileParts = parts.filter((p: any) => p.type === "file" && p.url);
        if (fileParts.length > 0) {
          const urlList = fileParts.map((p: any) => `[Uploaded File URL: ${p.url}]`).join("\n");
          const textPartIndex = parts.findIndex((p: any) => p.type === "text");
          if (textPartIndex !== -1) {
            parts[textPartIndex] = {
              ...parts[textPartIndex],
              text: `${parts[textPartIndex].text}\n\n${urlList}`,
            };
          } else {
            parts.push({
              type: "text",
              text: urlList,
            });
          }
          if (updatedMsg.content) {
            updatedMsg.content = `${updatedMsg.content}\n\n${urlList}`;
          }
        }
      }
      return updatedMsg;
    });

    const rawModelMessages = await convertToModelMessages(messagesWithUrls);

    // 4. Sanitize model messages to prevent AI_MissingToolResultsError:
    // Gather all toolCallIds that have tool-results in the conversation
    const resolvedToolCallIds = new Set<string>();
    for (const message of rawModelMessages) {
      if (message.role === "tool" && Array.isArray(message.content)) {
        for (const part of message.content) {
          if (part.type === "tool-result" && part.toolCallId) {
            resolvedToolCallIds.add(part.toolCallId);
          }
        }
      }
    }

    // Filter out unresolved tool-calls from assistant messages
    const cleanModelMessages: typeof rawModelMessages = [];
    for (const message of rawModelMessages) {
      if (message.role === "assistant" && Array.isArray(message.content)) {
        const validContent = message.content.filter((part: any) => {
          if (part.type === "tool-call") {
            return resolvedToolCallIds.has(part.toolCallId) || Boolean(part.providerExecuted);
          }
          return true;
        });
        if (validContent.length > 0) {
          cleanModelMessages.push({ ...message, content: validContent });
        }
      } else if (message.role === "tool" && Array.isArray(message.content)) {
        if (message.content.length > 0) {
          cleanModelMessages.push(message);
        }
      } else {
        cleanModelMessages.push(message);
      }
    }

    while (
      cleanModelMessages.length > 0 &&
      cleanModelMessages[0].role !== "user" &&
      cleanModelMessages[0].role !== "system"
    ) {
      cleanModelMessages.shift();
    }

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
      messages: cleanModelMessages,
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
