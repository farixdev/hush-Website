"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  ArrowUpRight,
  ChevronDown,
  BookOpen,
  Shield,
  HelpCircle,
  Download,
  KeyRound,
  Users,
  Wifi,
  Mail,
  ExternalLink,
  Lock,
} from "lucide-react";
import HushMark from "./HushMark";

export default function Nav() {
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);

  // Track scroll position for subtle background blur
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  // Close menus on outside click or ESC key
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    }
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      ref={navRef}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || megaOpen || mobileOpen
          ? "bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-lg"
          : "bg-transparent border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-8 sm:py-5">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            aria-label="Hush Homepage"
            className="flex items-center gap-2.5 group focus-visible:ring-offset-2"
          >
            <HushMark size={32} />
            <span className="text-base font-extrabold tracking-tight text-white group-hover:text-white/90">
              Hush
            </span>
          </Link>
          <span className="hidden sm:inline-block h-3.5 w-px bg-white/20" />
          <a
            href="https://www.edgebrainsoftware.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1 text-[11px] font-mono text-white/50 hover:text-white transition-colors"
          >
            <span>by Edge Brain Software</span>
            <ArrowUpRight size={11} className="text-white/40" />
          </a>
        </div>

        {/* Center Minimalist Links with Mega Menu trigger */}
        <nav
          aria-label="Primary Navigation"
          className="hidden items-center gap-8 md:flex text-xs font-medium tracking-wide"
        >
          {/* Mega Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMegaOpen((prev) => !prev)}
            aria-expanded={megaOpen}
            aria-controls="mega-menu-panel"
            className={`flex items-center gap-1.5 transition-colors focus-visible:ring-1 ${
              megaOpen ? "text-white" : "text-white/70 hover:text-white"
            }`}
          >
            <span>Explore Hush</span>
            <ChevronDown
              size={14}
              className={`transition-transform duration-200 ${
                megaOpen ? "rotate-180 text-white" : "text-white/40"
              }`}
            />
          </button>

          <Link
            href="/docs"
            className={`transition-colors hover:text-white ${
              pathname === "/docs" ? "text-white font-semibold" : "text-white/70"
            }`}
          >
            User Manual
          </Link>

          <Link
            href="/security"
            className={`transition-colors hover:text-white ${
              pathname === "/security" ? "text-white font-semibold" : "text-white/70"
            }`}
          >
            Security
          </Link>

          <Link
            href="/faq"
            className={`transition-colors hover:text-white ${
              pathname === "/faq" ? "text-white font-semibold" : "text-white/70"
            }`}
          >
            FAQ
          </Link>

          <Link
            href="/contact"
            className={`transition-colors hover:text-white ${
              pathname === "/contact" ? "text-white font-semibold" : "text-white/70"
            }`}
          >
            Build With Us
          </Link>
        </nav>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/download"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md transition-all hover:bg-white hover:text-black hover:scale-105 active:scale-95"
          >
            <span>Get APK</span>
            <ArrowUpRight size={13} />
          </Link>

          {/* Mobile hamburger button */}
          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/80 transition-colors hover:bg-white/10 md:hidden"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* ───────────────────────── Mega Menu Dropdown Panel ───────────────────────── */}
      <AnimatePresence>
        {megaOpen && (
          <motion.div
            id="mega-menu-panel"
            role="region"
            aria-label="Explore Hush Mega Menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-6"
          >
            <div className="overflow-hidden rounded-3xl border border-white/15 bg-black/95 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-white/10">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                {/* Column 1: Core Mechanics */}
                <div className="space-y-4">
                  <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40">
                    Product Architecture
                  </p>
                  <div className="space-y-2">
                    <Link
                      href="/#features"
                      onClick={() => setMegaOpen(false)}
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/5"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
                        <KeyRound size={15} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-white">
                          6-Digit Codes &amp; Rollover
                        </div>
                        <p className="mt-0.5 text-[11px] text-white/50 leading-relaxed">
                          Ephemeral pairing codes rotating every 2 minutes with random pseudonyms.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/docs#nearby-offline"
                      onClick={() => setMegaOpen(false)}
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/5"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
                        <Wifi size={15} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-white">
                          Nearby Offline Mode
                        </div>
                        <p className="mt-0.5 text-[11px] text-white/50 leading-relaxed">
                          Local Wi-Fi LAN discovery and Bluetooth Low Energy mesh without internet.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/docs#private-groups"
                      onClick={() => setMegaOpen(false)}
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/5"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
                        <Users size={15} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-white">
                          Private Group Rooms
                        </div>
                        <p className="mt-0.5 text-[11px] text-white/50 leading-relaxed">
                          Multi-peer encrypted text and group voice calls with disappearing timers.
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Column 2: Guidance & Security */}
                <div className="space-y-4">
                  <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40">
                    Documentation &amp; Trust
                  </p>
                  <div className="space-y-2">
                    <Link
                      href="/docs"
                      onClick={() => setMegaOpen(false)}
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/5"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
                        <BookOpen size={15} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-white">
                          Complete User Manual
                        </div>
                        <p className="mt-0.5 text-[11px] text-white/50 leading-relaxed">
                          7-chapter manual with real app screenshots and APK sideload guidance.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/security"
                      onClick={() => setMegaOpen(false)}
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/5"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
                        <Shield size={15} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-white">
                          Security Whitepaper
                        </div>
                        <p className="mt-0.5 text-[11px] text-white/50 leading-relaxed">
                          X25519 primitives, zero-metadata defense, and messenger comparison.
                        </p>
                      </div>
                    </Link>

                    <Link
                      href="/privacy"
                      onClick={() => setMegaOpen(false)}
                      className="group flex items-start gap-3 rounded-xl p-2.5 transition-colors hover:bg-white/5"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white">
                        <Lock size={15} />
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-white group-hover:text-white">
                          Zero-Data Privacy Policy
                        </div>
                        <p className="mt-0.5 text-[11px] text-white/50 leading-relaxed">
                          Our commitment to zero tracking, no server logs, and memory wipe.
                        </p>
                      </div>
                    </Link>
                  </div>
                </div>

                {/* Column 3: Edge Brain Software / Studio */}
                <div className="space-y-4">
                  <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/40">
                    Edge Brain Software
                  </p>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3">
                    <div className="text-xs font-semibold text-white">
                      Build Custom Privacy Apps
                    </div>
                    <p className="text-[11px] text-white/60 leading-relaxed">
                      Need bespoke secure communications, offline mesh networking, or hardened mobile software for your organization?
                    </p>
                    <div className="flex flex-col gap-2 pt-1">
                      <Link
                        href="/contact"
                        onClick={() => setMegaOpen(false)}
                        className="inline-flex items-center justify-between rounded-xl bg-white px-3 py-2 text-xs font-bold text-black transition-transform hover:scale-[1.02]"
                      >
                        <span>Start a Project</span>
                        <ArrowUpRight size={13} />
                      </Link>
                      <a
                        href="https://www.edgebrainsoftware.com/work/hush"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-white/80 hover:bg-white/10 hover:text-white transition-colors"
                      >
                        <span>Hush Case Study</span>
                        <ExternalLink size={12} className="text-white/40" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ───────────────────────── Mobile Drawer Menu ───────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
              className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
            />

            <motion.div
              id="mobile-nav-panel"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation Menu"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative z-50 mx-auto w-full px-4 pb-4 md:hidden"
            >
              <div className="overflow-hidden rounded-3xl border border-white/15 bg-black/95 p-5 shadow-2xl backdrop-blur-2xl">
                <nav className="flex flex-col gap-1.5 text-xs">
                  <Link
                    href="/#features"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <span>Features</span>
                    <ArrowUpRight size={14} className="text-white/30" />
                  </Link>
                  <Link
                    href="/docs"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <span>User Manual &amp; Docs</span>
                    <ArrowUpRight size={14} className="text-white/30" />
                  </Link>
                  <Link
                    href="/security"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <span>Security Whitepaper</span>
                    <ArrowUpRight size={14} className="text-white/30" />
                  </Link>
                  <Link
                    href="/faq"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <span>FAQ</span>
                    <ArrowUpRight size={14} className="text-white/30" />
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <span>Build an App (Contact Us)</span>
                    <ArrowUpRight size={14} className="text-white/30" />
                  </Link>
                  <Link
                    href="/privacy"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <span>Zero-Data Privacy Policy</span>
                    <ArrowUpRight size={14} className="text-white/30" />
                  </Link>
                  <Link
                    href="/download"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-white/80 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    <span>Download APK</span>
                    <ArrowUpRight size={14} className="text-white/30" />
                  </Link>
                </nav>

                <div className="mt-4 border-t border-white/10 pt-4">
                  <a
                    href="https://www.edgebrainsoftware.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 text-xs text-white/60 hover:text-white py-2 transition-colors"
                  >
                    <span>A product of Edge Brain Software</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
