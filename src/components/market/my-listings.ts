"use client";

// The reader's own listings live in localStorage (mockup only).

import { useEffect, useState } from "react";
import type { Listing } from "@/lib/mock/market";

const KEY = "boio-market-mine-v1";
export const ME = "me";

export function useMyListings() {
  const [mine, setMine] = useState<Listing[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setMine(JSON.parse(raw));
    } catch {}
  }, []);

  const save = (next: Listing[]) => {
    setMine(next);
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
  };

  return {
    mine,
    add: (l: Listing) => save([l, ...mine]),
    remove: (id: string) => save(mine.filter((l) => l.id !== id)),
  };
}

export const taka = (n: number) => `৳${n.toLocaleString("en-IN")}`;
