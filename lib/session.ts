import { cookies } from "next/headers";
import { verifyToken, authCookie } from "./auth";

/** Returns the logged-in admin username, or null. Server-only. */
export async function getAdmin(): Promise<string | null> {
  const store = await cookies();
  return verifyToken(store.get(authCookie.name)?.value);
}
