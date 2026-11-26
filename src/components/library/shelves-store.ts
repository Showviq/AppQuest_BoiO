"use client";

// Custom collections — per-browser (localStorage) until the backend exists.

import { useCallback, useEffect, useRef, useState } from "react";

export type CustomShelf = {
  id: string;
  name: string;
  isPublic: boolean;
  color: string;
  coverBookId?: string;
  bookIds: string[];
};

export const shelfColors = ["#1f3d2b", "#8c2b25", "#2c5866", "#b08d3c", "#3b2a4a", "#c4672f", "#56713f"];

const KEY = "boio-shelves-v1";
const seed: CustomShelf[] = [
  { id: "s1", name: "বর্ষার বই", isPublic: true, color: "#2c5866", coverBookId: "padma-nadir-majhi", bookIds: ["padma-nadir-majhi", "pather-panchali", "hajar-bochor"] },
  { id: "s2", name: "Detectives I love", isPublic: true, color: "#3b2a4a", bookIds: ["feluda", "misir-ali"] },
  { id: "s3", name: "Gift ideas", isPublic: false, color: "#b08d3c", bookIds: ["gitanjali", "alchemist"] },
];

export function useShelves() {
  const [shelves, setShelves] = useState<CustomShelf[]>(seed);
  const [ready, setReady] = useState(false);
  // Latest value, so writes hit storage synchronously (callers may navigate right after).
  const latest = useRef(seed);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        latest.current = JSON.parse(raw);
        setShelves(latest.current);
      }
    } catch {}
    setReady(true);
  }, []);

  const save = useCallback((fn: (s: CustomShelf[]) => CustomShelf[]) => {
    const next = fn(latest.current);
    latest.current = next;
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    setShelves(next);
  }, []);

  const create = (s: Omit<CustomShelf, "id">) => {
    const id = `s${Date.now()}`;
    save((all) => [...all, { ...s, id }]);
    return id;
  };
  const update = (id: string, patch: Partial<CustomShelf>) =>
    save((all) => all.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  const remove = (id: string) => save((all) => all.filter((s) => s.id !== id));

  return { shelves, ready, create, update, remove };
}
