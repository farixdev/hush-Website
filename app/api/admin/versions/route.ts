import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/session";
import { createVersion } from "@/lib/db";

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
  const apk_url = String(body.apk_url ?? "").trim();
  if (!version || !apk_url) {
    return NextResponse.json(
      { error: "version and apk_url are required" },
      { status: 400 }
    );
  }

  // If the size wasn't provided (e.g. a pasted link), try to read it from the
  // file's Content-Length so the download page can still show it.
  let size_bytes = Number(body.size_bytes ?? 0);
  if (!size_bytes && apk_url.startsWith("http")) {
    try {
      const head = await fetch(apk_url, { method: "HEAD", redirect: "follow" });
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
  });

  return NextResponse.json({ version: created });
}
