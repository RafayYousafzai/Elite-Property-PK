import type { Message } from "./types";
import { Avatar, Button, Surface, Skeleton } from "./heroui-shims";
import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { TextShimmer } from "./motion-primitives/text-shimmer";

interface ChatMessagesProps {
  messages: Message[];
  isLoading: boolean;
  isEmptyConversationState: boolean;
  quickPrompts: readonly string[];
  onQuickPromptSelect: (prompt: string) => void;
  avatarSrc: string;
  uploadingImage?: string | null;
}

function parseMessageContent(content: string): (string | React.ReactElement)[] {
  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  let key = 0;

  const combinedPattern =
    /(\*\*\*(.*?)\*\*\*)|(\*\*(.*?)\*\*)|(\*(.*?)\*)|(`(.*?)`)|(https?:\/\/[^\s]+)/g;

  let match;
  while ((match = combinedPattern.exec(content)) !== null) {
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${key++}`}>
          {content.substring(lastIndex, match.index)}
        </span>,
      );
    }

    if (match[1]) {
      parts.push(
        <strong
          key={`bolditalic-${key++}`}
          className="font-bold italic text-gray-900"
        >
          {match[2]}
        </strong>,
      );
    } else if (match[3]) {
      parts.push(
        <strong key={`bold-${key++}`} className="font-bold text-gray-950">
          {match[4]}
        </strong>,
      );
    } else if (match[5]) {
      parts.push(
        <em key={`italic-${key++}`} className="italic text-gray-700">
          {match[6]}
        </em>,
      );
    } else if (match[7]) {
      parts.push(
        <code
          key={`code-${key++}`}
          className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-red-600 font-mono text-xs"
        >
          {match[8]}
        </code>,
      );
    } else if (match[9]) {
      const url = match[9];
      const propertyMatch = url.match(/\/explore\/([^\/]+)$/);
      const displayText = propertyMatch
        ? propertyMatch[1]
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
            .substring(0, 35) + (propertyMatch[1].length > 35 ? "..." : "")
        : "View Property";

      parts.push(
        <a
          key={`link-${key++}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-600 hover:text-amber-700 underline underline-offset-2 font-semibold inline-flex items-center gap-1 break-words"
        >
          {displayText}
          <svg
            className="w-3 h-3 inline-block flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>,
      );
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < content.length) {
    parts.push(
      <span key={`text-${key++}`}>{content.substring(lastIndex)}</span>,
    );
  }

  return parts.length > 0 ? parts : [content];
}

function getTextContent(msg: Message): string {
  if (msg.parts) {
    return msg.parts
      .filter((p) => p.type === "text")
      .map((p) => (p as any).text)
      .join("");
  }
  return (msg as any).content || "";
}

function getFileParts(msg: Message) {
  return (
    msg.parts?.filter(
      (
        part,
      ): part is {
        type: "file";
        mediaType: string;
        filename?: string;
        url: string;
      } => part.type === "file",
    ) ?? []
  );
}

function getOptionButtonsForText(text: string): string[] | null {
  if (!text) return null;
  const lower = text.toLowerCase();

  // Do NOT show option buttons when asking for contact info, phone, or name
  if (
    lower.includes("whatsapp") ||
    lower.includes("phone") ||
    lower.includes("number") ||
    lower.includes("contact") ||
    lower.includes("name") ||
    lower.includes("reach")
  ) {
    return null;
  }

  if (
    lower.includes("purpose") ||
    lower.includes("personal use") ||
    lower.includes("investment") ||
    lower.includes("living")
  ) {
    return ["Personal Use", "Investment"];
  }

  if (
    lower.includes("budget") ||
    lower.includes("crore") ||
    lower.includes("cr") ||
    lower.includes("range") ||
    lower.includes("cost")
  ) {
    return ["Under 2 Crore", "2 - 4 Crore", "4 - 6 Crore", "Above 6 Crore"];
  }

  if (
    lower.includes("looking for") ||
    lower.includes("category") ||
    lower.includes("property type") ||
    lower.includes("guidance") ||
    lower.includes("plot") ||
    lower.includes("house")
  ) {
    return ["Plot", "House", "Either", "Guide Me"];
  }

  return null;
}

function ThinkingIndicator({ isToolActive }: { isToolActive: boolean }) {
  return (
    <div className="flex items-center justify-center min-h-[24px] min-w-[40px] px-1">
      {isToolActive ? (
        <span className="text-[12px] text-gray-500 font-medium animate-pulse select-none">
          Thinking...
        </span>
      ) : (
        <div className="flex gap-1.5 items-center justify-center h-4">
          <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-bounce [animation-delay:-0.3s]" />
          <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-bounce [animation-delay:-0.15s]" />
          <div className="w-2 h-2 rounded-full bg-[#d4af37] animate-bounce" />
        </div>
      )}
    </div>
  );
}

function ScrollToBottomButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="absolute bottom-4 right-4 z-10 w-8 h-8 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center text-gray-500 hover:text-gray-800 hover:shadow-lg hover:scale-105 transition-all duration-200 ease-out animate-in fade-in slide-in-from-bottom-2"
      aria-label="Scroll to bottom"
    >
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2.5}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}

function MessageImage({
  url,
  filename,
  msgId,
  index,
}: {
  url: string;
  filename?: string;
  msgId: string;
  index: number;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const img = new window.Image();
    img.onload = () => setLoaded(true);
    img.src = url;
  }, [url]);

  if (!loaded) {
    return <Skeleton className="rounded-2xl w-48 h-36 mb-2" />;
  }

  return (
    <img
      key={`${msgId}-file-${index}`}
      src={url}
      alt={filename || "Attachment"}
      className="max-w-full rounded-2xl mb-2 animate-[fadeScaleIn_0.3s_ease-out]"
    />
  );
}

export function ChatMessages({
  messages,
  isLoading,
  isEmptyConversationState,
  onQuickPromptSelect,
  avatarSrc,
  uploadingImage,
}: ChatMessagesProps) {
  const isMessageEmpty = messages.length === 0;

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const isAtBottomRef = useRef(true);

  const lastMessage = messages[messages.length - 1];
  const lastAssistantHasText =
    lastMessage?.role === "assistant"
      ? getTextContent(lastMessage).trim() !== ""
      : false;
  const showLoadingBubble = isLoading && !lastAssistantHasText;
  const currentAssistantMsg =
    messages[messages.length - 1]?.role === "assistant"
      ? messages[messages.length - 1]
      : null;
  const isToolActive =
    currentAssistantMsg?.parts?.some((p) => p.type.startsWith("tool-")) ??
    false;

  const activeOptions = useMemo(() => {
    if (isLoading) return null;
    if (isMessageEmpty) return ["Plot", "House", "Investment", "Guide Me"];
    if (lastMessage?.role === "assistant") {
      const text = getTextContent(lastMessage);
      return getOptionButtonsForText(text);
    }
    return null;
  }, [messages, isLoading, isMessageEmpty, lastMessage]);

  const scrollToBottom = useCallback((behavior: ScrollBehavior = "smooth") => {
    bottomRef.current?.scrollIntoView({ behavior, block: "end" });
  }, []);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const atBottom = distanceFromBottom < 60;
    isAtBottomRef.current = atBottom;
    setShowScrollButton(!atBottom);
  }, []);

  useEffect(() => {
    if (isAtBottomRef.current) {
      scrollToBottom(isLoading ? "instant" : "smooth");
    }
  }, [messages, isLoading, showLoadingBubble, scrollToBottom]);

  const AiAvatar = useMemo(
    () => (
      <div className="relative shrink-0 w-8 h-8">
        <img
          src={avatarSrc}
          alt="AI Avatar"
          className="w-8 h-8 rounded-full object-cover border border-gray-200 shadow-xs"
        />
        <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-[#22c55e] border-2 border-white rounded-full z-20" />
      </div>
    ),
    [avatarSrc],
  );

  const WelcomeMessage = useMemo(
    () => (
      <div className="flex items-end gap-2 w-full mt-1.5">
        <div className="mb-1">{AiAvatar}</div>
        <Surface
          className="p-2.5 text-[13px] leading-snug max-w-[80%] bg-slate-100 text-gray-800 rounded-2xl shadow-xs"
          variant="default"
        >
          <p className="whitespace-pre-wrap">
            Hi! 👋 Looking to buy or invest in property?
          </p>
        </Surface>
      </div>
    ),
    [AiAvatar],
  );

  return (
    <div
      className={`flex flex-col h-full ${isEmptyConversationState ? "pt-2 pb-2" : "py-0"}`}
    >
      {isMessageEmpty ? (
        <div className="flex flex-col flex-1 pl-2 pr-4 pb-1">
          {WelcomeMessage}
          {activeOptions && (
            <div className="flex flex-row flex-wrap justify-start gap-1.5 pt-2.5 pl-10">
              {activeOptions.map((opt) => (
                <Button
                  key={opt}
                  size="sm"
                  onClick={() => onQuickPromptSelect(opt)}
                  className="bg-[#d4af37] text-white font-semibold text-[13px] rounded-full px-3.5 py-1.5 h-8 min-w-0 transition hover:scale-105 shadow-sm"
                >
                  {opt}
                </Button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="relative flex flex-col h-full">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex flex-col gap-3 pl-2 pr-4 pb-2 overflow-y-auto flex-1 scroll-smooth"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full overflow-hidden shadow-sm relative border-2 border-[#d4af37]">
                <img
                  src={avatarSrc}
                  alt="Elite Property PK"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <span className="text-black text-[12px] font-semibold mt-1">
                Ali{" "}
              </span>
            </div>

            <Surface className="border-amber-100 flex min-w-[300px] flex-col gap-2 rounded-2xl border p-3 text-gray-400 text-[11px] leading-relaxed m-2 text-center">
              By using the chat feature, you agree to our terms and acknowledge
              our privacy policy.
            </Surface>

            {WelcomeMessage}

            {messages.map((msg, msgIdx) => {
              const isAssistant = msg.role === "assistant";
              const textContent = getTextContent(msg);
              const fileParts = getFileParts(msg);
              const isLastMsg = msgIdx === messages.length - 1;

              if (isAssistant && !textContent.trim()) return null;

              return (
                <div
                  key={msg.id}
                  className={`flex flex-col w-full ${!isAssistant ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`flex w-full ${!isAssistant ? "justify-end" : "justify-start gap-2"}`}
                  >
                    {isAssistant && (
                      <div className="mt-auto mb-1">{AiAvatar}</div>
                    )}

                    <div
                      className={`flex flex-col gap-1 max-w-[80%] ${
                        !isAssistant ? "items-end ml-auto" : "items-start"
                      }`}
                    >
                      <Surface
                        className={`py-2.5 px-3.5 text-[13px] leading-relaxed transition-opacity duration-200 ${
                          !isAssistant
                            ? "bg-[#d4af37] text-white font-medium rounded-2xl"
                            : "bg-slate-100 text-gray-800 rounded-2xl"
                        }`}
                        variant="default"
                      >
                        {fileParts.map((part, index) =>
                          part.mediaType?.startsWith("image/") ? (
                            <MessageImage
                              key={`${msg.id}-file-${index}`}
                              url={part.url}
                              filename={part.filename}
                              msgId={msg.id}
                              index={index}
                            />
                          ) : null,
                        )}
                        <p className="whitespace-pre-wrap">
                          {parseMessageContent(textContent)}
                        </p>
                      </Surface>
                    </div>
                  </div>

                  {/* Render contextual option buttons stacked vertically on the right side */}
                  {isAssistant && isLastMsg && activeOptions && (
                    <div className="flex flex-col items-end gap-1.5 pt-2 ml-auto max-w-[80%]">
                      {activeOptions.map((opt) => (
                        <Button
                          key={opt}
                          size="sm"
                          onClick={() => onQuickPromptSelect(opt)}
                          className="bg-[#d4af37] text-white font-semibold text-[13px] rounded-2xl px-4 py-2 h-auto min-h-[32px] min-w-0 transition hover:scale-105 shadow-sm text-right whitespace-normal"
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {uploadingImage && (
              <div className="flex w-full justify-end">
                <div className="max-w-[80%] ml-auto">
                  <Skeleton className="rounded-2xl w-48 h-36" />
                </div>
              </div>
            )}

            {showLoadingBubble && (
              <div className="flex gap-2 w-full mt-2">
                <div className="mt-auto mb-1">{AiAvatar}</div>
                <Surface
                  className="px-3.5 py-2.5 bg-slate-100 rounded-2xl"
                  variant="default"
                >
                  <ThinkingIndicator isToolActive={isToolActive} />
                </Surface>
              </div>
            )}

            <div ref={bottomRef} className="h-1 shrink-0" />
          </div>

          {showScrollButton && (
            <ScrollToBottomButton onClick={() => scrollToBottom("smooth")} />
          )}
        </div>
      )}
    </div>
  );
}
