"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, RotateCw, ArrowRight, Shield, Lock, Phone, KeyRound } from "lucide-react";

const PSEUDONYMS = [
  "Cinnamon Macaron",
  "Velvet Comet",
  "Silent Falcon",
  "Obsidian Willow",
  "Midnight Echo",
  "Copper Raven",
  "Lunar Sparrow",
  "Silver Fox",
  "Amber Drift",
  "Ghost Orchid",
];

function generateCode() {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let res = "";
  for (let i = 0; i < 6; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

export default function LiveCodeDemo() {
  const [code, setCode] = useState("65VVJ8");
  const [aliasIndex, setAliasIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(115); // 1:55
  const [inputCode, setInputCode] = useState("");
  const [connectedState, setConnectedState] = useState(false);

  // Countdown timer simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setCode(generateCode());
          return 120;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCopy = () => {
    navigator.clipboard?.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const rollNewAlias = () => {
    setAliasIndex((prev) => (prev + 1) % PSEUDONYMS.length);
  };

  const refreshCode = () => {
    setCode(generateCode());
    setTimerSeconds(120);
  };

  const handleSimulateConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.length >= 6) {
      setConnectedState(true);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-3xl border border-white/15 bg-black/80 p-6 sm:p-10 backdrop-blur-xl">
      {/* Background glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/[0.04] blur-3xl"
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 items-center">
        {/* Left column: Explanatory text */}
        <div className="lg:col-span-6 space-y-5">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-white/70">
            <KeyRound size={12} className="text-white/80" />
            <span>Interactive Simulator</span>
          </div>

          <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
            Experience the zero-friction handshake.
          </h3>

          <p className="text-sm leading-relaxed text-white/60">
            No contacts to sync. No phone numbers exposed to data brokers. Hush generates a fresh 6-digit cryptographic handshake token and a playful throwaway pseudonym every 2 minutes.
          </p>

          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3 text-xs text-white/70">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white font-mono text-[10px]">1</span>
              <span>Open the app — your 6-digit code is generated immediately.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/70">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white font-mono text-[10px]">2</span>
              <span>Send the code via any channel or tap nearby.</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/70">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/10 text-white font-mono text-[10px]">3</span>
              <span>The recipient types it in and an encrypted pipe opens automatically.</span>
            </div>
          </div>

          <div className="pt-2">
            <span className="text-xs text-white/40 italic">
              Try clicking the buttons in the phone simulator on the right to test code rolling and pseudonyms.
            </span>
          </div>
        </div>

        {/* Right column: Interactive App Mockup */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-sm rounded-[2.5rem] border border-white/20 bg-black p-5 shadow-2xl ring-1 ring-white/10">
            {/* Mock Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 text-xs text-white/50">
              <span className="font-bold tracking-wider text-white">hush</span>
              <span className="text-[10px] uppercase tracking-widest text-white/40">SIMULATOR</span>
            </div>

            <AnimatePresence mode="wait">
              {!connectedState ? (
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-5 pt-4"
                >
                  {/* Your code box */}
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-white/50">
                      <span className="uppercase tracking-widest">Your code</span>
                      <button
                        onClick={refreshCode}
                        className="flex items-center gap-1 text-[10px] text-white/40 hover:text-white transition-colors"
                        title="Rotate code immediately"
                      >
                        <span>new in {formatTimer(timerSeconds)}</span>
                        <RotateCw size={11} />
                      </button>
                    </div>

                    <div
                      onClick={handleCopy}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handleCopy();
                        }
                      }}
                      tabIndex={0}
                      role="button"
                      aria-label="Copy 6-digit session code"
                      className="mt-2 group relative cursor-pointer rounded-2xl border border-white/40 bg-white/[0.02] p-4 text-center transition-all hover:border-white hover:bg-white/[0.05] focus-visible:ring-2 focus-visible:ring-white"
                    >
                      <div className="font-mono text-2xl sm:text-3xl font-extrabold tracking-[0.2em] sm:tracking-[0.35em] text-white">
                        {code.split("").join(" ")}
                      </div>
                      <div className="mt-1 flex items-center justify-center gap-1.5 text-[11px] text-white/50 group-hover:text-white transition-colors">
                        {copied ? (
                          <>
                            <Check size={12} className="text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Copied to clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy size={12} />
                            <span>tap to copy</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-2.5 flex items-center justify-between px-1">
                      <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Ready to share</span>
                      </div>

                      {/* Pseudonym randomizer */}
                      <button
                        onClick={rollNewAlias}
                        className="flex items-center gap-1.5 text-[11px] text-white/70 hover:text-white transition-colors"
                      >
                        <span className="text-white/40">you&apos;re</span>
                        <span className="font-medium underline underline-offset-2">{PSEUDONYMS[aliasIndex]}</span>
                        <RotateCw size={10} className="text-white/40" />
                      </button>
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="flex items-center gap-3 text-[10px] text-white/30">
                    <div className="h-px flex-1 bg-white/10" />
                    <span>OR</span>
                    <div className="h-px flex-1 bg-white/10" />
                  </div>

                  {/* Connect input */}
                  <form onSubmit={handleSimulateConnect} className="space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-white/50">
                      <span className="uppercase tracking-widest">Enter a code</span>
                      <button
                        type="button"
                        onClick={() => setInputCode(code)}
                        className="text-[10px] text-white/40 hover:text-white transition-colors"
                      >
                        Use my code
                      </button>
                    </div>

                    <input
                      type="text"
                      maxLength={6}
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      placeholder="e.g. 65VVJ8"
                      className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-center font-mono text-base uppercase tracking-widest text-white placeholder-white/20 focus:border-white focus:outline-none focus:ring-1 focus:ring-white"
                    />

                    <button
                      type="submit"
                      disabled={inputCode.length < 6}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-bold text-black transition-all hover:bg-white/90 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <span>Connect</span>
                      <ArrowRight size={14} />
                    </button>
                  </form>
                </motion.div>
              ) : (
                /* Connected State Preview */
                <motion.div
                  key="connected"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4 pt-4 text-center"
                >
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                    <Shield size={24} />
                  </div>

                  <div>
                    <h4 className="text-base font-bold text-white">Private Session Active</h4>
                    <p className="mt-1 text-xs text-white/50">
                      Paired with anonymous peer · End-to-end encrypted
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-left space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white/40">Your alias:</span>
                      <span className="font-medium text-white">{PSEUDONYMS[aliasIndex]}</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white/40">Cipher:</span>
                      <span className="font-mono text-emerald-400">X25519 · ChaCha20</span>
                    </div>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-white/40">Persistence:</span>
                      <span className="text-white/60">RAM-only (Volatile)</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => setConnectedState(false)}
                      className="flex-1 rounded-xl border border-white/20 bg-white/5 py-2.5 text-xs font-medium text-white hover:bg-white/10 transition-colors"
                    >
                      Leave &amp; Wipe
                    </button>
                    <button
                      onClick={() => alert("In the Android app, this initiates an encrypted peer-to-peer voice call!")}
                      className="flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-black hover:bg-white/90 transition-colors"
                    >
                      <Phone size={13} />
                      <span>Call</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

