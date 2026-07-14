import { NextRequest, NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { getAdmin } from "@/lib/session";

// Client-upload handshake for Vercel Blob: the browser sends the APK straight
// to Blob storage (bypassing serverless body limits); this route only mints a
// scoped upload token after checking the admin session.
export async function POST(req: NextRequest) {
  const body = (await req.json()) as HandleUploadBody;
  try {
    const json = await handleUpload({
      body,
      request: req,
      onBeforeGenerateToken: async () => {
        if (!(await getAdmin())) throw new Error("Unauthorized");
        return {
          allowedContentTypes: [
            "application/vnd.android.package-archive",
            "application/octet-stream",
          ],
          maximumSizeInBytes: 200 * 1024 * 1024,
          addRandomSuffix: true,
        };
      },
      onUploadCompleted: async () => {
        // Metadata is saved by the client via POST /api/admin/versions.
      },
    });
    return NextResponse.json(json);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 400 });
  }
}
