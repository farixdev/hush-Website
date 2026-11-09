"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  X,
  Send,
  Loader2,
  Shield,
  ArrowRight,
  User,
  Mail,
  RotateCcw,
} from "lucide-react";
import HushMark from "./HushMark";

interface Message {
  id: string;
  sender: "visitor" | "ai" | "admin";
  text: string;
  created_at: string;
  escalated?: boolean;
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [visitorName, setVisitorName] = useState("");
  const [visitorEmail, setVisitorEmail] = useState("");
  const [isRegistered, setIsRegistered] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState("");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize session and check visitor details
  useEffect(() => {
    // 2-second popup banner on first landing
    const tooltipTimer = setTimeout(() => {
      const dismissed = sessionStorage.getItem("hush_chat_tooltip_dismissed");
      if (!dismissed) {
        setShowTooltip(true);
      }
    }, 2000);

    // Retrieve visitor info if already registered
    const savedName = localStorage.getItem("hush_visitor_name") || "";
    const savedEmail = localStorage.getItem("hush_visitor_email") || "";
    let savedSession = localStorage.getItem("hush_chat_session_id") || "";

    if (!savedSession) {
      savedSession = `session_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem("hush_chat_session_id", savedSession);
    }
    setSessionId(savedSession);

    if (savedName && savedEmail) {
      setVisitorName(savedName);
      setVisitorEmail(savedEmail);
      setIsRegistered(true);
    }

    return () => clearTimeout(tooltipTimer);
  }, []);

  // Poll for admin replies when open and registered
  useEffect(() => {
    if (!isOpen || !isRegistered || !sessionId) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`/api/chat?sessionId=${sessionId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.session && data.session.messages) {
            setMessages(data.session.messages);
          }
        }
      } catch {
        /* polling silence */
      }
    };

    fetchHistory();
    const interval = setInterval(fetchHistory, 4000);
    return () => clearInterval(interval);
  }, [isOpen, isRegistered, sessionId]);

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!visitorName.trim() || !visitorEmail.trim()) return;

    localStorage.setItem("hush_visitor_name", visitorName.trim());
    localStorage.setItem("hush_visitor_email", visitorEmail.trim().toLowerCase());
    setIsRegistered(true);

    // Initial greeting
    setMessages([
      {
        id: "msg_init",
        sender: "ai",
        text: `Hello ${visitorName.trim()}! How can we help you with Hush or building custom privacy applications with Edge Brain Software?`,
        created_at: new Date().toISOString(),
      },
    ]);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading || !sessionId) return;

    const textToSend = inputText.trim();
    setInputText("");

    const clientMsg: Message = {
      id: `local_${Date.now()}`,
      sender: "visitor",
      text: textToSend,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, clientMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          visitorName,
          visitorEmail,
          message: textToSend,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to send message.");
      }

      if (data.session?.messages) {
        setMessages(data.session.messages);
      } else if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `reply_${Date.now()}`,
            sender: "ai",
            text: data.reply,
            created_at: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          sender: "ai",
          text: `Our team will be in touch with you shortly at ${visitorEmail}.`,
          created_at: new Date().toISOString(),
          escalated: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const dismissTooltip = () => {
    setShowTooltip(false);
    sessionStorage.setItem("hush_chat_tooltip_dismissed", "true");
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50">
      {/* 2-Second Popup Banner */}
      <AnimatePresence>
        {showTooltip && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="absolute bottom-16 right-0 mb-2 w-[calc(100vw-2.5rem)] max-w-72 rounded-2xl border border-white/20 bg-black/95 p-4 shadow-2xl backdrop-blur-xl text-left"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <HushMark size={18} />
                <span className="text-xs font-semibold text-white">
                  Have a question?
                </span>
              </div>
              <button
                type="button"
                onClick={dismissTooltip}
                className="text-white/40 hover:text-white"
                aria-label="Dismiss message"
              >
                <X size={14} />
              </button>
            </div>
            <p className="mt-2 text-xs text-white/70 leading-relaxed">
              If you have any questions, please ask! Our team and AI are here to assist.
            </p>
            <button
              type="button"
              onClick={() => {
                dismissTooltip();
                setIsOpen(true);
              }}
              className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg bg-white py-1.5 text-xs font-semibold text-black transition-transform hover:scale-[1.02]"
            >
              <span>Chat with us</span>
              <ArrowRight size={12} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mb-3 flex h-[min(520px,calc(100vh-6rem))] w-[calc(100vw-2rem)] sm:w-[380px] max-w-[390px] flex-col overflow-hidden rounded-3xl border border-white/20 bg-black shadow-2xl backdrop-blur-2xl ring-1 ring-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.03] px-5 py-4">
              <div className="flex items-center gap-2.5">
                <HushMark size={24} />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-bold text-white">Hush Support</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  </div>
                  <span className="text-[10px] text-white/40 block">
                    Edge Brain Software
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white transition-colors"
                  aria-label="Close chat"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            {!isRegistered ? (
              /* Step 1: Onboarding Registration */
              <div className="flex flex-1 flex-col justify-center p-6 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white">
                  <User size={20} />
                </div>
                <h4 className="mt-4 text-base font-bold text-white">
                  Welcome to Hush
                </h4>
                <p className="mt-1 text-xs text-white/60 leading-relaxed">
                  Please share your name and email so our team can answer your inquiries and follow up with you.
                </p>

                <form onSubmit={handleRegister} className="mt-6 space-y-3 text-left">
                  <div>
                    <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="e.g. Alex"
                      className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-medium text-white/60 uppercase tracking-wider">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      value={visitorEmail}
                      onChange={(e) => setVisitorEmail(e.target.value)}
                      placeholder="you@domain.com"
                      className="mt-1 w-full rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-white focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-white py-2.5 text-xs font-bold text-black transition-transform hover:scale-[1.01]"
                  >
                    <span>Start Conversation</span>
                    <ArrowRight size={13} />
                  </button>
                </form>
              </div>
            ) : (
              /* Step 2: Message Stream */
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs">
                  {messages.map((m) => {
                    const isUser = m.sender === "visitor";
                    const isAdmin = m.sender === "admin";
                    return (
                      <div
                        key={m.id}
                        className={`flex flex-col ${
                          isUser ? "items-end" : "items-start"
                        }`}
                      >
                        <span className="text-[10px] text-white/30 mb-1 px-1">
                          {isUser
                            ? "You"
                            : isAdmin
                            ? "Support Team"
                            : "Hush Assistant"}
                        </span>
                        <div
                          className={`max-w-[85%] rounded-2xl px-4 py-2.5 leading-relaxed ${
                            isUser
                              ? "bg-white text-black font-medium"
                              : isAdmin
                              ? "border border-emerald-500/30 bg-emerald-500/10 text-white"
                              : "border border-white/15 bg-white/[0.04] text-white/90"
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{m.text}</p>
                        </div>
                        {m.escalated && (
                          <span className="mt-1 text-[10px] text-amber-300/80">
                            Notification sent to engineering leads
                          </span>
                        )}
                      </div>
                    );
                  })}

                  {loading && (
                    <div className="flex items-center gap-2 text-white/40 text-xs py-2">
                      <Loader2 size={13} className="animate-spin text-white/60" />
                      <span>Composing response...</span>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Message input */}
                <form
                  onSubmit={handleSendMessage}
                  className="border-t border-white/10 bg-white/[0.02] p-3 flex items-center gap-2"
                >
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Ask a question..."
                    disabled={loading}
                    maxLength={1000}
                    className="flex-1 rounded-xl border border-white/15 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-white focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={!inputText.trim() || loading}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-black transition-transform hover:scale-105 disabled:opacity-30 disabled:cursor-not-allowed"
                    aria-label="Send message"
                  >
                    <Send size={14} />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Bubble Button */}
      <button
        type="button"
        onClick={() => {
          dismissTooltip();
          setIsOpen((prev) => !prev);
        }}
        className="group relative flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-black text-white shadow-2xl transition-all duration-300 hover:scale-110 hover:border-white/40 focus:outline-none ring-1 ring-white/10"
        aria-label="Open chat"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-1 rounded-full bg-white/10 blur-md group-hover:bg-white/20 transition-all"
        />
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </button>
    </div>
  );
}

