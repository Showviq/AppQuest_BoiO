import "server-only";
import { randomBytes } from "node:crypto";
import { ApplinkError, requestOtp, toTel, verifyOtp } from "@/server/applink/client";
import { planDisclosure } from "@/server/applink/config";
import { upsertVerified, type User } from "@/server/store/users";

/**
 * Phone verification through Applink OTP.
 * NOTE: a successful Applink OTP verify also ACTIVATES the app's Applink subscription,
 * so the price/frequency is disclosed and consent recorded before the OTP is sent.
 *
 * Pending flows live in memory (single dev server). Moves to Redis/DB with the backend.
 */

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_VERIFY_ATTEMPTS = 5;
const PHONE_LIMIT = { max: 3, windowMs: 15 * 60 * 1000 };
const IP_LIMIT = { max: 10, windowMs: 15 * 60 * 1000 };

type Pending = {
  msisdn880: string;
  referenceNo: string; // server-side only, never sent to the client
  expires: number;
  attempts: number;
  consentAt: string;
};

const g = globalThis as unknown as {
  __boioPending?: Map<string, Pending>;
  __boioHits?: Map<string, number[]>;
};
const pending = (g.__boioPending ??= new Map<string, Pending>());
const hits = (g.__boioHits ??= new Map<string, number[]>());

export class FlowError extends Error {
  constructor(
    public status: number,
    public userMessage: string
  ) {
    super(userMessage);
  }
}

function limited(key: string, { max, windowMs }: { max: number; windowMs: number }) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter((t) => now - t < windowMs);
  if (list.length >= max) return true;
  list.push(now);
  hits.set(key, list);
  return false;
}

/** Accepts 01XXXXXXXXX, 8801XXXXXXXXX, +8801XXXXXXXXX. Applink runs on Banglalink (014/019). */
export function normalizeBdPhone(input: string): string {
  const digits = input.replace(/[^\d]/g, "");
  const local = digits.startsWith("880") ? digits.slice(2) : digits;
  if (!/^01\d{9}$/.test(local)) throw new FlowError(400, "Enter a valid 11-digit mobile number.");
  if (!/^01[49]/.test(local)) throw new FlowError(400, "Use a Banglalink number (014 or 019).");
  return `88${local}`;
}

function mapApplinkError(e: unknown): never {
  if (e instanceof ApplinkError) {
    if (e.code === "E1850") throw new FlowError(400, "Wrong code. Try again.");
    if (e.code === "E1851" || e.code === "E1855") throw new FlowError(410, "Code expired. Request a new one.");
    // Limited Production: only numbers whitelisted in the Applink portal can use the app.
    if (e.code === "E1343") throw new FlowError(403, "This number isn't enabled yet. Try another Banglalink number.");
    if (e.kind === "transient") throw new FlowError(503, "Service busy. Try again in a moment.");
    console.error("[applink]", e.code, e.kind); // no secrets, no OTP, no referenceNo
    throw new FlowError(502, "Verification is unavailable right now.");
  }
  throw e;
}

export async function startOtp(phone: string, ip: string, consent: boolean) {
  if (!consent) throw new FlowError(400, "Please accept the terms to continue.");
  const msisdn880 = normalizeBdPhone(phone);
  if (limited(`ip:${ip}`, IP_LIMIT) || limited(`ph:${msisdn880}`, PHONE_LIMIT)) {
    throw new FlowError(429, "Too many requests. Try again in 15 minutes.");
  }
  let referenceNo: string;
  try {
    ({ referenceNo } = await requestOtp(toTel(msisdn880)));
  } catch (e) {
    mapApplinkError(e);
  }
  const flowId = randomBytes(24).toString("base64url");
  pending.set(flowId, {
    msisdn880,
    referenceNo,
    expires: Date.now() + OTP_TTL_MS,
    attempts: 0,
    consentAt: new Date().toISOString(),
  });
  return { flowId, last3: msisdn880.slice(-3) };
}

export async function finishOtp(flowId: string | undefined, otp: string): Promise<User> {
  const p = flowId ? pending.get(flowId) : undefined;
  if (!p || p.expires < Date.now()) {
    if (flowId) pending.delete(flowId);
    throw new FlowError(410, "Code expired. Request a new one.");
  }
  if (!/^\d{4,8}$/.test(otp)) throw new FlowError(400, "Enter the code from the SMS.");
  if (++p.attempts > MAX_VERIFY_ATTEMPTS) {
    pending.delete(flowId!);
    throw new FlowError(429, "Too many attempts. Request a new code.");
  }
  let result: { subscriberId: string; subscriptionStatus: string };
  try {
    result = await verifyOtp(p.referenceNo, otp);
  } catch (e) {
    if (e instanceof ApplinkError && (e.code === "E1851" || e.code === "E1855")) pending.delete(flowId!);
    mapApplinkError(e);
  }
  pending.delete(flowId!);
  const plan = planDisclosure();
  return upsertVerified({
    subscriberId: result.subscriberId,
    msisdn880: p.msisdn880,
    subscriptionStatus: result.subscriptionStatus,
    consent: { at: p.consentAt, channel: "web", amount: plan.amount, frequency: plan.frequency },
  });
}
