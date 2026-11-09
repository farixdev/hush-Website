import HushMark from "@/components/HushMark";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-3 rounded-full bg-white/10 blur-md animate-pulse"
          />
          <HushMark size={40} className="relative z-10" />
        </div>
        <span className="font-mono text-xs uppercase tracking-[0.25em] text-white/40">
          Loading
        </span>
      </div>
    </div>
  );
}

