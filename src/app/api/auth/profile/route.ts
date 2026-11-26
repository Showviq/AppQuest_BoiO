import { NextResponse, type NextRequest } from "next/server";
import { getSessionUserId } from "@/server/auth/session";
import { publicUser, updateProfile } from "@/server/store/users";

export async function POST(req: NextRequest) {
  const uid = await getSessionUserId();
  if (!uid) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const name = String(body.name ?? "").trim();
  const password = String(body.password ?? "");
  if (name.length < 2 || name.length > 40) return NextResponse.json({ error: "Name: 2–40 characters." }, { status: 400 });
  if (password.length < 8) return NextResponse.json({ error: "Password: at least 8 characters." }, { status: 400 });
  const user = updateProfile(uid, name, password);
  if (!user) return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  return NextResponse.json({ ok: true, user: publicUser(user) });
}
