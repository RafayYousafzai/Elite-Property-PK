import { Fragment, type ReactNode, useEffect, useRef } from "react";
import Link from "next/link";
import type { UIMessage } from "ai";
import { ArrowUpRight, RotateCcw } from "lucide-react";
import { getThumbnailUrl, getImageUrl, toSameOrigin } from "@/lib/utils";
import { AssistantAvatar } from "./AssistantAvatar";

type ListingCard = {
  name: string;
  price: string;
  location: string;
  size: string;
  beds?: number;
  url: string;
  img?: string;
  sold?: boolean;
};

const QUICK_REPLIES = /\[\[([^\]]*)\]\]?\s*$/;

/** Visible text of an assistant message, minus the trailing quick-reply line. */
export function splitQuickReplies(text: string): { body: string; options: string[] } {
  const start = text.indexOf("[[");
  if (start === -1) return { body: text, options: [] };
  const match = text.slice(start).match(QUICK_REPLIES);
  const options = match?.[0].endsWith("]]")
    ? match[1].split("|").map((o) => o.trim()).filter(Boolean).slice(0, 4)
    : [];
  return { body: text.slice(0, start).trimEnd(), options };
}

export const textOf = (msg: UIMessage) =>
  msg.parts
    .filter((p): p is { type: "text"; text: string } => p.type === "text")
    .map((p) => p.text)
    .join("");

function listingCardsOf(msg: UIMessage): ListingCard[] {
  const cards: ListingCard[] = [];
  for (const part of msg.parts as Array<Record<string, any>>) {
    if (part.state !== "output-available" || !part.output) continue;
    if (part.type === "tool-searchListings" && Array.isArray(part.output.matches)) {
      cards.push(...part.output.matches);
    } else if (part.type === "tool-getListingDetails") {
      if (Array.isArray(part.output.candidates)) cards.push(...part.output.candidates);
      else if (part.output.url) cards.push(part.output);
    }
  }
  // A listing can come back from more than one tool call in the same reply
  return cards.filter((c, i) => cards.findIndex((x) => x.url === c.url) === i);
}

// ---------------------------------------------------------------- rich text

function renderInline(text: string, keyBase: string): ReactNode[] {
  const out: ReactNode[] = [];
  const pattern = /\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)\s]+)\)|(https?:\/\/[^\s)]+|\/(?:explore|contactus|request-callback|team|about|blogs)[^\s),.]*)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = pattern.exec(text))) {
    if (m.index > last) out.push(text.slice(last, m.index));
    const key = `${keyBase}-${i++}`;
    if (m[1]) out.push(<strong key={key} className="font-semibold text-[#1a1714]">{m[1]}</strong>);
    else if (m[2]) out.push(<em key={key}>{m[2]}</em>);
    else {
      const label = m[3] ?? (m[5].startsWith("/") ? m[5] : "link");
      const href = m[4] ?? m[5];
      out.push(
        href.startsWith("/") ? (
          <Link key={key} href={href} className="font-medium text-[#9a7a1e] underline underline-offset-2">
            {label}
          </Link>
        ) : (
          <a key={key} href={href} target="_blank" rel="noopener noreferrer" className="font-medium text-[#9a7a1e] underline underline-offset-2">
            {label}
          </a>
        ),
      );
    }
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

function RichText({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let list: string[] = [];

  const flushList = () => {
    if (list.length === 0) return;
    blocks.push(
      <ul key={`ul-${blocks.length}`} className="my-1 space-y-1 pl-4">
        {list.map((item, i) => (
          <li key={i} className="list-disc marker:text-[#9a7a1e]">
            {renderInline(item, `li-${blocks.length}-${i}`)}
          </li>
        ))}
      </ul>,
    );
    list = [];
  };

  lines.forEach((line, i) => {
    const bullet = line.match(/^\s*(?:[-*•]|\d+[.)])\s+(.*)$/);
    if (bullet) {
      list.push(bullet[1]);
      return;
    }
    flushList();
    if (line.trim()) blocks.push(<p key={`p-${i}`}>{renderInline(line, `p-${i}`)}</p>);
  });
  flushList();

  return <div className="space-y-1.5">{blocks}</div>;
}

// ---------------------------------------------------------------- pieces

function ListingCards({ cards }: { cards: ListingCard[] }) {
  return (
    <div className="-mx-4 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1 pl-14 [scrollbar-width:none]">
      {cards.map((card) => {
        const thumb = card.img ? getThumbnailUrl(card.img) : null;
        return (
          <Link
            key={card.url}
            href={card.url}
            className="group w-48 shrink-0 snap-start overflow-hidden rounded-xl border border-stone-200 bg-white transition-colors hover:border-[#9a7a1e]"
          >
            <span className="relative block aspect-[4/3] bg-stone-200">
              {thumb && (
                <img
                  src={toSameOrigin(thumb)}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    const fallback = getImageUrl(card.img);
                    if (e.currentTarget.src !== fallback) e.currentTarget.src = fallback;
                  }}
                  className="h-full w-full object-cover"
                />
              )}
              {card.sold && (
                <span className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-white">
                  Sold
                </span>
              )}
            </span>
            <span className="block p-3">
              <span className="line-clamp-2 text-[12.5px] font-medium leading-snug text-[#1a1714] group-hover:text-[#9a7a1e]">
                {card.name}
              </span>
              <span className="mt-1.5 block text-[13px] font-semibold text-[#1a1714]">{card.price}</span>
              <span className="mt-0.5 block truncate text-[11px] text-stone-500">
                {card.location} · {card.size}
                {card.beds ? ` · ${card.beds} beds` : ""}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}

function TypingIndicator({ searching }: { searching: boolean }) {
  return (
    <div className="flex items-end gap-2.5">
      <AssistantAvatar size={32} />
      <div className="flex items-center gap-2 rounded-2xl rounded-bl-md bg-white px-4 py-3 text-[12px] text-stone-500 ring-1 ring-stone-200">
        <span className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#9a7a1e]"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
        {searching && <span>Checking listings…</span>}
      </div>
    </div>
  );
}

export function QuickReplies({
  options,
  onSelect,
  disabled,
}: {
  options: string[];
  onSelect: (text: string) => void;
  disabled?: boolean;
}) {
  if (options.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2 pl-[42px]">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(opt)}
          className="h-9 cursor-pointer rounded-full border border-[#9a7a1e]/35 bg-white px-3.5 text-[12.5px] font-medium text-[#7a5c0f] transition-colors hover:border-[#9a7a1e] hover:bg-[#faf8f3] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------- list

export function ChatMessages({
  messages,
  status,
  error,
  onRetry,
  onQuickReply,
  emptyState,
}: {
  messages: UIMessage[];
  status: string;
  error: Error | undefined;
  onRetry: () => void;
  onQuickReply: (text: string) => void;
  emptyState: ReactNode;
}) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const isBusy = status === "submitted" || status === "streaming";

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end", behavior: isBusy ? "auto" : "smooth" });
  }, [messages, isBusy, error]);

  const last = messages[messages.length - 1];
  const lastText = last?.role === "assistant" ? splitQuickReplies(textOf(last)).body : "";
  const lastHasCards = last?.role === "assistant" && listingCardsOf(last).length > 0;
  const searching =
    last?.role === "assistant" &&
    (last.parts as Array<Record<string, any>>).some(
      (p) => p.type?.startsWith("tool-") && p.state !== "output-available" && p.type !== "tool-saveContactDetails",
    );
  const showTyping = isBusy && (last?.role === "user" || (!lastText.trim() && !lastHasCards) || searching);

  return (
    <div className="flex flex-col gap-4 px-4 py-5">
      {messages.length === 0 && emptyState}

      {messages.map((msg, index) => {
        const isLast = index === messages.length - 1;

        if (msg.role === "user") {
          return (
            <div key={msg.id} className="flex justify-end">
              <div className="max-w-[82%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-[#1a1714] px-4 py-2.5 text-[13.5px] leading-relaxed text-white">
                {textOf(msg)}
              </div>
            </div>
          );
        }

        const { body, options } = splitQuickReplies(textOf(msg));
        const cards = listingCardsOf(msg);
        if (!body.trim() && cards.length === 0) return null;

        return (
          <Fragment key={msg.id}>
            {body.trim() && (
              <div className="flex items-end gap-2.5">
                <AssistantAvatar size={32} />
                <div className="max-w-[82%] break-words rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-[13.5px] leading-relaxed text-stone-700 ring-1 ring-stone-200">
                  <RichText text={body} />
                </div>
              </div>
            )}
            {cards.length > 0 && <ListingCards cards={cards} />}
            {isLast && !isBusy && !error && (
              <QuickReplies options={options} onSelect={onQuickReply} />
            )}
          </Fragment>
        );
      })}

      {showTyping && <TypingIndicator searching={Boolean(searching)} />}

      {error && !isBusy && (
        <div className="flex items-end gap-2.5">
          <AssistantAvatar size={32} />
          <div className="max-w-[82%] rounded-2xl rounded-bl-md bg-red-50 px-4 py-3 text-[13px] text-red-700 ring-1 ring-red-200">
            <p>{/429|too many/i.test(error.message) ? "You're sending messages quickly — please wait a moment." : "Sorry, I couldn't reply just now."}</p>
            <button
              type="button"
              onClick={onRetry}
              className="mt-2 inline-flex cursor-pointer items-center gap-1.5 text-[12px] font-semibold underline-offset-2 hover:underline"
            >
              <RotateCcw size={13} /> Try again
            </button>
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}

export function ViewListingsLink() {
  return (
    <Link href="/explore" className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#9a7a1e]">
      Browse all listings <ArrowUpRight size={13} />
    </Link>
  );
}
