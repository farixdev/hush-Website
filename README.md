<div align="center">

# ▪️ Hush — marketing site & release CMS

Minimalist black-and-white marketing site for the **Hush** app, with a built-in
**admin panel** to upload APKs and manage versions/changelogs.

**Next.js 15 · Framer Motion · Tailwind · Neon (Postgres) · Vercel Blob**

</div>

---

## Pages

| Route | What it is |
| --- | --- |
| `/` | Animated single-page landing (hero, features, how-it-works, CTA) |
| `/download` | Latest release + full version history / changelog |
| `/admin` | Password-protected CMS: upload APKs, edit versions & changelogs |

Animations use **Framer Motion**; the background particles, blur-in headings and
travelling-border button are [reactbits.dev](https://reactbits.dev)-style
components in `components/reactbits/`.

---

## Run locally

```bash
npm install
cp .env.example .env.local      # optional — see below
npm run dev                     # http://localhost:3000
```

**With zero config**, the site runs fully:
- Version data is stored in a local `.data/versions.json` file.
- Uploaded APKs are saved to `public/uploads/`.
- Admin login uses the defaults below.

So you can open `/admin`, log in, upload an APK, and see it on `/download`
immediately — no database needed for development.

### Admin login (default)

```
username: admin
password: Fta@53009
```

Change these with `ADMIN_USERNAME` / `ADMIN_PASSWORD` env vars.

---

## Deploy to Vercel + Neon

> 📘 **New to this? Follow the click-by-click guide in [`DEPLOY.md`](DEPLOY.md).**
> The summary below is the short version.

### 1. Database — Neon
1. Create a project at [neon.tech](https://neon.tech).
2. Copy the connection string into `DATABASE_URL`.
   The `versions` table is created automatically on first use — no migration needed.
   (Manual SQL, if you prefer, is in [`schema.sql`](schema.sql).)

### 2. APK storage — Vercel Blob
1. In your Vercel project → **Storage → Blob → Create**.
2. It adds `BLOB_READ_WRITE_TOKEN` to your project automatically.
   (Locally, run `vercel env pull .env.local` to get it, or leave it unset to
   use the `public/uploads/` fallback.)

### 3. Deploy
1. Push this folder to a Git repo and **Import** it in Vercel.
2. Set environment variables (Project → Settings → Environment Variables):

   | Variable | Value |
   | --- | --- |
   | `ADMIN_USERNAME` | `admin` (or your choice) |
   | `ADMIN_PASSWORD` | `Fta@53009` (change this!) |
   | `AUTH_SECRET` | a long random string |
   | `DATABASE_URL` | your Neon connection string |
   | `BLOB_READ_WRITE_TOKEN` | added by Vercel Blob |

3. Deploy. Open `/admin`, log in, and upload the APK.

> APK uploads go **directly from the browser to Vercel Blob**, so they aren't
> limited by serverless request size — large APKs upload fine.

---

## Tech notes

- **Auth**: a signed (HMAC-SHA256) `httpOnly` cookie; no external auth service.
- **DB abstraction** (`lib/db.ts`) transparently uses Neon or the JSON fallback.
- **Storage abstraction** (`lib/storage.ts`) uses Vercel Blob or local files.
- Fully responsive, dark, `prefers-reduced-motion`-aware.

Built by [farixdev](https://github.com/farixdev).
