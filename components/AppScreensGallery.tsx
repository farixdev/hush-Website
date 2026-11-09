"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { KeyRound, Radio, Users, Check, ArrowRight, ShieldCheck, Wifi, Bluetooth, Phone, Timer, Shuffle, ShieldAlert } from "lucide-react";

interface ScreenData {
  id: string;
  tabLabel: string;
  badge: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  imageAlt: string;
  highlights: {
    title: string;
    description: string;
    icon: typeof KeyRound;
  }[];
}

const SCREENS: ScreenData[] = [
  {
    id: "home",
    tabLabel: "Instant Code",
    badge: "01 · Fast Handshake",
    title: "No numbers. No sign-up. Just a 6-character code.",
    subtitle:
      "Open Hush and an ephemeral 6-digit alphanumeric code is created on the spot. Share it over any channel; when the recipient enters it, an end-to-end encrypted channel opens instantly.",
    imageSrc: "/screens/hush-home.jpg",
    imageAlt: "Hush main home screen with dynamic 6-digit session code and connect input",
    highlights: [
      {
        title: "2-Minute Auto Rollover",
        description: "Codes rotate automatically with a live countdown timer ('new in 1:55') so obsolete session invitations never stay valid.",
        icon: Timer,
      },
      {
        title: "Throwaway Pseudonyms",
        description: "Assigned whimsical random identities like 'Cinnamon Macaron' that can be re-rolled with a single tap.",
        icon: Shuffle,
      },
      {
        title: "Instant Direct Connect",
        description: "Type or paste the other person's code and tap Connect to initiate an immediate peer handshake.",
        icon: KeyRound,
      },
    ],
  },
  {
    id: "nearby",
    tabLabel: "Nearby & Bluetooth",
    badge: "02 · Zero Internet",
    title: "Chat and voice-call completely offline.",
    subtitle:
      "No cell tower? No internet? In an airplane, protest, subway, or basement? Hush discovers peers on the same local Wi-Fi or directly via Bluetooth with no servers involved.",
    imageSrc: "/screens/hush-nearby.jpg",
    imageAlt: "Hush nearby screen scanning for devices over local Wi-Fi and Bluetooth fallback",
    highlights: [
      {
        title: "Local Wi-Fi Radar",
        description: "Scans your local subnet using zero-configuration mDNS broadcast. Messages never hit the wider internet.",
        icon: Wifi,
      },
      {
        title: "Bluetooth Mesh Fallback",
        description: "One tap switches to direct Bluetooth device-to-device mode. Even with airplane mode or power grid failure, you can still talk.",
        icon: Bluetooth,
      },
      {
        title: "Network Isolation Aware",
        description: "Intelligent warnings help you navigate guest or café networks that block client-to-client traffic.",
        icon: ShieldCheck,
      },
    ],
  },
  {
    id: "group",
    tabLabel: "Private Groups",
    badge: "03 · Multi-Peer Rooms",
    title: "Encrypted group chat and group voice calls.",
    subtitle:
      "Create a private group room with a shared 6-character code (e.g., H8KSVQ). Messages are sealed individually for every member, with disappearing message timers and instant room leave.",
    imageSrc: "/screens/hush-group.jpg",
    imageAlt: "Hush private group room with encrypted chat, voice call button, and disappearing messages timer",
    highlights: [
      {
        title: "Encrypted Voice Conferencing",
        description: "Tap the phone icon in the header to jump into high-fidelity peer-to-peer group voice calls.",
        icon: Phone,
      },
      {
        title: "Disappearing Message Timer",
        description: "Configurable hourglass timer self-destructs messages automatically after they have been read.",
        icon: Timer,
      },
      {
        title: "Total Ephemeral Purge",
        description: "Tap 'Leave' and the cryptographic keys are wiped instantly. No conversation log is retained anywhere.",
        icon: Users,
      },
    ],
  },
  {
    id: "philosophy",
    tabLabel: "Stealth Philosophy",
    badge: "04 · Pure Privacy",
    title: "Quiet. Private. Gone.",
    subtitle:
      "The core promise of Hush is absolute zero-footprint minimalism. No contact syncing, no tracking beacons, no analytics SDKs, and no cloud backups.",
    imageSrc: "/screens/hush-splash.jpg",
    imageAlt: "Hush splash screen displaying the Quiet, Private, Gone philosophy",
    highlights: [
      {
        title: "Zero Metadata Footprint",
        description: "Unlike WhatsApp or Signal, Hush doesn't require your phone number or know who you communicate with.",
        icon: ShieldCheck,
      },
      {
        title: "RAM-Only Execution",
        description: "Ephemeral conversations are held strictly in temporary volatile memory and purged cleanly on session exit.",
        icon: KeyRound,
      },
      {
        title: "Anti-Forensics Architecture",
        description: "No database files left on disk, no unencrypted cache, and zero tracking logs for forensic extraction.",
        icon: ShieldAlert,
      },
    ],
  },
];

export default function AppScreensGallery() {
  const [activeTab, setActiveTab] = useState(0);
  const current = SCREENS[activeTab];

  return (
    <div className="relative">
      {/* Tab Switcher */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl sm:rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-md max-w-xl mx-auto">
        {SCREENS.map((screen, idx) => {
          const isActive = idx === activeTab;
          return (
            <button
              key={screen.id}
              type="button"
              onClick={() => setActiveTab(idx)}
              className={`relative rounded-full px-3.5 py-1.5 sm:px-4 sm:py-2 text-xs font-medium transition-all ${
                isActive
                  ? "bg-white text-black shadow-lg shadow-white/10"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              {screen.tabLabel}
            </button>
          );
        })}
      </div>

      {/* Main Content Area */}
      <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
        {/* Left: Text & Highlights */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 16 }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-mono text-white/70">
                <span>{current.badge}</span>
              </div>

              <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                {current.title}
              </h3>

              <p className="text-base leading-relaxed text-white/60">
                {current.subtitle}
              </p>

              <div className="mt-8 space-y-4 pt-2">
                {current.highlights.map((h, i) => {
                  const Icon = h.icon;
                  return (
                    <div
                      key={h.title}
                      className="group flex items-start gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
                        <Icon size={18} />
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-white">
                          {h.title}
                        </h4>
                        <p className="mt-1 text-xs leading-relaxed text-white/50">
                          {h.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Realistic Phone Mockup with Actual App Screenshot */}
        <div className="flex justify-center lg:col-span-5">
          <div className="relative mx-auto w-full max-w-[270px] sm:max-w-[310px]">
            {/* Ambient soft glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-4 rounded-[3.5rem] bg-white/[0.07] blur-2xl"
            />

            {/* Hardware frame */}
            <div className="relative rounded-[3rem] border border-white/20 bg-black p-2.5 shadow-[0_30px_90px_-20px_rgba(255,255,255,0.15)] ring-1 ring-white/10">
              {/* Dynamic island / speaker notch */}
              <div className="absolute left-1/2 top-4 z-20 h-4 w-24 -translate-x-1/2 rounded-full bg-black/80 border border-white/10 backdrop-blur-md" />

              {/* Screen container */}
              <div className="relative overflow-hidden rounded-[2.4rem] border border-white/10 bg-black aspect-[9/19.5]">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={current.id}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.3 }}
                    className="relative h-full w-full"
                  >
                    <Image
                      src={current.imageSrc}
                      alt={current.imageAlt}
                      fill
                      sizes="(max-width: 640px) 280px, 310px"
                      className="object-cover object-top"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Subtle bottom home indicator bar */}
              <div className="mx-auto mt-2 h-1 w-28 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

