"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, Loader2 } from "lucide-react";
import HushMark from "@/components/HushMark";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Login failed");
      }
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 flex flex-col items-center text-center">
          <HushMark size={52} className="rounded-2xl" />
          <h1 className="mt-5 text-xl font-bold">Hush Admin</h1>
          <p className="mt-1 text-sm text-white/40">
            Sign in to manage releases
          </p>
        </div>

        <div className="space-y-3">
          <Field
            icon={<User size={16} />}
            placeholder="Username"
            value={username}
            onChange={setUsername}
            autoComplete="username"
          />
          <Field
            icon={<Lock size={16} />}
            placeholder="Password"
            type="password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
          />
        </div>

        {error && (
          <p className="mt-3 text-sm text-white/70">
            <span className="mr-1.5 inline-block h-1.5 w-1.5 rounded-full bg-white" />
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={busy}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-bold text-black transition-transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60"
        >
          {busy && <Loader2 size={16} className="animate-spin" />}
          Sign in
        </button>
      </motion.form>
    </main>
  );
}

function Field({
  icon,
  ...props
}: {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 focus-within:border-white/40">
      <span className="text-white/40">{icon}</span>
      <input
        className="w-full bg-transparent py-3.5 text-sm outline-none placeholder:text-white/30"
        placeholder={props.placeholder}
        type={props.type}
        value={props.value}
        autoComplete={props.autoComplete}
        onChange={(e) => props.onChange(e.target.value)}
        required
      />
    </div>
  );
}
