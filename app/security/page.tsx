import type { Metadata } from "next";
import Link from "next/link";
import {
  Shield,
  Lock,
  EyeOff,
  Radio,
  FileCode,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  Fingerprint,
  Cpu,
} from "lucide-react";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Particles from "@/components/reactbits/Particles";

export const metadata: Metadata = {
  title: "Security & Cryptography Architecture · Hush",
  description:
    "Explore Hush's zero-knowledge security architecture, threat model, cryptographic primitives, and metadata resistance. Learn how Hush eliminates phone numbers, server logs, and persistent chat databases.",
  alternates: { canonical: "/security" },
  openGraph: {
    title: "Security & Cryptography Architecture · Hush",
    description:
      "Deep dive into Hush's end-to-end encryption, ephemeral handshake tokens, local peer-to-peer protocols, and zero-metadata design.",
    url: "/security",
    images: ["/hush-mask.png"],
  },
};

const COMPARISON = [
  {
    feature: "Registration without Phone Number",
    hush: true,
    signal: false,
    whatsapp: false,
    telegram: false,
    session: true,
  },
  {
    feature: "Zero User Accounts / Sign-up",
    hush: true,
    signal: false,
    whatsapp: false,
    telegram: false,
    session: false,
  },
  {
    feature: "Works Fully Offline (Wi-Fi LAN / Bluetooth)",
    hush: true,
    signal: false,
    whatsapp: false,
    telegram: false,
    session: false,
  },
  {
    feature: "RAM-Only / Ephemeral History",
    hush: true,
    signal: false,
    whatsapp: false,
    telegram: false,
    session: false,
  },
  {
    feature: "Encrypted Peer-to-Peer Voice Calls",
    hush: true,
    signal: true,
    whatsapp: true,
    telegram: false,
    session: true,
  },
  {
    feature: "No Google Play Services Required",
    hush: true,
    signal: true,
    whatsapp: false,
    telegram: true,
    session: true,
  },
  {
    feature: "Zero Central Contact Graph / Address Book",
    hush: true,
    signal: false,
    whatsapp: false,
    telegram: false,
    session: true,
  },
];

export default function SecurityPage() {
  return (
    <main id="main-content" className="relative min-h-screen bg-black text-white">
      <Nav />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10 pt-36 pb-20">
        <Particles quantity={45} className="opacity-50" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[450px] w-[650px] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[150px]"
        />
        <div className="container-page relative text-center">
          <Reveal>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-white/70">
              <Shield size={13} className="text-emerald-400" />
              <span>Cryptographic Architecture &amp; Threat Model</span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Security by Absence.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg leading-relaxed text-white/60">
              You cannot leak what you never collect. Hush replaces accounts,
              address book scraping, and persistent database storage with
              ephemeral peer-to-peer encryption.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Core Cryptographic Primitives */}
      <section className="relative py-20 border-b border-white/10">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Protocol Overview</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Cryptographic Primitives
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
              Hush avoids custom unverified ciphers. Every component relies on industry-standard, high-speed, modern cryptography with Perfect Forward Secrecy.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <Reveal delay={0.05}>
              <div className="card h-full p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
                  <Fingerprint size={20} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  Ephemeral Diffie-Hellman (X25519)
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/50">
                  During the 6-character code handshake, ephemeral elliptic-curve keypairs are negotiated. Private keys reside solely in volatile RAM and are never written to disk.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="card h-full p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
                  <Lock size={20} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  Authenticated Encryption (ChaCha20-Poly1305)
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/50">
                  Payloads are encrypted and authenticated with 256-bit keys and unique per-message nonces. Tampered or modified messages fail decryption and are rejected immediately.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.15}>
              <div className="card h-full p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
                  <Radio size={20} />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-white">
                  DTLS-SRTP Voice Streaming
                </h3>
                <p className="mt-2 text-xs leading-relaxed text-white/50">
                  Real-time audio streams are transmitted peer-to-peer using WebRTC DTLS-SRTP. Opus audio packets are encoded and encrypted device-side without server interception.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Metadata Defense */}
      <section className="relative py-20 border-b border-white/10">
        <div className="container-page">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow">The Hidden Threat</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Why Metadata is the Real Surveillance Weapon
              </h2>
              <div className="mt-5 space-y-4 text-sm leading-relaxed text-white/60">
                <p>
                  Most &quot;secure&quot; messaging applications encrypt your messages, but they still collect and retain your <strong>metadata</strong>:
                </p>
                <ul className="space-y-2 text-xs text-white/70">
                  <li className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <strong className="text-white">Phone Numbers:</strong> Tied to your real-world identity, national ID, SIM registration, and credit rating.
                  </li>
                  <li className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <strong className="text-white">Social Graphs:</strong> Who you talked to, what time you connected, and how frequently you exchange messages.
                  </li>
                  <li className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <strong className="text-white">Push Tokens:</strong> Unique device identifiers shared with Apple and Google notification infrastructure.
                  </li>
                </ul>
                <p>
                  <strong>How Hush defeats this:</strong> There is no account database. You generate a random code, exchange it, speak, and leave. Once a session terminates, the keys and ephemeral tokens are wiped from RAM.
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/15 bg-white/[0.02] p-8 backdrop-blur-md">
              <h3 className="text-lg font-bold text-white">The Zero-Retention Guarantee</h3>
              <div className="mt-6 space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">No database of users:</strong> The server literally does not have a table of usernames, phone numbers, or passwords.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">No IP logs:</strong> Ephemeral routing sockets close upon session end without archival logging.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">No message storage:</strong> Messages are forwarded in flight. If the recipient is offline, the message is dropped, never queued in a cloud database.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-white">No unencrypted disk caches:</strong> Chats are held in RAM. When you tap Leave, memory is zeroized.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Matrix Table */}
      <section id="comparison" className="relative py-20 border-b border-white/10">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Comparison</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Hush vs. Conventional Messengers
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
              See how Hush differs fundamentally in architecture and metadata handling compared to other platforms.
            </p>
          </Reveal>

          <div className="mt-12 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.02]">
            <table className="w-full min-w-[580px] text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 bg-white/5 text-white">
                  <th className="py-4 px-5 font-semibold">Privacy Feature</th>
                  <th className="py-4 px-4 font-bold text-white bg-white/10 text-center">Hush</th>
                  <th className="py-4 px-4 font-medium text-white/70 text-center">Signal</th>
                  <th className="py-4 px-4 font-medium text-white/70 text-center">Session</th>
                  <th className="py-4 px-4 font-medium text-white/70 text-center">Telegram</th>
                  <th className="py-4 px-4 font-medium text-white/70 text-center">WhatsApp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-5 font-medium text-white/90">{row.feature}</td>
                    <td className="py-3.5 px-4 text-center bg-white/[0.04]">
                      {row.hush ? (
                        <CheckCircle2 size={16} className="mx-auto text-emerald-400" />
                      ) : (
                        <XCircle size={16} className="mx-auto text-white/20" />
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {row.signal ? (
                        <CheckCircle2 size={16} className="mx-auto text-emerald-400" />
                      ) : (
                        <XCircle size={16} className="mx-auto text-white/20" />
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {row.session ? (
                        <CheckCircle2 size={16} className="mx-auto text-emerald-400" />
                      ) : (
                        <XCircle size={16} className="mx-auto text-white/20" />
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {row.telegram ? (
                        <CheckCircle2 size={16} className="mx-auto text-emerald-400" />
                      ) : (
                        <XCircle size={16} className="mx-auto text-white/20" />
                      )}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      {row.whatsapp ? (
                        <CheckCircle2 size={16} className="mx-auto text-emerald-400" />
                      ) : (
                        <XCircle size={16} className="mx-auto text-white/20" />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Threat Model & Operational Security */}
      <section id="threat-model" className="relative py-20">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Honest Security</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
              Threat Model: What We Defend &amp; What We Cannot
            </h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/60">
              No software can protect against an adversary with physical possession of an unlocked phone or a compromised operating system kernel. Here is what Hush explicitly addresses.
            </p>
          </Reveal>

          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Defends Against */}
            <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.02] p-6 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 size={18} />
                <span>What Hush Defends Against</span>
              </div>
              <ul className="space-y-3 text-xs text-white/70">
                <li>
                  <strong className="text-white">ISP &amp; Telecom Snooping:</strong> Internet providers and cell towers only see scrambled packets directed to ephemeral endpoints.
                </li>
                <li>
                  <strong className="text-white">Cloud Subpoenas:</strong> Since Hush does not store accounts or chats on servers, there is no database to subpoena or seize.
                </li>
                <li>
                  <strong className="text-white">Post-Session Forensic Seizure:</strong> After tapping Leave, memory is zeroized. A forensic extraction of your phone storage reveals zero chat logs.
                </li>
                <li>
                  <strong className="text-white">Internet Blackouts &amp; Censorship:</strong> Nearby Wi-Fi and Bluetooth allow local device-to-device communication without any WAN access.
                </li>
              </ul>
            </div>

            {/* Out of Scope / User Responsibility */}
            <div className="rounded-2xl border border-amber-500/20 bg-amber-500/[0.02] p-6 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <AlertTriangle size={18} />
                <span>What Remains User Responsibility</span>
              </div>
              <ul className="space-y-3 text-xs text-white/70">
                <li>
                  <strong className="text-white">Device Malware / Keyloggers:</strong> If your Android OS contains root-level spyware or pegasus-like implants, screen contents can be captured before encryption.
                </li>
                <li>
                  <strong className="text-white">Physical Shoulder Surfing:</strong> Anyone looking directly at your physical phone screen can read messages while the session is open.
                </li>
                <li>
                  <strong className="text-white">Untrusted Peers:</strong> The other person in the session could take a photo of their phone screen with a second camera.
                </li>
                <li>
                  <strong className="text-white">Out-of-Band Code Sharing:</strong> Share your 6-digit code through a trusted channel or in person.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

