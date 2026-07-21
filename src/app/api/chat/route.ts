import { streamText, convertToModelMessages, stepCountIs } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { ELITE_SYSTEM_PROMPT } from "@/lib/agent/prompt";
import { getAgentTools } from "@/lib/agent/tools";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (body?.ping) {
      return new Response(JSON.stringify({ ok: true, message: "pong" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { messages = [], sessionId = "anonymous" } = body;

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

    // Strictly model gemini-3.1-flash-lite as requested
    const model = google("gemini-3.1-flash-lite");

    const result = streamText({
      model,
      stopWhen: stepCountIs(10),
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
