"use client";

// Mockup state: the reader's library lives in localStorage until the backend exists.

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Shelf = "want" | "reading" | "read" | "abandoned";
export const shelfLabels: Record<Shelf, string> = {
  want: "Want to read",
  reading: "Reading",
  read: "Read",
  abandoned: "Stopped",
};

export type Entry = { shelf: Shelf; page: number; rating?: number; review?: string; updated: number };
type Library = Record<string, Entry>;

const KEY = "boio-library-v1";
const seed: Library = {
  himu: { shelf: "reading", page: 58, updated: 3 },
  "pather-panchali": { shelf: "reading", page: 112, updated: 2 },
  feluda: { shelf: "read", page: 128, rating: 4.5, updated: 1 },
  gitanjali: { shelf: "want", page: 0, updated: 0 },
};

type Ctx = {
  library: Library;
  set: (bookId: string, patch: Partial<Entry>) => void;
  remove: (bookId: string) => void;
};
const LibraryCtx = createContext<Ctx | null>(null);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [library, setLibrary] = useState<Library>(seed);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLibrary(JSON.parse(raw));
    } catch {}
  }, []);

  const persist = (next: Library) => {
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {}
    return next;
  };

  const set = useCallback((bookId: string, patch: Partial<Entry>) => {
    setLibrary((lib) => {
      const prev = lib[bookId] ?? { shelf: "want" as Shelf, page: 0, updated: 0 };
      return persist({ ...lib, [bookId]: { ...prev, ...patch, updated: Date.now() } });
    });
  }, []);

  const remove = useCallback((bookId: string) => {
    setLibrary((lib) => {
      const next = { ...lib };
      delete next[bookId];
      return persist(next);
    });
  }, []);

  return <LibraryCtx.Provider value={{ library, set, remove }}>{children}</LibraryCtx.Provider>;
}

export function useLibrary() {
  const ctx = useContext(LibraryCtx);
  if (!ctx) throw new Error("useLibrary outside LibraryProvider");
  return ctx;
}
