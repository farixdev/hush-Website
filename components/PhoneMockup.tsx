"use client";

import { motion } from "framer-motion";
import HushMark from "./HushMark";

/** A stylized rendering of Hush's "connect" screen. */
export default function PhoneMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, ease: [0.2, 0.65, 0.3, 0.9], delay: 0.2 }}
      className="relative mx-auto w-[260px]"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative rounded-[2.6rem] border border-white/15 bg-black p-2 shadow-[0_40px_120px_-30px_rgba(255,255,255,0.18)]"
      >
        <div className="overflow-hidden rounded-[2.1rem] border border-white/10 bg-black">
          {/* status bar */}
          <div className="flex items-center justify-between px-5 pt-3 text-[10px] text-white/50">
            <span>9:41</span>
            <span>▪▪▪ ▪</span>
          </div>
          {/* header */}
          <div className="flex items-center justify-between px-5 pb-3 pt-4">
            <span className="text-sm font-extrabold tracking-wide">hush</span>
            <HushMark size={22} />
          </div>
          <div className="h-px w-full bg-white/10" />

          {/* body */}
          <div className="px-5 py-6">
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/40">
              Your code
            </p>
            <div className="mt-2 rounded-xl border border-white/60 py-4 text-center">
              <div className="font-mono text-[26px] font-extrabold tracking-[0.35em]">
                X7K9P2
              </div>
              <div className="mt-1 text-[9px] text-white/40">tap to copy</div>
            </div>

            <div className="my-5 flex items-center gap-3 text-[9px] text-white/30">
              <div className="h-px flex-1 bg-white/10" />
              OR
              <div className="h-px flex-1 bg-white/10" />
            </div>

            <p className="text-[9px] uppercase tracking-[0.25em] text-white/40">
              Enter a code
            </p>
            <div className="mt-2 rounded-xl bg-white/[0.06] py-3 text-center font-mono text-lg tracking-[0.4em] text-white/40">
              ••••••
            </div>
            <div className="mt-3 rounded-xl bg-white py-3 text-center text-xs font-bold text-black">
              Connect
            </div>
            <div className="mt-5 flex items-center justify-center gap-1.5 text-[8.5px] text-white/30">
              <span>🔒</span> Anonymous · nothing is kept
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
