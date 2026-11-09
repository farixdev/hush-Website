import type { Metadata } from "next";
import Link from "next/link";
import { ShieldCheck, Lock, EyeOff, ServerOff, FileCheck, ArrowRight } from "lucide-react";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Particles from "@/components/reactbits/Particles";

export const metadata: Metadata = {
  title: "Privacy Policy & Zero-Log Declaration · Hush",
  description:
    "Official Privacy Policy and Zero-Data Declaration for Hush. Learn how Hush operates with zero personal information, no tracking cookies, no phone numbers, and no persistent server storage.",
  alternates: { canonical: "/privacy" },
  openGraph: {
    title: "Privacy Policy & Zero-Log Declaration · Hush",
    description:
      "Hush collects zero personal data, maintains no user accounts, and stores no chat logs. Complete transparency on our zero-retention architecture.",
    url: "/privacy",
    images: ["/hush-mask.png"],
  },
};

const SECTIONS = [
  {
    icon: EyeOff,
    title: "1. No Personal Data Collected",
    content:
      "Hush does not require, request, or store your phone number, email address, real name, device contacts, or social media accounts. You exist in Hush solely as an ephemeral 6-digit code and a randomized pseudonym (e.g. 'Cinnamon Macaron') for the duration of an active session.",
  },
  {
    icon: ServerOff,
    title: "2. Zero Server Logs & Blind Relays",
    content:
      "Our signaling and relay infrastructure operates strictly as a blind packet forwarder. The server does not maintain an SQLite/Postgres database of messages, does not record IP access logs, and does not retain metadata graphs. Once a ciphertext packet is forwarded to the intended recipient, it is discarded from server memory.",
  },
  {
    icon: Lock,
    title: "3. Volatile RAM-Only Storage",
    content:
      "All active conversations, group messages, and cryptographic session keys are kept exclusively in temporary volatile RAM on your device. Hush does not write your conversations to unencrypted local disk databases. Tapping 'Leave' or closing the app destroys the ephemeral keys and memory buffers immediately.",
  },
  {
    icon: ShieldCheck,
    title: "4. No Third-Party Trackers or Analytics",
    content:
      "Hush contains zero Google Analytics, zero Firebase Telemetry, zero Facebook SDKs, zero crash-reporting trackers, and zero advertising SDKs. The marketing website (hush.app) uses no tracking cookies or third-party marketing beacons.",
  },
  {
    icon: FileCheck,
    title: "5. Offline & Local Radio Operation",
    content:
      "When using Nearby Mode (Local Wi-Fi or Bluetooth), communication happens directly between the physical devices without routing packets through any remote server or the public internet. No network logs exist outside your local radio environment.",
  },
];

export default function PrivacyPage() {
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
        <div className="container-page relative max-w-4xl text-center">
          <Reveal>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-white/70">
              <ShieldCheck size={13} className="text-emerald-400" />
              <span>Zero-Data Privacy Policy</span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              We Cannot Compromise What We Do Not Have.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/60 leading-relaxed">
              True privacy cannot rely solely on promises or terms of service. It must be enforced by architecture. This document explains Hush&apos;s cryptographic zero-data model.
            </p>
            <p className="mt-3 text-xs font-mono text-white/40">
              Effective Date: Continuous · Last Reviewed: {new Date().getFullYear()}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="relative py-16">
        <div className="container-page max-w-3xl space-y-12">
          {SECTIONS.map((sec) => {
            const Icon = sec.icon;
            return (
              <div
                key={sec.title}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white">
                    <Icon size={18} />
                  </div>
                  <h2 className="text-lg font-bold text-white">{sec.title}</h2>
                </div>
                <p className="mt-4 text-xs sm:text-sm leading-relaxed text-white/65">
                  {sec.content}
                </p>
              </div>
            );
          })}

          {/* Legal Disclosures / Regulatory Compliance */}
          <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-6 sm:p-8 space-y-4">
            <h3 className="text-base font-bold text-white">
              GDPR, CCPA &amp; Global Privacy Rights
            </h3>
            <p className="text-xs leading-relaxed text-white/60">
              Because Hush never collects, stores, or processes personal identifiers (no IP databases, no email addresses, no phone numbers, no device IDs), there is no personal data profile to access, correct, or export. The <strong>Right to Erasure (Right to be Forgotten)</strong> is executed automatically by the app upon session termination.
            </p>
            <div className="pt-2">
              <Link
                href="/security"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-white underline underline-offset-4 hover:text-white/80"
              >
                <span>Read technical details in the Security Whitepaper</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

