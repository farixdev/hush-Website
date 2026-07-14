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

const VERCEL_BODY_LIMIT = 4 * 1024 * 1024; // ~4.5 MB serverless request cap

// Safety net so a stalled upload surfaces a clear error instead of spinning.
function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "Upload timed out. Check your connection and try again — if it keeps failing, confirm Vercel Blob is connected and you're on the production URL."
            )
          ),
        ms
      )
    ),
  ]);
}

// Reads a failed Response into a friendly message, even when the body is plain
// text/HTML (e.g. a 413 "Request Entity Too Large" from the platform).
async function readError(r: Response): Promise<string> {
  if (r.status === 413) {
    return "APK too large for this upload path. Connect Vercel Blob storage (DEPLOY.md → Step 3b) and redeploy — then large uploads work.";
  }
  const text = await r.text().catch(() => "");
  try {
    const j = JSON.parse(text);
    return j.error || `Failed (${r.status})`;
  } catch {
    return text.trim().slice(0, 160) || `Failed (${r.status})`;
  }
}

// Uploads FormData with real progress events (fetch can't report upload
// progress; XMLHttpRequest can). Resolves the parsed JSON response.
function xhrUpload(
  url: string,
  formData: FormData,
  onProgress: (pct: number) => void
): Promise<{ url: string; pathname: string; size: number }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          resolve(JSON.parse(xhr.responseText));
        } catch {
          reject(new Error("Unexpected server response."));
        }
      } else if (xhr.status === 413) {
        reject(
          new Error(
            "APK too large for this upload path. Connect Vercel Blob storage (DEPLOY.md → Step 3b) and redeploy."
          )
        );
      } else {
        let msg = `Upload failed (${xhr.status})`;
        try {
          msg = JSON.parse(xhr.responseText).error || msg;
        } catch {
          if (xhr.responseText) msg = xhr.responseText.slice(0, 160);
        }
        reject(new Error(msg));
      }
    };
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(formData);
  });
}

export default function AdminDashboard({
  username,
  versions,
  blobConfigured,
  onVercel,
}: {
  username: string;
  versions: Version[];
  blobConfigured: boolean;
  onVercel: boolean;
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
  const [progress, setProgress] = useState(0); // 0–100 during upload

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return; // guard against double-submit
    setError("");
    setDone(false);
    if (!version.trim()) return setError("Enter a version number.");
    if (!file) return setError("Choose an APK file.");

    // On Vercel, large files can only go through Blob (the serverless request
    // body is capped and the filesystem is read-only).
    if (!blobConfigured && onVercel && file.size > VERCEL_BODY_LIMIT) {
      return setError(
        "This APK is too large to upload without Vercel Blob. Connect Blob storage (DEPLOY.md → Step 3b) and redeploy, then try again."
      );
    }

    setBusy(true);
    setProgress(0);
    try {
      let url: string;
      let pathname: string | null = null;
      let size = file.size;

      if (blobConfigured) {
        setStatus("Uploading…");
        const { put } = await import("@vercel/blob/client");

        // Get a scoped upload token from our server (no completion webhook).
        const safeName = `hush-${
          version.trim().replace(/[^a-zA-Z0-9._-]/g, "") || "x"
        }.apk`;
        const tr = await fetch("/api/admin/blob-token", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pathname: safeName }),
        });
        if (!tr.ok) throw new Error(await readError(tr));
        const { token, pathname: putPath } = await tr.json();

        const totalBytes = file.size || 1;
        // The SDK reports cumulative loaded bytes, so this is overall progress.
        const blob = await withTimeout(
          put(putPath, file, {
            access: "public",
            token,
            contentType: "application/vnd.android.package-archive",
            multipart: file.size > 8 * 1024 * 1024,
            onUploadProgress: (e) => {
              const pct = Math.min(99, Math.round((e.loaded / totalBytes) * 100));
              setProgress((prev) => (pct > prev ? pct : prev));
            },
          }),
          10 * 60 * 1000
        );
        url = blob.url;
        pathname = blob.pathname;
      } else {
        setStatus("Uploading…");
        const fd = new FormData();
        fd.append("file", file);
        fd.append("version", version.trim());
        const j = await xhrUpload("/api/admin/upload-local", fd, setProgress);
        url = j.url;
        pathname = j.pathname;
        size = j.size;
      }

      setProgress(100);
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
      if (!r2.ok) throw new Error(await readError(r2));

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
      setProgress(0);
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

          {onVercel && !blobConfigured && (
            <div className="mt-5 rounded-xl border border-white/25 bg-white/[0.04] p-3.5 text-xs leading-relaxed text-white/70">
              <b className="text-white">Vercel Blob isn&apos;t connected.</b> Large
              APK uploads will fail. Add Blob storage (DEPLOY.md → Step&nbsp;3b) and
              redeploy to enable uploads.
            </div>
          )}

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

          {busy && (
            <div className="mt-5">
              <div className="mb-1.5 flex items-center justify-between text-xs text-white/60">
                <span>
                  {progress > 0 && progress < 100
                    ? "Uploading…"
                    : status || "Working…"}
                </span>
                {progress > 0 && progress < 100 && (
                  <span className="font-mono text-white/80">{progress}%</span>
                )}
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full bg-white transition-[width] duration-200 ease-out ${
                    progress === 0 ? "animate-pulse w-1/3" : ""
                  }`}
                  style={progress > 0 ? { width: `${progress}%` } : undefined}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-white/35">
                {progress >= 100
                  ? "Finalizing…"
                  : "Large APKs can take a while on slower connections — keep this tab open."}
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={busy}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-bold text-black transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
          >
            {busy ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                {progress > 0 && progress < 100
                  ? `Uploading ${progress}%`
                  : status || "Working…"}
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
