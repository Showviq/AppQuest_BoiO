"use client";

import Link from "next/link";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import { Sheet } from "@/components/sheet";
import { Stars } from "@/components/stars";
import { BackButton, PageTitle } from "@/components/ui";
import { type MoodCard, moodCards } from "@/lib/mock/discovery";
import { books } from "@/lib/mock-data";

const booksFor = (m: MoodCard) => books.filter((b) => b.moods.includes(m.id)).sort((a, b) => b.rating - a.rating);

export default function Moods() {
  const [open, setOpen] = useState<MoodCard | null>(null);

  return (
    <>
      <BackButton />
      <PageTitle>Moods</PageTitle>

      <ul className="grid grid-cols-2 gap-3">
        {moodCards.map((m) => {
          const list = booksFor(m);
          return (
            <li key={m.id}>
              <button
                onClick={() => setOpen(m)}
                className="relative flex h-40 w-full flex-col justify-between overflow-hidden rounded-2xl p-4 text-left"
                style={{ background: m.bg, color: m.fg }}
              >
                <span className="text-3xl" aria-hidden>
                  {m.emoji}
                </span>
                <span>
                  <span className="block font-serif text-lg leading-tight">{m.label}</span>
                  <span className="text-xs opacity-80">
                    {m.bn} · {list.length}
                  </span>
                </span>
                {/* fanned covers */}
                <span className="pointer-events-none absolute -right-3 top-3 flex rotate-12 opacity-90" aria-hidden>
                  {list.slice(0, 2).map((b, i) => (
                    <span key={b.id} className={i ? "-ml-6" : ""}>
                      <BookCover book={b} size="sm" />
                    </span>
                  ))}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <Sheet open={!!open} onClose={() => setOpen(null)} title={open ? `${open.emoji} ${open.label}` : ""}>
        {open && (
          <>
            <p className="-mt-2 mb-3 text-sm text-ink-soft">{open.blurb}</p>
            <ul className="divide-y divide-line">
              {booksFor(open).map((b) => (
                <li key={b.id}>
                  <Link href={`/book/${b.id}`} className="flex gap-3 py-3">
                    <BookCover book={b} size="sm" />
                    <div className="min-w-0">
                      <p className="font-serif text-lg leading-snug">{b.title}</p>
                      <p className="text-sm text-ink-soft">{b.author}</p>
                      <Stars value={b.rating} size={12} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </Sheet>
    </>
  );
}
