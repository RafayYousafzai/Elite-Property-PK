"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

// The full chat panel pulls in @ai-sdk/react, ai, zod and @dnd-kit (~250KB
// of JS that Lighthouse flags as 85-99% unused on load). None of that
// should be fetched or executed until the visitor actually opens the chat.
const ChatWidget = dynamic(() => import("./ChatWidget"), { ssr: false });

const avatar_url =
  "https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=256&auto=format&fit=crop";

const BUBBLE_MESSAGES = [
  "Looking for DHA or Bahria plots?",
  "Need help with property buying?",
  "Interested in high-ROI investments?",
  "Request a callback from Elite Property!",
];

function SobaanAvatar() {
  return (
    <div className="relative shrink-0 w-16 h-16 sm:w-18 sm:h-18">
      <div className="w-full h-full rounded-full bg-[#d4af37] p-0.5 shadow-[0_10px_24px_rgba(212,175,55,0.35)] overflow-hidden flex items-center justify-center">
        <img
          src={avatar_url}
          alt="Elite Property Assistant"
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-[#22c55e] border-2 border-white rounded-full z-20" />
    </div>
  );
}

export default function ChatLauncher() {
  const [activated, setActivated] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState(BUBBLE_MESSAGES[0]);
  const bubbleTimerRef = useRef<number | null>(null);
  const bubbleHideTimerRef = useRef<number | null>(null);

  const pickRandomBubbleMessage = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * BUBBLE_MESSAGES.length);
    return BUBBLE_MESSAGES[randomIndex];
  }, []);

  useEffect(() => {
    if (activated) return;

    const scheduleNextBubble = () => {
      const delay = 30000 + Math.floor(Math.random() * 30000);
      bubbleTimerRef.current = window.setTimeout(() => {
        setBubbleText(pickRandomBubbleMessage());
        setShowBubble(true);

        if (bubbleHideTimerRef.current) {
          window.clearTimeout(bubbleHideTimerRef.current);
        }
        const hideDelay = 3000 + Math.floor(Math.random() * 2000);
        bubbleHideTimerRef.current = window.setTimeout(() => {
          setShowBubble(false);
        }, hideDelay);

        scheduleNextBubble();
      }, delay);
    };

    scheduleNextBubble();

    return () => {
      if (bubbleTimerRef.current) window.clearTimeout(bubbleTimerRef.current);
      if (bubbleHideTimerRef.current)
        window.clearTimeout(bubbleHideTimerRef.current);
    };
  }, [activated, pickRandomBubbleMessage]);

  if (activated) {
    return <ChatWidget defaultOpen />;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="relative">
        <div
          className={`absolute right-full top-1/2 z-10 mr-4 -translate-y-1/2 transition-all duration-500 ease-out ${
            showBubble
              ? "translate-x-0 opacity-100"
              : "translate-x-2 opacity-0"
          }`}
          aria-hidden="true"
        >
          <div className="relative rounded-[22px] bg-white p-3 ring-1 ring-black/5">
            <p className="whitespace-nowrap text-small leading-none text-[#222]">
              {bubbleText}
            </p>
          </div>
        </div>

        <button
          onClick={() => setActivated(true)}
          className="group h-16 w-16 sm:h-18 sm:w-18 rounded-full cursor-pointer focus:outline-none flex items-center justify-center transition-transform hover:scale-105 active:scale-95 bg-transparent border-none p-0 outline-none"
          aria-label="Open Elite Property PK chat"
        >
          <SobaanAvatar />
        </button>
      </div>
    </div>
  );
}
