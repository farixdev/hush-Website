import { NextRequest, NextResponse } from "next/server";
import { generateClientTokenFromReadWriteToken } from "@vercel/blob/client";
import { getAdmin } from "@/lib/session";

// Mints a short-lived, scoped client token so the browser can upload the APK
// straight to Vercel Blob with put(). Unlike handleUpload(), this flow has NO
// server-to-server completion webhook — so it can't hang waiting on a callback.
export async function POST(req: NextRequest) {
  if (!(await getAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json(
      { error: "Vercel Blob is not connected (BLOB_READ_WRITE_TOKEN missing)." },
      { status: 400 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const pathname = String(body.pathname || "hush.apk").replace(
    /[^a-zA-Z0-9._-]/g,
    "-"
  );

  const token = await generateClientTokenFromReadWriteToken({
    token: process.env.BLOB_READ_WRITE_TOKEN,
    pathname,
    addRandomSuffix: true,
    allowedContentTypes: [
      "application/vnd.android.package-archive",
      "application/octet-stream",
    ],
    maximumSizeInBytes: 300 * 1024 * 1024,
    validUntil: Date.now() + 60 * 60 * 1000,
  });

  return NextResponse.json({ token, pathname });
}
