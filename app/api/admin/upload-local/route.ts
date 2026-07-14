import { NextRequest, NextResponse } from "next/server";
import { getAdmin } from "@/lib/session";
import { safeApkName, saveLocalApk } from "@/lib/storage";

// Dev-only fallback used when Vercel Blob isn't configured: saves the uploaded
// APK to public/uploads and returns its URL. (On Vercel, the browser uploads
// straight to Blob instead — see /api/admin/blob-upload.)
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get("file");
  const version = String(form.get("version") ?? "");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file" }, { status: 400 });
  }

  const name = safeApkName(version, file.name);
  const bytes = await file.arrayBuffer();
  const { url, pathname } = await saveLocalApk(name, bytes);
  return NextResponse.json({ url, pathname, size: file.size });
}
