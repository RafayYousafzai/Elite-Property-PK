"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { usePathname } from "next/navigation";
import { ArrowUp, MessageCircle, RotateCcw, Square, X } from "lucide-react";
import { useChatWidget } from "@/hooks/useChatWidget";
import { ASSISTANT_NAME, CONTACT } from "@/lib/agent/brand";
import { AssistantAvatar } from "./AssistantAvatar";
import { ChatMessages, QuickReplies, ViewListingsLink } from "./ChatMessages";

const isListingPage = (path: string) => /^\/explore\/[^/]+/.test(path);

function starterPrompts(path: string): string[] {
  if (isListingPage(path)) {
    return ["Is this still available?", "Book a viewing", "Payment plan?", "Similar properties"];
  }
  return ["Houses in DHA Phase 2", "Plots under 3 crore", "Book a site visit", "Talk to an advisor"];
}

/** Tracks the visual viewport so the panel stays above the phone keyboard. */
function useVisualViewport(active: boolean) {
  const [vv, setVv] = useState<{ height: number; top: number } | null>(null);
  useEffect(() => {
    const viewport = window.visualViewport;
    if (!active || !viewport) {
      setVv(null);
      return;
    }
    const update = () => setVv({ height: viewport.height, top: viewport.offsetTop });
    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);
    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, [active]);
  return vv;
}

export default function ChatWidget({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { messages, input, setInput, send, status, isBusy, error, retry, stop, reset } = useChatWidget();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const vv = useVisualViewport(open && isMobile);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 639px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Escape closes; on phones the page behind the full-screen sheet shouldn't scroll
  useEffect(() => {
    if (!open) return;
    const onKey = (e: globalThis.KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const original = document.body.style.overflow;
    if (isMobile) document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = original;
    };
  }, [open, isMobile, onClose]);

  // Focus the input on desktop (on phones this would pop the keyboard unasked)
  useEffect(() => {
    if (open && !isMobile) textareaRef.current?.focus();
  }, [open, isMobile]);

  // Grow the input with its content, up to ~4 lines
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 112)}px`;
  }, [input]);

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send(input);
    }
  };

  const whatsappHref = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(
    isListingPage(pathname)
      ? `Hi, I'm interested in this property: https://www.elitepropertypk.com${pathname}`
      : "Hi, I'd like help finding a property in DHA Islamabad.",
  )}`;

  const emptyState = (
    <div className="space-y-4">
      <div className="flex items-end gap-2.5">
        <AssistantAvatar size={32} />
        <div className="max-w-[82%] rounded-2xl rounded-bl-md bg-white px-4 py-3 text-[13.5px] leading-relaxed text-stone-700 ring-1 ring-stone-200">
          <p>
            Assalam o Alaikum! I&apos;m <strong className="font-semibold text-[#1a1714]">{ASSISTANT_NAME}</strong>.{" "}
            {isListingPage(pathname)
              ? "Ask me anything about this property — price, size, features or booking a viewing."
              : "I can find listings that fit your budget, answer questions about any property, or connect you with an advisor."}
          </p>
          <p className="mt-1.5 text-stone-500">English, Urdu or Roman Urdu — whatever suits you.</p>
        </div>
      </div>
      <QuickReplies options={starterPrompts(pathname)} onSelect={send} />
      {!isListingPage(pathname) && (
        <div className="pl-[42px]">
          <ViewListingsLink />
        </div>
      )}
    </div>
  );

  return (
    <div
      role="dialog"
      aria-modal={isMobile}
      aria-label={`Chat with ${ASSISTANT_NAME}`}
      hidden={!open}
      data-lenis-prevent
      className="fixed inset-x-0 top-0 z-[300] flex flex-col bg-[#faf8f3] text-[#1a1714] animate-in fade-in slide-in-from-bottom-4 duration-200 sm:inset-auto sm:bottom-6 sm:right-6 sm:h-[min(660px,calc(100dvh-7rem))] sm:w-[400px] sm:overflow-hidden sm:rounded-2xl sm:border sm:border-stone-200 sm:shadow-2xl sm:shadow-stone-900/15"
      style={isMobile ? { height: vv ? vv.height : "100dvh", top: vv?.top ?? 0 } : undefined}
    >
      {/* Header */}
      <header className="flex shrink-0 items-center gap-3 border-b border-stone-200 bg-white px-4 py-3">
        <AssistantAvatar size={40} online />
        <div className="min-w-0 flex-1">
          <p className="font-[family-name:var(--font-display)] text-xl font-semibold leading-tight">{ASSISTANT_NAME}</p>
          <p className="truncate text-[11px] text-stone-500">AI property assistant</p>
        </div>
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with an advisor on WhatsApp"
          title="Talk to a person on WhatsApp"
          className="flex h-9 w-9 items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-[#1a1714]"
        >
          <MessageCircle size={18} strokeWidth={1.75} />
        </a>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={reset}
            aria-label="Start a new chat"
            title="New chat"
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-full text-stone-500 transition-colors hover:bg-stone-100 hover:text-[#1a1714]"
          >
            <RotateCcw size={17} strokeWidth={1.75} />
          </button>
        )}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close chat"
          className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-stone-100 text-stone-600 transition-colors hover:bg-stone-200 hover:text-[#1a1714]"
        >
          <X size={18} />
        </button>
      </header>

      {/* Conversation */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
        <ChatMessages
          messages={messages}
          status={status}
          error={error}
          onRetry={retry}
          onQuickReply={send}
          emptyState={emptyState}
        />
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="shrink-0 border-t border-stone-200 bg-white px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3"
      >
        <div className="flex items-end gap-2 rounded-2xl border border-stone-200 bg-[#faf8f3] py-1.5 pl-4 pr-1.5 transition-colors focus-within:border-[#9a7a1e]">
          <textarea
            ref={textareaRef}
            rows={1}
            value={input}
            maxLength={1500}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Ask about any property…"
            aria-label="Message"
            className="max-h-28 min-h-[36px] flex-1 resize-none bg-transparent py-2 text-[16px] leading-snug outline-none placeholder:text-stone-400 sm:text-[14px]"
          />
          {isBusy ? (
            <button
              type="button"
              onClick={stop}
              aria-label="Stop reply"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-stone-200 text-[#1a1714] transition-colors hover:bg-stone-300"
            >
              <Square size={12} className="fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full bg-[#1a1714] text-white transition-colors hover:bg-[#9a7a1e] disabled:cursor-not-allowed disabled:bg-stone-300"
            >
              <ArrowUp size={17} strokeWidth={2.25} />
            </button>
          )}
        </div>
        <p className="mt-2 text-center text-[10.5px] text-stone-400">
          AI assistant — our advisors confirm every detail before you buy.
        </p>
      </form>
    </div>
  );
}
