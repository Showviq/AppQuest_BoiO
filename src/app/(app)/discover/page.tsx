"use client";

import { Search, X } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BookCover } from "@/components/book-cover";
import { Stars } from "@/components/stars";
import { PageTitle } from "@/components/ui";
import { books, moods, searchBooks } from "@/lib/mock-data";

export default function Discover() {
  const [q, setQ] = useState("");
  const [mood, setMood] = useState<string | null>(null);

  const results = useMemo(() => {
    const base = q.trim() ? searchBooks(q) : [...books].sort((a, b) => b.ratings - a.ratings);
    return mood ? base.filter((b) => b.moods.includes(mood)) : base;
  }, [q, mood]);

  return (
    <>
      <PageTitle>Discover</PageTitle>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="বই, লেখক… Himu, Feluda"
          aria-label="Search books"
          className="h-12 w-full rounded-full border border-line bg-surface pl-11 pr-11 text-[16px]"
        />
        {q && (
          <button
            onClick={() => setQ("")}
            aria-label="Clear search"
            className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-ink-soft hover:bg-surface-2"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="no-scrollbar -mx-4 mt-4 flex gap-2 overflow-x-auto px-4" role="group" aria-label="Moods">
        {moods.map((m) => (
          <button
            key={m}
            onClick={() => setMood(mood === m ? null : m)}
            aria-pressed={mood === m}
            className={`h-9 shrink-0 rounded-full border px-4 text-sm ${
              mood === m ? "border-forest bg-forest text-on-forest" : "border-line bg-surface"
            }`}
          >
            {m}
          </button>
        ))}
      </div>

      {results.length === 0 ? (
        <p className="mt-16 text-center text-ink-soft">No books match “{q}”.</p>
      ) : (
        <ul className="mt-6 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
          {results.map((b) => (
            <li key={b.id}>
              <Link href={`/book/${b.id}`} className="block">
                <BookCover book={b} />
                <p className="mt-2 line-clamp-1 font-serif text-sm">{b.title}</p>
                <p className="line-clamp-1 text-xs text-ink-soft">{b.author}</p>
                <Stars value={b.rating} size={11} />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
