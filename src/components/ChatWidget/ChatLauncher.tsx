"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { ASSISTANT_NAME } from "@/lib/agent/brand";
import { AssistantAvatar } from "./AssistantAvatar";

// The chat panel pulls in @ai-sdk/react and ai. None of that is fetched until
// the visitor shows intent (hover/touch on the launcher) or opens the chat.
const loadPanel = () => import("./ChatWidget");
const ChatWidget = dynamic(loadPanel, { ssr: false });

const BUBBLES = [
  "Looking for a home in DHA?",
  "Plots under 3 crore? Ask me",
  "Ask me about any listing",
];

export default function ChatLauncher() {
  const pathname = usePathname();
  const [activated, setActivated] = useState(false);
  const [open, setOpen] = useState(false);
  const [bubble, setBubble] = useState<string | null>(null);

  const onListing = /^\/explore\/[^/]+/.test(pathname);

  // Occasional hint bubble until the visitor has opened the chat once
  useEffect(() => {
    if (activated) return;
    let hideTimer: number;
    const show = (text: string) => {
      setBubble(text);
      hideTimer = window.setTimeout(() => setBubble(null), 5000);
    };
    const first = window.setTimeout(
      () => show(onListing ? "Questions about this property? Ask me" : BUBBLES[0]),
      onListing ? 8000 : 20000,
    );
    const repeat = window.setInterval(
      () => show(BUBBLES[Math.floor(Math.random() * BUBBLES.length)]),
      45000,
    );
    return () => {
      window.clearTimeout(first);
      window.clearTimeout(hideTimer);
      window.clearInterval(repeat);
    };
  }, [activated, onListing]);

  const openChat = useCallback(() => {
    setActivated(true);
    setOpen(true);
    setBubble(null);
  }, []);
  const closeChat = useCallback(() => setOpen(false), []);

  return (
    <>
      {activated && <ChatWidget open={open} onClose={closeChat} />}

      {!open && (
        <div className="chat-launcher-dock fixed bottom-6 right-6 z-50">
          <div
            className={`pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 transition-all duration-500 ${
              bubble ? "translate-x-0 opacity-100" : "translate-x-2 opacity-0"
            }`}
            aria-hidden
          >
            <p className="whitespace-nowrap rounded-full border border-stone-200 bg-white px-4 py-2.5 text-[13px] text-[#1a1714] shadow-lg shadow-stone-900/10">
              {bubble}
            </p>
          </div>
          <button
            type="button"
            onClick={openChat}
            onPointerEnter={loadPanel}
            onTouchStart={loadPanel}
            onFocus={loadPanel}
            aria-label={`Chat with ${ASSISTANT_NAME}, our property assistant`}
            className="flex cursor-pointer rounded-full transition-transform duration-200 hover:scale-105 active:scale-95"
          >
            <AssistantAvatar size={60} online />
          </button>
        </div>
      )}
    </>
  );
}
