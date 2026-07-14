"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  LogOut,
  Trash2,
  Star,
  Loader2,
  FileUp,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import HushMark from "@/components/HushMark";
import type { Version } from "@/lib/db";
import { formatBytes, formatDate } from "@/lib/format";

export default function AdminDashboard({
  username,
  versions,
  blobConfigured,
}: {
  username: string;
  versions: Version[];
  blobConfigured: boolean;
}) {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);

  const [version, setVersion] = useState("");
  const [changelog, setChangelog] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setDone(false);
    if (!version.trim()) return setError("Enter a version number.");
    if (!file) return setError("Choose an APK file.");

    setBusy(true);
    try {
      let url: string;
      let pathname: string | null = null;
      let size = file.size;

      if (blobConfigured) {
        setStatus("Uploading to Blob storage…");
        const { upload } = await import("@vercel/blob/client");
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/admin/blob-upload",
        });
        url = blob.url;
        pathname = blob.pathname;
      } else {
        setStatus("Uploading…");
        const fd = new FormData();
        fd.append("file", file);
        fd.append("version", version.trim());
        const r = await fetch("/api/admin/upload-local", {
          method: "POST",
          body: fd,
        });
        if (!r.ok) throw new Error((await r.json()).error || "Upload failed");
        const j = await r.json();
        url = j.url;
        pathname = j.pathname;
        size = j.size;
      }

      setStatus("Saving release…");
      const r2 = await fetch("/api/admin/versions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          version: version.trim(),
          changelog: changelog.trim(),
          apk_url: url,
          apk_pathname: pathname,
          size_bytes: size,
        }),
      });
      if (!r2.ok) throw new Error((await r2.json()).error || "Save failed");

      setVersion("");
      setChangelog("");
      setFile(null);
      if (fileRef.current) fileRef.current.value = "";
      setStatus("");
      setDone(true);
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this release? This removes the APK too.")) return;
    await fetch(`/api/admin/versions/${id}`, { method: "DELETE" });
    router.refresh();
  }

  async function makeLatest(id: number) {
    await fetch(`/api/admin/versions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "setLatest" }),
    });
    router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/70 backdrop-blur-xl">
        <div className="container-page flex items-center justify-between py-4">
          <div className="flex items-center gap-2.5">
            <HushMark size={30} />
            <span className="font-bold">Hush Admin</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="hidden text-white/40 sm:inline">@{username}</span>
            <a
              href="/download"
              target="_blank"
              className="hidden items-center gap-1.5 text-white/60 hover:text-white sm:inline-flex"
            >
              View site <ExternalLink size={13} />
            </a>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3.5 py-1.5 text-white/70 hover:bg-white hover:text-black"
            >
              <LogOut size={14} /> Log out
            </button>
          </div>
        </div>
      </header>

      <div className="container-page grid grid-cols-1 gap-8 py-10 lg:grid-cols-[380px_1fr]">
        {/* ── Upload ── */}
        <form onSubmit={publish} className="card h-fit p-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <UploadCloud size={18} /> New release
          </div>

          <label className="mt-6 block text-xs uppercase tracking-wider text-white/40">
            Version
          </label>
          <input
            value={version}
            onChange={(e) => setVersion(e.target.value)}
            placeholder="1.0.1"
            className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-sm outline-none focus:border-white/40"
          />

          <label className="mt-5 block text-xs uppercase tracking-wider text-white/40">
            Changelog / improvements
          </label>
          <textarea
            value={changelog}
            onChange={(e) => setChangelog(e.target.value)}
            placeholder={"One item per line, e.g.\nFixed message ordering\nNew app icon"}
            rows={5}
            className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm leading-relaxed outline-none focus:border-white/40"
          />

          <label className="mt-5 block text-xs uppercase tracking-wider text-white/40">
            APK file
          </label>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="mt-2 flex w-full items-center gap-3 rounded-xl border border-dashed border-white/20 px-4 py-4 text-left text-sm transition-colors hover:border-white/50"
          >
            <FileUp size={18} className="text-white/50" />
            {file ? (
              <span className="min-w-0">
                <span className="block truncate font-medium">{file.name}</span>
                <span className="text-xs text-white/40">
                  {formatBytes(file.size)}
                </span>
              </span>
            ) : (
              <span className="text-white/40">Choose .apk…</span>
            )}
          </button>
          <input
            ref={fileRef}
            type="file"
            accept=".apk,application/vnd.android.package-archive"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />

          {error && <p className="mt-4 text-sm text-white/80">⚠ {error}</p>}
          {done && !error && (
            <p className="mt-4 flex items-center gap-1.5 text-sm text-white/70">
              <CheckCircle2 size={15} /> Release published.
            </p>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-bold text-black transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {busy ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {status || "Working…"}
              </>
            ) : (
              "Publish release"
            )}
          </button>

          <p className="mt-3 text-center text-[11px] text-white/30">
            {blobConfigured
              ? "Storage: Vercel Blob"
              : "Storage: local /public/uploads (dev)"}
          </p>
        </form>

        {/* ── Releases ── */}
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">Releases</h2>
            <span className="text-sm text-white/40">{versions.length} total</span>
          </div>

          {versions.length === 0 ? (
            <div className="card p-10 text-center text-white/40">
              No releases yet. Publish your first one on the left.
            </div>
          ) : (
            <div className="space-y-3">
              {versions.map((v) => (
                <div key={v.id} className="card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-base font-bold">
                        v{v.version}
                      </span>
                      {v.is_latest && (
                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
                          Latest
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      {!v.is_latest && (
                        <button
                          onClick={() => makeLatest(v.id)}
                          title="Set as latest"
                          className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs hover:bg-white hover:text-black"
                        >
                          <Star size={13} /> Set latest
                        </button>
                      )}
                      <a
                        href={`/api/download/${v.id}`}
                        className="rounded-full border border-white/15 px-3 py-1.5 text-xs hover:bg-white hover:text-black"
                      >
                        APK
                      </a>
                      <button
                        onClick={() => remove(v.id)}
                        title="Delete"
                        className="inline-flex items-center rounded-full border border-white/15 p-1.5 text-white/60 hover:border-white hover:text-white"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
                    <span>{formatDate(v.created_at)}</span>
                    <span>{formatBytes(v.size_bytes)}</span>
                    <span>{v.downloads.toLocaleString()} downloads</span>
                  </div>
                  {v.changelog?.trim() && (
                    <p className="mt-3 whitespace-pre-line border-t border-white/10 pt-3 text-sm text-white/60">
                      {v.changelog}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
