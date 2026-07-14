import { NextRequest, NextResponse } from "next/server";
import { getVersion, incrementDownloads } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params;
  const version = await getVersion(Number(id)).catch(() => null);
  if (!version) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  await incrementDownloads(Number(id)).catch(() => {});

  const url = version.apk_url.startsWith("http")
    ? version.apk_url
    : new URL(version.apk_url, req.url).toString();

  return NextResponse.redirect(url, 307);
}
