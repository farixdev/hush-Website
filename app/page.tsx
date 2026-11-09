import Link from "next/link";
import {
  ArrowUpRight,
  EyeOff,
  Lock,
  Phone,
  Wifi,
  Users,
  Timer,
  Radio,
  BookOpen,
  Shield,
  HelpCircle,
  Bluetooth,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
} from "lucide-react";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Particles from "@/components/reactbits/Particles";
import BlurText from "@/components/reactbits/BlurText";
import StarBorder from "@/components/reactbits/StarBorder";
import PhoneMockup from "@/components/PhoneMockup";
import AppScreensGallery from "@/components/AppScreensGallery";
import LiveCodeDemo from "@/components/LiveCodeDemo";

const FEATURES = [
  {
    icon: EyeOff,
    tag: "No Phone Number",
    title: "Completely Anonymous",
    body: "No accounts, no email, no password, no profile. Each session you are assigned a fresh throwaway pseudonym like 'Cinnamon Macaron' — nothing ever ties back to your identity.",
  },
  {
    icon: Lock,
    tag: "X25519 · ChaCha20",
    title: "End-to-End Encrypted",
    body: "Cryptographic keys are negotiated device-to-device using ephemeral Diffie-Hellman handshakes. The relay server only forwards blind ciphertext with zero decryption capability.",
  },
  {
    icon: Phone,
    tag: "Peer-to-Peer",
    title: "Encrypted Voice Calls",
    body: "Speak with crystal-clear clarity. Voice calls are encrypted end-to-end with WebRTC DTLS-SRTP, featuring mute and speakerphone controls without routing through eavesdropping servers.",
  },
  {
    icon: Wifi,
    tag: "Offline & Off-Grid",
    title: "Works Nearby Without Internet",
    body: "Communicate directly over local Wi-Fi or Bluetooth Low Energy (BLE). No cell towers, no satellite, and no internet connection required — perfect for flights, basements, or blackouts.",
  },
  {
    icon: Users,
    tag: "Room Codes",
    title: "Private Group Rooms",
    body: "Create private group rooms with a single 6-character code (e.g. H8KSVQ). Supports multi-peer encrypted text and group voice calls with individually sealed message streams.",
  },
  {
    icon: Timer,
    tag: "Ephemeral Purge",
    title: "Zero-Trace Memory State",
    body: "A session lives strictly in volatile RAM. Configure disappearing message timers with the hourglass icon, or tap 'Leave' to trigger an immediate cryptographic wipe on all devices.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Open Hush",
    body: "A fresh 6-character code and a playful pseudonym (like 'Cinnamon Macaron') appear instantly — no sign-up, no permissions to grant.",
  },
  {
    n: "02",
    title: "Share or Scan Nearby",
    body: "Send your code to a friend, create a group room, or tap 'Someone nearby' to discover devices on the same Wi-Fi or over Bluetooth with zero internet.",
  },
  {
    n: "03",
    title: "Chat & Voice-Call",
    body: "Exchange end-to-end encrypted messages or initiate encrypted voice calls in real time. Everything is sealed on your phone before transmission.",
  },
  {
    n: "04",
    title: "Tap Leave & Vanish",
    body: "When the conversation is done, tap 'Leave'. Encryption keys are purged from volatile memory. Nothing is left in databases or on servers.",
  },
];

const QUICK_FAQS = [
  {
    q: "Do I need a SIM card or phone number to use Hush?",
    a: "No. Unlike Signal, Telegram, and WhatsApp, Hush never asks for a phone number, email address, or contact list access.",
  },
  {
    q: "How does Nearby mode work if there is no internet?",
    a: "Hush communicates directly device-to-device over your local Wi-Fi subnet or Bluetooth Low Energy radio. Messages jump straight between phones.",
  },
  {
    q: "Can conversations be recovered from my phone?",
    a: "No. Hush holds conversations in volatile RAM and does not write message logs to SQLite or flash storage. Tapping Leave wipes the keys.",
  },
];

export default function Home() {
  return (
    <main id="main-content" className="relative bg-black text-white">
      <Nav />

      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden">
        <Particles quantity={70} className="opacity-70" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/[0.06] blur-[120px]"
        />
        <div className="container-page relative grid min-h-screen grid-cols-1 items-center gap-12 pb-20 pt-36 lg:grid-cols-2">
          <div>
            <h1 className="text-[13vw] font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              <BlurText text="Say it." as="span" className="block" />
              <BlurText
                text="Then it's gone."
                as="span"
                delay={0.25}
                className="block text-white/40"
              />
            </h1>

            <p className="mt-7 max-w-md text-lg leading-relaxed text-white/60">
              A private chat and voice call with no accounts and no trace. Get a
              6-character code, share it, and talk in real time — end-to-end
              encrypted. Leave, and it&apos;s gone forever. No internet? Connect to
              someone nearby over Wi-Fi or Bluetooth.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <StarBorder href="/download">
                Download for Android
                <ArrowUpRight size={16} />
              </StarBorder>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                <BookOpen size={16} />
                <span>User Manual &amp; Docs</span>
              </Link>
            </div>
          </div>

          <div className="relative">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ───────────────────────── Interactive Simulator ───────────────────────── */}
      <section className="relative border-t border-white/10 py-24 bg-white/[0.01]">
        <div className="container-page">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="eyebrow">Interactive Preview</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Test the zero-knowledge handshake right now.
              </h2>
              <p className="mt-3 text-sm text-white/50">
                Experience how 6-digit codes and randomized pseudonyms like
                &quot;Cinnamon Macaron&quot; create effortless, private sessions.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <LiveCodeDemo />
          </Reveal>
        </div>
      </section>

      {/* ───────────────────────── App Screens Showcase ───────────────────────── */}
      <section className="relative border-t border-white/10 py-28">
        <div className="container-page">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16">
              <p className="eyebrow">Real App Experience</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Built for pure privacy. Engineered for speed.
              </h2>
              <p className="mt-3 text-sm text-white/50">
                Explore the actual interface: ephemeral 1-on-1 handshakes, local
                Wi-Fi &amp; Bluetooth nearby discovery, and private encrypted
                group rooms.
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <AppScreensGallery />
          </Reveal>
        </div>
      </section>

      {/* ───────────────────────── Features ───────────────────────── */}
      <section id="features" className="relative border-t border-white/10 py-28 bg-white/[0.01]">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Why Hush</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need. Nothing that remembers you.
            </h2>
            <p className="mt-3 max-w-xl text-sm text-white/50">
              Unlike commercial chat applications that harvest social graphs and require phone numbers, Hush treats privacy as an absolute.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <div className="group h-full bg-black p-8 transition-colors hover:bg-white/[0.03]">
                  <div className="flex items-center justify-between">
                    <f.icon
                      size={22}
                      strokeWidth={1.6}
                      className="text-white/80"
                    />
                    <span className="text-[10px] font-mono uppercase tracking-wider text-white/40 border border-white/10 px-2 py-0.5 rounded-full">
                      {f.tag}
                    </span>
                  </div>
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {f.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── How it works ───────────────────────── */}
      <section id="how" className="relative border-t border-white/10 py-28">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              A conversation that leaves nothing behind.
            </h2>
            <p className="mt-3 max-w-xl text-sm text-white/50">
              Four simple steps from opening the app to vanishing into thin air.
            </p>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="card h-full p-7 flex flex-col justify-between">
                  <div>
                    <div className="font-mono text-xs font-bold text-white/30 uppercase tracking-widest">
                      Step {s.n}
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/50">
                      {s.body}
                    </p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-white/5 text-[11px] text-white/30 font-mono">
                    Zero trace state
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/docs"
              className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white underline underline-offset-4"
            >
              <span>Read the step-by-step User Manual &amp; Documentation</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────── Privacy Comparison Teaser ───────────────────────── */}
      <section className="relative border-t border-white/10 py-24 bg-white/[0.01]">
        <div className="container-page">
          <div className="rounded-3xl border border-white/15 bg-white/[0.02] p-8 sm:p-12 backdrop-blur-xl">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="eyebrow">Zero-Metadata Defense</span>
                <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Why Hush eliminates phone numbers entirely.
                </h3>
                <p className="text-sm leading-relaxed text-white/60">
                  Most modern encrypted apps still tie your conversations to your real-world identity via your SIM card and phone number. Hush breaks this link by generating ephemeral peer tokens. When a session terminates, nothing remains on any server.
                </p>
                <div className="pt-2 flex flex-wrap gap-4">
                  <Link
                    href="/security"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black hover:scale-105 transition-all"
                  >
                    <Shield size={14} />
                    <span>Read Security Whitepaper</span>
                  </Link>
                  <Link
                    href="/faq"
                    className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-medium text-white hover:bg-white/10 transition-colors"
                  >
                    <HelpCircle size={14} />
                    <span>Browse FAQ</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 space-y-3">
                <div className="rounded-xl border border-white/10 bg-black/60 p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>Hush Identity</span>
                    <span className="font-mono text-emerald-400">Anonymous Code</span>
                  </div>
                  <p className="mt-1 text-[11px] text-white/40">
                    Throwaway 6-character token &amp; pseudonym. Discarded immediately.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/60 p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>Storage Medium</span>
                    <span className="font-mono text-emerald-400">RAM-Only</span>
                  </div>
                  <p className="mt-1 text-[11px] text-white/40">
                    No databases written to flash memory. No unencrypted caches.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-black/60 p-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-white">
                    <span>Offline Capability</span>
                    <span className="font-mono text-emerald-400">Wi-Fi &amp; Bluetooth</span>
                  </div>
                  <p className="mt-1 text-[11px] text-white/40">
                    Peer discovery with zero dependence on the public internet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────────────────────── FAQ Preview ───────────────────────── */}
      <section className="relative border-t border-white/10 py-24">
        <div className="container-page max-w-4xl">
          <Reveal>
            <div className="text-center mb-12">
              <p className="eyebrow">Common Inquiries</p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Frequently Asked Questions
              </h2>
            </div>
          </Reveal>

          <div className="space-y-4">
            {QUICK_FAQS.map((faq) => (
              <div
                key={faq.q}
                className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-colors hover:border-white/20"
              >
                <h3 className="text-base font-semibold text-white">{faq.q}</h3>
                <p className="mt-2 text-xs leading-relaxed text-white/60">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white/70 hover:text-white underline underline-offset-4"
            >
              <span>View all frequently asked questions</span>
              <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ───────────────────────── CTA ───────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/10 py-28">
        <Particles quantity={40} className="opacity-50" />
        <div className="container-page relative text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
              <span className="shiny-text">Nothing to lose.</span> Literally.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-white/55">
              Install the standalone APK, open it, and start a private session in
              seconds — direct chat, peer-to-peer voice call, or someone nearby.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <StarBorder href="/download">
                Download Hush for Android
                <ArrowUpRight size={16} />
              </StarBorder>
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm font-medium text-white hover:bg-white/10 transition-colors"
              >
                <BookOpen size={15} />
                <span>Read Documentation</span>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
