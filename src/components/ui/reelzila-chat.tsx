"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, ChevronDown, Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import {
  collection,
  query,
  orderBy,
  limit,
  addDoc,
  getDocs,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

// ── Constants ────────────────────────────────────────────────────────────────

const LOCAL_STORAGE_KEY = "reelzila_chat_history";
const MAX_HISTORY_MESSAGES = 100;
const FIRESTORE_COLLECTION = "chatMessages";
const MAX_CONTEXT_MESSAGES = 10;

// ── Lightweight Markdown Formatter ──────────────────────────────────────────

function formatMessage(text: string): React.ReactNode {
  const lines = text.split("\n");
  const result: React.ReactNode[] = [];

  lines.forEach((line, lineIdx) => {
    if (line === "" && result.length > 0) {
      result.push(<div key={`spacer-${lineIdx}`} className="h-2" />);
      return;
    }

    // Handle markdown headings: ###, ##, or #
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length; // 1, 2, or 3
      const text = headingMatch[2];
      const sizeClass = level === 1 ? "text-lg font-bold" : level === 2 ? "text-base font-bold" : "text-sm font-semibold";
      result.push(
        <div key={`line-${lineIdx}`} className={`${sizeClass} text-white mt-3 mb-1`}>
          {parseInline(text)}
        </div>
      );
      return;
    }

    const segments = parseInline(line);
    result.push(
      <div key={`line-${lineIdx}`} className="leading-relaxed">
        {segments}
      </div>
    );
  });

  return <>{result}</>;
}

function parseInline(text: string): React.ReactNode[] {
  const tokens: Array<{ type: "bold" | "link" | "url" | "text"; content: string; url?: string }> = [];
  let remaining = text;

  while (remaining.length > 0) {
    const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
    const linkMatch = remaining.match(/^\[([^\]]+)\]\(([^)]+)\)/);
    const urlMatch = remaining.match(/^(https?:\/\/[^\s)]+)/);

    if (boldMatch) {
      tokens.push({ type: "bold", content: boldMatch[1] });
      remaining = remaining.slice(boldMatch[0].length);
    } else if (linkMatch) {
      tokens.push({ type: "link", content: linkMatch[1], url: linkMatch[2] });
      remaining = remaining.slice(linkMatch[0].length);
    } else if (urlMatch) {
      tokens.push({ type: "url", content: urlMatch[1], url: urlMatch[1] });
      remaining = remaining.slice(urlMatch[0].length);
    } else {
      const nextSpecial = remaining.search(/(\*\*|\[|https?:\/\/)/);
      if (nextSpecial === -1) {
        tokens.push({ type: "text", content: remaining });
        remaining = "";
      } else {
        tokens.push({ type: "text", content: remaining.slice(0, nextSpecial) });
        remaining = remaining.slice(nextSpecial);
      }
    }
  }

  return tokens.map((token, i) => {
    if (token.type === "bold") {
      return (
        <strong key={i} className="font-bold text-inherit">
          {token.content}
        </strong>
      );
    }
    if (token.type === "link" || token.type === "url") {
      return (
        <a
          key={i}
          href={token.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:opacity-80 transition-opacity"
        >
          {token.content}
        </a>
      );
    }
    return <span key={i}>{token.content}</span>;
  });
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface Message {
  sender: "bot" | "user";
  text: string;
  timestamp?: number;
}

interface PersistedMessage {
  sender: "bot" | "user";
  text: string;
  timestamp: number;
}

// ── Welcome message (local-only, never persisted) ─────────────────────────────

const WELCOME_TEXT = "👋 Hi! I'm **Reelzila** FAQ chatbot. I can help with questions about our platform, pricing, AI models, credits, marketplace, or troubleshooting. How can I help you today?";

// ── Persistence Helpers ───────────────────────────────────────────────────────

function loadFromLocalStorage(): Message[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed: PersistedMessage[] = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((m) => m.sender && m.text)
      .map((m) => ({ sender: m.sender, text: m.text, timestamp: m.timestamp }));
  } catch {
    return [];
  }
}

function saveToLocalStorage(messages: Message[]): void {
  try {
    const toSave: PersistedMessage[] = messages.map((m) => ({
      sender: m.sender,
      text: m.text,
      timestamp: m.timestamp || Date.now(),
    }));
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(toSave.slice(-MAX_HISTORY_MESSAGES)));
  } catch {
    // localStorage may be full or unavailable; fail silently
  }
}

async function loadFromFirestore(userId: string): Promise<Message[]> {
  try {
    const messagesRef = collection(db, "users", userId, FIRESTORE_COLLECTION);
    const q = query(messagesRef, orderBy("timestamp", "desc"), limit(MAX_HISTORY_MESSAGES));
    const snapshot = await getDocs(q);

    const messages: Message[] = [];
    // Firestore returns in desc order, reverse to get chronological
    snapshot.docs
      .slice()
      .reverse()
      .forEach((doc) => {
        const data = doc.data();
        if (data.sender && data.text) {
          messages.push({
            sender: data.sender,
            text: data.text,
            timestamp: data.timestamp?.toMillis?.() || data.timestamp || Date.now(),
          });
        }
      });
    return messages;
  } catch (error) {
    console.error("Failed to load chat history from Firestore:", error);
    throw error;
  }
}

async function appendToFirestore(
  userId: string,
  message: Message
): Promise<void> {
  try {
    const messagesRef = collection(db, "users", userId, FIRESTORE_COLLECTION);
    await addDoc(messagesRef, {
      sender: message.sender,
      text: message.text,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Failed to save message to Firestore:", error);
    // Non-critical — chat continues even if save fails
  }
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function ReelzilaChat() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const prevUserIdRef = useRef<string | null>(null);
  const historyLoadedRef = useRef(false);

  // ── Load chat history when user auth state changes ──────────────────────────

  const loadHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    setLoadError(null);

    try {
      if (user?.uid) {
        const history = await loadFromFirestore(user.uid);
        setMessages(history);
        persistedMessagesRef.current = history;
      } else {
        const history = loadFromLocalStorage();
        setMessages(history);
        persistedMessagesRef.current = history;
      }
      historyLoadedRef.current = true;
    } catch (err) {
      console.error("Failed to load chat history:", err);
      setLoadError(
        user?.uid
          ? "Couldn't load your chat history from the cloud. Showing local messages."
          : "Couldn't load saved messages."
      );
      if (user?.uid) {
        const local = loadFromLocalStorage();
        setMessages(local);
        persistedMessagesRef.current = local;
      } else {
        setMessages([]);
        persistedMessagesRef.current = [];
      }
    } finally {
      setIsLoadingHistory(false);
    }
  }, [user?.uid]);

  // Load history on mount and re-load when user auth state changes (login/logout)
  useEffect(() => {
    const currentUid = user?.uid ?? null;
    // On first mount (historyLoadedRef is false) or on auth change, load history.
    // For unauthenticated users: currentUid === null, prevUserIdRef is also null
    // on first mount, so we must use historyLoadedRef as the trigger.
    if (historyLoadedRef.current && currentUid === prevUserIdRef.current) {
      return;
    }
    prevUserIdRef.current = currentUid;
    setMessages([]);
    historyLoadedRef.current = false;
    loadHistory();
  }, [user?.uid, loadHistory]);

  // ── Auto-scroll & focus ─────────────────────────────────────────────────────

  useEffect(() => {
    if (!isLoadingHistory) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isLoadingHistory]);

  useEffect(() => {
    if (isOpen && !isLoadingHistory) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isLoadingHistory]);

  // ── Persist messages after each change ─────────────────────────────────────

  const persistedMessagesRef = useRef<Message[]>([]);

  useEffect(() => {
    if (isLoadingHistory || messages.length === 0) return;

    const prev = persistedMessagesRef.current;
    if (prev.length === messages.length && JSON.stringify(prev) === JSON.stringify(messages)) {
      return;
    }
    persistedMessagesRef.current = messages;

    if (user?.uid) {
      const lastMsg = messages[messages.length - 1];
      appendToFirestore(user.uid, lastMsg).catch(() => {});
    } else {
      saveToLocalStorage(messages);
    }
  }, [messages, user?.uid, isLoadingHistory]);

  // ── Send handler ────────────────────────────────────────────────────────────

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isLoading || isLoadingHistory) return;

    const userMessage: Message = { sender: "user", text: trimmed, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = [...messages, userMessage]
        .slice(-MAX_CONTEXT_MESSAGES)
        .map((m) => ({
          role: m.sender === "user" ? ("user" as const) : ("assistant" as const),
          content: m.text,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to get response");
      }

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply, timestamp: Date.now() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "I'm having trouble connecting right now. Please try again or email us at **support@reelzila.studio**.",
          timestamp: Date.now(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleRetry = () => {
    loadHistory();
  };

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <>
      {/* Floating Chat Toggle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#D4FF4F] text-black shadow-lg shadow-[#D4FF4F]/30 hover:bg-[#c2ef4a] hover:shadow-xl hover:shadow-[#D4FF4F]/40 transition-all duration-200 flex items-center justify-center group"
            aria-label="Open chat with Reelzila"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="absolute inset-0 rounded-full border-2 border-[#D4FF4F] animate-ping opacity-30" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-3rem)] h-[560px] max-h-[calc(100vh-6rem)] rounded-2xl shadow-2xl border border-neutral-800 bg-black/95 backdrop-blur-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800 bg-neutral-950/50 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#D4FF4F] text-black flex items-center justify-center font-bold text-sm">
                  R
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm leading-tight">Reelzila</h3>
                  <p className="text-neutral-400 text-[11px] leading-tight">
                    {isLoading
                      ? "Typing…"
                      : isLoadingHistory
                        ? "Loading…"
                        : "Online"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
                aria-label="Close chat"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
              {/* Loading State */}
              {isLoadingHistory && (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                  <Loader2 className="w-8 h-8 text-[#D4FF4F] animate-spin" />
                  <p className="text-neutral-400 text-sm">
                    {user?.uid ? "Loading your chat history…" : "Loading messages…"}
                  </p>
                </div>
              )}

              {/* Error State — only for authenticated users */}
              {!isLoadingHistory && loadError && user?.uid && (
                <div className="flex flex-col items-center justify-center gap-3 px-4 py-8">
                  <AlertCircle className="w-8 h-8 text-amber-400" />
                  <p className="text-neutral-300 text-sm text-center">{loadError}</p>
                  <button
                    onClick={handleRetry}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-800 text-neutral-200 text-sm hover:bg-neutral-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry
                  </button>
                </div>
              )}

              {/* Welcome message — shown inline only when no history exists (never persisted to Firestore) */}
              {!isLoadingHistory && !loadError && messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-start"
                >
                  <div className="max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed bg-neutral-800 text-neutral-100 rounded-bl-md">
                    <div className="[&_a]:text-[#D4FF4F] [&_strong]:font-bold [&_a]:underline">
                      {formatMessage(WELCOME_TEXT)}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Messages */}
              {!isLoadingHistory &&
                messages.map((msg, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-[#D4FF4F] text-black rounded-br-md"
                          : "bg-neutral-800 text-neutral-100 rounded-bl-md"
                      }`}
                    >
                      {msg.sender === "user" ? (
                        <span className="whitespace-pre-wrap break-words">{msg.text}</span>
                      ) : (
                        <div className="[&_a]:text-[#D4FF4F] [&_strong]:font-bold [&_a]:underline">
                          {formatMessage(msg.text)}
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}

              {/* AI Typing Indicator */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-neutral-800 rounded-2xl rounded-bl-md px-4 py-3">
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:0ms]" />
                      <span className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:150ms]" />
                      <span className="w-2 h-2 rounded-full bg-neutral-500 animate-bounce [animation-delay:300ms]" />
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="px-4 py-3 border-t border-neutral-800 bg-neutral-950/30 shrink-0">
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isLoadingHistory ? "Loading…" : "Ask me anything…"
                  }
                  disabled={isLoading || isLoadingHistory}
                  className="flex-1 px-3.5 py-2.5 bg-neutral-900 border border-neutral-700 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-[#D4FF4F]/50 focus:border-[#D4FF4F]/50 transition-all disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading || isLoadingHistory}
                  className="p-2.5 rounded-xl bg-[#D4FF4F] text-black hover:bg-[#c2ef4a] disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              {!isLoadingHistory && (
                <p className="text-[10px] text-neutral-600 text-center mt-1.5">
                  {user?.uid
                    ? "Chat saved to your account"
                    : "Chat saved on this device"}
                </p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
