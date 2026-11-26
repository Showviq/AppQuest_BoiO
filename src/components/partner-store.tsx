"use client";

// Mockup state (D-011, D-013): author/publisher applications, approvals and plan
// requests live in this browser's localStorage until the backend exists.
// The real version stores VerificationRequests server-side and adds the role
// to the user only after an admin approves.

import { useCallback, useEffect, useState } from "react";

export type PartnerRole = "author" | "publisher";
export type AppStatus = "pending" | "approved" | "rejected";

export type Application = {
  role: PartnerRole;
  name: string; // pen name or publishing house
  link: string; // official website / Facebook page
  proof: string; // e.g. ISBN of a published book, trade licence no.
  status: AppStatus;
  reason?: string; // rejection reason
  submittedAt: number;
  decidedAt?: number;
};

export type PlanId = "boost" | "spotlight";
export type PlanRequest = { plan: PlanId; bookId?: string; status: "invoice-requested"; at: number };
export type Post = { text: string; at: number };

type State = { app: Application | null; plans: PlanRequest[]; posts: Post[]; stall?: string };

const KEY = "boio-partner-v1";
const EVENT = "boio-partner-change";
const empty: State = { app: null, plans: [], posts: [] };

function read(): State {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? { ...empty, ...JSON.parse(raw) } : empty;
  } catch {
    return empty;
  }
}

export function usePartner() {
  const [state, setState] = useState<State>(empty);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setState(read());
    sync();
    setReady(true);
    window.addEventListener(EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const update = useCallback((fn: (s: State) => State) => {
    const next = fn(read());
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    setState(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  return {
    ...state,
    ready,
    apply: (a: Pick<Application, "role" | "name" | "link" | "proof">) =>
      update((s) => ({ ...s, app: { ...a, status: "pending", submittedAt: Date.now() } })),
    decide: (status: "approved" | "rejected", reason?: string) =>
      update((s) => (s.app ? { ...s, app: { ...s.app, status, reason, decidedAt: Date.now() } } : s)),
    withdraw: () => update(() => empty),
    requestPlan: (plan: PlanId, bookId?: string) =>
      update((s) => ({ ...s, plans: [{ plan, bookId, status: "invoice-requested", at: Date.now() }, ...s.plans] })),
    addPost: (text: string) => update((s) => ({ ...s, posts: [{ text, at: Date.now() }, ...s.posts] })),
    setStall: (stall: string) => update((s) => ({ ...s, stall })),
  };
}

export const roleLabel: Record<PartnerRole, string> = { author: "Author", publisher: "Publisher" };

/** Publisher plans: B2B, billed by invoice (too large for carrier billing). */
export const publisherPlans: { id: PlanId; name: string; price: string; perks: string[] }[] = [
  { id: "boost", name: "Book Boost", price: "৳1,000 / 7 days", perks: ["Featured in Discover", "Promoted tag"] },
  {
    id: "spotlight",
    name: "Boi Mela Spotlight",
    price: "৳5,000 / fair",
    perks: ["Top of USSD Trending", "Stall pinned in Boi Mela", "Fair push SMS to opted-in readers"],
  },
];
