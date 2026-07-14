// APK storage helpers.
//  • Production: Vercel Blob (browser uploads straight to Blob, bypassing the
//    serverless body-size limit — handled in the API routes).
//  • Development without a Blob token: APK is saved to public/uploads/.

export function isBlobConfigured(): boolean {
  return !!process.env.BLOB_READ_WRITE_TOKEN;
}

export function safeApkName(version: string, original: string): string {
  const v = version.replace(/[^a-zA-Z0-9._-]/g, "");
  const base = original.toLowerCase().endsWith(".apk") ? original : `${original}.apk`;
  const clean = base.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `hush-${v || "x"}-${Date.now()}-${clean}`;
}

export async function saveLocalApk(
  filename: string,
  data: ArrayBuffer
): Promise<{ url: string; pathname: string }> {
  const fs = await import("node:fs/promises");
  const path = await import("node:path");
  const dir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, filename), Buffer.from(data));
  return { url: `/uploads/${filename}`, pathname: `uploads/${filename}` };
}
