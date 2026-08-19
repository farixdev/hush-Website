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
  "Hush is a free, anonymous messenger for Android. No sign-up, no trace — get a code, share it, and chat or voice-call in real time, end-to-end encrypted. Works nearby over Wi-Fi or Bluetooth with no internet, plus private groups. Leave, and everything is deleted.";

export const SITE_KEYWORDS = [
  "anonymous chat",
  "encrypted messenger",
  "end-to-end encryption",
  "private chat app",
  "ephemeral messaging",
  "no sign up chat",
  "encrypted voice calls",
  "offline chat app",
  "Bluetooth chat",
  "same Wi-Fi chat",
  "peer to peer messenger",
  "private group chat",
  "anonymous messaging app",
  "Android chat app",
  "Hush app",
];
