"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  HelpCircle,
  ChevronDown,
  Search,
  ArrowRight,
  BookOpen,
  X,
} from "lucide-react";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Particles from "@/components/reactbits/Particles";

interface FAQItem {
  question: string;
  answer: string;
  category: "general" | "privacy" | "nearby" | "groups" | "install";
}

const FAQS: FAQItem[] = [
  {
    category: "general",
    question: "What is Hush and how is it different from Signal or WhatsApp?",
    answer:
      "Hush is built for situations where you want zero trace. Signal and WhatsApp both require your real phone number and build a social graph of who you contact. Hush requires zero personal info: no phone number, no email, no password, and no contacts access. You connect via a temporary 6-digit code or nearby Wi-Fi/Bluetooth, and when you leave, the conversation is wiped completely.",
  },
  {
    category: "general",
    question: "Why do I get a name like 'Cinnamon Macaron'?",
    answer:
      "To keep sessions completely anonymous while still making conversations easy to follow, Hush generates playful, randomized pseudonyms on every launch. You can tap the refresh button beside your alias to re-roll a new pseudonym anytime.",
  },
  {
    category: "general",
    question: "Is Hush completely free?",
    answer:
      "Yes, 100% free with no ads, no trackers, no subscriptions, and no paywalls. The project is built out of a belief in privacy as a fundamental human right.",
  },
  {
    category: "install",
    question: "Why isn't Hush on the Google Play Store?",
    answer:
      "Publishing on the Google Play Store requires bundling proprietary Google Play Services libraries, accepting Google's mandatory telemetry policies, and submitting to automated app store censorship. Sideloading the standalone APK directly ensures zero dependencies on Google servers and guaranteed autonomy.",
  },
  {
    category: "install",
    question: "How do I safely install the APK on Android?",
    answer:
      "Download the .apk file from the Download page. When you tap the downloaded file, Android will ask for permission to 'Install unknown apps'. Enable the toggle for your browser or file manager, and tap Install. No root access or special developer tools are required.",
  },
  {
    category: "privacy",
    question: "Can anyone (including server hosts) recover my messages after I leave?",
    answer:
      "No. Hush stores messages only in volatile device RAM while the session is open. When you tap 'Leave' or close the app, the encryption keys and message buffers are zeroized and discarded. There are no SQLite database files saved on your phone and no archives on any server.",
  },
  {
    category: "privacy",
    question: "Why do the 6-digit codes expire after 2 minutes?",
    answer:
      "The 2-minute rollover timer ensures that invitation codes cannot be hijacked or reused later. Once a session begins, the code is fulfilled and cannot be used by a third party.",
  },
  {
    category: "nearby",
    question: "How does Nearby mode work with zero internet?",
    answer:
      "Nearby mode leverages your phone's built-in radio chips. On a local Wi-Fi router, it uses mDNS multicast packets that jump directly between devices without reaching the external internet. In areas without Wi-Fi, switching to Bluetooth establishes a direct device-to-device radio link.",
  },
  {
    category: "nearby",
    question: "Why does Nearby say 'Some guest / café networks block phone-to-phone connections'?",
    answer:
      "Many public Wi-Fi networks (such as hotel, airport, or coffee shop guest networks) turn on 'Client Isolation' (AP Isolation) to prevent strangers on the same network from hacking each other. When AP isolation is on, devices cannot see each other on Wi-Fi. In this case, simply tap 'No Wi-Fi? Connect over Bluetooth' to bypass the router.",
  },
  {
    category: "groups",
    question: "How many people can join a private group room?",
    answer:
      "Private group rooms support multi-member chats and voice conferences using a single group code (e.g., H8KSVQ). Anyone who receives the code can join the room. All messages are end-to-end encrypted across members.",
  },
  {
    category: "groups",
    question: "How does the disappearing message hourglass timer work?",
    answer:
      "In a group or direct chat, tapping the hourglass icon lets you configure an auto-destruction timer (such as 8 seconds). As soon as a message is delivered and viewed, its countdown begins and it disappears permanently from everyone's devices.",
  },
  {
    category: "privacy",
    question: "Are voice calls encrypted?",
    answer:
      "Yes. Voice calls use WebRTC with DTLS-SRTP encryption. The audio is captured, encoded via Opus, and encrypted directly on your phone. Audio packets stream directly peer-to-peer and never route through an unencrypted audio bridge.",
  },
];

const CATEGORIES = [
  { id: "all", label: "All Questions" },
  { id: "general", label: "General" },
  { id: "privacy", label: "Privacy & Security" },
  { id: "nearby", label: "Nearby & Offline" },
  { id: "groups", label: "Groups & Voice" },
  { id: "install", label: "Installation & APK" },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  const filtered = FAQS.filter((faq) => {
    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <main id="main-content" className="relative min-h-screen bg-black text-white">
      <Nav />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10 pt-36 pb-16">
        <Particles quantity={40} className="opacity-40" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[140px]"
        />
        <div className="container-page relative text-center">
          <Reveal>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-white/70">
              <HelpCircle size={13} className="text-white/80" />
              <span>Questions &amp; Knowledge Base</span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Frequently Asked Questions.
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-base text-white/60">
              Everything you need to know about Hush&apos;s privacy model, offline mode, code exchange, and Android installation.
            </p>

            {/* Search Input */}
            <div className="mx-auto mt-8 max-w-md">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40"
                />
                <input
                  type="text"
                  aria-label="Search questions"
                  placeholder="Search questions (e.g. bluetooth, code, delete)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-full border border-white/15 bg-white/5 py-3 pl-11 pr-10 text-xs text-white placeholder-white/40 backdrop-blur-md focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search query"
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ Category Pills & Accordion */}
      <section className="relative py-16">
        <div className="container-page max-w-4xl">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pb-10">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  activeCategory === cat.id
                    ? "bg-white text-black"
                    : "border border-white/10 bg-white/[0.02] text-white/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Accordion list */}
          <div className="space-y-4">
            {filtered.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-10 text-center">
                <p className="text-sm text-white/50">
                  No questions found matching &quot;{searchQuery}&quot;.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveCategory("all");
                  }}
                  className="mt-4 text-xs font-semibold text-white underline"
                >
                  Clear search filters
                </button>
              </div>
            ) : (
              filtered.map((item, idx) => {
                const isOpen = expandedIndex === idx;
                return (
                  <div
                    key={item.question}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] transition-colors hover:border-white/20"
                  >
                    <button
                      type="button"
                      id={`faq-btn-${idx}`}
                      aria-expanded={isOpen}
                      aria-controls={`faq-answer-${idx}`}
                      onClick={() => setExpandedIndex(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-white transition-colors"
                    >
                      <span className="pr-4">{item.question}</span>
                      <ChevronDown
                        size={18}
                        className={`shrink-0 text-white/40 transition-transform duration-200 ${
                          isOpen ? "rotate-180 text-white" : ""
                        }`}
                      />
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          id={`faq-answer-${idx}`}
                          role="region"
                          aria-labelledby={`faq-btn-${idx}`}
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <div className="border-t border-white/5 px-5 pb-5 pt-3 text-xs leading-relaxed text-white/60">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            )}
          </div>

          {/* Call to User Manual */}
          <div className="mt-16 rounded-2xl border border-white/15 bg-white/[0.03] p-8 text-center">
            <h3 className="text-xl font-bold text-white">Need a comprehensive walkthrough?</h3>
            <p className="mt-2 text-xs text-white/50 max-w-lg mx-auto">
              Our official User Manual includes annotated screenshots, Android permission breakdowns, and step-by-step guides.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black hover:scale-105 transition-all"
              >
                <BookOpen size={14} />
                <span>Read Full User Manual</span>
              </Link>
              <Link
                href="/download"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-medium text-white hover:bg-white/10 transition-colors"
              >
                <span>Download APK</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

