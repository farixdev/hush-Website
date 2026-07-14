import { NextResponse } from "next/server";
import { listVersions } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const versions = await listVersions();
    return NextResponse.json({ versions });
  } catch (e) {
    return NextResponse.json({ versions: [], error: String(e) }, { status: 200 });
  }
}
