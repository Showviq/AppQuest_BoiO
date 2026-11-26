"use client";

import { BookHeart, ChartPie, Filter, Heart, NotebookPen, Target } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import {
  type Ownership,
  type Shelf,
  ownershipLabels,
  shelfLabels,
  shelfOrder,
  useLibrary,
} from "@/components/library-store";
import { Sheet } from "@/components/sheet";
import { Stars } from "@/components/stars";
import { PageTitle, Progress, Tabs } from "@/components/ui";
import { getBook } from "@/lib/mock-data";

const tools = [
  { href: "/diary", label: "Diary", icon: NotebookPen },
  { href: "/goals", label: "Goals", icon: Target },
  { href: "/stats", label: "Stats", icon: ChartPie },
  { href: "/shelves", label: "Shelves", icon: BookHeart },
];

export default function Library() {
  const { library } = useLibrary();
  const [tab, setTab] = useState<Shelf>("reading");
  const [own, setOwn] = useState<Ownership | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const count = (s: Shelf) => Object.values(library).filter((e) => e.shelf === s).length;
  const items = Object.entries(library)
    .filter(([, e]) => e.shelf === tab && (!own || e[own]))
    .sort(([, a], [, b]) => b.updated - a.updated);

  return (
    <>
      <PageTitle
        action={
          <button
            onClick={() => setFilterOpen(true)}
            aria-label="Filter"
            className={`relative grid size-11 place-items-center rounded-full hover:bg-surface-2 ${own ? "text-forest" : ""}`}
          >
            <Filter size={20} />
            {own && <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-gold" aria-hidden />}
          </button>
        }
      >
        Library
      </PageTitle>

      <ul className="mb-5 grid grid-cols-4 gap-2">
        {tools.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link href={href} className="flex flex-col items-center gap-1 rounded-2xl border border-line bg-surface py-3 text-xs">
              <Icon size={20} className="text-forest" />
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <Tabs
        label="Shelves"
        value={tab}
        onChange={setTab}
        tabs={shelfOrder.map((s) => ({
          id: s,
          label: (
            <>
              {shelfLabels[s]} <span className="opacity-60">{count(s)}</span>
            </>
          ),
        }))}
      />

      {own && (
        <button onClick={() => setOwn(null)} className="mb-2 rounded-full bg-forest-soft px-3 py-1 text-xs text-forest">
          {ownershipLabels[own]} ✕
        </button>
      )}

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
            const flags = (Object.keys(ownershipLabels) as Ownership[]).filter((k) => e[k]);
            return (
              <li key={id}>
                <Link href={`/book/${id}`} className="flex gap-4 py-4">
                  <BookCover book={b} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="flex items-center gap-1.5 font-serif text-lg leading-snug">
                      {b.title}
                      {e.favourite && <Heart size={14} className="text-danger" fill="currentColor" aria-label="Favourite" />}
                    </p>
                    <p className="text-sm text-ink-soft">{b.author}</p>
                    {(tab === "reading" || tab === "rereading" || tab === "onhold") && (
                      <div className="mt-2 flex items-center gap-2">
                        <Progress value={pct} className="flex-1" />
                        <span className="text-xs text-ink-soft">
                          {e.page}/{b.pages}
                        </span>
                      </div>
                    )}
                    {e.rating && <Stars value={e.rating} />}
                    {flags.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {flags.map((k) => (
                          <span key={k} className="rounded-full bg-surface-2 px-2 py-0.5 text-[11px] text-ink-soft">
                            {ownershipLabels[k]}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}

      <Sheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Ownership">
        <ul className="flex flex-col gap-1">
          {([null, ...Object.keys(ownershipLabels)] as (Ownership | null)[]).map((k) => (
            <li key={k ?? "all"}>
              <button
                onClick={() => {
                  setOwn(k);
                  setFilterOpen(false);
                }}
                className="flex h-12 w-full items-center justify-between rounded-xl px-3 text-left hover:bg-surface-2"
              >
                {k ? ownershipLabels[k] : "All"}
                {own === k && <span className="size-2 rounded-full bg-forest" />}
              </button>
            </li>
          ))}
        </ul>
      </Sheet>
    </>
  );
}
