"use client";

import { BadgeCheck, CalendarClock, Coins, Heart } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import { Sheet } from "@/components/sheet";
import { Stars } from "@/components/stars";
import { useToast } from "@/components/toast";
import { Accordion, Avatar, BackButton, Button, Tabs } from "@/components/ui";
import { getBook } from "@/lib/mock-data";
import { getAuthor } from "@/lib/mock/pro";

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : String(n));
type Tab = "posts" | "books" | "upcoming";

export default function AuthorPage() {
  const { id } = useParams<{ id: string }>();
  const a = getAuthor(id);
  const toast = useToast();
  const [following, setFollowing] = useState(false);
  const [tab, setTab] = useState<Tab>("posts");
  const [tip, setTip] = useState(false);
  if (!a) notFound();

  return (
    <>
      <BackButton />

      <div className="flex items-center gap-4">
        <Avatar name={a.nameAlt} size="lg" />
        <div className="min-w-0">
          <h1 className="flex items-center gap-1.5 font-serif text-2xl leading-tight">
            {a.name} <BadgeCheck size={20} className="shrink-0 text-forest" aria-label="Verified author" />
          </h1>
          <p className="text-ink-soft">{a.nameAlt}</p>
          <p className="text-sm text-ink-soft">
            {fmt(a.followers + (following ? 1 : 0))} followers · {a.books.length} books
          </p>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">
        <Button
          variant={following ? "outline" : "primary"}
          onClick={() => {
            setFollowing(!following);
            toast(following ? "Unfollowed" : `Following ${a.nameAlt}`);
          }}
        >
          {following ? "Following" : "Follow"}
        </Button>
        <Button variant="outline" onClick={() => setTip(true)}>
          <Coins size={18} /> Tip
        </Button>
      </div>

      <div className="mt-5 rounded-2xl border border-line bg-surface px-4">
        <Accordion title="Official bio">
          <p>{a.bio}</p>
          <p className="mt-2 text-sm">{a.born}</p>
        </Accordion>
      </div>

      <div className="mt-5">
        <Tabs
          tabs={[
            { id: "posts", label: "Posts" },
            { id: "books", label: "Books" },
            { id: "upcoming", label: "Upcoming" },
          ]}
          value={tab}
          onChange={setTab}
          label="Author"
        />
      </div>

      {tab === "posts" && (
        <ul className="divide-y divide-line">
          {a.posts.map((p) => (
            <li key={p.text} className="py-4">
              <p className="flex items-center gap-1 text-sm font-medium">
                {a.nameAlt} <BadgeCheck size={14} className="text-forest" /> <span className="font-normal text-ink-soft">· {p.ago}</span>
              </p>
              <p className="mt-1 text-[15px] leading-relaxed">{p.text}</p>
              <p className="mt-2 flex items-center gap-1 text-sm text-ink-soft">
                <Heart size={15} /> {p.likes.toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}

      {tab === "books" && (
        <ul className="grid grid-cols-3 gap-4">
          {a.books.map((bid) => {
            const b = getBook(bid);
            return (
              b && (
                <li key={bid}>
                  <Link href={`/book/${bid}`}>
                    <BookCover book={b} />
                    <p className="mt-2 line-clamp-1 font-serif text-sm">{b.title}</p>
                    <Stars value={b.rating} size={11} />
                  </Link>
                </li>
              )
            );
          })}
        </ul>
      )}

      {tab === "upcoming" && (
        <ol className="relative ml-3 border-l-2 border-line">
          {a.upcoming.map((u) => (
            <li key={u.title} className="mb-6 ml-5">
              <span className="absolute -left-[9px] mt-1 size-4 rounded-full border-2 border-surface bg-gold" aria-hidden />
              <p className="flex items-center gap-1 text-sm font-semibold text-forest">
                <CalendarClock size={14} /> {u.date}
              </p>
              <p className="font-medium">{u.title}</p>
              <p className="text-sm text-ink-soft">{u.note}</p>
            </li>
          ))}
        </ol>
      )}

      <Sheet open={tip} onClose={() => setTip(false)} title={`Tip ${a.nameAlt}`}>
        <div className="grid grid-cols-3 gap-3">
          {[2, 5, 10].map((v) => (
            <button key={v} disabled className="h-14 rounded-2xl border border-line text-lg font-semibold opacity-60">
              ৳{v}
            </button>
          ))}
        </div>
        <p className="mt-4 text-center text-sm text-ink-soft">Coming soon</p>
      </Sheet>
    </>
  );
}
