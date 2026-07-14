export type ProviderKey = "github" | "mega" | "mediafire" | "gdrive";

export type LinkMap = Partial<Record<ProviderKey, string>>;

export const PROVIDERS: {
  key: ProviderKey;
  name: string;
  hint: string;
}[] = [
  {
    key: "github",
    name: "GitHub Releases",
    hint: "https://github.com/you/repo/releases/download/v1.0.0/app.apk",
  },
  { key: "mega", name: "MEGA", hint: "https://mega.nz/file/…" },
  {
    key: "mediafire",
    name: "MediaFire",
    hint: "https://www.mediafire.com/file/…/app.apk/file",
  },
  {
    key: "gdrive",
    name: "Google Drive",
    hint: "https://drive.google.com/uc?export=download&id=…",
  },
];

/** The first provider link that exists, following PROVIDERS order. */
export function firstLink(links: LinkMap | null | undefined): string {
  if (!links) return "";
  for (const p of PROVIDERS) {
    const v = links[p.key];
    if (v && v.trim()) return v.trim();
  }
  return "";
}

/** Normalizes a raw links object to only valid provider keys with values. */
export function cleanLinks(input: unknown): LinkMap {
  const out: LinkMap = {};
  if (input && typeof input === "object") {
    for (const p of PROVIDERS) {
      const v = (input as Record<string, unknown>)[p.key];
      if (typeof v === "string" && v.trim()) out[p.key] = v.trim();
    }
  }
  return out;
}
