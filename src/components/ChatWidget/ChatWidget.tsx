"use client";

import { useRef, useState, useEffect, useCallback, FormEvent } from "react";
import { Card, ScrollShadow } from "./heroui-shims";
import { useChatWidget } from "@/hooks/useChatWidget";
import { ChatHeader } from "./ChatHeader";
import { ChatMessages } from "./ChatMessages";
import { ChatComposer } from "./ChatComposer";
import Image from "next/image";

type MessageWithParts = {
  role?: string;
  parts?: Array<{ type?: string }>;
};

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

export default function ChatWidget({
  defaultOpen = false,
}: {
  defaultOpen?: boolean;
}) {
  const {
    isOpen,
    setIsOpen,
    sessionId,
    input,
    setInput,
    messages,
    isProcessing,
    handleSubmit,
    sendText,
  } = useChatWidget({ initialOpen: defaultOpen });

  const [isEmbedded, setIsEmbedded] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [bubbleText, setBubbleText] = useState(
    "Looking for DHA or Bahria plots?",
  );
  // Seeded true when opened via the launcher button so the closed-state
  // bubble rotation resumes correctly if the user later minimizes the panel.
  const hasAutoOpenedRef = useRef(defaultOpen);
  const introTimerRef = useRef<number | null>(null);
  const autoCloseTimerRef = useRef<number | null>(null);
  const bubbleTimerRef = useRef<number | null>(null);
  const bubbleHideTimerRef = useRef<number | null>(null);
  const pickRandomBubbleMessage = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * BUBBLE_MESSAGES.length);
    return BUBBLE_MESSAGES[randomIndex];
  }, []);

  const clearAutoCloseTimer = useCallback(() => {
    if (autoCloseTimerRef.current) {
      window.clearTimeout(autoCloseTimerRef.current);
      autoCloseTimerRef.current = null;
    }
  }, []);

  const handleUserInteraction = useCallback(() => {
    clearAutoCloseTimer();
  }, [clearAutoCloseTimer]);

  const scheduleAutoClose = useCallback(() => {
    clearAutoCloseTimer();
    autoCloseTimerRef.current = window.setTimeout(() => {
      clearAutoCloseTimer();
      setIsOpen(false);
      setShowBubble(false);
    }, 3000);
  }, [clearAutoCloseTimer, setIsOpen]);

  useEffect(() => {
    if (messages.length > 0) {
      clearAutoCloseTimer();
    }
  }, [messages.length, clearAutoCloseTimer]);

  // useEffect(() => {
  //   if (typeof window === "undefined") return;

  //   const setupTimer = window.setTimeout(() => {
  //     setIsEmbedded(window.self !== window.top);
  //     setBubbleText("Looking for DHA or Bahria plots?");
  //     setShowBubble(true);
  //     introTimerRef.current = window.setTimeout(() => {
  //       hasAutoOpenedRef.current = true;
  //       setIsOpen(true);
  //       setShowBubble(false);
  //       scheduleAutoClose();
  //     }, 1800);
  //   }, 0);

  //   return () => window.clearTimeout(setupTimer);
  // }, [scheduleAutoClose, setIsOpen]);

  useEffect(() => {
    if (isOpen) {
      if (introTimerRef.current) {
        window.clearTimeout(introTimerRef.current);
        introTimerRef.current = null;
      }

      if (bubbleTimerRef.current) {
        window.clearTimeout(bubbleTimerRef.current);
        bubbleTimerRef.current = null;
      }

      if (bubbleHideTimerRef.current) {
        window.clearTimeout(bubbleHideTimerRef.current);
        bubbleHideTimerRef.current = null;
      }

      window.setTimeout(() => setShowBubble(false), 0);
      return;
    }

    if (!hasAutoOpenedRef.current) {
      return;
    }

    clearAutoCloseTimer();

    if (introTimerRef.current) {
      window.clearTimeout(introTimerRef.current);
      introTimerRef.current = null;
    }

    if (bubbleTimerRef.current) {
      window.clearTimeout(bubbleTimerRef.current);
      bubbleTimerRef.current = null;
    }

    if (bubbleHideTimerRef.current) {
      window.clearTimeout(bubbleHideTimerRef.current);
      bubbleHideTimerRef.current = null;
    }

    setShowBubble(true);
    setBubbleText(pickRandomBubbleMessage());

    const hideDelay = 3000 + Math.floor(Math.random() * 2000);
    bubbleHideTimerRef.current = window.setTimeout(() => {
      setShowBubble(false);
    }, hideDelay);

    const scheduleNextBubble = () => {
      const delay = 30000 + Math.floor(Math.random() * 30000);
      bubbleTimerRef.current = window.setTimeout(() => {
        setBubbleText(pickRandomBubbleMessage());
        setShowBubble(true);

        if (bubbleHideTimerRef.current) {
          window.clearTimeout(bubbleHideTimerRef.current);
          bubbleHideTimerRef.current = null;
        }

        const nextHideDelay = 3000 + Math.floor(Math.random() * 2000);
        bubbleHideTimerRef.current = window.setTimeout(() => {
          setShowBubble(false);
        }, nextHideDelay);

        scheduleNextBubble();
      }, delay);
    };

    scheduleNextBubble();
  }, [clearAutoCloseTimer, isOpen, pickRandomBubbleMessage]);

  useEffect(() => {
    return () => {
      if (introTimerRef.current) {
        window.clearTimeout(introTimerRef.current);
      }
      if (bubbleTimerRef.current) {
        window.clearTimeout(bubbleTimerRef.current);
      }
      if (bubbleHideTimerRef.current) {
        window.clearTimeout(bubbleHideTimerRef.current);
      }
      if (autoCloseTimerRef.current) {
        window.clearTimeout(autoCloseTimerRef.current);
      }
    };
  }, []);

  const [image, setImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const avatarSrc = avatar_url;
  const quickPrompts = [
    "Looking to Buy",
    "Investment Options",
    "Request Callback",
  ];

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isProcessing]);

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isMessageEmpty = messages.length === 0;
    const payload = {
      type: "elite-chat-widget",
      isOpen,
      isMessageEmpty,
      showBubble,
    };
    window.parent.postMessage(payload, "*");
  }, [isOpen, messages.length, showBubble]);

  useEffect(() => {
    if (!uploadingImage) return;

    const lastUserMsg = [...messages]
      .reverse()
      .find((m: MessageWithParts) => m.role === "user");
    const hasFilePart = lastUserMsg?.parts?.some((p) => p.type === "file");

    if (hasFilePart) {
      URL.revokeObjectURL(uploadingImage);
      window.setTimeout(() => setUploadingImage(null), 0);
    }
  }, [messages, uploadingImage]);

  const clearAttachment = () => {
    if (image) {
      URL.revokeObjectURL(image);
    }
    setImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const onSend = (e?: FormEvent) => {
    handleUserInteraction();
    if (e && e.preventDefault) e.preventDefault();
    if (!input.trim() && !image) return;

    if (image) {
      setUploadingImage(image);
    }

    handleSubmit(e, selectedFile);

    setImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!sessionId) return null;

  const isMessageEmpty = messages.length === 0;

  return (
    <div
      className={
        isEmbedded
          ? "w-full h-full flex items-end justify-end p-0"
          : `fixed bottom-6 z-50 ${
              isOpen
                ? "left-1/2 -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0"
                : "right-6"
            }`
      }
    >
      {isOpen && (
        <Card
          onClick={handleUserInteraction}
          className={`w-[95vw] max-w-105 sm:w-110 md:w-115 ${
            isMessageEmpty ? "h-56" : "h-160"
          } p-0 rounded-3xl shadow-2xl/10`}
        >
          <ChatHeader
            title="Elite Property PK"
            subtitle="Online"
            avatarSrc={avatarSrc}
            onMinimize={() => setIsOpen(false)}
            isMessageEmpty={isMessageEmpty}
          />

          <ScrollShadow
            className="flex-1 px-0 scrollbar-hide"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#ccc transparent",
            }}
          >
            <ChatMessages
              messages={messages as unknown as never[]}
              isLoading={isProcessing}
              isEmptyConversationState={isMessageEmpty}
              quickPrompts={quickPrompts}
              onQuickPromptSelect={(prompt) => {
                handleUserInteraction();
                let message = "";

                if (prompt === "Looking to Buy") {
                  message =
                    "I am looking to buy a property in Pakistan. What options do you have?";
                } else if (prompt === "Investment Options") {
                  message = "I want to explore high-ROI investment options.";
                } else if (prompt === "Request Callback") {
                  message =
                    "I would like to request a callback from a consultant.";
                } else {
                  message = prompt;
                }

                setInput(message);
                sendText(message);
              }}
              avatarSrc={avatarSrc}
              uploadingImage={uploadingImage}
            />

            <div ref={messagesEndRef} />
          </ScrollShadow>

          <ChatComposer
            image={image}
            input={input}
            isLoading={isProcessing}
            onImageClear={clearAttachment}
            onImageUpload={(e) => {
              handleUserInteraction();
              if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                const MAX_FILE_SIZE = 5 * 1024 * 1024;
                if (file.size > MAX_FILE_SIZE) {
                  alert(
                    "File size exceeds the 5MB limit. Please upload a smaller file.",
                  );
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                  return;
                }
                setSelectedFile(file);
                setImage(URL.createObjectURL(file));
              }
            }}
            onInputChange={(value) => {
              handleUserInteraction();
              setInput(value);
            }}
            onInputKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend(e);
              }
            }}
            onSend={() => onSend(undefined)}
            placeholder="Message..."
            fileInputRef={fileInputRef}
            inputRef={inputRef}
            isEmptyConversationState={isMessageEmpty}
          />
        </Card>
      )}

      {!isOpen && (
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
            onClick={() => setIsOpen(true)}
            className="group h-16 w-16 sm:h-18 sm:w-18 rounded-full cursor-pointer focus:outline-none flex items-center justify-center transition-transform hover:scale-105 active:scale-95 bg-transparent border-none p-0 outline-none"
            aria-label="Open Elite Property PK chat"
          >
            <SobaanAvatar />
          </button>
        </div>
      )}
    </div>
  );
}
