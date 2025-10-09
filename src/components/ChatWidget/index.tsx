"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, MessageCircle, Sparkles } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

// Function to parse and render markdown-style text with links
function parseMessageContent(content: string): (string | React.ReactElement)[] {
  // Split content into parts (text, bold, italic, links, etc.)
  const parts: (string | React.ReactElement)[] = [];
  let lastIndex = 0;
  let key = 0;

  // Enhanced pattern to match multiple markdown formats:
  // **bold**, *italic*, `code`, links, and emojis are preserved
  const combinedPattern =
    /(\*\*\*(.*?)\*\*\*)|(\*\*(.*?)\*\*)|(\*(.*?)\*)|(`(.*?)`)|(https?:\/\/[^\s]+)/g;

  let match;
  while ((match = combinedPattern.exec(content)) !== null) {
    // Add text before the match
    if (match.index > lastIndex) {
      parts.push(
        <span key={`text-${key++}`}>
          {content.substring(lastIndex, match.index)}
        </span>
      );
    }

    if (match[1]) {
      // Bold + Italic (***text***)
      parts.push(
        <strong
          key={`bolditalic-${key++}`}
          className="font-bold italic text-amber-300"
        >
          {match[2]}
        </strong>
      );
    } else if (match[3]) {
      // Bold text (**text**)
      parts.push(
        <strong key={`bold-${key++}`} className="font-bold text-amber-300">
          {match[4]}
        </strong>
      );
    } else if (match[5]) {
      // Italic text (*text*)
      parts.push(
        <em key={`italic-${key++}`} className="italic text-amber-200">
          {match[6]}
        </em>
      );
    } else if (match[7]) {
      // Inline code (`code`)
      parts.push(
        <code
          key={`code-${key++}`}
          className="px-1.5 py-0.5 bg-gray-900/50 border border-amber-500/30 rounded text-amber-400 font-mono text-xs"
        >
          {match[8]}
        </code>
      );
    } else if (match[9]) {
      // URL match
      const url = match[9];
      // Extract property name from URL if it's a property link
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
          className="text-amber-400 hover:text-amber-300 underline underline-offset-2 font-medium inline-flex items-center gap-1 break-words"
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
        </a>
      );
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining text
  if (lastIndex < content.length) {
    parts.push(
      <span key={`text-${key++}`}>{content.substring(lastIndex)}</span>
    );
  }

  return parts.length > 0 ? parts : [content];
}

export function CustomChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi there! I'm here to help you with any questions you have!",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

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
        "https://rafayiscool.online/webhook/343c586c-fecf-4279-bbe9-bf74e3b6d418/chat",
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
        }
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
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-yellow-500 via-amber-500 to-yellow-600 shadow-2xl shadow-amber-500/50 transition-all duration-300 hover:shadow-amber-500/70 sm:bottom-6 sm:right-6"
          >
            <motion.div
              animate={{
                rotate: [0, 10, -10, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatDelay: 3,
              }}
            >
              <MessageCircle className="h-7 w-7 text-white" />
            </motion.div>
            <motion.div
              className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-r from-amber-400 to-yellow-500"
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
              <Sparkles className="h-3 w-3 text-white" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatWindowRef}
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed bottom-0 right-0 z-50 flex h-[calc(var(--vh,1vh)*100)] w-full flex-col overflow-hidden border-amber-300/10 bg-gradient-to-br from-black via-gray-900/50 to-black shadow-2xl shadow-amber-500/20 backdrop-blur-xl sm:bottom-6 sm:right-6 sm:h-[600px] sm:w-[400px] sm:rounded-3xl"
          >
            {/* Header */}
            <div className="relative flex items-center justify-between border-b border-amber-300/10 bg-gradient-to-r from-amber-600/30 via-yellow-600/30 to-amber-600/30 p-5 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-yellow-600 shadow-lg shadow-amber-500/50">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-black bg-emerald-500"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-white">
                    Emma <span className="font-light">(Ai)</span>
                  </h3>
                  <p className="text-xs text-amber-200">
                    Online • Ready to help
                  </p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </motion.button>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-4 overflow-y-auto p-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-amber-500/20">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ type: "spring", damping: 20, stiffness: 300 }}
                  className={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/30"
                        : "bg-gray-800/50 text-gray-100 backdrop-blur-sm border border-amber-300/10"
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                      {parseMessageContent(message.content)}
                    </div>
                    <p
                      className={`mt-1 text-xs ${
                        message.role === "user"
                          ? "text-amber-200"
                          : "text-gray-400"
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}

              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="rounded-2xl border border-amber-300/10 bg-gray-800/50 px-4 py-3 backdrop-blur-sm">
                    <div className="flex gap-1">
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0,
                        }}
                        className="h-2 w-2 rounded-full bg-amber-400"
                      />
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.2,
                        }}
                        className="h-2 w-2 rounded-full bg-amber-400"
                      />
                      <motion.div
                        animate={{ y: [0, -8, 0] }}
                        transition={{
                          duration: 0.6,
                          repeat: Infinity,
                          delay: 0.4,
                        }}
                        className="h-2 w-2 rounded-full bg-amber-400"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="border-t border-amber-300/10 bg-gradient-to-r from-amber-600/20 via-yellow-600/20 to-amber-600/20 p-4 backdrop-blur-xl">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 rounded-xl border border-amber-300/10 bg-black/20 px-4 py-3 text-sm text-white placeholder-gray-400 backdrop-blur-sm transition-all focus:border-amber-500/50 focus:bg-black/30 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={!inputValue.trim() || isTyping}
                  className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 text-white shadow-lg shadow-amber-500/30 transition-all hover:shadow-amber-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="h-5 w-5" />
                </motion.button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
