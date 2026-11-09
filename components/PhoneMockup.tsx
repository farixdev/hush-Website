"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Shield, Fingerprint } from "lucide-react";

/** A sleek hardware frame displaying the authentic Hush home screen */
export default function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, ease: [0.2, 0.65, 0.3, 0.9], delay: 0.2 }}
      className="relative mx-auto w-full max-w-[260px] sm:max-w-[300px]"
    >
      {/* Floating subtle ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-4 rounded-[3.5rem] bg-white/[0.08] blur-2xl"
      />

      {/* Floating badges */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-6 top-16 z-20 hidden sm:flex items-center gap-2 rounded-full border border-white/20 bg-black/90 px-3.5 py-1.5 text-xs shadow-2xl backdrop-blur-xl"
      >
        <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-mono text-white/90 text-[11px]">new in 1:55</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute -right-6 bottom-24 z-20 hidden sm:flex items-center gap-2 rounded-full border border-white/20 bg-black/90 px-3.5 py-1.5 text-xs shadow-2xl backdrop-blur-xl"
      >
        <Fingerprint size={13} className="text-white/70" />
        <span className="text-white/90 text-[11px]">Cinnamon Macaron</span>
      </motion.div>

      {/* Phone hardware frame */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-[2.8rem] border border-white/20 bg-black p-2.5 shadow-[0_40px_120px_-30px_rgba(255,255,255,0.2)] ring-1 ring-white/10"
      >
        {/* Dynamic Island / Speaker */}
        <div className="absolute left-1/2 top-4 z-20 h-3.5 w-20 -translate-x-1/2 rounded-full bg-black/90 border border-white/10 backdrop-blur-md" />

        {/* Screen container */}
        <div className="relative overflow-hidden rounded-[2.2rem] border border-white/10 bg-black aspect-[9/19.5]">
          <Image
            src="/screens/hush-home.jpg"
            alt="Hush mobile application screen showing 6-digit session code"
            fill
            sizes="300px"
            priority
            className="object-cover object-top"
          />
        </div>

        {/* Home bar */}
        <div className="mx-auto mt-2 h-1 w-24 rounded-full bg-white/20" />
      </motion.div>
    </motion.div>
  );
}
