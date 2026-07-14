import { Download } from "lucide-react";
import type { Version } from "@/lib/db";
import { formatBytes, formatDate } from "@/lib/format";
import Reveal from "./Reveal";

export default function VersionList({ versions }: { versions: Version[] }) {
  if (versions.length === 0) {
    return (
      <div className="card mt-8 p-10 text-center text-white/40">
        No releases yet. Check back soon.
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-4">
      {versions.map((v, i) => (
        <Reveal key={v.id} delay={Math.min(i * 0.05, 0.3)}>
          <div className="card p-6 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-lg font-bold">v{v.version}</span>
                {v.is_latest && (
                  <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black">
                    Latest
                  </span>
                )}
              </div>
              <a
                href={`/api/download/${v.id}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold transition-colors hover:bg-white hover:text-black"
              >
                <Download size={15} />
                APK
              </a>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-white/40">
              <span>{formatDate(v.created_at)}</span>
              <span>{formatBytes(v.size_bytes)}</span>
              <span>{v.downloads.toLocaleString()} downloads</span>
            </div>

            {v.changelog?.trim() && (
              <div className="mt-4 border-t border-white/10 pt-4">
                <ul className="space-y-1.5">
                  {v.changelog
                    .split("\n")
                    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
                    .filter(Boolean)
                    .map((line, idx) => (
                      <li
                        key={idx}
                        className="flex gap-2.5 text-sm text-white/65"
                      >
                        <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-white/40" />
                        {line}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </Reveal>
      ))}
    </div>
  );
}
