import { NextResponse, type NextRequest } from "next/server";
import { FlowError, normalizeBdPhone } from "@/server/auth/otp-flow";
import { setSession } from "@/server/auth/session";
import { checkPassword, findByPhone, hashPassword, publicUser } from "@/server/store/users";

const DUMMY = hashPassword("timing-equaliser");

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  try {
    const user = findByPhone(normalizeBdPhone(String(body.phone ?? "")));
    const ok = checkPassword(String(body.password ?? ""), user?.passwordHash ?? DUMMY);
    if (!user || !ok) return NextResponse.json({ error: "Wrong number or password." }, { status: 401 });
    const res = NextResponse.json({ ok: true, user: publicUser(user) });
    setSession(res, user.id);
    return res;
  } catch (e) {
    if (e instanceof FlowError) return NextResponse.json({ error: e.userMessage }, { status: e.status });
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
