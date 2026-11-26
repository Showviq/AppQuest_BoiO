"use client";

import { Lock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import { useToast } from "@/components/toast";
import { PageTitle } from "@/components/ui";
import { getBook } from "@/lib/mock-data";
import { clubs } from "@/lib/mock/clubs";

export default function Clubs() {
  const [state, setState] = useState<Record<string, "joined" | "requested">>({ "classics-slowly": "joined" });
  const toast = useToast();

  const act = (id: string, name: string, privacy: string) => {
    const cur = state[id];
    const next = cur ? undefined : privacy === "Open" ? "joined" : "requested";
    setState((s) => {
      const n = { ...s };
      if (next) n[id] = next;
      else delete n[id];
      return n;
    });
    toast(next === "joined" ? `Joined ${name}` : next === "requested" ? "Request sent" : `Left ${name}`);
  };

  return (
    <>
      <PageTitle>Book clubs</PageTitle>
      <ul className="flex flex-col gap-3">
        {clubs.map((c) => {
          const b = getBook(c.bookId);
          const s = state[c.id];
          return (
            <li key={c.id} className="flex gap-4 rounded-2xl border border-line bg-surface p-4">
              <Link href={`/clubs/${c.id}`} className="shrink-0">
                {b && <BookCover book={b} size="sm" />}
              </Link>
              <div className="min-w-0 flex-1">
                <Link href={`/clubs/${c.id}`} className="font-medium hover:text-forest">
                  {c.name}
                </Link>
                <p className="flex items-center gap-1 text-sm text-ink-soft">
                  {c.privacy === "Request" && <Lock size={12} />} {c.members + (s === "joined" ? 1 : 0)} members
                </p>
                <p className="mt-1 text-sm">
                  Reading <span className="font-serif">{b?.title}</span>
                </p>
              </div>
              <button
                onClick={() => act(c.id, c.name, c.privacy)}
                aria-pressed={Boolean(s)}
                className={`h-9 self-center rounded-full px-4 text-sm font-semibold ${
                  s ? "border border-line text-ink-soft" : "bg-forest text-on-forest"
                }`}
              >
                {s === "joined" ? "Joined" : s === "requested" ? "Requested" : c.privacy === "Open" ? "Join" : "Request"}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
