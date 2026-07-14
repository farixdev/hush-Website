"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import HushMark from "./HushMark";

export default function Nav() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="container-page mt-4">
        <nav className="flex items-center justify-between rounded-full border border-white/10 bg-black/60 px-4 py-2.5 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2.5">
            <HushMark size={30} />
            <span className="text-[15px] font-bold tracking-tight">Hush</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm text-white/60 md:flex">
            <a href="/#features" className="transition-colors hover:text-white">
              Features
            </a>
            <a href="/#how" className="transition-colors hover:text-white">
              How it works
            </a>
            <Link href="/download" className="transition-colors hover:text-white">
              Versions
            </Link>
          </div>

          <Link
            href="/download"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition-transform hover:scale-[1.03] active:scale-95"
          >
            Download
          </Link>
        </nav>
      </div>
    </motion.header>
  );
}
