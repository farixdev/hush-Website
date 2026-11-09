import { Download } from "lucide-react";
import { PROVIDERS } from "@/lib/providers";
import type { Version } from "@/lib/db";
import { ProviderIcon } from "./ProviderIcon";

/**
 * Renders a release's download links, either as provider icons (default) or as
 * plain text buttons — chosen per release via `version.display`.
 * Clicking always goes through /api/download so downloads are counted.
 */
export default function ProviderLinks({
  version,
  large = false,
}: {
  version: Version;
  large?: boolean;
}) {
  const available = PROVIDERS.filter((p) => version.links?.[p.key]);
  const useButtons = version.display === "buttons";

  const primaryBtn = large
    ? "inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-base font-bold text-black"
    : "inline-flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white hover:text-black";

  const pillBtn = large
    ? "inline-flex items-center gap-2 rounded-full border border-white/20 px-5 py-2.5 text-sm font-semibold hover:bg-white hover:text-black"
    : "inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-semibold hover:bg-white hover:text-black";

  // No provider links (e.g. an old single-URL release) → one Download button.
  if (available.length === 0) {
    return (
      <a href={`/api/download/${version.id}`} className={primaryBtn}>
        <Download size={large ? 20 : 15} /> Download
      </a>
    );
  }

  // ── Plain button / text mode ──
  if (useButtons) {
    // One source → a single, unlabelled "Download" button.
    if (available.length === 1) {
      const p = available[0];
      return (
        <a
          href={`/api/download/${version.id}?p=${p.key}`}
          target="_blank"
          rel="noopener noreferrer"
          className={primaryBtn}
        >
          <Download size={large ? 20 : 15} /> Download
        </a>
      );
    }
    // Several sources → one text button each (named, no icon).
    return (
      <div className={`flex flex-wrap items-center ${large ? "gap-3" : "gap-2"}`}>
        {available.map((p) => (
          <a
            key={p.key}
            href={`/api/download/${version.id}?p=${p.key}`}
            target="_blank"
            rel="noreferrer"
            className={pillBtn}
          >
            <Download size={large ? 16 : 13} /> {p.short}
          </a>
        ))}
      </div>
    );
  }

  // ── Icon mode (default) ──
  const iconSize = large ? 24 : 18;
  const box = large ? "h-14 w-14" : "h-10 w-10";
  return (
    <div className={`flex flex-wrap items-center ${large ? "gap-3" : "gap-2"}`}>
      {available.map((p) => (
        <a
          key={p.key}
          href={`/api/download/${version.id}?p=${p.key}`}
          target="_blank"
          rel="noopener noreferrer"
          title={`Download from ${p.name}`}
          aria-label={`Download from ${p.name}`}
          className={`group inline-flex ${box} items-center justify-center rounded-2xl border border-white/15 bg-white/[0.03] text-white/85 transition-colors hover:border-white hover:bg-white hover:text-black`}
        >
          <ProviderIcon provider={p.key} size={iconSize} />
        </a>
      ))}
    </div>
  );
}
