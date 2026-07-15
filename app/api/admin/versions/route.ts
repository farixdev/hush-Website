import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/session";
import { createVersion } from "@/lib/db";
import { cleanLinks, firstLink } from "@/lib/providers";

// Persists a version's metadata after its APK has been uploaded (to Blob in
// production, or to public/uploads in dev).
export async function POST(req: NextRequest) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const version = String(body.version ?? "").trim();
  const links = cleanLinks(body.links);
  // apk_url is the "primary" link: an uploaded file's URL, else the first
  // provider link. It powers the /api/download redirect + size lookup.
  const apk_url = String(body.apk_url ?? "").trim() || firstLink(links);

  if (!version) {
    return NextResponse.json({ error: "Enter a version number." }, { status: 400 });
  }
  if (!apk_url) {
    return NextResponse.json(
      { error: "Add at least one download link." },
      { status: 400 }
    );
  }

  // If the size wasn't provided (e.g. a pasted link), try to read it from the
  // file's Content-Length so the download page can still show it.
  let size_bytes = Number(body.size_bytes ?? 0);
  if (!size_bytes && apk_url.startsWith("http")) {
    try {
      // Time-boxed: some hosts (MEGA, Drive pages) don't answer HEAD quickly.
      const head = await fetch(apk_url, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(5000),
      });
      const len = head.headers.get("content-length");
      if (len) size_bytes = Number(len);
    } catch {
      /* size stays 0 — not critical */
    }
  }

  const created = await createVersion({
    version,
    changelog: String(body.changelog ?? "").trim(),
    size_bytes,
    apk_url,
    apk_pathname: body.apk_pathname ? String(body.apk_pathname) : null,
    links,
    display: body.display === "buttons" ? "buttons" : "icons",
  });

  return NextResponse.json({ version: created });
}
