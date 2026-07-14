import { Download } from "lucide-react";
import { PROVIDERS } from "@/lib/providers";
import type { Version } from "@/lib/db";
import { ProviderIcon } from "./ProviderIcon";

/**
 * Renders one clickable icon per download provider the release has a link for.
 * Clicking opens that provider's link (via /api/download so it's counted).
 * Falls back to a single "Download" button if a release only has a direct URL.
 */
export default function ProviderLinks({
  version,
  large = false,
}: {
  version: Version;
  large?: boolean;
}) {
  const available = PROVIDERS.filter((p) => version.links?.[p.key]);
  const iconSize = large ? 24 : 18;
  const box = large ? "h-14 w-14" : "h-10 w-10";

  if (available.length === 0) {
    return (
      <a
        href={`/api/download/${version.id}`}
        className={`inline-flex items-center gap-2 rounded-full ${
          large
            ? "bg-white px-8 py-4 text-base font-bold text-black"
            : "border border-white/20 px-4 py-2 text-sm font-semibold hover:bg-white hover:text-black"
        }`}
      >
        <Download size={large ? 20 : 15} />
        Download
      </a>
    );
  }

  return (
    <div className={`flex flex-wrap items-center ${large ? "gap-3" : "gap-2"}`}>
      {available.map((p) => (
        <a
          key={p.key}
          href={`/api/download/${version.id}?p=${p.key}`}
          target="_blank"
          rel="noreferrer"
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
