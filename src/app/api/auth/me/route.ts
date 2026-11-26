import { NextResponse } from "next/server";
import { getSessionUserId } from "@/server/auth/session";
import { findById, publicUser } from "@/server/store/users";

export async function GET() {
  const uid = await getSessionUserId();
  const user = uid ? findById(uid) : undefined;
  return NextResponse.json({ user: user ? publicUser(user) : null });
}
