import { Smartphone, ShieldCheck, Cloud } from "lucide-react";

import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Reveal from "@/components/Reveal";
import HushMark from "@/components/HushMark";
import DownloadButton from "@/components/DownloadButton";
import VersionList from "@/components/VersionList";
import Particles from "@/components/reactbits/Particles";
import { listVersions, type Version } from "@/lib/db";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

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
    <main className="relative">
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
                </p>
                <div className="mt-8 flex justify-center">
                  <DownloadButton
                    id={latest.id}
                    version={latest.version}
                    sizeBytes={latest.size_bytes}
                  />
                </div>
              </>
            ) : (
              <p className="mx-auto mt-6 max-w-md text-white/50">
                No release is available yet — the first build is on its way.
              </p>
            )}
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
              {[
                {
                  icon: Smartphone,
                  t: "Install the APK",
                  d: "Allow “install from unknown sources”, then tap the file.",
                },
                {
                  icon: ShieldCheck,
                  t: "Open & get a code",
                  d: "No sign-up — a code appears instantly.",
                },
                {
                  icon: Cloud,
                  t: "Needs internet",
                  d: "Messages sync in real time between two devices.",
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
        </div>
      </section>

      {/* version history */}
      <section className="py-20">
        <div className="container-page">
          <Reveal>
            <p className="eyebrow">Changelog</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Version history
            </h2>
            <p className="mt-2 text-sm text-white/45">
              Every release, what changed, and its size.
            </p>
          </Reveal>
          <VersionList versions={versions} />
        </div>
      </section>

      <Footer />
    </main>
  );
}
