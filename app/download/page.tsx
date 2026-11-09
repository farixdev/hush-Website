import type { Metadata } from "next";
import Link from "next/link";
import { Smartphone, ShieldCheck, Wifi, BookOpen, HelpCircle, ArrowRight, CheckCircle2, Shield } from "lucide-react";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import HushMark from "@/components/HushMark";
import ProviderLinks from "@/components/ProviderLinks";
import VersionList from "@/components/VersionList";
import Particles from "@/components/reactbits/Particles";
import { listVersions, type Version } from "@/lib/db";
import { formatDate, formatBytes } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Download Hush for Android",
  description:
    "Download the latest Hush APK for Android — free, anonymous, end-to-end encrypted chat and voice calls. No sign-up. Install, open, and get a code in seconds.",
  alternates: { canonical: "/download" },
  openGraph: {
    title: "Download Hush for Android",
    description:
      "Get the latest Hush APK — free, anonymous, encrypted chat and voice calls for Android. No account, nothing kept.",
    url: "/download",
    images: ["/hush-mask.png"],
  },
};

async function safeVersions(): Promise<Version[]> {
  try {
    return await listVersions();
  } catch {
    return [];
  }
}

export default async function DownloadPage() {
  const versions = await safeVersions();
  const latest = versions.find((v) => v.is_latest) ?? versions[0] ?? null;

  return (
    <main id="main-content" className="relative min-h-screen bg-black text-white">
      <Nav />

      {/* hero / latest */}
      <section className="relative overflow-hidden border-b border-white/10">
        <Particles quantity={45} className="opacity-60" />
        <div className="container-page relative pb-16 pt-36 text-center">
          <Reveal>
            <div className="flex justify-center">
              <HushMark size={72} className="rounded-3xl" />
            </div>
            <p className="eyebrow mt-8">Download</p>
            <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-5xl">
              Get Hush for Android
            </h1>

            {latest ? (
              <>
                <p className="mx-auto mt-4 max-w-md text-white/55">
                  Latest release{" "}
                  <span className="font-mono text-white">v{latest.version}</span>{" "}
                  · {formatDate(latest.created_at)}
                  {latest.size_bytes > 0 && (
                    <> · {formatBytes(latest.size_bytes)}</>
                  )}
                </p>
                <p className="mt-8 text-xs uppercase tracking-[0.2em] text-white/35">
                  Download from
                </p>
                <div className="mt-4 flex justify-center">
                  <ProviderLinks version={latest} large />
                </div>
              </>
            ) : (
              <p className="mx-auto mt-6 max-w-md text-white/50">
                No release is available yet — the first build is on its way.
              </p>
            )}

            {/* Verification & Trust badges */}
            <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-white/40">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-emerald-400" />
                <span>Zero Google Play Services dependencies</span>
              </span>
              <span className="h-3 w-px bg-white/15 hidden sm:block" />
              <span className="flex items-center gap-1.5">
                <Shield size={13} className="text-emerald-400" />
                <span>Direct signed APK</span>
              </span>
              <span className="h-3 w-px bg-white/15 hidden sm:block" />
              <span className="flex items-center gap-1.5">
                <span>Android 8.0 or newer</span>
              </span>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Smartphone,
                  t: "1. Install the APK",
                  d: "Allow “install from unknown sources” in your browser, then tap the downloaded APK.",
                },
                {
                  icon: ShieldCheck,
                  t: "2. Open & get a code",
                  d: "No sign-up — an ephemeral 6-character code appears instantly with zero account creation.",
                },
                {
                  icon: Wifi,
                  t: "3. Chat, call, or nearby",
                  d: "Real-time text and voice online, or connect over Wi-Fi / Bluetooth with no internet.",
                },
              ].map((s) => (
                <div key={s.t} className="card p-5 text-left">
                  <s.icon size={18} className="text-white/70" />
                  <div className="mt-3 text-sm font-semibold">{s.t}</div>
                  <div className="mt-1 text-xs leading-relaxed text-white/45">
                    {s.d}
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* User Guide banner */}
          <Reveal delay={0.2}>
            <div className="mx-auto mt-10 max-w-3xl rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-left flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white">
                  <BookOpen size={14} className="text-white/70" />
                  <span>Need help getting started?</span>
                </div>
                <p className="mt-1 text-xs text-white/50">
                  Read our step-by-step user manual covering sideloading, offline Bluetooth pairing, and private groups.
                </p>
              </div>
              <Link
                href="/docs"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-black bg-white px-4 py-2 rounded-full shrink-0 hover:scale-105 transition-all"
              >
                <span>Read User Manual</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* version history */}
      <section id="versions" className="py-20 border-b border-white/10">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Changelog</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Version history
            </h2>
          </Reveal>
          <VersionList versions={versions} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
