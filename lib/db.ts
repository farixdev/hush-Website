// Version store. Uses Neon Postgres when DATABASE_URL is set (production),
// otherwise a local JSON file so the site runs with zero setup in development.

import type { LinkMap, DisplayStyle } from "./providers";

export type Version = {
  id: number;
  version: string;
  changelog: string;
  size_bytes: number;
  apk_url: string;
  apk_pathname: string | null;
  links: LinkMap;
  display: DisplayStyle;
  downloads: number;
  is_latest: boolean;
  created_at: string;
};

export type NewVersion = {
  version: string;
  changelog: string;
  size_bytes: number;
  apk_url: string;
  apk_pathname: string | null;
  links: LinkMap;
  display: DisplayStyle;
};

const useNeon = !!process.env.DATABASE_URL;

// ─────────────────────────────── Neon ───────────────────────────────
let _sql: ReturnType<typeof import("@neondatabase/serverless").neon> | null = null;
let _schema: Promise<void> | null = null;

async function sql() {
  if (!_sql) {
    const { neon } = await import("@neondatabase/serverless");
    _sql = neon(process.env.DATABASE_URL!);
  }
  if (!_schema) {
    _schema = (async () => {
      await _sql!`
        CREATE TABLE IF NOT EXISTS versions (
          id SERIAL PRIMARY KEY,
          version TEXT NOT NULL,
          changelog TEXT NOT NULL DEFAULT '',
          size_bytes BIGINT NOT NULL DEFAULT 0,
          apk_url TEXT NOT NULL,
          apk_pathname TEXT,
          links JSONB NOT NULL DEFAULT '{}'::jsonb,
          display TEXT NOT NULL DEFAULT 'icons',
          downloads INTEGER NOT NULL DEFAULT 0,
          is_latest BOOLEAN NOT NULL DEFAULT false,
          created_at TIMESTAMPTZ NOT NULL DEFAULT now()
        )`;
      // Add columns for databases created before these features.
      await _sql!`ALTER TABLE versions ADD COLUMN IF NOT EXISTS links JSONB NOT NULL DEFAULT '{}'::jsonb`;
      await _sql!`ALTER TABLE versions ADD COLUMN IF NOT EXISTS display TEXT NOT NULL DEFAULT 'icons'`;
    })();
  }
  await _schema;
  return _sql!;
}

function rowToVersion(r: Record<string, unknown>): Version {
  return {
    id: Number(r.id),
    version: String(r.version),
    changelog: String(r.changelog ?? ""),
    size_bytes: Number(r.size_bytes ?? 0),
    apk_url: String(r.apk_url),
    apk_pathname: (r.apk_pathname as string) ?? null,
    links: (r.links as LinkMap) ?? {},
    display: r.display === "buttons" ? "buttons" : "icons",
    downloads: Number(r.downloads ?? 0),
    is_latest: Boolean(r.is_latest),
    created_at: new Date(r.created_at as string).toISOString(),
  };
}

// ──────────────────────────── JSON fallback ────────────────────────────
async function jsonFile() {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), ".data");
  const file = path.join(dir, "versions.json");
  await fs.mkdir(dir, { recursive: true });
  return { fs, file };
}

async function readJson(): Promise<Version[]> {
  const { fs, file } = await jsonFile();
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw) as Version[];
  } catch {
    return [];
  }
}

async function writeJson(rows: Version[]) {
  const { fs, file } = await jsonFile();
  await fs.writeFile(file, JSON.stringify(rows, null, 2), "utf8");
}

// ─────────────────────────────── API ───────────────────────────────
export async function listVersions(): Promise<Version[]> {
  if (useNeon) {
    const s = await sql();
    const rows = await s`SELECT * FROM versions ORDER BY created_at DESC`;
    return (rows as Record<string, unknown>[]).map(rowToVersion);
  }
  const rows = await readJson();
  return rows.sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
}

export async function getLatest(): Promise<Version | null> {
  const all = await listVersions();
  if (all.length === 0) return null;
  return all.find((v) => v.is_latest) ?? all[0];
}

export async function createVersion(input: NewVersion): Promise<Version> {
  if (useNeon) {
    const s = await sql();
    await s`UPDATE versions SET is_latest = false WHERE is_latest = true`;
    const rows = await s`
      INSERT INTO versions (version, changelog, size_bytes, apk_url, apk_pathname, links, display, is_latest)
      VALUES (${input.version}, ${input.changelog}, ${input.size_bytes}, ${input.apk_url}, ${input.apk_pathname}, ${JSON.stringify(input.links)}, ${input.display}, true)
      RETURNING *`;
    return rowToVersion((rows as Record<string, unknown>[])[0]);
  }
  const rows = await readJson();
  for (const r of rows) r.is_latest = false;
  const id = rows.reduce((m, r) => Math.max(m, r.id), 0) + 1;
  const v: Version = {
    id,
    version: input.version,
    changelog: input.changelog,
    size_bytes: input.size_bytes,
    apk_url: input.apk_url,
    apk_pathname: input.apk_pathname,
    links: input.links,
    display: input.display,
    downloads: 0,
    is_latest: true,
    created_at: new Date().toISOString(),
  };
  rows.push(v);
  await writeJson(rows);
  return v;
}

export async function getVersion(id: number): Promise<Version | null> {
  const all = await listVersions();
  return all.find((v) => v.id === id) ?? null;
}

export async function deleteVersion(id: number): Promise<Version | null> {
  const existing = await getVersion(id);
  if (!existing) return null;
  if (useNeon) {
    const s = await sql();
    await s`DELETE FROM versions WHERE id = ${id}`;
  } else {
    const rows = (await readJson()).filter((r) => r.id !== id);
    await writeJson(rows);
  }
  return existing;
}

export async function setLatest(id: number): Promise<void> {
  if (useNeon) {
    const s = await sql();
    await s`UPDATE versions SET is_latest = false WHERE is_latest = true`;
    await s`UPDATE versions SET is_latest = true WHERE id = ${id}`;
    return;
  }
  const rows = await readJson();
  for (const r of rows) r.is_latest = r.id === id;
  await writeJson(rows);
}

export async function incrementDownloads(id: number): Promise<void> {
  if (useNeon) {
    const s = await sql();
    await s`UPDATE versions SET downloads = downloads + 1 WHERE id = ${id}`;
    return;
  }
  const rows = await readJson();
  const r = rows.find((x) => x.id === id);
  if (r) {
    r.downloads += 1;
    await writeJson(rows);
  }
}
