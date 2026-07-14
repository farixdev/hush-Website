import { NextRequest, NextResponse } from "next/server";
import { getVersion, incrementDownloads } from "@/lib/db";
import { firstLink, PROVIDERS, type ProviderKey } from "@/lib/providers";

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

  // ?p=github|mega|… picks a specific provider link; otherwise the primary one.
  const p = req.nextUrl.searchParams.get("p") as ProviderKey | null;
  const validKeys = PROVIDERS.map((x) => x.key);
  const target =
    (p && validKeys.includes(p) && version.links?.[p]) ||
    firstLink(version.links) ||
    version.apk_url;

  if (!target) {
    return NextResponse.json({ error: "No download link" }, { status: 404 });
  }

  await incrementDownloads(Number(id)).catch(() => {});

  const url = target.startsWith("http")
    ? target
    : new URL(target, req.url).toString();

  return NextResponse.redirect(url, 307);
}
