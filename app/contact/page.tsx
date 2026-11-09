"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Mail,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import Particles from "@/components/reactbits/Particles";

const PROJECT_TYPES = [
  "Custom Privacy-First Messenger",
  "P2P & Offline Mesh Communication",
  "Hardened Mobile App (iOS / Android)",
  "Zero-Knowledge Cryptographic Architecture",
  "Enterprise Private Deployment",
  "Other Custom Software",
];

const BUDGET_RANGES = [
  "$10k – $25k",
  "$25k – $50k",
  "$50k – $100k",
  "$100k+",
  "Undetermined / Advisory",
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    project_type: PROJECT_TYPES[0],
    budget: BUDGET_RANGES[1],
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit inquiry.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main id="main-content" className="relative min-h-screen bg-black text-white">
      <Nav />

      {/* Header */}
      <section className="relative overflow-hidden border-b border-white/10 pt-36 pb-16">
        <Particles quantity={40} className="opacity-40" />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-white/[0.04] blur-[140px]"
        />
        <div className="container-page relative max-w-4xl text-center">
          <Reveal>
            <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-mono text-white/70">
              <Mail size={13} className="text-white/80" />
              <span>Edge Brain Software Partnership</span>
            </div>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Build an App Like Hush.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base text-white/60 leading-relaxed">
              Hush is an open proof of sovereign, zero-metadata privacy engineered by{" "}
              <a
                href="https://www.edgebrainsoftware.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white font-medium underline underline-offset-4 hover:text-white/80"
              >
                Edge Brain Software
              </a>
              . If you want to develop a tailored secure app, offline communication system, or peer-to-peer network, partner with our team.
            </p>
          </Reveal>
        </div>
      </section>

      {/* Form & Studio Info */}
      <section className="relative py-16">
        <div className="container-page max-w-5xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
            {/* Left: Studio details & case study link */}
            <div className="lg:col-span-5 space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-4">
                <span className="text-[11px] font-mono uppercase tracking-widest text-white/40">
                  Engineering Studio
                </span>
                <h3 className="text-xl font-bold text-white">
                  Edge Brain Software
                </h3>
                <p className="text-xs text-white/60 leading-relaxed">
                  We specialize in zero-knowledge architectures, native mobile engineering, encrypted communication channels, and offline-first peer networks.
                </p>

                <div className="pt-2">
                  <a
                    href="https://www.edgebrainsoftware.com/work/hush"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs font-semibold text-white transition-colors hover:bg-white/10"
                  >
                    <span>Read Hush Case Study</span>
                    <ExternalLink size={14} className="text-white/40" />
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 space-y-3">
                <h4 className="text-sm font-semibold text-white">Capabilities</h4>
                <ul className="space-y-2 text-xs text-white/60">
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Android &amp; iOS Standalone Applications</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>Local Subnet &amp; Bluetooth Mesh Protocols</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>WebRTC Real-Time Encrypted Voice &amp; Video</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    <span>RAM-Only Anti-Forensics &amp; Zero Retention</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Right: Contact Form */}
            <div className="lg:col-span-7">
              <div className="rounded-2xl border border-white/15 bg-white/[0.02] p-6 sm:p-8 backdrop-blur-md">
                {submitted ? (
                  <div className="py-12 text-center space-y-4">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                      <CheckCircle2 size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-white">
                      Inquiry Received
                    </h3>
                    <p className="mx-auto max-w-md text-xs sm:text-sm text-white/60 leading-relaxed">
                      Thank you for contacting Edge Brain Software. Your project details have been logged and routed to our principal engineers. We will review your requirements and respond at <strong>{form.email}</strong> shortly.
                    </p>
                    <div className="pt-4">
                      <button
                        onClick={() => {
                          setSubmitted(false);
                          setForm({
                            name: "",
                            email: "",
                            company: "",
                            project_type: PROJECT_TYPES[0],
                            budget: BUDGET_RANGES[1],
                            message: "",
                          });
                        }}
                        className="rounded-full border border-white/20 bg-white/5 px-5 py-2 text-xs font-medium text-white hover:bg-white/10 transition-colors"
                      >
                        Submit another inquiry
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Tell us about your project
                      </h3>
                      <p className="mt-1 text-xs text-white/50">
                        Fill out the details below. Our engineering leads will reach out within 24 hours.
                      </p>
                    </div>

                    {error && (
                      <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                        <AlertCircle size={14} className="shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-name" className="block text-xs font-medium text-white/70">
                          Your Name *
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          required
                          value={form.name}
                          onChange={(e) => setForm({ ...form, name: e.target.value })}
                          placeholder="Alice Carter"
                          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-white focus:outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor="contact-email" className="block text-xs font-medium text-white/70">
                          Work Email *
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          placeholder="alice@company.com"
                          className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-white focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-company" className="block text-xs font-medium text-white/70">
                        Organization / Company
                      </label>
                      <input
                        id="contact-company"
                        type="text"
                        value={form.company}
                        onChange={(e) => setForm({ ...form, company: e.target.value })}
                        placeholder="Company Ltd. or Individual"
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-3.5 py-2.5 text-xs text-white placeholder-white/30 focus:border-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label htmlFor="contact-project-type" className="block text-xs font-medium text-white/70">
                          Project Type
                        </label>
                        <select
                          id="contact-project-type"
                          value={form.project_type}
                          onChange={(e) => setForm({ ...form, project_type: e.target.value })}
                          className="mt-1.5 w-full rounded-xl border border-white/10 bg-neutral-900 px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                        >
                          {PROJECT_TYPES.map((t) => (
                            <option key={t} value={t} className="bg-neutral-900 text-white">
                              {t}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label htmlFor="contact-budget" className="block text-xs font-medium text-white/70">
                          Estimated Budget
                        </label>
                        <select
                          id="contact-budget"
                          value={form.budget}
                          onChange={(e) => setForm({ ...form, budget: e.target.value })}
                          className="mt-1.5 w-full rounded-xl border border-white/10 bg-neutral-900 px-3.5 py-2.5 text-xs text-white focus:border-white focus:outline-none"
                        >
                          {BUDGET_RANGES.map((b) => (
                            <option key={b} value={b} className="bg-neutral-900 text-white">
                              {b}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-xs font-medium text-white/70">
                        Project Brief / Requirements *
                      </label>
                      <textarea
                        id="contact-message"
                        required
                        rows={4}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Describe what you want to build, target platforms, timeline, and privacy constraints..."
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs text-white placeholder-white/30 focus:border-white focus:outline-none resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-bold text-black transition-transform hover:scale-[1.01] active:scale-98 disabled:opacity-50"
                    >
                      {loading ? (
                        <span>Sending inquiry...</span>
                      ) : (
                        <>
                          <span>Submit Inquiry to Edge Brain Software</span>
                          <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

