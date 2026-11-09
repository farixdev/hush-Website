"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import HushMark from "@/components/HushMark";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log unexpected errors for development diagnostics without exposing to users
    console.error("Application error boundary triggered:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-full max-w-md rounded-3xl border border-white/15 bg-white/[0.02] p-8 backdrop-blur-xl">
        <div className="flex justify-center mb-6">
          <HushMark size={48} />
        </div>

        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-rose-500/30 bg-rose-500/10 text-rose-400 mb-4">
          <AlertCircle size={24} />
        </div>

        <h1 className="text-xl font-bold tracking-tight text-white">
          Unexpected Error Encountered
        </h1>

        <p className="mt-2 text-xs leading-relaxed text-white/60">
          Something went wrong while rendering this view. Your session data and cryptographic state remain safe and unexposed.
        </p>

        {error.digest && (
          <p className="mt-2 font-mono text-[10px] text-white/30">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-xs font-semibold text-black transition-transform hover:scale-105 active:scale-95"
          >
            <RotateCcw size={14} />
            <span>Try Again</span>
          </button>
          <Link
            href="/"
            className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-medium text-white hover:bg-white/10 transition-colors"
          >
            <Home size={14} />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </main>
  );
}

