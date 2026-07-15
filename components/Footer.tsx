import Link from "next/link";
import HushMark from "./HushMark";

export default function Footer() {
  return (
    <footer className="relative border-t border-white/10 py-12">
      <div className="container-page flex flex-col items-center justify-between gap-6 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <HushMark size={26} />
          <span className="text-sm font-semibold">Hush</span>
          <span className="text-sm text-white/30"> anonymous</span>
        </div>
        <div className="flex items-center gap-6 text-sm text-white/50">
          <Link href="/" className="hover:text-white">
            Home
          </Link>
          <Link href="/download" className="hover:text-white">
            Download
          </Link>
          <a
            href="https://github.com/farixdev"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white"
          >
            GitHub
          </a>
        </div>
      </div>
      <div className="container-page mt-8 text-center text-xs text-white/25">
        © {new Date().getFullYear()} Hush · Built by farixdev
      </div>
    </footer>
  );
}
