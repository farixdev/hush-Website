import { NextRequest, NextResponse } from "next/server";
import { checkCredentials, createToken, authCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let username = "";
  let password = "";
  try {
    const body = await req.json();
    username = String(body.username ?? "");
    password = String(body.password ?? "");
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  if (!checkCredentials(username, password)) {
    return NextResponse.json(
      { error: "Incorrect username or password." },
      { status: 401 }
    );
  }

  const token = await createToken(username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(authCookie.name, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: authCookie.maxAge,
  });
  return res;
}
