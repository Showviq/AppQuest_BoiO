import { NextResponse, type NextRequest } from "next/server";
import { FlowError, startOtp } from "@/server/auth/otp-flow";

const OTP_FLOW_COOKIE = "boio_otp";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  try {
    const { flowId, last3 } = await startOtp(String(body.phone ?? ""), ip, body.consent === true);
    const res = NextResponse.json({ ok: true, last3 });
    res.cookies.set(OTP_FLOW_COOKIE, flowId, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      path: "/api/auth",
      maxAge: 5 * 60,
    });
    return res;
  } catch (e) {
    if (e instanceof FlowError) return NextResponse.json({ error: e.userMessage }, { status: e.status });
    console.error("[otp/request]", (e as Error).message);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}
