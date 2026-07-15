import Link from "next/link";
import {
  ArrowUpRight,
  EyeOff,
  Timer,
  KeyRound,
  Zap,
  ShieldOff,
  Contrast,
} from "lucide-react";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Particles from "@/components/reactbits/Particles";
import BlurText from "@/components/reactbits/BlurText";
import StarBorder from "@/components/reactbits/StarBorder";
import PhoneMockup from "@/components/PhoneMockup";

const FEATURES = [
  {
    icon: EyeOff,
    title: "Anonymous",
    body: "No login, no sign-up, no profile. You're never asked for a single detail.",
  },
  {
    icon: Timer,
    title: "Ephemeral",
    body: "A session lives only while you're in it. Leave, and the whole thread is deleted.",
  },
  {
    icon: KeyRound,
    title: "Code-based",
    body: "Get a short code, share it, and the moment it's entered you're connected.",
  },
  {
    icon: Zap,
    title: "Real-time",
    body: "Messages, typing and read receipts sync instantly between two devices.",
  },
  {
    icon: ShieldOff,
    title: "No tracking",
    body: "No contact lists, no history, no analytics profile. Nothing follows you.",
  },
  {
    icon: Contrast,
    title: "Black & white",
    body: "A deliberately stark, minimal interface. Nothing to distract from the words.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Open Hush",
    body: "A short code appears instantly no setup, no account.",
  },
  {
    n: "02",
    title: "Share the code",
    body: "Send it to one person, any way you like.",
  },
  {
    n: "03",
    title: "Talk, then vanish",
    body: "They enter it, you're connected. End the session and it's gone for both.",
  },
];

export default function Home() {
  return (
    <main className="relative">
      <Nav />

      {/* ───────────────────────── Hero ───────────────────────── */}
      <section className="relative overflow-hidden">
        <Particles quantity={70} className="opacity-70" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[-10%] h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-white/[0.06] blur-[120px]"
        />
        <div className="container-page relative grid min-h-screen grid-cols-1 items-center gap-12 pb-20 pt-36 lg:grid-cols-2">
          <div>
            

            <h1 className="text-[13vw] font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
              <BlurText text="Say it." as="span" className="block" />
              <BlurText
                text="Then it's gone."
                as="span"
                delay={0.25}
                className="block text-white/40"
              />
            </h1>

            <p className="mt-7 max-w-md text-lg leading-relaxed text-white/60">
              A chat with no accounts and no trace. Get a code, share it with one
              person, talk in real time then end the session and it disappears.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <StarBorder href="/download">
                Download for Android
                <ArrowUpRight size={16} />
              </StarBorder>
              <a
                href="#how"
                className="text-sm font-medium text-white/60 underline-offset-4 transition-colors hover:text-white hover:underline"
              >
                See how it works
              </a>
            </div>

            <div className="mt-10 flex items-center gap-6 text-xs text-white/40">
              <span>Free</span>
              <span className="h-3 w-px bg-white/15" />
              <span>No account</span>
            </div>
          </div>

          <div className="relative">
            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ───────────────────────── Features ───────────────────────── */}
      <section id="features" className="relative border-t border-white/10 py-24">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Why Hush</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need. Nothing that remembers you.
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.05}>
                <div className="group h-full bg-black p-8 transition-colors hover:bg-white/[0.02]">
                  <f.icon
                    size={22}
                    strokeWidth={1.6}
                    className="text-white/80"
                  />
                  <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {f.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── How it works ───────────────────────── */}
      <section id="how" className="relative py-24">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">How it works</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl">
              A conversation that leaves nothing behind.
            </h2>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <div className="card h-full p-8">
                  <div className="font-mono text-sm text-white/30">{s.n}</div>
                  <h3 className="mt-6 text-xl font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-white/50">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ───────────────────────── CTA ───────────────────────── */}
      <section className="relative overflow-hidden border-t border-white/10 py-28">
        <Particles quantity={40} className="opacity-50" />
        <div className="container-page relative text-center">
          <Reveal>
            <h2 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl">
              <span className="shiny-text">Nothing to lose.</span> Literally.
            </h2>
            <p className="mx-auto mt-5 max-w-md text-white/55">
              Install the APK, open it, and start a session in seconds.
            </p>
            <div className="mt-9 flex items-center justify-center">
              <StarBorder href="/download">
                Get Hush
                <ArrowUpRight size={16} />
              </StarBorder>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </main>
  );
}
