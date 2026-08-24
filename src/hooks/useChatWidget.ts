"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useState, useCallback } from "react";

const uploadFileToSupabase = async (fileObj: File, sessionId: string) => {
  try {
    const response = await fetch("/api/upload", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fileName: fileObj.name,
        fileType: fileObj.type,
        sessionId,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate upload URL: status ${response.status}`);
    }

    const { signedUrl, publicUrl } = await response.json();
    if (!signedUrl || !publicUrl) {
      throw new Error("Invalid response from upload API");
    }

    const uploadResponse = await fetch(signedUrl, {
      method: "PUT",
      headers: {
        "Content-Type": fileObj.type,
      },
      body: fileObj,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Direct upload failed with status ${uploadResponse.status}`);
    }

    return publicUrl as string;
  } catch (err) {
    console.error("File upload failed:", err);
    return null;
  }
};

interface StoredSession {
  sessionId: string;
  expiresAt: number;
  messages: any[];
  hasSentFollowUp?: boolean;
}

const SESSION_KEY = "elite_chat_session";
const ONE_HOUR = 60 * 60 * 1000;

const getStoredSession = (): StoredSession | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch (err) {
    console.error("Error reading stored session:", err);
    return null;
  }
};

const safeSliceMessages = (messages: any[], targetLimit: number): any[] => {
  if (messages.length <= targetLimit) return messages;

  let startIndex = messages.length - targetLimit;
  while (startIndex > 0 && messages[startIndex].role !== "user") {
    startIndex--;
  }

  if (startIndex === 0 && messages[startIndex].role !== "user") {
    startIndex = messages.length - targetLimit;
    while (startIndex < messages.length && messages[startIndex].role !== "user") {
      startIndex++;
    }
  }

  if (startIndex >= messages.length) {
    return messages.slice(-targetLimit);
  }

  return messages.slice(startIndex);
};

export function useChatWidget(options?: { initialOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(options?.initialOpen ?? false);
  const [input, setInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const [sessionData] = useState(() => {
    const stored = getStoredSession();
    if (stored) {
      return stored;
    }
    const randomPart =
      typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
        ? crypto.randomUUID().substring(0, 8)
        : Math.random().toString(36).substring(2, 10);
    const newSessionId = `sess_${randomPart}`;
    const newSession: StoredSession = {
      sessionId: newSessionId,
      expiresAt: Date.now() + ONE_HOUR,
      messages: [],
      hasSentFollowUp: false,
    };
    if (typeof window !== "undefined") {
      localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    }
    return newSession;
  });

  const sessionId = sessionData?.sessionId || "";

  const [hasSentFollowUp, setHasSentFollowUp] = useState(() => {
    return sessionData?.hasSentFollowUp || false;
  });

  const { messages, sendMessage, status, error, setMessages } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { sessionId },
    }),
    messages: sessionData?.messages || [],
  });

  useEffect(() => {
    if (typeof window === "undefined" || !sessionId) return;
    const session: StoredSession = {
      sessionId,
      expiresAt: Date.now() + ONE_HOUR,
      messages: safeSliceMessages(messages, 20),
      hasSentFollowUp,
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }, [messages, sessionId, hasSentFollowUp]);

  useEffect(() => {
    if (messages.length === 0 || hasSentFollowUp) return;

    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role !== "assistant") return;

    const timer = setTimeout(() => {
      const followUp = {
        id: `followup_${Date.now()}`,
        role: "assistant" as const,
        content: "Hi, are you still looking for property guidance or assistance?",
        parts: [{ type: "text" as const, text: "Hi, are you still looking for property guidance or assistance?" }],
      };
      setMessages((prev) => [...prev, followUp]);
      setHasSentFollowUp(true);
    }, 45000);

    return () => clearTimeout(timer);
  }, [messages, hasSentFollowUp, setMessages]);

  const isReady = (status === "ready" || status === "error") && !isUploading;
  const isProcessing = status === "submitted" || status === "streaming" || isUploading;

  const uploadAndSend = useCallback(
    async (text: string, selectedFile?: File | null) => {
      let finalMessageText = text.trim();
      let uploadedUrl: string | null = null;

      if (selectedFile) {
        const MAX_FILE_SIZE = 5 * 1024 * 1024;
        if (selectedFile.size > MAX_FILE_SIZE) {
          alert("File size exceeds 5MB limit. Please upload a smaller file.");
          setInput("");
          return;
        }
        setIsUploading(true);
        uploadedUrl = await uploadFileToSupabase(selectedFile, sessionId);
        setIsUploading(false);

        if (!uploadedUrl) {
          finalMessageText += "\n[System Notification: Document upload failed.]";
        }
      }

      if (uploadedUrl && selectedFile) {
        const filePart = {
          type: "file" as const,
          mediaType: selectedFile.type || "image/*",
          filename: selectedFile.name,
          url: uploadedUrl,
        };

        await sendMessage(
          finalMessageText
            ? { text: finalMessageText, files: [filePart] }
            : { files: [filePart] }
        );
      } else if (finalMessageText) {
        await sendMessage({ text: finalMessageText });
      }

      setInput("");
    },
    [sendMessage, sessionId]
  );

  const handleSubmit = useCallback(
    async (e?: React.SyntheticEvent, selectedFile?: File | null) => {
      e?.preventDefault();
      await uploadAndSend(input, selectedFile);
    },
    [input, uploadAndSend]
  );

  const sendText = useCallback(
    async (text: string, selectedFile?: File | null) => {
      await uploadAndSend(text, selectedFile);
    },
    [uploadAndSend]
  );

  return {
    isOpen,
    setIsOpen,
    sessionId,
    input,
    setInput,
    messages,
    error,
    isReady,
    isProcessing,
    handleSubmit,
    sendText,
    isUploading,
  };
}
