import { NextResponse, type NextRequest } from "next/server";
import { FlowError, finishOtp } from "@/server/auth/otp-flow";
import { setSession } from "@/server/auth/session";
import { publicUser } from "@/server/store/users";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  try {
    const user = await finishOtp(req.cookies.get("boio_otp")?.value, String(body.otp ?? "").trim());
    const res = NextResponse.json({ ok: true, user: publicUser(user) });
    res.cookies.set("boio_otp", "", { path: "/api/auth", maxAge: 0 });
    setSession(res, user.id);
    return res;
  } catch (e) {
    if (e instanceof FlowError) return NextResponse.json({ error: e.userMessage }, { status: e.status });
    console.error("[otp/verify]", (e as Error).message);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
