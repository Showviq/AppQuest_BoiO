"use client";

import { Bell, LayoutGrid, MapPin, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import { ProgressSheet } from "@/components/book-actions";
import { useLibrary } from "@/components/library-store";
import { Sheet } from "@/components/sheet";
import { useMyPosts } from "@/components/social/my-posts";
import { PostCard } from "@/components/social/post-card";
import { SectionHead, Tabs, Rail } from "@/components/ui";
import { type Book, getBook } from "@/lib/mock-data";
import { posts } from "@/lib/mock/social";

type FeedTab = "foryou" | "following" | "trending" | "latest";
const feedTabs = [
  { id: "foryou", label: "For You" },
  { id: "following", label: "Following" },
  { id: "trending", label: "Trending" },
  { id: "latest", label: "Latest" },
] as const;

export default function Home() {
  const { library } = useLibrary();
  const [progressFor, setProgressFor] = useState<Book | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [tab, setTab] = useState<FeedTab>("foryou");
  const { posts: mine } = useMyPosts();
  // Your own posts lead your feed. Community posts live in the community; "Latest" is public only.
  const ownInTab = mine.filter(
    (p) => p.audience !== "community" && (tab === "foryou" || tab === "following" || (tab === "latest" && p.audience === "public"))
  );
  const feed = [...ownInTab, ...posts.filter((p) => p.feeds.includes(tab))];

  const reading = Object.entries(library)
    .filter(([, e]) => e.shelf === "reading")
    .sort(([, a], [, b]) => b.updated - a.updated)
    .map(([id, e]) => ({ book: getBook(id), entry: e }))
    .filter((x): x is { book: Book; entry: (typeof library)[string] } => Boolean(x.book));

  return (
    <>
      <header className="mb-6 flex items-center justify-between">
        <span className="font-serif text-3xl text-forest lg:invisible">Boi-O</span>
        <div className="flex items-center">
          <button
            onClick={() => setNotifOpen(true)}
            aria-label="Notifications"
            className="relative grid size-11 place-items-center rounded-full hover:bg-surface-2"
          >
            <Bell size={22} />
            <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-gold" aria-hidden />
          </button>
          <Link href="/more" aria-label="More" className="grid size-11 place-items-center rounded-full hover:bg-surface-2">
            <LayoutGrid size={22} />
          </Link>
        </div>
      </header>

      <section aria-label="Continue reading" className="mb-8">
        <SectionHead title="Reading" href="/library" />
        {reading.length === 0 ? (
          <Link href="/discover" className="block rounded-2xl border border-dashed border-line p-6 text-center text-ink-soft">
            Find your next book
          </Link>
        ) : (
          <Rail className="gap-4 pb-3 pt-1">
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
          </Rail>
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
        <Tabs label="Feed" tabs={feedTabs} value={tab} onChange={setTab} />
        <ul key={tab} className="stagger flex flex-col divide-y divide-line">
          {feed.map((p) => (
            <li key={p.id}>
              <PostCard post={p} />
            </li>
          ))}
        </ul>
      </section>

      <Link
        href="/compose"
        aria-label="New post"
        className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] right-4 z-30 grid size-14 place-items-center rounded-full bg-forest text-on-forest shadow-lg lg:bottom-8 lg:right-8"
      >
        <Plus size={26} />
      </Link>

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
