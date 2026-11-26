import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { applySubscriptionStatus } from "@/server/store/users";

/**
 * Applink subscriber notification (Subscription API settings → notification URL).
 * Authoritative source of subscription state: REGISTERED / UNREGISTERED etc.,
 * including changes Boi-O didn't start (STOP by SMS, operator removal).
 * The body carries our Applink password: never log the raw payload.
 */

const ACK = { statusCode: "S1000", statusDetail: "Success" };

function same(a: string, b: string) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ statusCode: "E1312", statusDetail: "Invalid request" }, { status: 400 });
  }

  const str = (k: string) => (typeof body[k] === "string" ? (body[k] as string) : "");
  const appId = process.env.APPLINK_APP_ID?.trim() ?? "";
  const pw = process.env.APPLINK_PASSWORD?.trim() ?? "";
  if (!appId || !pw || !same(str("applicationId"), appId) || !same(str("password"), pw)) {
    console.warn("[applink/notify] rejected: credentials did not match");
    return NextResponse.json({ statusCode: "E1313", statusDetail: "Authentication failed" }, { status: 401 });
  }

  const subscriberId = str("subscriberId");
  const status = str("status").replace(/\.$/, "").toUpperCase(); // samples show "UNREGISTERED."
  if (!subscriberId || !status) {
    return NextResponse.json({ statusCode: "E1312", statusDetail: "Invalid request" }, { status: 400 });
  }

  const matched = applySubscriptionStatus(subscriberId, status);
  console.info("[applink/notify]", status, matched ? "user updated" : "no matching user", str("timeStamp"));
  return NextResponse.json(ACK);
}
