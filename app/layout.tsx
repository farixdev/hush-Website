import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import FloatingChat from "@/components/FloatingChat";
import {
  SITE_URL,
  SITE_NAME,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
} from "@/lib/site";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s · Hush",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: SITE_KEYWORDS,
  authors: [{ name: "Edge Brain Software", url: "https://www.edgebrainsoftware.com" }],
  creator: "Edge Brain Software",
  publisher: SITE_NAME,
  category: "communication",
  alternates: { canonical: "/" },
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
      { url: "/hush-icon.png", type: "image/png" },
    ],
    apple: [{ url: "/hush-icon.png", type: "image/png" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    url: SITE_URL,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [{ url: "/hush-mask.png", alt: "Hush — anonymous, encrypted chat & voice calls" }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/hush-mask.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: SITE_NAME,
  applicationCategory: "CommunicationApplication",
  operatingSystem: "Android",
  description: SITE_DESCRIPTION,
  url: SITE_URL,
  downloadUrl: `${SITE_URL}/download`,
  softwareVersion: "1.4.2",
  featureList: [
    "Anonymous — no account or sign-up",
    "End-to-end encrypted messages and voice calls",
    "Encrypted peer-to-peer voice calls",
    "Nearby mode over Wi-Fi or Bluetooth with no internet",
    "Private group chat and group voice calls",
    "Ephemeral — conversations are deleted when you leave",
  ],
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "Edge Brain Software",
    url: "https://www.edgebrainsoftware.com",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-black font-sans text-white antialiased selection:bg-white selection:text-black">
        {/* Accessible skip to main content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-4 focus:py-2 focus:text-xs focus:font-bold focus:text-black focus:outline-none focus:ring-2 focus:ring-white"
        >
          Skip to main content
        </a>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <FloatingChat />
      </body>
    </html>
  );
}
