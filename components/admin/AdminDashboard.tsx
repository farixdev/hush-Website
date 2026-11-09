"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  UploadCloud,
  LogOut,
  Trash2,
  Loader2,
  FileUp,
  ExternalLink,
  CheckCircle2,
  Link2,
  MessageSquare,
  Mail,
  Sliders,
  Send,
  AlertCircle,
  Eye,
  EyeOff,
  User,
  Clock,
} from "lucide-react";
import HushMark from "@/components/HushMark";
import { ProviderIcon } from "@/components/ProviderIcon";
import type { Version } from "@/lib/db";
import type { AppSettings, ContactInquiry, ChatSession } from "@/lib/store";
import {
  PROVIDERS,
  type LinkMap,
  type ProviderKey,
  type DisplayStyle,
} from "@/lib/providers";
import { formatBytes, formatDate } from "@/lib/format";

const VERCEL_BODY_LIMIT = 4 * 1024 * 1024;

function withTimeout<T>(p: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    p,
    new Promise<T>((_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "Upload timed out. Check your connection and try again."
            )
          ),
        ms
      )
    ),
  ]);
}

async function readError(r: Response): Promise<string> {
  if (r.status === 413) {
    return "APK too large for this upload path. Connect Vercel Blob storage and redeploy.";
  }
  const text = await r.text().catch(() => "");
  try {
    const j = JSON.parse(text);
    return j.error || `Failed (${r.status})`;
  } catch {
    return text.trim().slice(0, 160) || `Failed (${r.status})`;
  }
}

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

  // Active Admin View Tab
  const [activeTab, setActiveTab] = useState<"releases" | "chats" | "contacts" | "settings">("releases");

  // Releases state
  const [mode, setMode] = useState<"link" | "file">("link");
  const [version, setVersion] = useState("");
  const [changelog, setChangelog] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [links, setLinks] = useState<LinkMap>({});
  const [display, setDisplay] = useState<DisplayStyle>("icons");
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  // Chat Inbox State
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [adminReplyText, setAdminReplyText] = useState("");
  const [replying, setReplying] = useState(false);

  // Inquiries State
  const [contacts, setContacts] = useState<ContactInquiry[]>([]);

  // Settings State
  const [settings, setSettings] = useState<Partial<AppSettings>>({});
  const [settingsStatus, setSettingsStatus] = useState("");
  const [savingSettings, setSavingSettings] = useState(false);
  const [testEmailTarget, setTestEmailTarget] = useState("");
  const [testEmailStatus, setTestEmailStatus] = useState("");
  const [testingEmail, setTestingEmail] = useState(false);
  const [showApiKey, setShowApiKey] = useState(false);

  // Fetch data on tab change
  useEffect(() => {
    if (activeTab === "chats") {
      fetch("/api/admin/chat")
        .then((r) => r.json())
        .then((d) => {
          if (d.sessions) {
            setChatSessions(d.sessions);
            if (d.sessions.length > 0 && !selectedChatId) {
              setSelectedChatId(d.sessions[0].id);
            }
          }
        })
        .catch(console.error);
    } else if (activeTab === "contacts") {
      fetch("/api/admin/contacts")
        .then((r) => r.json())
        .then((d) => {
          if (d.contacts) setContacts(d.contacts);
        })
        .catch(console.error);
    } else if (activeTab === "settings") {
      fetch("/api/admin/settings")
        .then((r) => r.json())
        .then((d) => {
          if (d.settings) {
            setSettings(d.settings);
            setTestEmailTarget(d.settings.admin_notification_email || "");
          }
        })
        .catch(console.error);
    }
  }, [activeTab]);

  // Handle Admin Chat Reply
  async function handleSendAdminReply(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedChatId || !adminReplyText.trim() || replying) return;

    setReplying(true);
    try {
      const res = await fetch("/api/admin/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: selectedChatId,
          replyText: adminReplyText.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.session) {
        setChatSessions((prev) =>
          prev.map((s) => (s.id === selectedChatId ? data.session : s))
        );
        setAdminReplyText("");
      }
    } catch (err) {
      console.error("Failed to send admin reply:", err);
    } finally {
      setReplying(false);
    }
  }

  // Handle Save Settings
  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault();
    setSavingSettings(true);
    setSettingsStatus("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save settings.");

      setSettingsStatus("Settings saved successfully.");
      setTimeout(() => setSettingsStatus(""), 4000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setSettingsStatus(`Error: ${msg}`);
    } finally {
      setSavingSettings(false);
    }
  }

  // Handle Test Email
  async function handleTestEmail() {
    if (!testEmailTarget) return;
    setTestingEmail(true);
    setTestEmailStatus("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetEmail: testEmailTarget }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send test email.");

      setTestEmailStatus("Test email sent successfully! Check your inbox.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setTestEmailStatus(`Failed: ${msg}`);
    } finally {
      setTestingEmail(false);
    }
  }

  // Mark contact as read
  async function handleMarkContactRead(id: string) {
    try {
      await fetch("/api/admin/contacts", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setContacts((prev) =>
        prev.map((c) => (c.id === id ? { ...c, read: true } : c))
      );
    } catch (err) {
      console.error(err);
    }
  }

  // ── Existing Release Management Handlers ──
  async function saveVersion(payload: {
    apk_url: string;
    apk_pathname: string | null;
    size_bytes: number;
    links?: LinkMap;
  }) {
    setStatus("Saving release…");
    const r = await fetch("/api/admin/versions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        version: version.trim(),
        changelog: changelog.trim(),
        display,
        ...payload,
      }),
    });
    if (!r.ok) throw new Error(await readError(r));
    setVersion("");
    setChangelog("");
    setFile(null);
    setLinks({});
    setDisplay("icons");
    if (fileRef.current) fileRef.current.value = "";
    setStatus("");
    setDone(true);
    router.refresh();
  }

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setError("");
    setDone(false);
    if (!version.trim()) return setError("Enter a version number.");

    if (mode === "link") {
      const cleaned: LinkMap = {};
      for (const p of PROVIDERS) {
        const v = (links[p.key] ?? "").trim();
        if (v) cleaned[p.key] = v;
      }
      const entries = Object.values(cleaned);
      if (entries.length === 0) return setError("Add at least one download link.");
      if (entries.some((u) => !/^https?:\/\/.+\..+/i.test(u))) {
        return setError("Links must start with https:// and point to a file/page.");
      }
      setBusy(true);
      try {
        await saveVersion({
          apk_url: entries[0],
          apk_pathname: null,
          size_bytes: 0,
          links: cleaned,
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setBusy(false);
      }
      return;
    }

    if (!file) return setError("Pick an APK file to upload.");
    setBusy(true);
    setProgress(0);

    try {
      if (blobConfigured) {
        setStatus("Uploading to Vercel Blob…");
        const { upload } = await import("@vercel/blob/client");
        const blob = await withTimeout(
          upload(`hush-${version.trim()}.apk`, file, {
            access: "public",
            handleUploadUrl: "/api/admin/blob-token",
            onUploadProgress: (p) => setProgress(Math.round(p.percentage)),
          }),
          15 * 60 * 1000
        );
        await saveVersion({
          apk_url: blob.url,
          apk_pathname: blob.pathname,
          size_bytes: file.size,
        });
      } else {
        if (onVercel && file.size > VERCEL_BODY_LIMIT) {
          throw new Error(
            `This APK is ${formatBytes(file.size)}, but local uploads on Vercel are capped at ~4.5 MB.`
          );
        }
        setStatus(
          file.size > 20 * 1024 * 1024
            ? "Uploading large APK to local storage…"
            : "Uploading to local storage…"
        );
        const form = new FormData();
        form.append("file", file);
        form.append("version", version.trim());
        const result = await xhrUpload("/api/admin/upload-local", form, setProgress);
        await saveVersion({
          apk_url: result.url,
          apk_pathname: result.pathname,
          size_bytes: result.size,
        });
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
      setStatus("");
    }
  }

  async function remove(id: number) {
    if (!confirm("Delete this release? The APK file will also be removed.")) return;
    const r = await fetch(`/api/admin/versions/${id}`, { method: "DELETE" });
    if (r.ok) router.refresh();
  }

  async function makeLatest(id: number) {
    const r = await fetch(`/api/admin/versions/${id}`, { method: "PATCH" });
    if (r.ok) router.refresh();
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  const selectedChat = chatSessions.find((s) => s.id === selectedChatId);

  return (
    <main className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="container-page flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <HushMark size={30} />
            <div>
              <span className="font-bold text-sm block">Hush Mission Control</span>
              <span className="text-[10px] text-white/40 block">
                Edge Brain Software
              </span>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-xs">
            <button
              onClick={() => setActiveTab("releases")}
              className={`rounded-full px-3.5 py-1.5 font-medium transition-colors ${
                activeTab === "releases" ? "bg-white text-black" : "text-white/60 hover:text-white"
              }`}
            >
              Releases &amp; APKs
            </button>
            <button
              onClick={() => setActiveTab("chats")}
              className={`rounded-full px-3.5 py-1.5 font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === "chats" ? "bg-white text-black" : "text-white/60 hover:text-white"
              }`}
            >
              <MessageSquare size={13} />
              <span>Chat Inbox</span>
              {chatSessions.some((c) => c.status === "escalated") && (
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("contacts")}
              className={`rounded-full px-3.5 py-1.5 font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === "contacts" ? "bg-white text-black" : "text-white/60 hover:text-white"
              }`}
            >
              <Mail size={13} />
              <span>Inquiries</span>
              {contacts.some((c) => !c.read) && (
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              )}
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`rounded-full px-3.5 py-1.5 font-medium transition-colors flex items-center gap-1.5 ${
                activeTab === "settings" ? "bg-white text-black" : "text-white/60 hover:text-white"
              }`}
            >
              <Sliders size={13} />
              <span>AI &amp; SMTP</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden items-center gap-1.5 text-white/60 hover:text-white sm:inline-flex"
            >
              <span>View Site</span> <ExternalLink size={12} />
            </a>
            <button
              onClick={logout}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-white/70 hover:bg-white hover:text-black transition-colors"
            >
              <LogOut size={13} /> Log out
            </button>
          </div>
        </div>
      </header>

      {/* ───────────────────────── TAB 1: RELEASES & APKS ───────────────────────── */}
      {activeTab === "releases" && (
        <div className="container-page grid grid-cols-1 gap-8 py-10 lg:grid-cols-[380px_1fr]">
          <form onSubmit={publish} className="card h-fit p-6">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              <UploadCloud size={18} /> New release
            </div>

            <div className="mt-5 grid grid-cols-2 gap-1 rounded-xl bg-white/[0.05] p-1">
              <button
                type="button"
                onClick={() => setMode("link")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
                  mode === "link" ? "bg-white text-black" : "text-white/60"
                }`}
              >
                <Link2 size={14} /> Paste link
              </button>
              <button
                type="button"
                onClick={() => setMode("file")}
                className={`flex items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-semibold transition-colors ${
                  mode === "file" ? "bg-white text-black" : "text-white/60"
                }`}
              >
                <FileUp size={14} /> Upload file
              </button>
            </div>

            <label className="mt-5 block text-xs uppercase tracking-wider text-white/40">
              Version
            </label>
            <input
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="1.0.1"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 font-mono text-sm text-white outline-none focus:border-white/40"
            />

            <label className="mt-5 block text-xs uppercase tracking-wider text-white/40">
              Changelog / improvements
            </label>
            <textarea
              value={changelog}
              onChange={(e) => setChangelog(e.target.value)}
              rows={4}
              placeholder="What changed in this build?"
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/[0.03] p-4 text-xs text-white outline-none focus:border-white/40 resize-none"
            />

            {mode === "file" ? (
              <>
                <label className="mt-5 block text-xs uppercase tracking-wider text-white/40">
                  APK file
                </label>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".apk"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="mt-2 w-full text-xs text-white/70"
                />
              </>
            ) : (
              <div className="mt-5 space-y-3">
                <label className="block text-xs uppercase tracking-wider text-white/40">
                  Direct Download URL
                </label>
                <input
                  value={links["github"] || ""}
                  onChange={(e) => setLinks({ ...links, github: e.target.value })}
                  placeholder="https://.../hush.apk"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-xs text-white outline-none focus:border-white/40"
                />
              </div>
            )}

            {error && (
              <div className="mt-4 flex items-center gap-2 text-xs text-rose-300">
                <AlertCircle size={14} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}
            {done && (
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-400">
                <CheckCircle2 size={14} /> Release published successfully!
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-xs font-bold text-black transition-transform hover:scale-[1.01] disabled:opacity-50"
            >
              {busy ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>{status || "Publishing…"}</span>
                </>
              ) : (
                <span>Publish Release</span>
              )}
            </button>
          </form>

          {/* Versions List */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-white">Active Releases ({versions.length})</h2>
            {versions.map((v) => (
              <div key={v.id} className="card p-5 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">v{v.version}</span>
                    {v.is_latest && (
                      <span className="rounded-full bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 text-[10px] text-emerald-400 font-semibold">
                        Latest
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/40 mt-1">
                    {formatDate(v.created_at)} · {v.downloads} downloads
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {!v.is_latest && (
                    <button
                      onClick={() => makeLatest(v.id)}
                      className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:text-white hover:bg-white/5"
                    >
                      Set Latest
                    </button>
                  )}
                  <button
                    onClick={() => remove(v.id)}
                    className="p-1.5 text-white/40 hover:text-rose-400 transition-colors"
                    title="Delete release"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ───────────────────────── TAB 2: CHAT INBOX ───────────────────────── */}
      {activeTab === "chats" && (
        <div className="container-page py-10">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 min-h-[580px]">
            {/* Thread List */}
            <div className="lg:col-span-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4 space-y-3 overflow-y-auto max-h-[620px]">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  Visitor Threads ({chatSessions.length})
                </span>
                <button
                  onClick={() => {
                    fetch("/api/admin/chat")
                      .then((r) => r.json())
                      .then((d) => d.sessions && setChatSessions(d.sessions));
                  }}
                  className="text-[11px] text-white/40 hover:text-white"
                >
                  Refresh
                </button>
              </div>

              {chatSessions.length === 0 ? (
                <p className="text-xs text-white/40 py-8 text-center">
                  No visitor chat sessions logged yet.
                </p>
              ) : (
                chatSessions.map((session) => {
                  const isSelected = session.id === selectedChatId;
                  const lastMsg = session.messages[session.messages.length - 1];
                  return (
                    <div
                      key={session.id}
                      onClick={() => setSelectedChatId(session.id)}
                      className={`cursor-pointer rounded-xl p-3.5 transition-colors border ${
                        isSelected
                          ? "border-white bg-white/10"
                          : "border-white/5 bg-white/[0.02] hover:bg-white/5"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-xs text-white">
                          {session.visitor_name}
                        </span>
                        {session.status === "escalated" ? (
                          <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[9px] font-mono text-amber-300">
                            Escalated
                          </span>
                        ) : (
                          <span className="text-[10px] text-white/40">
                            {formatDate(session.updated_at)}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-white/50 truncate mt-1">
                        {session.visitor_email}
                      </div>
                      {lastMsg && (
                        <p className="text-xs text-white/70 truncate mt-1.5 italic">
                          &quot;{lastMsg.text}&quot;
                        </p>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Conversation Viewer */}
            <div className="lg:col-span-8 rounded-2xl border border-white/10 bg-white/[0.02] flex flex-col justify-between overflow-hidden">
              {selectedChat ? (
                <>
                  {/* Chat header */}
                  <div className="border-b border-white/10 p-4 flex items-center justify-between bg-white/[0.01]">
                    <div>
                      <h3 className="text-sm font-bold text-white flex items-center gap-2">
                        <span>{selectedChat.visitor_name}</span>
                        <span className="text-xs text-white/40 font-normal">
                          ({selectedChat.visitor_email})
                        </span>
                      </h3>
                      <span className="text-[10px] text-white/40 font-mono">
                        Session: {selectedChat.id}
                      </span>
                    </div>
                    {selectedChat.status === "escalated" && (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs text-amber-300">
                        Human Follow-up Required
                      </span>
                    )}
                  </div>

                  {/* Message stream */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-3.5 max-h-[440px]">
                    {selectedChat.messages.map((m) => {
                      const isVisitor = m.sender === "visitor";
                      const isAdmin = m.sender === "admin";
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col ${
                            isVisitor ? "items-start" : "items-end"
                          }`}
                        >
                          <span className="text-[10px] text-white/40 mb-1 px-1">
                            {isVisitor
                              ? selectedChat.visitor_name
                              : isAdmin
                              ? "Admin Reply"
                              : "Hush AI Assistant"}
                          </span>
                          <div
                            className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs leading-relaxed ${
                              isVisitor
                                ? "border border-white/10 bg-white/5 text-white"
                                : isAdmin
                                ? "bg-white text-black font-medium"
                                : "border border-white/15 bg-white/[0.02] text-white/90"
                            }`}
                          >
                            <p className="whitespace-pre-wrap">{m.text}</p>
                          </div>
                          {m.escalated && (
                            <span className="mt-1 text-[10px] text-amber-300">
                              Escalation token triggered
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Admin Reply form */}
                  <form
                    onSubmit={handleSendAdminReply}
                    className="border-t border-white/10 p-4 bg-white/[0.02] flex items-center gap-3"
                  >
                    <input
                      type="text"
                      placeholder={`Reply directly to ${selectedChat.visitor_name}...`}
                      value={adminReplyText}
                      onChange={(e) => setAdminReplyText(e.target.value)}
                      disabled={replying}
                      className="flex-1 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-xs text-white placeholder-white/30 focus:border-white focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={!adminReplyText.trim() || replying}
                      className="flex items-center gap-1.5 rounded-xl bg-white px-5 py-3 text-xs font-bold text-black transition-transform hover:scale-105 disabled:opacity-40"
                    >
                      {replying ? (
                        <Loader2 size={13} className="animate-spin" />
                      ) : (
                        <Send size={13} />
                      )}
                      <span>Send Reply</span>
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-1 items-center justify-center p-12 text-center text-xs text-white/40">
                  Select a visitor chat from the left panel to review message history and reply.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────── TAB 3: CONTACT INQUIRIES ───────────────────────── */}
      {activeTab === "contacts" && (
        <div className="container-page py-10 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Project Inquiries &amp; Leads</h2>
              <p className="text-xs text-white/50">
                Inquiries submitted via the /contact page for custom privacy &amp; app development.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {contacts.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-12 text-center text-xs text-white/40">
                No contact inquiries received yet.
              </div>
            ) : (
              contacts.map((c) => (
                <div
                  key={c.id}
                  className={`rounded-2xl border p-6 transition-colors ${
                    c.read
                      ? "border-white/10 bg-white/[0.01]"
                      : "border-white/25 bg-white/[0.03]"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-white">{c.name}</h3>
                        {!c.read && (
                          <span className="rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-mono">
                            New Lead
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-white/60 mt-0.5">
                        <a href={`mailto:${c.email}`} className="text-white underline">
                          {c.email}
                        </a>
                        {c.company && <span> · {c.company}</span>}
                      </div>
                    </div>
                    <div className="text-right text-xs text-white/40">
                      <div>{formatDate(c.created_at)}</div>
                      <div className="font-mono text-emerald-400 mt-1">{c.budget}</div>
                    </div>
                  </div>

                  <div className="py-4">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-white/40 block">
                      Scope: {c.project_type}
                    </span>
                    <p className="mt-2 text-xs text-white/80 leading-relaxed whitespace-pre-wrap">
                      {c.message}
                    </p>
                  </div>

                  {!c.read && (
                    <div className="pt-2 border-t border-white/5 flex justify-end">
                      <button
                        onClick={() => handleMarkContactRead(c.id)}
                        className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        Mark as Reviewed
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* ───────────────────────── TAB 4: AI & SMTP SETTINGS ───────────────────────── */}
      {activeTab === "settings" && (
        <div className="container-page max-w-4xl py-10">
          <form onSubmit={handleSaveSettings} className="space-y-8">
            {/* Groq AI Settings */}
            <div className="rounded-2xl border border-white/15 bg-white/[0.02] p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Sliders size={18} />
                  <span>Groq AI Assistant Configuration</span>
                </h3>
                <p className="mt-1 text-xs text-white/50">
                  Provide your Groq API key to power real-time AI responses in the website chat.
                </p>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 font-medium">
                  Groq API Key
                </label>
                <div className="relative mt-2">
                  <input
                    type={showApiKey ? "text" : "password"}
                    value={settings.groq_api_key ?? ""}
                    onChange={(e) => setSettings({ ...settings, groq_api_key: e.target.value })}
                    placeholder="gsk_..."
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-mono text-xs text-white placeholder-white/30 outline-none focus:border-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    {showApiKey ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                <p className="mt-1.5 text-[11px] text-white/40">
                  Keys are stored securely on the server and never exposed to website visitors.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 font-medium">
                    Model
                  </label>
                  <select
                    value={settings.groq_model || "llama-3.3-70b-versatile"}
                    onChange={(e) => setSettings({ ...settings, groq_model: e.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-neutral-900 px-4 py-2.5 text-xs text-white outline-none focus:border-white"
                  >
                    <option value="llama-3.3-70b-versatile">llama-3.3-70b-versatile (Recommended)</option>
                    <option value="llama-3.1-8b-instant">llama-3.1-8b-instant (Fastest)</option>
                    <option value="mixtral-8x7b-32768">mixtral-8x7b-32768</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 font-medium">
                    Escalation Alert Email
                  </label>
                  <input
                    type="email"
                    value={settings.admin_notification_email ?? ""}
                    onChange={(e) => setSettings({ ...settings, admin_notification_email: e.target.value })}
                    placeholder="founder@edgebrainsoftware.com"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-white/60 font-medium">
                  AI System Instructions &amp; Security Guardrails
                </label>
                <textarea
                  rows={6}
                  value={settings.ai_system_instructions ?? ""}
                  onChange={(e) => setSettings({ ...settings, ai_system_instructions: e.target.value })}
                  placeholder="Instructions for how the AI should represent Hush..."
                  className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 p-4 text-xs font-mono text-white/80 placeholder-white/30 outline-none focus:border-white resize-y"
                />
                <p className="mt-1.5 text-[11px] text-white/40">
                  Tip: Include &quot;Our team will be in touch with you shortly at &#123;visitor_email&#125;&quot; and [ESCALATE] to trigger automated email routing when questions are out of scope.
                </p>
              </div>
            </div>

            {/* Custom Domain SMTP Settings */}
            <div className="rounded-2xl border border-white/15 bg-white/[0.02] p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Mail size={18} />
                  <span>Custom Domain SMTP Server Configuration</span>
                </h3>
                <p className="mt-1 text-xs text-white/50">
                  Configure your domain SMTP credentials to receive lead notifications and escalated chat emails.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-white/60 font-medium">
                    SMTP Host
                  </label>
                  <input
                    type="text"
                    value={settings.smtp_host ?? ""}
                    onChange={(e) => setSettings({ ...settings, smtp_host: e.target.value })}
                    placeholder="smtp.edgebrainsoftware.com"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 font-medium">
                    SMTP Port
                  </label>
                  <input
                    type="number"
                    value={settings.smtp_port ?? 587}
                    onChange={(e) => setSettings({ ...settings, smtp_port: Number(e.target.value) })}
                    placeholder="587"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 font-medium">
                    SMTP Username / Email
                  </label>
                  <input
                    type="text"
                    value={settings.smtp_user ?? ""}
                    onChange={(e) => setSettings({ ...settings, smtp_user: e.target.value })}
                    placeholder="support@edgebrainsoftware.com"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-white"
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 font-medium">
                    SMTP Password
                  </label>
                  <input
                    type="password"
                    value={settings.smtp_pass ?? ""}
                    onChange={(e) => setSettings({ ...settings, smtp_pass: e.target.value })}
                    placeholder="••••••••"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-white/60 font-medium">
                    From Header
                  </label>
                  <input
                    type="text"
                    value={settings.smtp_from ?? ""}
                    onChange={(e) => setSettings({ ...settings, smtp_from: e.target.value })}
                    placeholder="Hush Support <support@edgebrainsoftware.com>"
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-white"
                  />
                </div>

                <div className="flex items-center gap-3 pt-6">
                  <input
                    type="checkbox"
                    id="smtp_sec"
                    checked={Boolean(settings.smtp_secure)}
                    onChange={(e) => setSettings({ ...settings, smtp_secure: e.target.checked })}
                    className="h-4 w-4 rounded border-white/20 bg-white/5"
                  />
                  <label htmlFor="smtp_sec" className="text-xs text-white/80 cursor-pointer">
                    Enable SSL / TLS (Default port 465)
                  </label>
                </div>
              </div>

              {/* Test Email Section */}
              <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center gap-3">
                <input
                  type="email"
                  value={testEmailTarget}
                  onChange={(e) => setTestEmailTarget(e.target.value)}
                  placeholder="Recipient address for test email"
                  className="flex-1 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-white/30 outline-none focus:border-white"
                />
                <button
                  type="button"
                  onClick={handleTestEmail}
                  disabled={testingEmail || !testEmailTarget}
                  className="rounded-xl border border-white/20 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/10 disabled:opacity-40 transition-colors shrink-0"
                >
                  {testingEmail ? "Sending..." : "Send Test Email"}
                </button>
              </div>
              {testEmailStatus && (
                <p className="text-xs font-mono text-emerald-400">{testEmailStatus}</p>
              )}
            </div>

            {/* Save Button & Feedback */}
            <div className="flex items-center justify-between">
              <div>
                {settingsStatus && (
                  <p className="text-xs font-mono text-emerald-400">{settingsStatus}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={savingSettings}
                className="flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-xs font-bold text-black transition-transform hover:scale-105 disabled:opacity-50"
              >
                {savingSettings ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save All Settings</span>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
