/**
 * Central site constants used for SEO (metadata, sitemap, robots, JSON-LD).
 * Set `NEXT_PUBLIC_SITE_URL` in your environment to your real production domain;
 * it falls back to the placeholder below.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://hush.app"
).replace(/\/$/, "");

export const SITE_NAME = "Hush";

export const SITE_TITLE = "Hush — anonymous, encrypted chat & voice calls";

export const SITE_DESCRIPTION =
  "Hush is a free, anonymous messenger for Android. No sign-up, no phone numbers, no trace. Get an expiring 6-digit code, share it, and chat or voice-call in real time with end-to-end encryption. Works nearby over Wi-Fi or Bluetooth with zero internet, plus private groups. Leave, and everything is permanently deleted.";

export const SITE_KEYWORDS = [
  "anonymous chat",
  "encrypted messenger",
  "end-to-end encryption",
  "private chat app",
  "ephemeral messaging",
  "no sign up chat",
  "no phone number messenger",
  "encrypted voice calls",
  "offline chat app",
  "Bluetooth chat",
  "same Wi-Fi chat",
  "peer to peer messenger",
  "private group chat",
  "anonymous messaging app",
  "Android chat app",
  "anti surveillance chat",
  "RAM only messaging",
  "zero metadata chat",
  "Hush user manual",
  "Hush app",
];
