"use client";

import { Bell, Heart, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import { ProgressSheet } from "@/components/book-actions";
import { useLibrary } from "@/components/library-store";
import { Sheet } from "@/components/sheet";
import { Stars } from "@/components/stars";
import { SectionHead } from "@/components/ui";
import { type Book, type FeedItem, feed, getBook } from "@/lib/mock-data";

export default function Home() {
  const { library } = useLibrary();
  const [progressFor, setProgressFor] = useState<Book | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);

  const reading = Object.entries(library)
    .filter(([, e]) => e.shelf === "reading")
    .sort(([, a], [, b]) => b.updated - a.updated)
    .map(([id, e]) => ({ book: getBook(id), entry: e }))
    .filter((x): x is { book: Book; entry: (typeof library)[string] } => Boolean(x.book));

  return (
    <>
      <header className="mb-6 flex items-center justify-between">
        <span className="font-serif text-3xl text-forest lg:invisible">Boi-O</span>
        <button
          onClick={() => setNotifOpen(true)}
          aria-label="Notifications"
          className="relative grid size-11 place-items-center rounded-full hover:bg-surface-2"
        >
          <Bell size={22} />
          <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-gold" aria-hidden />
        </button>
      </header>

      <section aria-label="Continue reading" className="mb-8">
        <SectionHead title="Reading" href="/library" />
        {reading.length === 0 ? (
          <Link href="/discover" className="block rounded-2xl border border-dashed border-line p-6 text-center text-ink-soft">
            Find your next book
          </Link>
        ) : (
          <ul className="no-scrollbar -mx-4 flex gap-4 overflow-x-auto px-4 pb-2">
            {reading.map(({ book, entry }) => {
              const pct = Math.round((entry.page / book.pages) * 100);
              return (
                <li key={book.id} className="w-28 shrink-0">
                  <button onClick={() => setProgressFor(book)} className="text-left" aria-label={`Update progress: ${book.title}`}>
                    <BookCover book={book} />
                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-surface-2">
                      <div className="h-full bg-forest" style={{ width: `${pct}%` }} />
                    </div>
                    <p className="mt-1 text-xs text-ink-soft">{pct}%</p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <Link
        href="/boimela"
        className="mb-8 flex items-center gap-3 rounded-2xl bg-forest px-4 py-3 text-on-forest"
      >
        <MapPin size={20} />
        <span className="font-medium">Boi Mela 2027</span>
        <span className="ml-auto text-sm opacity-80">Find stalls</span>
      </Link>

      <section aria-label="Feed">
        <SectionHead title="From readers you follow" />
        <ul className="flex flex-col divide-y divide-line">
          {feed.map((item) => (
            <FeedRow key={item.id} item={item} />
          ))}
        </ul>
      </section>

      {progressFor && (
        <ProgressSheet book={progressFor} open onClose={() => setProgressFor(null)} />
      )}

      <Sheet open={notifOpen} onClose={() => setNotifOpen(false)} title="Notifications">
        <ul className="flex flex-col gap-3 text-[15px]">
          <li><b>Nusrat</b> liked your rating of সোনার কেল্লা</li>
          <li><b>Tanvir</b> started following you</li>
          <li>7-day reading streak</li>
        </ul>
      </Sheet>
    </>
  );
}

function FeedRow({ item }: { item: FeedItem }) {
  const book = getBook(item.bookId);
  const [liked, setLiked] = useState(false);
  const [reveal, setReveal] = useState(false);
  if (!book) return null;
  const action = { review: "rated", finished: "finished", started: "started" }[item.kind];

  return (
    <li className="flex gap-3 py-4">
      <Link href={`/book/${book.id}`} className="shrink-0">
        <BookCover book={book} size="sm" />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="text-[15px]">
          <b>{item.user}</b> <span className="text-ink-soft">{action}</span>{" "}
          <Link href={`/book/${book.id}`} className="font-serif">
            {book.title}
          </Link>
        </p>
        {item.rating && <Stars value={item.rating} />}
        {item.text &&
          (item.spoiler && !reveal ? (
            <button onClick={() => setReveal(true)} className="mt-1 rounded-lg bg-surface-2 px-3 py-1.5 text-sm text-ink-soft">
              Spoiler · tap to show
            </button>
          ) : (
            <p className="mt-1 text-[15px] leading-relaxed">{item.text}</p>
          ))}
        <div className="mt-2 flex items-center gap-4 text-sm text-ink-soft">
          <button
            onClick={() => setLiked((l) => !l)}
            aria-pressed={liked}
            className={`flex items-center gap-1 ${liked ? "text-danger" : ""}`}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
            {item.likes + (liked ? 1 : 0)}
          </button>
          <span>{item.ago}</span>
        </div>
      </div>
    </li>
  );
}
