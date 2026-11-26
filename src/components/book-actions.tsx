"use client";

import { Check, Heart, PenLine } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import {
  type Ownership,
  type Shelf,
  ownershipLabels,
  shelfLabels,
  shelfOrder,
  useLibrary,
} from "@/components/library-store";
import { Sheet } from "@/components/sheet";
import { StarInput } from "@/components/stars";
import { useToast } from "@/components/toast";
import { Button, Switch } from "@/components/ui";
import type { Book } from "@/lib/mock-data";

export function ShelfSheet({ book, open, onClose }: { book: Book; open: boolean; onClose: () => void }) {
  const { library, set, remove } = useLibrary();
  const toast = useToast();
  const entry = library[book.id];
  const current = entry?.shelf;

  return (
    <Sheet open={open} onClose={onClose} title="Add to shelf">
      <ul className="flex flex-col gap-1">
        {shelfOrder.map((s: Shelf) => (
          <li key={s}>
            <button
              onClick={() => {
                set(book.id, { shelf: s, page: s === "read" ? book.pages : entry?.page ?? 0 });
                toast(`Added to ${shelfLabels[s]}`);
                onClose();
              }}
              className="flex h-12 w-full items-center justify-between rounded-xl px-3 text-left hover:bg-surface-2"
            >
              {shelfLabels[s]}
              {current === s && <Check size={18} className="text-forest" />}
            </button>
          </li>
        ))}
      </ul>
      {current && (
        <>
          <div className="mt-3 border-t border-line pt-2">
            {(Object.keys(ownershipLabels) as Ownership[]).map((k) => (
              <Switch
                key={k}
                label={ownershipLabels[k]}
                checked={Boolean(entry?.[k])}
                onChange={(v) => set(book.id, { [k]: v })}
              />
            ))}
          </div>
          <Button
            variant="ghost"
            className="mt-2 w-full text-danger"
            onClick={() => {
              remove(book.id);
              toast("Removed from library");
              onClose();
            }}
          >
            Remove from library
          </Button>
        </>
      )}
    </Sheet>
  );
}

export function ProgressSheet({ book, open, onClose }: { book: Book; open: boolean; onClose: () => void }) {
  const { library, set, logSession } = useLibrary();
  const toast = useToast();
  const start = library[book.id]?.page ?? 0;
  const [page, setPage] = useState(start);
  const [mode, setMode] = useState<"page" | "pct">("page");
  const [minutes, setMinutes] = useState(20);
  const pct = Math.round((page / book.pages) * 100);

  const setFromInput = (v: number) =>
    setPage(
      mode === "page"
        ? Math.max(0, Math.min(book.pages, v))
        : Math.round((Math.max(0, Math.min(100, v)) / 100) * book.pages)
    );

  return (
    <Sheet open={open} onClose={onClose} title={book.title}>
      <div role="radiogroup" aria-label="Unit" className="mb-3 grid grid-cols-2 gap-1 rounded-full bg-surface-2 p-1 text-sm">
        {(["page", "pct"] as const).map((m) => (
          <button
            key={m}
            role="radio"
            aria-checked={mode === m}
            onClick={() => setMode(m)}
            className={`h-9 rounded-full ${mode === m ? "bg-surface font-semibold shadow-sm" : "text-ink-soft"}`}
          >
            {m === "page" ? "Page" : "%"}
          </button>
        ))}
      </div>
      <div className="flex items-baseline gap-2">
        <input
          id="page"
          type="number"
          inputMode="numeric"
          aria-label={mode === "page" ? "Page" : "Percent"}
          min={0}
          max={mode === "page" ? book.pages : 100}
          value={mode === "page" ? page : pct}
          onChange={(e) => setFromInput(Number(e.target.value) || 0)}
          className="w-28 rounded-xl border border-line bg-bg px-3 py-2 text-2xl font-semibold"
        />
        <span className="text-ink-soft">{mode === "page" ? `/ ${book.pages}` : `% · p. ${page}`}</span>
      </div>
      <input
        type="range"
        min={0}
        max={book.pages}
        value={page}
        onChange={(e) => setPage(Number(e.target.value))}
        className="mt-4 w-full accent-[var(--forest)]"
        aria-label="Progress"
      />
      <label className="mt-4 flex items-center justify-between text-sm">
        <span className="text-ink-soft">Minutes read</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          value={minutes}
          onChange={(e) => setMinutes(Math.max(0, Number(e.target.value) || 0))}
          className="w-20 rounded-xl border border-line bg-bg px-3 py-1.5 text-right"
        />
      </label>
      <Button
        className="mt-5 w-full"
        onClick={() => {
          const done = page >= book.pages;
          set(book.id, { page, shelf: done ? "read" : "reading" });
          if (page > start) logSession(book.id, { date: Date.now(), pages: page - start, minutes });
          toast(done ? "Marked as read" : "Progress saved");
          onClose();
        }}
      >
        Save
      </Button>
    </Sheet>
  );
}

export function RateSheet({ book, open, onClose }: { book: Book; open: boolean; onClose: () => void }) {
  const { library, set } = useLibrary();
  const toast = useToast();
  const [rating, setRating] = useState(library[book.id]?.rating ?? 0);
  const [fav, setFav] = useState(Boolean(library[book.id]?.favourite));
  const [review, setReview] = useState(library[book.id]?.review ?? "");

  return (
    <Sheet open={open} onClose={onClose} title="Rate">
      <StarInput value={rating} onChange={setRating} />
      <div className="mt-2 flex items-center justify-center gap-3 text-sm text-ink-soft">
        <span>{rating ? `${rating} / 5` : "—"}</span>
        <button
          onClick={() => setFav((f) => !f)}
          aria-pressed={fav}
          aria-label="Favourite"
          className={`grid size-10 place-items-center rounded-full hover:bg-surface-2 ${fav ? "text-danger" : ""}`}
        >
          <Heart size={22} fill={fav ? "currentColor" : "none"} />
        </button>
      </div>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        maxLength={500}
        rows={3}
        placeholder="Short review (optional)"
        className="mt-3 w-full resize-none rounded-xl border border-line bg-bg p-3"
      />
      <Link href={`/review/${book.id}`} className="mt-1 inline-flex items-center gap-1 text-sm text-forest">
        <PenLine size={14} /> Full editor
      </Link>
      <Button
        className="mt-4 w-full"
        disabled={!rating && !fav}
        onClick={() => {
          set(book.id, {
            rating: rating || undefined,
            favourite: fav,
            review: review.trim() || undefined,
            shelf: library[book.id]?.shelf ?? "read",
            page: library[book.id]?.page ?? book.pages,
          });
          toast("Saved");
          onClose();
        }}
      >
        Save
      </Button>
    </Sheet>
  );
}
