import Link from "next/link";
import HushMark from "./HushMark";
import { ArrowUpRight, Shield, BookOpen, HelpCircle, Mail, ExternalLink, Lock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 bg-black pt-16 pb-12">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-10 pb-12 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand & mission */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" aria-label="Hush Homepage" className="flex items-center gap-2.5">
              <HushMark size={28} />
              <span className="text-base font-bold tracking-tight text-white">Hush</span>
            </Link>
            <p className="mt-4 text-xs leading-relaxed text-white/70">
              Zero-knowledge, anonymous communications for Android. Built as an open privacy-first initiative.
            </p>

            <div className="mt-5 rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs">
              <span className="text-white/40 block text-[11px] uppercase tracking-wider">Product of</span>
              <a
                href="https://www.edgebrainsoftware.com/work/hush"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-1 font-semibold text-white hover:text-white/80 inline-flex items-center gap-1 transition-colors"
              >
                <span>Edge Brain Software</span>
                <ArrowUpRight size={13} className="text-white/40" />
              </a>
              <span className="block text-[11px] text-white/50 mt-0.5">
                Custom software &amp; privacy architecture
              </span>
            </div>
          </div>

          {/* Product links */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Product
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-white/70">
              <li>
                <Link href="/#features" className="hover:text-white transition-colors">
                  Core Features
                </Link>
              </li>
              <li>
                <Link href="/#how" className="hover:text-white transition-colors">
                  How Codes Work
                </Link>
              </li>
              <li>
                <Link href="/download" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Download APK</span>
                  <ArrowUpRight size={13} className="text-white/30" />
                </Link>
              </li>
              <li>
                <Link href="/download#versions" className="hover:text-white transition-colors">
                  Release History
                </Link>
              </li>
              <li>
                <a
                  href="https://www.edgebrainsoftware.com/work/hush"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1 text-white/80"
                >
                  <span>Hush Case Study</span>
                  <ExternalLink size={12} className="text-white/40" />
                </a>
              </li>
            </ul>
          </div>

          {/* User Guide & Manual */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Guidance &amp; Docs
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-white/70">
              <li>
                <Link href="/docs" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <BookOpen size={13} className="text-white/40" />
                  <span>User Manual &amp; Docs</span>
                </Link>
              </li>
              <li>
                <Link href="/docs#getting-started" className="hover:text-white transition-colors">
                  Installation Guide
                </Link>
              </li>
              <li>
                <Link href="/docs#nearby-offline" className="hover:text-white transition-colors">
                  Nearby Wi-Fi &amp; Bluetooth
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <HelpCircle size={13} className="text-white/40" />
                  <span>FAQ &amp; Knowledge Base</span>
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Lock size={13} className="text-white/40" />
                  <span>Zero-Data Privacy Policy</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Security & Edge Brain Software */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Enterprise &amp; Development
            </p>
            <ul className="mt-4 space-y-2.5 text-xs text-white/70">
              <li>
                <Link href="/security" className="hover:text-white transition-colors flex items-center gap-1.5">
                  <Shield size={13} className="text-white/40" />
                  <span>Security Whitepaper</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors flex items-center gap-1.5 text-white">
                  <Mail size={13} className="text-white/60" />
                  <span>Build an App Like This</span>
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@edgebrainsoftware.com"
                  className="hover:text-white transition-colors flex items-center gap-1.5 text-white/80"
                >
                  <Mail size={13} className="text-white/40" />
                  <span className="truncate">support@edgebrainsoftware.com</span>
                </a>
              </li>
              <li>
                <a
                  href="https://www.edgebrainsoftware.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-1.5"
                >
                  <span>edgebrainsoftware.com</span>
                  <ArrowUpRight size={13} className="text-white/30" />
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row text-xs text-white/50">
          <div>
            © {new Date().getFullYear()} Hush · A product of{" "}
            <a
              href="https://www.edgebrainsoftware.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/80 hover:text-white underline underline-offset-2"
            >
              Edge Brain Software
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span className="text-white/40">End-to-End Encrypted</span>
            <span className="h-3 w-px bg-white/10 hidden sm:block" />
            <span className="text-white/40">Peer-to-Peer</span>
            <span className="h-3 w-px bg-white/10 hidden sm:block" />
            <Link href="/privacy" className="text-white/60 hover:text-white transition-colors">
              Privacy Declaration
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
