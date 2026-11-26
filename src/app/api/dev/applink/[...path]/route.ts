import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Local Applink contract mock — OTP endpoints only.
 * Enabled only when APPLINK_DEV_MOCK=1 (never in production). Point
 * APPLINK_OTP_REQUEST_URL / APPLINK_OTP_VERIFY_URL here during development.
 * The code is always 123456.
 */

const MOCK_OTP = "123456";
const g = globalThis as unknown as { __mockRefs?: Map<string, { sub: string; at: number }> };
const refs = (g.__mockRefs ??= new Map());

const reply = (body: Record<string, string>) => NextResponse.json({ version: "1.0", ...body });
const fail = (statusCode: string, statusDetail: string) => reply({ statusCode, statusDetail });

export async function POST(req: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  if (process.env.APPLINK_DEV_MOCK !== "1" || process.env.NODE_ENV === "production") {
    return new NextResponse(null, { status: 404 });
  }
  const route = (await params).path.join("/");
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || Object.values(body).some((v) => typeof v !== "string")) {
    return fail("E1312", "Invalid request: every value must be a string");
  }
  if (body.applicationId !== process.env.APPLINK_APP_ID || body.password !== process.env.APPLINK_PASSWORD) {
    return fail("E1313", "Authentication failed");
  }

  if (route === "otp/request") {
    const allowed = new Set(["applicationId", "password", "subscriberId", "applicationHash"]);
    if (Object.keys(body).some((k) => !allowed.has(k))) return fail("E1856", "Invalid request");
    if (!/^tel:8801\d{9}$/.test(String(body.subscriberId))) return fail("E1312", "Invalid subscriberId");
    const referenceNo = BigInt("0x" + randomBytes(12).toString("hex")).toString().slice(0, 30);
    refs.set(referenceNo, { sub: String(body.subscriberId), at: Date.now() });
    return reply({ statusCode: "S1000", statusDetail: "Success", referenceNo });
  }

  if (route === "otp/verify") {
    const ref = refs.get(String(body.referenceNo));
    if (!ref) return fail("E1855", "Invalid reference number");
    if (Date.now() - ref.at > 5 * 60 * 1000) return fail("E1851", "The OTP request has expired");
    if (body.otp !== MOCK_OTP) return fail("E1850", "Invalid OTP");
    refs.delete(String(body.referenceNo));
    return reply({ statusCode: "S1000", statusDetail: "Success", subscriptionStatus: "REGISTERED", subscriberId: ref.sub });
  }

  return fail("E1309", "Service not provisioned in mock");
}
