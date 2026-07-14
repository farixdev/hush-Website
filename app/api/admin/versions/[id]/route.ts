import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/session";
import { deleteVersion, setLatest } from "@/lib/db";
import { isBlobConfigured } from "@/lib/storage";

export async function DELETE(
  _req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const removed = await deleteVersion(Number(id));

  // Best-effort clean up of the stored APK.
  if (removed?.apk_pathname) {
    try {
      if (isBlobConfigured() && removed.apk_url.startsWith("http")) {
        const { del } = await import("@vercel/blob");
        await del(removed.apk_url);
      } else {
        const fs = await import("node:fs/promises");
        const path = await import("node:path");
        await fs.unlink(path.join(process.cwd(), "public", removed.apk_pathname));
      }
    } catch {
      /* ignore */
    }
  }

  return NextResponse.json({ ok: true });
}

export async function PATCH(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = await req.json().catch(() => ({}));
  if (body.action === "setLatest") {
    await setLatest(Number(id));
    return NextResponse.json({ ok: true });
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
