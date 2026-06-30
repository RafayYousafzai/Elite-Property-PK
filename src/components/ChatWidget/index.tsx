"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Send,
  MessageCircle,
  Image as ImageIcon,
  ArrowUp,
} from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Function to parse and render markdown-style text with links
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
      // Bold + Italic (***text***)
      parts.push(
        <strong
          key={`bolditalic-${key++}`}
          className="font-bold italic text-gray-900 dark:text-white"
        >
          {match[2]}
        </strong>,
      );
    } else if (match[3]) {
      // Bold text (**text**)
      parts.push(
        <strong
          key={`bold-${key++}`}
          className="font-bold text-gray-950 dark:text-white"
        >
          {match[4]}
        </strong>,
      );
    } else if (match[5]) {
      // Italic text (*text*)
      parts.push(
        <em
          key={`italic-${key++}`}
          className="italic text-gray-700 dark:text-gray-300"
        >
          {match[6]}
        </em>,
      );
    } else if (match[7]) {
      // Inline code (`code`)
      parts.push(
        <code
          key={`code-${key++}`}
          className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded text-red-600 dark:text-red-400 font-mono text-xs"
        >
          {match[8]}
        </code>,
      );
    } else if (match[9]) {
      // URL match
      const url = match[9];
      const propertyMatch = url.match(/\/explore\/([^\/]+)$/);
      const displayText = propertyMatch
        ? propertyMatch[1]
            .split("-")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
            .substring(0, 40) + (propertyMatch[1].length > 40 ? "..." : "")
        : "View Property";

      parts.push(
        <a
          key={`link-${key++}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-amber-600 hover:text-amber-800 dark:text-amber-400 dark:hover:text-amber-300 underline underline-offset-2 font-semibold inline-flex items-center gap-1 break-words"
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

export function CustomChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! 👋 What are you looking for today?",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const emmaAvatar =
    "https://plus.unsplash.com/premium_photo-1671656349218-5218444643d8?q=80&w=256&auto=format&fit=crop";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const chatWindow = chatWindowRef.current;
    if (isOpen && chatWindow) {
      const handleWheel = (e: WheelEvent) => {
        e.stopPropagation();
      };
      chatWindow.addEventListener("wheel", handleWheel);
      return () => {
        chatWindow.removeEventListener("wheel", handleWheel);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleResize = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    if (isOpen) {
      window.addEventListener("resize", handleResize);
      handleResize(); // Initial call
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch(
        "https://n8n.srv1548576.hstgr.cloud/webhook/343c586c-fecf-4279-bbe9-bf74e3b6d418/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            action: "sendMessage",
            sessionId: "custom-chat-session",
            message: content.trim(),
          }),
        },
      );

      const data = await response.json();
      const assistantMessage: Message = {
        role: "assistant",
        content: data.output || "I'm sorry, I couldn't process that request.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      const errorMessage: Message = {
        role: "assistant",
        content: "I'm having trouble connecting. Please try again later.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputValue);
  };

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 z-[9999] flex h-16 w-16 items-center justify-center rounded-full bg-amber-500 hover:bg-amber-600 shadow-xl transition-all duration-300 sm:bottom-6 sm:right-6"
          >
            <MessageCircle className="h-7 w-7 text-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatWindowRef}
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed bottom-0 right-0 z-[9999] flex h-[calc(var(--vh,1vh)*100)] w-full flex-col overflow-hidden bg-white dark:bg-gray-900 border border-gray-150 dark:border-gray-800 shadow-2xl sm:bottom-6 sm:right-6 sm:h-[650px] sm:w-[420px] sm:rounded-3xl"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between  border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 px-5 py-3">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-1.5">
                    Ali
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                    Online
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Chat Body Container */}
            <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-950 p-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-200">
              {/* Agent Large Profile Mockup (Centered at start) */}
              <div className="flex flex-col items-center justify-center my-6">
                <div className="relative mb-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={emmaAvatar}
                    alt="Ali"
                    className="h-20 w-20 rounded-full object-cover shadow-md ring-4 ring-amber-50 dark:ring-amber-900/30"
                  />
                  <span className="absolute bottom-0 right-1 block h-4.5 w-4.5 rounded-full border-3 border-white dark:border-gray-950 bg-emerald-500" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white text-base">
                  Ali
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  AI Assistant
                </p>
              </div>

              {/* Disclaimer / Privacy Consent Box */}
              <div className="mb-6 rounded-[22px] border border-gray-100 dark:border-gray-800/80 bg-gray-50/50 dark:bg-gray-900/30 p-4 text-center">
                <p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
                  By using the chat feature, you agree to our terms and
                  acknowledge our privacy policy.
                </p>
              </div>

              {/* Message List */}
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-end gap-2.5 ${
                      message.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {/* Bot Avatar */}
                    {message.role === "assistant" && (
                      <div className="relative h-8 w-8 flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={emmaAvatar}
                          alt="Ali"
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-950 bg-emerald-500" />
                      </div>
                    )}

                    <div
                      className={`max-w-[75%] rounded-[22px] px-4 py-3 text-sm shadow-sm ${
                        message.role === "user"
                          ? "bg-amber-500 text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100"
                      }`}
                    >
                      <div className="leading-relaxed whitespace-pre-wrap break-words">
                        {parseMessageContent(message.content)}
                      </div>
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-end gap-2.5 justify-start">
                    <div className="relative h-8 w-8 flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={emmaAvatar}
                        alt="Ali"
                        className="h-8 w-8 rounded-full object-cover"
                      />
                      <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full border-2 border-white dark:border-gray-950 bg-emerald-500" />
                    </div>
                    <div className="rounded-[22px] bg-gray-100 dark:bg-gray-800 px-4 py-3.5">
                      <div className="flex gap-1.5 items-center justify-center h-2">
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0,
                          }}
                          className="h-1.5 w-1.5 rounded-full bg-gray-400"
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0.2,
                          }}
                          className="h-1.5 w-1.5 rounded-full bg-gray-400"
                        />
                        <motion.div
                          animate={{ y: [0, -5, 0] }}
                          transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: 0.4,
                          }}
                          className="h-1.5 w-1.5 rounded-full bg-gray-400"
                        />
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Input Panel */}
            <div className="border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4">
              <form
                onSubmit={handleSubmit}
                className="flex items-center gap-2.5"
              >
                {/* Input Field */}
                <div className="relative flex-1">
                  <input
                    ref={inputRef}
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Message..."
                    className="w-full rounded-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 px-5 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:border-amber-500 focus:bg-white dark:focus:bg-gray-800 focus:outline-none transition duration-200"
                  />
                </div>

                {/* Circular Send Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500 hover:bg-amber-600 text-white shadow-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowUp className="h-5 w-5" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
