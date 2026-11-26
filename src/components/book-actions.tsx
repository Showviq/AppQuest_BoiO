"use client";

import { Check } from "lucide-react";
import { useState } from "react";
import { type Shelf, shelfLabels, useLibrary } from "@/components/library-store";
import { Sheet } from "@/components/sheet";
import { StarInput } from "@/components/stars";
import { useToast } from "@/components/toast";
import { Button } from "@/components/ui";
import type { Book } from "@/lib/mock-data";

export function ShelfSheet({ book, open, onClose }: { book: Book; open: boolean; onClose: () => void }) {
  const { library, set, remove } = useLibrary();
  const toast = useToast();
  const current = library[book.id]?.shelf;

  return (
    <Sheet open={open} onClose={onClose} title="Add to shelf">
      <ul className="flex flex-col gap-1">
        {(Object.keys(shelfLabels) as Shelf[]).map((s) => (
          <li key={s}>
            <button
              onClick={() => {
                set(book.id, { shelf: s, page: s === "read" ? book.pages : library[book.id]?.page ?? 0 });
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
      )}
    </Sheet>
  );
}

export function ProgressSheet({ book, open, onClose }: { book: Book; open: boolean; onClose: () => void }) {
  const { library, set } = useLibrary();
  const toast = useToast();
  const [page, setPage] = useState(library[book.id]?.page ?? 0);

  return (
    <Sheet open={open} onClose={onClose} title={book.title}>
      <label className="block text-sm text-ink-soft" htmlFor="page">
        Page
      </label>
      <div className="mt-1 flex items-baseline gap-2">
        <input
          id="page"
          type="number"
          inputMode="numeric"
          min={0}
          max={book.pages}
          value={page}
          onChange={(e) => setPage(Math.max(0, Math.min(book.pages, Number(e.target.value) || 0)))}
          className="w-28 rounded-xl border border-line bg-bg px-3 py-2 text-2xl font-semibold"
        />
        <span className="text-ink-soft">/ {book.pages}</span>
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
      <Button
        className="mt-5 w-full"
        onClick={() => {
          const done = page >= book.pages;
          set(book.id, { page, shelf: done ? "read" : "reading" });
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
  const [review, setReview] = useState(library[book.id]?.review ?? "");

  return (
    <Sheet open={open} onClose={onClose} title="Rate">
      <StarInput value={rating} onChange={setRating} />
      <p className="mt-2 text-center text-sm text-ink-soft">{rating ? `${rating} / 5` : " "}</p>
      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        maxLength={500}
        rows={3}
        placeholder="Short review (optional)"
        className="mt-3 w-full resize-none rounded-xl border border-line bg-bg p-3"
      />
      <Button
        className="mt-4 w-full"
        disabled={!rating}
        onClick={() => {
          set(book.id, {
            rating,
            review: review.trim() || undefined,
            shelf: library[book.id]?.shelf ?? "read",
            page: library[book.id]?.page ?? book.pages,
          });
          toast("Rating saved");
          onClose();
        }}
      >
        Save
      </Button>
    </Sheet>
  );
}
