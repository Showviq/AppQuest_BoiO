import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import type { NextResponse } from "next/server";

/** Boi-O's own session (Applink is never called on login or page load). */

export const SESSION_COOKIE = "boio_session";
const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 32) throw new Error("SESSION_SECRET must be set (32+ chars). See .env.example.");
  return s;
}

const sign = (data: string) => createHmac("sha256", secret()).update(data).digest("base64url");

export function setSession(res: NextResponse, userId: string) {
  const payload = Buffer.from(JSON.stringify({ uid: userId, exp: Date.now() + MAX_AGE * 1000 })).toString(
    "base64url"
  );
  res.cookies.set(SESSION_COOKIE, `${payload}.${sign(payload)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export function clearSession(res: NextResponse) {
  res.cookies.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}

export async function getSessionUserId(): Promise<string | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const { uid, exp } = JSON.parse(Buffer.from(payload, "base64url").toString());
    return typeof uid === "string" && exp > Date.now() ? uid : null;
  } catch {
    return null;
  }
}
