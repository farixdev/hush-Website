import Link from "next/link";
import { ArrowLeft, BookOpen, Download, HelpCircle, Mail, Shield } from "lucide-react";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import HushMark from "@/components/HushMark";
import Particles from "@/components/reactbits/Particles";

export default function NotFound() {
  return (
    <main className="relative min-h-screen bg-black text-white flex flex-col justify-between">
      <Nav />

      <section className="relative overflow-hidden pt-36 pb-20 flex-1 flex items-center justify-center">
        <Particles quantity={45} className="opacity-40" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/[0.04] blur-[150px]"
        />

        <div className="container-page relative text-center max-w-xl py-12">
          <div className="flex justify-center">
            <HushMark size={64} className="rounded-2xl" />
          </div>

          <p className="mt-8 font-mono text-xs uppercase tracking-[0.3em] text-white/40">
            Error 404
          </p>

          <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl text-white">
            Page Vanished.
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Like a closed Hush session, this page leaves no trace. It may have been moved, removed, or never existed in the first place.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition-transform hover:scale-105 active:scale-95"
            >
              <ArrowLeft size={14} />
              <span>Back to Homepage</span>
            </Link>
            <Link
              href="/download"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-medium text-white hover:bg-white/10 transition-colors"
            >
              <Download size={14} />
              <span>Download APK</span>
            </Link>
          </div>

          <div className="mt-12 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-left">
            <Link
              href="/docs"
              className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors flex flex-col justify-between"
            >
              <BookOpen size={16} className="text-white/40" />
              <span className="mt-2 font-medium">User Manual</span>
            </Link>
            <Link
              href="/security"
              className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors flex flex-col justify-between"
            >
              <Shield size={16} className="text-white/40" />
              <span className="mt-2 font-medium">Security</span>
            </Link>
            <Link
              href="/faq"
              className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors flex flex-col justify-between"
            >
              <HelpCircle size={16} className="text-white/40" />
              <span className="mt-2 font-medium">FAQ</span>
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-white/10 bg-white/[0.02] p-3 text-xs text-white/70 hover:text-white hover:bg-white/5 transition-colors flex flex-col justify-between"
            >
              <Mail size={16} className="text-white/40" />
              <span className="mt-2 font-medium">Contact Us</span>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

