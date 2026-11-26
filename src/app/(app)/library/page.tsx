"use client";

import Link from "next/link";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import { type Shelf, shelfLabels, useLibrary } from "@/components/library-store";
import { Stars } from "@/components/stars";
import { PageTitle } from "@/components/ui";
import { getBook } from "@/lib/mock-data";

const order: Shelf[] = ["reading", "want", "read", "abandoned"];

export default function Library() {
  const { library } = useLibrary();
  const [tab, setTab] = useState<Shelf>("reading");

  const count = (s: Shelf) => Object.values(library).filter((e) => e.shelf === s).length;
  const items = Object.entries(library)
    .filter(([, e]) => e.shelf === tab)
    .sort(([, a], [, b]) => b.updated - a.updated);

  return (
    <>
      <PageTitle>Library</PageTitle>

      <div role="tablist" aria-label="Shelves" className="no-scrollbar -mx-4 flex gap-1 overflow-x-auto border-b border-line px-4">
        {order.map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={tab === s}
            onClick={() => setTab(s)}
            className={`-mb-px h-11 shrink-0 border-b-2 px-3 text-sm ${
              tab === s ? "border-forest font-semibold text-forest" : "border-transparent text-ink-soft"
            }`}
          >
            {shelfLabels[s]} <span className="opacity-60">{count(s)}</span>
          </button>
        ))}
      </div>

      {items.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-ink-soft">Nothing here yet.</p>
          <Link href="/discover" className="mt-3 inline-block font-medium text-forest">
            Discover books
          </Link>
        </div>
      ) : (
        <ul role="tabpanel" className="divide-y divide-line">
          {items.map(([id, e]) => {
            const b = getBook(id);
            if (!b) return null;
            const pct = Math.round((e.page / b.pages) * 100);
            return (
              <li key={id}>
                <Link href={`/book/${id}`} className="flex gap-4 py-4">
                  <BookCover book={b} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-lg leading-snug">{b.title}</p>
                    <p className="text-sm text-ink-soft">{b.author}</p>
                    {tab === "reading" && (
                      <div className="mt-2 flex items-center gap-2">
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
                          <div className="h-full bg-forest" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-ink-soft">
                          {e.page}/{b.pages}
                        </span>
                      </div>
                    )}
                    {e.rating && <Stars value={e.rating} />}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}
