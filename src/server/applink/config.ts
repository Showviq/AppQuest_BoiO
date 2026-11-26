import "server-only";

/**
 * The only module that reads Applink settings from the environment.
 * Server-side only: never import from client code, never use a NEXT_PUBLIC_ prefix.
 * Read lazily so `next build` works without credentials.
 */

function required(name: string): string {
  const v = process.env[name]?.trim();
  if (!v) throw new Error(`[applink] Missing env ${name}. See .env.example.`);
  return v;
}

function optional(name: string): string | undefined {
  const v = process.env[name]?.trim();
  return v ? v.replace(/\/+$/, "") : undefined;
}

export function applinkCredentials() {
  return { applicationId: required("APPLINK_APP_ID"), password: required("APPLINK_PASSWORD") };
}

/** One URL per provisioned service. Unset = not enabled for this app. */
export const endpoints = {
  get otpRequest() {
    return optional("APPLINK_OTP_REQUEST_URL");
  },
  get otpVerify() {
    return optional("APPLINK_OTP_VERIFY_URL");
  },
};

export type Endpoint = keyof typeof endpoints;

export function requireEndpoint(name: Endpoint): string {
  const url = endpoints[name];
  if (!url) throw new Error(`[applink] ${name} is not configured. See .env.example.`);
  return url;
}

/** What the subscriber is agreeing to when they verify the OTP (shown before sending it). */
export function planDisclosure() {
  const amount = process.env.BOIO_SUB_CHARGE_BDT?.trim() || "0";
  const frequency = process.env.BOIO_SUB_FREQUENCY?.trim() || "monthly";
  return { amount, frequency, free: Number(amount) === 0 };
}
