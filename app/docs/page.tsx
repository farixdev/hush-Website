import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Smartphone,
  ShieldCheck,
  Wifi,
  Bluetooth,
  Users,
  Timer,
  Phone,
  KeyRound,
  AlertCircle,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Lock,
} from "lucide-react";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Particles from "@/components/reactbits/Particles";

export const metadata: Metadata = {
  title: "User Manual & Documentation · Hush",
  description:
    "Official user manual and step-by-step guidance for Hush. Learn how to install the APK, connect using 6-digit codes, set up private group rooms, use Nearby offline mode, and make encrypted voice calls.",
  alternates: { canonical: "/docs" },
  openGraph: {
    title: "User Manual & Documentation · Hush",
    description:
      "Step-by-step guidance for Hush on Android: 6-digit session codes, offline Wi-Fi & Bluetooth mode, private groups, and encrypted voice calls.",
    url: "/docs",
    images: ["/hush-mask.png"],
  },
};

const CHAPTERS = [
  { id: "getting-started", title: "1. Installation & Setup", icon: Smartphone },
  { id: "direct-sessions", title: "2. 1-on-1 Direct Sessions", icon: KeyRound },
  { id: "private-groups", title: "3. Private Group Rooms", icon: Users },
  { id: "nearby-offline", title: "4. Nearby Offline Mode", icon: Wifi },
  { id: "voice-calls", title: "5. Encrypted Voice Calling", icon: Phone },
  { id: "ephemeral-data", title: "6. Data Lifecycle & Leave", icon: Timer },
  { id: "troubleshooting", title: "7. Troubleshooting & FAQ", icon: HelpCircle },
];

export default function DocsPage() {
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
        <div className="container-page relative">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-white/70">
              <BookOpen size={13} className="text-white/80" />
              <span>Official User Manual &amp; Docs</span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Mastering Hush.
            </h1>
            <p className="mt-4 text-lg leading-relaxed text-white/60">
              A comprehensive guide to private, zero-trace messaging on Android.
              Learn how the ephemeral codes operate, how to chat offline with no
              internet, and how your conversations vanish when you leave.
            </p>
          </div>
        </div>
      </section>

      {/* Body with Sidebar Layout */}
      <section className="relative py-16">
        <div className="container-page grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Sticky Navigation / Table of Contents */}
          <aside className="lg:col-span-3">
            <div className="sticky top-28 space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
                Contents
              </p>
              <nav className="space-y-1">
                {CHAPTERS.map((ch) => {
                  const Icon = ch.icon;
                  return (
                    <a
                      key={ch.id}
                      href={`#${ch.id}`}
                      className="group flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-xs text-white/60 transition-colors hover:bg-white/5 hover:text-white"
                    >
                      <Icon size={14} className="text-white/40 group-hover:text-white" />
                      <span>{ch.title}</span>
                    </a>
                  );
                })}
              </nav>

              <div className="border-t border-white/10 pt-4">
                <Link
                  href="/download"
                  className="flex items-center justify-between rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black transition-transform hover:scale-[1.02]"
                >
                  <span>Download Latest APK</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </div>
          </aside>

          {/* Main Manual Content */}
          <div className="space-y-20 lg:col-span-9">
            {/* Chapter 1: Installation & Setup */}
            <article id="getting-started" className="scroll-mt-32 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                  Chapter 01
                </span>
                <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Installation &amp; Android Setup
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  How to securely install Hush on any Android phone without an app store account.
                </p>
              </div>

              <div className="prose prose-invert max-w-none text-sm text-white/70 leading-relaxed space-y-4">
                <p>
                  Hush is distributed as a pure, standalone Android APK. It intentionally avoids dependency on Google Play Services, Firebase analytics, or Google Mobile Services (GMS), ensuring your phone identity is never attached to Google tracking IDs.
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 pt-2">
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <span className="font-mono text-xs font-bold text-white">Step 1</span>
                    <h4 className="mt-2 text-sm font-semibold text-white">Download APK</h4>
                    <p className="mt-1 text-xs text-white/50">
                      Grab the signed APK from <Link href="/download" className="text-white underline">hush.app/download</Link> or the direct mirror.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <span className="font-mono text-xs font-bold text-white">Step 2</span>
                    <h4 className="mt-2 text-sm font-semibold text-white">Enable Unknown Apps</h4>
                    <p className="mt-1 text-xs text-white/50">
                      When prompted by your browser or file manager, tap <em>Settings</em> and allow <em>Install unknown apps</em>.
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <span className="font-mono text-xs font-bold text-white">Step 3</span>
                    <h4 className="mt-2 text-sm font-semibold text-white">Open Instantly</h4>
                    <p className="mt-1 text-xs text-white/50">
                      Tap Install and Open. There is zero registration form, no phone number prompt, and no email verification.
                    </p>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-5">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                    <ShieldCheck size={16} className="text-emerald-400" />
                    <span>Android Permissions Policy</span>
                  </div>
                  <p className="mt-2 text-xs text-white/60 leading-relaxed">
                    Hush follows an uncompromising minimal-privilege principle:
                  </p>
                  <ul className="mt-2 space-y-1 text-xs text-white/60 list-disc list-inside">
                    <li><strong className="text-white">Contacts:</strong> Never requested. Hush has no access to your address book.</li>
                    <li><strong className="text-white">Storage / Photos:</strong> Never requested for persistent logs.</li>
                    <li><strong className="text-white">Microphone:</strong> Requested only when you tap Call to transmit peer-to-peer audio.</li>
                    <li><strong className="text-white">Nearby Devices / Bluetooth:</strong> Requested only for offline discovery when you select Nearby Mode.</li>
                  </ul>
                </div>
              </div>
            </article>

            {/* Chapter 2: 1-on-1 Direct Sessions */}
            <article id="direct-sessions" className="scroll-mt-32 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                  Chapter 02
                </span>
                <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  1-on-1 Direct Sessions &amp; 6-Character Codes
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  How pairing works using zero-knowledge expiring codes and playful pseudonyms.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
                <div className="lg:col-span-7 space-y-4 text-sm text-white/70 leading-relaxed">
                  <p>
                    Every time you launch Hush, a randomized 6-character alphanumeric code is generated (for example, <code className="font-mono text-white bg-white/10 px-1.5 py-0.5 rounded">65VVJ8</code>).
                  </p>

                  <h3 className="text-base font-semibold text-white">Key Mechanisms:</h3>
                  <div className="space-y-3 text-xs">
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                      <strong className="text-white block font-medium">1. Two-Minute Auto Rollover</strong>
                      <span className="text-white/60 mt-1 block">
                        Under the code box, notice the countdown <code className="text-white font-mono">new in 1:55 ⟳</code>. When the countdown finishes, an unused code is purged and replaced. This prevents stale codes from floating around.
                      </span>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                      <strong className="text-white block font-medium">2. Anonymous Pseudonyms</strong>
                      <span className="text-white/60 mt-1 block">
                        You are assigned a playful, randomized alias (e.g. <em>&quot;you&apos;re Cinnamon Macaron&quot;</em>). Tapping the refresh icon beside your pseudonym rolls a new one on the fly.
                      </span>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                      <strong className="text-white block font-medium">3. Connecting</strong>
                      <span className="text-white/60 mt-1 block">
                        One person shares their code. The other person scrolls down to &quot;Enter a code&quot;, types the 6 characters, and taps <strong className="text-white">Connect</strong>. The private session opens automatically on both screens.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Screenshot embed */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="w-[240px] rounded-2xl border border-white/15 bg-black p-2 shadow-xl">
                    <div className="relative aspect-[9/19.5] overflow-hidden rounded-xl border border-white/10 bg-black">
                      <Image
                        src="/screens/hush-home.jpg"
                        alt="Hush main screen with 6-digit code and connect input"
                        fill
                        sizes="240px"
                        className="object-cover object-top"
                      />
                    </div>
                    <p className="mt-2 text-center text-[10px] text-white/40">
                      Main Home Screen · 65VVJ8 session token
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Chapter 3: Private Group Rooms */}
            <article id="private-groups" className="scroll-mt-32 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                  Chapter 03
                </span>
                <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Private Group Rooms &amp; Disappearing Timers
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  Host encrypted multi-party rooms, group voice conversations, and configure timed self-destruct.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
                <div className="lg:col-span-7 space-y-4 text-sm text-white/70 leading-relaxed">
                  <p>
                    On the main screen under <em>&quot;MORE WAYS&quot;</em>, select <strong className="text-white">Create private group</strong>. This creates a multi-peer encrypted room identified by a unique group code (e.g., <code className="font-mono text-white bg-white/10 px-1.5 py-0.5 rounded">H8KSVQ</code>).
                  </p>

                  <div className="space-y-3 text-xs">
                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                      <strong className="text-white block font-medium">Inviting Members</strong>
                      <span className="text-white/60 mt-1 block">
                        Share the 6-character room code with anyone you want in the room. Anyone entering the code joins the room securely.
                      </span>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                      <strong className="text-white block font-medium">Hourglass Disappearing Timer</strong>
                      <span className="text-white/60 mt-1 block">
                        Notice the hourglass icon (<Timer size={12} className="inline mx-1" />) next to the message input box. Tap it to toggle self-destruct timers (e.g. 8s, 30s, 5m). Messages automatically disappear from all devices after reading.
                      </span>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/[0.02] p-3.5">
                      <strong className="text-white block font-medium">Multi-Party E2EE</strong>
                      <span className="text-white/60 mt-1 block">
                        Every message is sealed separately for each peer in the room. The server acts merely as a blind blind-relay packet forwarder, completely unable to decipher messages.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Screenshot embed */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="w-[240px] rounded-2xl border border-white/15 bg-black p-2 shadow-xl">
                    <div className="relative aspect-[9/19.5] overflow-hidden rounded-xl border border-white/10 bg-black">
                      <Image
                        src="/screens/hush-group.jpg"
                        alt="Hush private group room screen showing encrypted members and leave button"
                        fill
                        sizes="240px"
                        className="object-cover object-top"
                      />
                    </div>
                    <p className="mt-2 text-center text-[10px] text-white/40">
                      Private Group Screen · Code H8KSVQ
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Chapter 4: Nearby Offline Mode */}
            <article id="nearby-offline" className="scroll-mt-32 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                  Chapter 04
                </span>
                <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Nearby Offline Mode (Wi-Fi &amp; Bluetooth)
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  Communicate locally with zero internet access, zero cellular towers, and zero cloud relays.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 items-center">
                <div className="lg:col-span-7 space-y-4 text-sm text-white/70 leading-relaxed">
                  <p>
                    From the main screen, tap <strong className="text-white">Someone nearby</strong>. This opens the Nearby radar scanner.
                  </p>

                  <h3 className="text-base font-semibold text-white">1. Local Wi-Fi (LAN Subnet)</h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    When both phones are connected to the same Wi-Fi router (home network, office, or mobile hotspot), Hush uses multicast peer discovery (mDNS). Packets travel directly between the two phones over your local radio link. No internet connection is needed!
                  </p>

                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-xs text-amber-200">
                    <strong className="block font-semibold">Important note on Guest / Public Wi-Fi:</strong>
                    <span>
                      Some café, airport, or hotel networks enable &quot;Client Isolation&quot; (AP Isolation), which blocks devices on the same Wi-Fi from talking to each other. If this happens, use Bluetooth mode instead.
                    </span>
                  </div>

                  <h3 className="text-base font-semibold text-white pt-2">2. Bluetooth Device-to-Device</h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    If Wi-Fi is unavailable or blocked, tap the top button: <code className="text-white font-mono bg-white/10 px-1.5 py-0.5 rounded">&quot;No Wi-Fi? Connect over Bluetooth&quot;</code>. Hush engages Bluetooth Low Energy (BLE) direct pairing, allowing encrypted chat and calls in basements, flights, protests, or off-grid locations.
                  </p>
                </div>

                {/* Screenshot embed */}
                <div className="lg:col-span-5 flex justify-center">
                  <div className="w-[240px] rounded-2xl border border-white/15 bg-black p-2 shadow-xl">
                    <div className="relative aspect-[9/19.5] overflow-hidden rounded-xl border border-white/10 bg-black">
                      <Image
                        src="/screens/hush-nearby.jpg"
                        alt="Hush nearby radar scanner searching for devices over Wi-Fi and Bluetooth"
                        fill
                        sizes="240px"
                        className="object-cover object-top"
                      />
                    </div>
                    <p className="mt-2 text-center text-[10px] text-white/40">
                      Nearby Screen · Wi-Fi &amp; Bluetooth Fallback
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Chapter 5: Encrypted Voice Calling */}
            <article id="voice-calls" className="scroll-mt-32 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                  Chapter 05
                </span>
                <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Encrypted Voice Calling
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  Peer-to-peer encrypted audio conferencing without third-party phone numbers or servers.
                </p>
              </div>

              <div className="space-y-4 text-sm text-white/70 leading-relaxed">
                <p>
                  Hush isn&apos;t just for text. Both 1-on-1 sessions and private group rooms feature integrated voice calling.
                </p>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-center gap-2 text-white font-semibold text-sm">
                      <Phone size={16} />
                      <span>Starting a Call</span>
                    </div>
                    <p className="mt-2 text-xs text-white/60 leading-relaxed">
                      Tap the phone icon in the top header. Your microphone audio is sampled, compressed with the Opus codec, and encrypted using DTLS-SRTP before leaving your phone.
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                    <div className="flex items-center gap-2 text-white font-semibold text-sm">
                      <ShieldCheck size={16} className="text-emerald-400" />
                      <span>True Peer-to-Peer</span>
                    </div>
                    <p className="mt-2 text-xs text-white/60 leading-relaxed">
                      Voice packets stream directly between the participants whenever possible. No company server listens in, buffers, or records your conversation.
                    </p>
                  </div>
                </div>
              </div>
            </article>

            {/* Chapter 6: Data Lifecycle & Leave */}
            <article id="ephemeral-data" className="scroll-mt-32 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                  Chapter 06
                </span>
                <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Data Lifecycle &amp; The &quot;Leave&quot; Protocol
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  How conversations are destroyed permanently and why nothing is ever recovered.
                </p>
              </div>

              <div className="space-y-4 text-sm text-white/70 leading-relaxed">
                <p>
                  Standard messengers (Telegram, WhatsApp, Signal) retain conversation history in databases on your device and offer cloud backups. If your device is seized or forensically inspected, past chats can be exposed.
                </p>

                <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-5">
                  <h4 className="font-bold text-white text-base">The Hush Ephemeral Guarantee:</h4>
                  <ul className="mt-3 space-y-2 text-xs text-white/70">
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>RAM-Only State:</strong> Messages are held only in temporary volatile memory while the session is active.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>Leave Destroys Session:</strong> Tapping <em>Leave</em> or closing the app invokes a cryptographic zeroize wipe. Private keys in RAM are overwritten and discarded.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span><strong>Zero Server Retention:</strong> The relay servers do not hold database records of messages. Once delivered, packets are forgotten instantly.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </article>

            {/* Chapter 7: Troubleshooting & FAQ */}
            <article id="troubleshooting" className="scroll-mt-32 space-y-6">
              <div className="border-b border-white/10 pb-4">
                <span className="font-mono text-xs text-white/40 uppercase tracking-widest">
                  Chapter 07
                </span>
                <h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
                  Troubleshooting &amp; Pro Tips
                </h2>
                <p className="mt-2 text-sm text-white/60">
                  Common questions and solutions for Android connectivity.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <h4 className="font-semibold text-white text-sm">
                    &quot;Code says invalid or session not found&quot;
                  </h4>
                  <p className="mt-1 text-white/60 leading-relaxed">
                    Check if the code has expired. Codes rotate every 2 minutes. Have the person sharing the code verify their current 6 characters and re-enter.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <h4 className="font-semibold text-white text-sm">
                    &quot;Nearby scanner is not finding the other phone on Wi-Fi&quot;
                  </h4>
                  <p className="mt-1 text-white/60 leading-relaxed">
                    Make sure both phones are connected to the exact same Wi-Fi network (not one on 2.4GHz guest and one on 5GHz main). If your router enforces AP isolation (common in hotels or coffee shops), tap &quot;No Wi-Fi? Connect over Bluetooth&quot; to bypass the router entirely.
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <h4 className="font-semibold text-white text-sm">
                    &quot;Why don&apos;t I get push notifications when the app is swiped away?&quot;
                  </h4>
                  <p className="mt-1 text-white/60 leading-relaxed">
                    Google push notifications (FCM) require sending your device token and user metadata to Google servers. Hush rejects this surveillance vector. You stay connected only while the app is active or running in the foreground.
                  </p>
                </div>
              </div>

              {/* Call to action */}
              <div className="rounded-2xl border border-white/15 bg-white/[0.03] p-6 text-center mt-8">
                <h3 className="text-lg font-bold text-white">Ready to start?</h3>
                <p className="mt-2 text-xs text-white/50 max-w-md mx-auto">
                  Download the latest APK, install in 10 seconds, and connect anonymously.
                </p>
                <div className="mt-5 flex justify-center">
                  <Link
                    href="/download"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black hover:scale-105 transition-all"
                  >
                    <span>Download Hush for Android</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

