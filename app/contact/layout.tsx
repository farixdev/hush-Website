import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build With Us · Contact Edge Brain Software",
  description:
    "Partner with Edge Brain Software to build custom privacy-first messengers, peer-to-peer mesh networks, or hardened mobile applications for Android and iOS.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Build With Us · Contact Edge Brain Software",
    description:
      "Commission custom secure communication apps, offline mesh protocols, and zero-knowledge architectures from the creators of Hush.",
    url: "/contact",
    images: ["/hush-mask.png"],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

