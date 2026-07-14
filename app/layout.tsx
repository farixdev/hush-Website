import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Hush — anonymous, ephemeral chat",
  description:
    "No accounts. No sign-up. No trace. Get a code, share it, chat privately — then it's gone.",
  openGraph: {
    title: "Hush — anonymous, ephemeral chat",
    description:
      "No accounts. No sign-up. No trace. Get a code, share it, chat privately — then it's gone.",
    images: ["/hush-mask.png"],
  },
  metadataBase: new URL("https://hush.app"),
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${mono.variable}`}>
      <body className="min-h-screen bg-black font-sans text-white antialiased">
        {children}
      </body>
    </html>
  );
}
