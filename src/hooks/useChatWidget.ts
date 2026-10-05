"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// v2: the assistant's tools changed, so older stored conversations are dropped
const SESSION_KEY = "elite_chat_session_v2";
const SESSION_TTL = 24 * 60 * 60 * 1000;
const MAX_STORED_MESSAGES = 30;

type StoredSession = {
  sessionId: string;
  expiresAt: number;
  messages: UIMessage[];
};

const newSessionId = () =>
  `sess_${
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID().slice(0, 12)
      : Math.random().toString(36).slice(2, 14)
  }`;

function readSession(): StoredSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredSession;
    if (Date.now() > parsed.expiresAt) {
      localStorage.removeItem(SESSION_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeSession(session: StoredSession) {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // Storage full or blocked (private mode) — the chat still works, it just won't persist
  }
}

export function useChatWidget() {
  const [session] = useState<StoredSession>(
    () => readSession() ?? { sessionId: newSessionId(), expiresAt: Date.now() + SESSION_TTL, messages: [] },
  );
  const sessionIdRef = useRef(session.sessionId);
  const [input, setInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        // Resolved per request so the assistant always knows the current page
        body: () => ({ sessionId: sessionIdRef.current, page: window.location.pathname }),
      }),
    [],
  );

  const { messages, sendMessage, status, error, regenerate, stop, clearError, setMessages } = useChat({
    transport,
    messages: session.messages,
  });

  // Persist only settled conversations (not every streamed token)
  useEffect(() => {
    if (status === "streaming" || status === "submitted") return;
    writeSession({
      sessionId: sessionIdRef.current,
      expiresAt: Date.now() + SESSION_TTL,
      messages: messages.slice(-MAX_STORED_MESSAGES),
    });
  }, [messages, status]);

  const isBusy = status === "submitted" || status === "streaming";

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isBusy) return;
      if (error) clearError();
      setInput("");
      sendMessage({ text: trimmed });
    },
    [isBusy, error, clearError, sendMessage],
  );

  const retry = useCallback(() => {
    clearError();
    regenerate();
  }, [clearError, regenerate]);

  const reset = useCallback(() => {
    stop();
    clearError();
    sessionIdRef.current = newSessionId();
    setMessages([]);
    setInput("");
  }, [stop, clearError, setMessages]);

  return { messages, input, setInput, send, status, isBusy, error, retry, stop, reset };
}
