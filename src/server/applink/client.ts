import "server-only";
import { applinkCredentials, requireEndpoint } from "./config";

/**
 * Minimal Applink client (OTP only for now).
 * Contract: dev.applink.com.bd docs / Applink-as-a-Skill `references/13-curl-reference.md`.
 * - Credentials travel in the JSON body; every value is a string.
 * - HTTP 200 is not success: decide from `statusCode`.
 */

const TIMEOUT_MS = 15_000;

export type ApplinkResponse = {
  statusCode: string;
  statusDetail: string;
  [k: string]: unknown;
};

export class ApplinkError extends Error {
  constructor(
    public code: string,
    public detail: string,
    public kind: "client" | "configuration" | "transient" | "unknown"
  ) {
    super(`Applink ${code}: ${detail}`);
  }
}

const kinds: Record<string, ApplinkError["kind"]> = {
  E1312: "client",
  E1850: "client",
  E1851: "client",
  E1855: "client",
  E1856: "client",
  E1301: "configuration",
  E1303: "configuration",
  E1309: "configuration",
  E1313: "configuration",
  E1603: "transient",
};

async function post(url: string, body: Record<string, string>): Promise<ApplinkResponse> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(TIMEOUT_MS),
      cache: "no-store",
    });
  } catch {
    throw new ApplinkError("NETWORK", "Applink did not respond", "transient");
  }
  let json: Partial<ApplinkResponse>;
  try {
    json = await res.json();
  } catch {
    throw new ApplinkError(`HTTP${res.status}`, "Unreadable response", "transient");
  }
  return {
    ...json,
    statusCode: String(json.statusCode ?? ""),
    statusDetail: String(json.statusDetail ?? ""),
  };
}

function expect(res: ApplinkResponse, ok: string) {
  if (res.statusCode !== ok) {
    throw new ApplinkError(res.statusCode || "UNKNOWN", res.statusDetail, kinds[res.statusCode] ?? "unknown");
  }
}

/** `tel:8801XXXXXXXXX` — the form the OTP endpoints publish. */
export const toTel = (msisdn880: string) => `tel:${msisdn880}`;

export async function requestOtp(subscriberId: string) {
  const res = await post(requireEndpoint("otpRequest"), {
    ...applinkCredentials(),
    subscriberId,
  });
  expect(res, "S1000");
  const referenceNo = String(res.referenceNo ?? "");
  if (!referenceNo) throw new ApplinkError("NO_REF", "Missing referenceNo", "unknown");
  return { referenceNo };
}

export async function verifyOtp(referenceNo: string, otp: string) {
  const res = await post(requireEndpoint("otpVerify"), {
    ...applinkCredentials(),
    referenceNo,
    otp,
  });
  expect(res, "S1000");
  return {
    subscriberId: String(res.subscriberId ?? ""),
    subscriptionStatus: String(res.subscriptionStatus ?? "INITIAL"),
  };
}
