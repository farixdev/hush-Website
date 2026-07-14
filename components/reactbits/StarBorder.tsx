"use client";

// An animated travelling border (à la reactbits.dev "Star Border"), monochrome.
// Renders as a <button> or <a>. Two soft highlights orbit the rounded edge.

import Link from "next/link";
import type { ReactNode } from "react";

export default function StarBorder({
  children,
  href,
  onClick,
  className = "",
  speed = "5s",
  type = "button",
  disabled,
}: {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  speed?: string;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  const inner = (
    <span className="relative z-10 flex items-center justify-center gap-2 rounded-full bg-black px-7 py-3.5 text-sm font-semibold text-white">
      {children}
    </span>
  );

  const shell = (
    <span
      className={`relative inline-flex overflow-hidden rounded-full p-[1.5px] ${
        disabled ? "opacity-50 pointer-events-none" : ""
      } ${className}`}
    >
      <span
        aria-hidden
        className="absolute inset-[-200%] animate-[star-spin_var(--sp)_linear_infinite]"
        style={
          {
            "--sp": speed,
            background:
              "conic-gradient(from 0deg, transparent 0 65%, rgba(255,255,255,0.9) 80%, transparent 92% 100%)",
          } as React.CSSProperties
        }
      />
      {inner}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {shell}
      </Link>
    );
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled} className="inline-flex">
      {shell}
    </button>
  );
}
