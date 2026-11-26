"use client";

// Mockup state: the reader's library lives in localStorage until the backend exists.

import { createContext, useCallback, useContext, useEffect, useState } from "react";

export type Shelf = "want" | "reading" | "read" | "rereading" | "onhold" | "abandoned" | "wishlist";
export const shelfLabels: Record<Shelf, string> = {
  want: "Want to read",
  reading: "Reading",
  read: "Read",
  rereading: "Rereading",
  onhold: "On hold",
  abandoned: "Abandoned",
  wishlist: "Wishlist",
};
export const shelfOrder: Shelf[] = ["reading", "want", "read", "rereading", "onhold", "abandoned", "wishlist"];

export type Ownership = "owned" | "forSale";
export const ownershipLabels: Record<Ownership, string> = {
  owned: "Owned",
  forSale: "For sale",
};

export type Session = { date: number; pages: number; minutes: number };
export type Note = { date: number; text: string; page?: number };

export type Entry = {
  shelf: Shelf;
  page: number;
  rating?: number;
  review?: string;
  favourite?: boolean;
  owned?: boolean;
  forSale?: boolean;
  notes?: Note[];
  sessions?: Session[];
  updated: number;
};
type Library = Record<string, Entry>;

const KEY = "boio-library-v2";
const OLD_KEY = "boio-library-v1";
const DAY = 86_400_000;
// Seed timestamps are relative to "now" at load so the demo streak looks alive.
const ago = (d: number) => Date.now() - d * DAY;

function makeSeed(): Library {
  return {
    himu: {
      shelf: "reading",
      page: 58,
      owned: true,
      updated: 3,
      sessions: [
        { date: ago(0), pages: 12, minutes: 20 },
        { date: ago(1), pages: 18, minutes: 30 },
        { date: ago(2), pages: 10, minutes: 15 },
      ],
      notes: [{ date: ago(1), page: 40, text: "হিমুর হলুদ পাঞ্জাবি — প্রথম দেখা।" }],
    },
    "pather-panchali": {
      shelf: "reading",
      page: 112,
      owned: true,
      updated: 2,
      sessions: [
        { date: ago(3), pages: 30, minutes: 45 },
        { date: ago(4), pages: 22, minutes: 35 },
        { date: ago(6), pages: 25, minutes: 40 },
      ],
    },
    feluda: { shelf: "read", page: 128, rating: 4.5, favourite: true, owned: true, updated: 1, sessions: [{ date: ago(20), pages: 128, minutes: 180 }] },
    "1984": { shelf: "read", page: 328, rating: 5, owned: true, forSale: true, updated: 1, sessions: [{ date: ago(50), pages: 328, minutes: 420 }] },
    gitanjali: { shelf: "want", page: 0, updated: 0 },
    alchemist: { shelf: "wishlist", page: 0, updated: 0 },
  };
}

type Ctx = {
  library: Library;
  set: (bookId: string, patch: Partial<Entry>) => void;
  remove: (bookId: string) => void;
  logSession: (bookId: string, s: Session) => void;
  addNote: (bookId: string, n: Note) => void;
};
const LibraryCtx = createContext<Ctx | null>(null);

export function LibraryProvider({ children }: { children: React.ReactNode }) {
  const [library, setLibrary] = useState<Library>(makeSeed);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY) ?? localStorage.getItem(OLD_KEY);
      if (raw) setLibrary(JSON.parse(raw)); // v1 entries are a subset of v2 — load as-is
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

  const logSession = useCallback((bookId: string, s: Session) => {
    setLibrary((lib) => {
      const prev = lib[bookId] ?? { shelf: "reading" as Shelf, page: 0, updated: 0 };
      return persist({
        ...lib,
        [bookId]: { ...prev, sessions: [...(prev.sessions ?? []), s], updated: Date.now() },
      });
    });
  }, []);

  const addNote = useCallback((bookId: string, n: Note) => {
    setLibrary((lib) => {
      const prev = lib[bookId] ?? { shelf: "reading" as Shelf, page: 0, updated: 0 };
      return persist({ ...lib, [bookId]: { ...prev, notes: [...(prev.notes ?? []), n], updated: Date.now() } });
    });
  }, []);

  return (
    <LibraryCtx.Provider value={{ library, set, remove, logSession, addNote }}>{children}</LibraryCtx.Provider>
  );
}

export function useLibrary() {
  const ctx = useContext(LibraryCtx);
  if (!ctx) throw new Error("useLibrary outside LibraryProvider");
  return ctx;
}

/** All sessions across the library, newest first. */
export function allSessions(library: Library) {
  return Object.entries(library)
    .flatMap(([bookId, e]) => (e.sessions ?? []).map((s) => ({ bookId, ...s })))
    .sort((a, b) => b.date - a.date);
}

/** Consecutive days (ending today or yesterday) with at least one session. */
export function readingStreak(library: Library) {
  const days = new Set(allSessions(library).map((s) => Math.floor(s.date / DAY)));
  let d = Math.floor(Date.now() / DAY);
  if (!days.has(d)) d -= 1;
  let n = 0;
  while (days.has(d)) {
    n++;
    d--;
  }
  return n;
}
