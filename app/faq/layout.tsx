import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Frequently Asked Questions & Support · Hush",
  description:
    "Explore answers about Hush's zero-knowledge privacy, ephemeral 6-digit codes, offline Wi-Fi and Bluetooth mode, encrypted voice calls, and direct Android APK sideloading.",
  alternates: { canonical: "/faq" },
  openGraph: {
    title: "Frequently Asked Questions & Support · Hush",
    description:
      "All your questions answered: zero metadata, offline peer discovery, RAM-only message destruction, and security model.",
    url: "/faq",
    images: ["/hush-mask.png"],
  },
};

export default function FAQLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

