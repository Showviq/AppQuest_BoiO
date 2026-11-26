import "server-only";
import { createHash, randomBytes, randomUUID, scryptSync, timingSafeEqual } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

/**
 * Temporary user store: a JSON file in .data/ (git-ignored).
 * Replaced by PostgreSQL when the backend phase starts (see docs/01-decisions.md D-010).
 */

export type User = {
  id: string;
  subscriberId: string; // opaque Applink identity — may be masked
  phoneHash: string; // sha256 of 8801XXXXXXXXX, for login lookup
  phoneLast3: string;
  name?: string;
  passwordHash?: string;
  subscriptionStatus: string;
  consent: { at: string; channel: "web"; amount: string; frequency: string };
  createdAt: string;
};

const FILE = path.join(process.cwd(), ".data", "users.json");

function load(): User[] {
  try {
    return JSON.parse(readFileSync(FILE, "utf8"));
  } catch {
    return [];
  }
}

function save(users: User[]) {
  mkdirSync(path.dirname(FILE), { recursive: true });
  writeFileSync(FILE, JSON.stringify(users, null, 2));
}

export const hashPhone = (msisdn880: string) => createHash("sha256").update(msisdn880).digest("hex");

export function findById(id: string) {
  return load().find((u) => u.id === id);
}

export function findByPhone(msisdn880: string) {
  const h = hashPhone(msisdn880);
  return load().find((u) => u.phoneHash === h);
}

/** Create or update the user bound to this subscriber after a verified OTP. */
export function upsertVerified(input: {
  subscriberId: string;
  msisdn880: string;
  subscriptionStatus: string;
  consent: User["consent"];
}): User {
  const users = load();
  const h = hashPhone(input.msisdn880);
  const existing = users.find((u) => u.phoneHash === h);
  if (existing) {
    Object.assign(existing, {
      subscriberId: input.subscriberId,
      subscriptionStatus: input.subscriptionStatus,
      consent: input.consent,
    });
    save(users);
    return existing;
  }
  const user: User = {
    id: randomUUID(),
    subscriberId: input.subscriberId,
    phoneHash: h,
    phoneLast3: input.msisdn880.slice(-3),
    subscriptionStatus: input.subscriptionStatus,
    consent: input.consent,
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  save(users);
  return user;
}

/**
 * Mirror a subscription change pushed by Applink (subscriber notification).
 * Matches on subscriberId, or on the phone when the id is an unmasked tel:880… number.
 * Idempotent: re-applying the same status is a no-op. Returns false if no user matches.
 */
export function applySubscriptionStatus(subscriberId: string, status: string): boolean {
  const users = load();
  const digits = subscriberId.replace(/^tel:/, "");
  const h = /^8801\d{9}$/.test(digits) ? hashPhone(digits) : null;
  const u = users.find((x) => x.subscriberId === subscriberId || (h !== null && x.phoneHash === h));
  if (!u) return false;
  if (u.subscriptionStatus !== status) {
    u.subscriptionStatus = status;
    save(users);
  }
  return true;
}

export function updateProfile(id: string, name: string, password: string) {
  const users = load();
  const u = users.find((x) => x.id === id);
  if (!u) return undefined;
  u.name = name;
  u.passwordHash = hashPassword(password);
  save(users);
  return u;
}

export function hashPassword(pw: string) {
  const salt = randomBytes(16);
  const key = scryptSync(pw, salt, 64);
  return `scrypt$${salt.toString("hex")}$${key.toString("hex")}`;
}

export function checkPassword(pw: string, stored?: string) {
  if (!stored) return false;
  const [, saltHex, keyHex] = stored.split("$");
  const key = scryptSync(pw, Buffer.from(saltHex, "hex"), 64);
  const expected = Buffer.from(keyHex, "hex");
  return expected.length === key.length && timingSafeEqual(expected, key);
}

export function publicUser(u: User) {
  return {
    id: u.id,
    name: u.name ?? null,
    phone: `•••••••••${u.phoneLast3}`,
    subscriptionStatus: u.subscriptionStatus,
    profileComplete: Boolean(u.name && u.passwordHash),
  };
}
