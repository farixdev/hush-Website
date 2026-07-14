# 🚀 Deploy Hush website — step by step

This guide takes you from the code on your machine to a **live website** with a
working **admin panel** for uploading APKs.

Stack: **Next.js → Vercel** (hosting) · **Neon** (database) · **Vercel Blob** (APK files).

**Total time:** ~15 minutes. **Cost:** $0 (all free tiers).

---

## ✅ What you'll need (all free)

1. A **GitHub** account → <https://github.com>
2. A **Vercel** account → <https://vercel.com> (sign up **with GitHub** — easiest)
3. That's it. Neon and Blob are added *from inside* Vercel in Step 3.

---

## STEP 0 — (optional) Test it locally first

Make sure it runs before deploying:

```bash
cd hush-website
npm install
npm run dev
```

Open <http://localhost:3000>. Go to <http://localhost:3000/admin> and log in with:

```
username: admin
password: Fta@53009
```

If that works, you're ready to deploy. (Locally it uses a JSON file + a local
folder, so no database is needed to try it.)

---

## STEP 1 — Put the code on GitHub

You only want to deploy the **`hush-website`** folder. The cleanest way is to
push *just that folder* as its own repo.

1. Go to <https://github.com/new> and create a **new empty repository**
   (e.g. `hush-website`). **Don't** add a README/gitignore — leave it empty.

2. In a terminal, from **inside the `hush-website` folder**, run:

   ```bash
   cd hush-website
   git init
   git add .
   git commit -m "Hush website"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/hush-website.git
   git push -u origin main
   ```

   Replace `YOUR_USERNAME` with your GitHub username.

> 💡 `node_modules`, `.env`, uploaded APKs and local data are already git-ignored,
> so nothing sensitive or heavy gets pushed.

---

## STEP 2 — Import the project into Vercel

1. Go to <https://vercel.com/new>.
2. Under **Import Git Repository**, pick your `hush-website` repo → **Import**.
3. Vercel auto-detects **Next.js** — leave all build settings at their defaults.
4. **Don't click Deploy yet** — first add the database and storage (Step 3),
   otherwise the first deploy will run without them. (If you already deployed,
   that's fine — you'll just redeploy at the end.)

> If you pushed the *whole* `chatify` project instead of just `hush-website`,
> then in Vercel set **Root Directory → `hush-website`** (Settings → General).

---

## STEP 3 — Add the database (Neon) and storage (Blob)

Both are added straight from your Vercel project — no separate signup needed.

### 3a. Neon Postgres (stores version info)

1. In your Vercel project → **Storage** tab → **Create Database**.
2. Choose **Neon** (Serverless Postgres) → **Continue**.
3. Give it a name → pick a region near you → **Create**.
4. When asked, **connect it to this project** and select **all environments**
   (Production, Preview, Development).

   ✅ This automatically adds the `DATABASE_URL` environment variable for you.
   The `versions` table is created automatically the first time it's used —
   **you don't need to run any SQL.**

### 3b. Vercel Blob (stores the APK files)

1. Still in the **Storage** tab → **Create Database** again.
2. Choose **Blob** → **Continue** → **Create**.
3. **Connect it to this project** (all environments).

   ✅ This automatically adds the `BLOB_READ_WRITE_TOKEN` environment variable.

> Why Blob? APKs are ~50 MB. Blob lets the browser upload the file **directly**,
> so big uploads never hit Vercel's request-size limit.

---

## STEP 4 — Add the admin login variables

In your Vercel project → **Settings → Environment Variables**, add these three
(click **Add** for each, select **all** environments):

| Name | Value |
| --- | --- |
| `ADMIN_USERNAME` | `admin` |
| `ADMIN_PASSWORD` | `Fta@53009`  *(change this to something private!)* |
| `AUTH_SECRET` | a long random string — see below |

**To generate `AUTH_SECRET`**, run one of these and paste the output:

```bash
# any terminal with Node:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
```powershell
# Windows PowerShell:
-join ((1..32) | ForEach-Object { '{0:x2}' -f (Get-Random -Max 256) })
```

Or just type a long random jumble of ~40+ characters. It only needs to be secret
and stable.

> After Step 3, you should now have **5** variables total:
> `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `AUTH_SECRET`, `DATABASE_URL`, `BLOB_READ_WRITE_TOKEN`.

---

## STEP 5 — Deploy

- If you haven't deployed yet: go to the **Deployments** tab → **Deploy**.
- If you deployed earlier (before adding storage/vars): go to **Deployments** →
  the latest one → **⋯ menu → Redeploy** (so it picks up the new variables).

Wait ~1 minute. When it's done, Vercel gives you a live URL like
`https://hush-website.vercel.app`.

---

## STEP 6 — Publish your first release

1. Open **`https://YOUR-SITE.vercel.app/admin`**.
2. Log in with your `ADMIN_USERNAME` / `ADMIN_PASSWORD`.
3. Fill in:
   - **Version** → e.g. `1.0.0`
   - **Changelog** → one improvement per line
   - **APK file** → choose your `Hush-v1.0.0.apk`
4. Click **Publish release**.
5. Open **`https://YOUR-SITE.vercel.app/download`** — your release is live with a
   working download button. 🎉

That's the whole loop. Every future update = just upload a new APK on `/admin`.

---

## STEP 7 — (optional) Custom domain

Vercel project → **Settings → Domains** → add your domain and follow the DNS
instructions. HTTPS is automatic.

---

## 🔧 Troubleshooting

| Problem | Fix |
| --- | --- |
| **Can't log in to /admin** | Check `ADMIN_USERNAME` / `ADMIN_PASSWORD` are set, then **redeploy** so they take effect. |
| **"Publish" fails / upload error** | Make sure **Vercel Blob** is connected (Step 3b) and `BLOB_READ_WRITE_TOKEN` exists. Redeploy after adding it. |
| **Download page is empty** | You haven't published a release yet (Step 6), or `DATABASE_URL` is missing. |
| **Changed a variable but nothing changed** | Env-var changes only apply on the **next deploy** — hit **Redeploy**. |
| **Login works but immediately logs out** | Set a real `AUTH_SECRET` (Step 4) and redeploy. |
| **Build fails** | Run `npm run build` locally to see the error; make sure you pushed the whole `hush-website` folder. |

---

## 📋 Quick checklist

- [ ] Pushed `hush-website` to GitHub
- [ ] Imported repo into Vercel
- [ ] Added **Neon** storage (→ `DATABASE_URL`)
- [ ] Added **Blob** storage (→ `BLOB_READ_WRITE_TOKEN`)
- [ ] Added `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `AUTH_SECRET`
- [ ] Redeployed
- [ ] Logged into `/admin` and published a release
- [ ] Verified the download works on `/download`

Done — your site is live and you can push new APK versions any time from `/admin`.
