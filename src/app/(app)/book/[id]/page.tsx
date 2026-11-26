"use client";

import { ArrowLeft, BookmarkPlus, Check, Coins, Drama, Headphones, PenLine, Quote, Star } from "lucide-react";
import Link from "next/link";
import { notFound, useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { ProgressSheet, RateSheet, ShelfSheet } from "@/components/book-actions";
import { BookCover } from "@/components/book-cover";
import { shelfLabels, useLibrary } from "@/components/library-store";
import { Sheet } from "@/components/sheet";
import { BookDiscussion } from "@/components/social/book-discussion";
import { BookPosts } from "@/components/social/book-posts";
import { Stars } from "@/components/stars";
import { Accordion, Button } from "@/components/ui";
import { feed, getBook } from "@/lib/mock-data";

export default function BookPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const book = getBook(id);
  const { library } = useLibrary();
  const [sheet, setSheet] = useState<"shelf" | "rate" | "progress" | "tip" | null>(null);
  if (!book) notFound();

  const entry = library[book.id];
  const reviews = feed.filter((f) => f.bookId === book.id && f.text);

  return (
    <>
      <button
        onClick={() => router.back()}
        aria-label="Back"
        className="-ml-2 mb-2 grid size-11 place-items-center rounded-full hover:bg-surface-2"
      >
        <ArrowLeft size={22} />
      </button>

      <div className="flex flex-col items-center text-center">
        <BookCover book={book} size="lg" />
        <h1 className="mt-5 font-serif text-3xl leading-tight">{book.title}</h1>
        <p className="text-ink-soft">{book.titleAlt}</p>
        <p className="mt-1 font-medium">{book.author}</p>
        <div className="mt-2 flex items-center gap-2 text-sm">
          <Stars value={book.rating} />
          <span>{book.rating.toFixed(1)}</span>
          <span className="text-ink-soft">({book.ratings.toLocaleString()})</span>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button onClick={() => setSheet("shelf")}>
          {entry ? <Check size={18} /> : <BookmarkPlus size={18} />}
          {entry ? shelfLabels[entry.shelf] : "Add to shelf"}
        </Button>
        <Button variant="outline" onClick={() => setSheet("rate")}>
          <Star size={18} />
          {entry?.rating ? `${entry.rating}` : "Rate"}
        </Button>
      </div>
      {entry?.shelf === "reading" && (
        <button onClick={() => setSheet("progress")} className="mt-3 w-full text-sm text-forest">
          Page {entry.page} of {book.pages} · Update
        </button>
      )}

      <ul className="mt-5 grid grid-cols-4 gap-2 text-center text-xs">
        {[
          { href: `/review/${book.id}`, label: "Review", icon: PenLine },
          { href: `/quote?book=${book.id}`, label: "Quote card", icon: Quote },
          { href: `/audio/${book.id}`, label: "Listen", icon: Headphones },
          { href: "/characters", label: "Characters", icon: Drama },
        ].map(({ href, label, icon: Icon }) => (
          <li key={label}>
            <Link href={href} className="flex flex-col items-center gap-1 rounded-2xl py-2 hover:bg-surface-2">
              <span className="grid size-11 place-items-center rounded-full border border-line bg-surface text-forest">
                <Icon size={18} />
              </span>
              {label}
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-2xl border border-line bg-surface px-4">
        <Accordion title="About" defaultOpen>
          <p className="font-serif text-ink">{book.blurb}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {[...book.genres, ...book.moods].map((g) => (
              <span key={g} className="rounded-full bg-surface-2 px-3 py-1 text-xs">
                {g}
              </span>
            ))}
          </div>
        </Accordion>
        <Accordion title="Details">
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
            <dt>Published</dt>
            <dd className="text-ink">{book.year}</dd>
            <dt>Pages</dt>
            <dd className="text-ink">{book.pages}</dd>
            <dt>Language</dt>
            <dd className="text-ink">{book.lang === "bn" ? "Bangla" : "English"}</dd>
          </dl>
        </Accordion>
        <Accordion title="Reviews" meta={reviews.length || undefined}>
          {reviews.length === 0 ? (
            <button onClick={() => setSheet("rate")} className="text-forest">
              Write the first review
            </button>
          ) : (
            <ul className="flex flex-col gap-3">
              {reviews.map((r) => (
                <li key={r.id}>
                  <b className="text-ink">{r.user}</b> {r.rating && <Stars value={r.rating} size={12} />}
                  <p className={r.spoiler ? "blur-sm hover:blur-none" : ""}>{r.text}</p>
                </li>
              ))}
            </ul>
          )}
        </Accordion>
        <Accordion title="Author">
          <div className="flex items-center justify-between gap-3">
            <span className="text-ink">{book.authorAlt}</span>
            <Button variant="outline" className="min-h-9 px-4 text-sm" onClick={() => setSheet("tip")}>
              <Coins size={16} /> Tip
            </Button>
          </div>
        </Accordion>
      </div>

      <BookDiscussion />

      <BookPosts bookId={book.id} />

      <ShelfSheet book={book} open={sheet === "shelf"} onClose={() => setSheet(null)} />
      {sheet === "rate" && <RateSheet book={book} open onClose={() => setSheet(null)} />}
      {sheet === "progress" && <ProgressSheet book={book} open onClose={() => setSheet(null)} />}

      <Sheet open={sheet === "tip"} onClose={() => setSheet(null)} title="Tip the author">
        <div className="grid grid-cols-3 gap-3">
          {[2, 5, 10].map((a) => (
            <button key={a} disabled className="h-14 rounded-2xl border border-line text-lg font-semibold opacity-60">
              ৳{a}
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-ink-soft">Paid from mobile balance. Coming soon.</p>
      </Sheet>
    </>
  );
}
