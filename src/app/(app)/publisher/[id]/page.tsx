"use client";

import { BadgeCheck, Check, MapPin, Share2, Ticket } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import { Stars } from "@/components/stars";
import { useToast } from "@/components/toast";
import { BackButton, Button, Hero, Rail, SectionHead, Stat } from "@/components/ui";
import { getBook } from "@/lib/mock-data";
import { getPublisher, publishers } from "@/lib/mock/market";

const k = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

export default function Storefront() {
  const { id } = useParams<{ id: string }>();
  const p = getPublisher(id);
  const toast = useToast();
  const [following, setFollowing] = useState(false);
  const [claimed, setClaimed] = useState<string[]>([]);
  if (!p) notFound();
  const titles = new Set(p.sections.flatMap((s) => s.bookIds)).size;

  return (
    <>
      <BackButton href="/more" />
      <Hero
        background={`linear-gradient(120deg, ${p.color}, color-mix(in oklab, ${p.color} 70%, #000))`}
        banner={<p className="absolute right-4 top-3 font-serif text-3xl text-white/30">{p.nameAlt}</p>}
        avatar={
          <span
            className="grid size-20 place-items-center rounded-2xl font-serif text-3xl text-white shadow-lg ring-4 ring-bg"
            style={{ background: p.color }}
            aria-hidden
          >
            {[...p.name][0]}
          </span>
        }
        actions={
          <>
            <button
              onClick={() => toast("Link copied")}
              aria-label="Share"
              className="grid size-11 place-items-center rounded-full border border-line bg-surface hover:bg-surface-2"
            >
              <Share2 size={18} />
            </button>
            <Button
              variant={following ? "outline" : "primary"}
              onClick={() => { setFollowing((f) => !f); toast(following ? "Unfollowed" : `Following ${p.name}`); }}
              aria-pressed={following}
            >
              {following ? "Following" : "Follow"}
            </Button>
          </>
        }
      />

      <h1 className="mt-3 flex items-center gap-2 font-serif text-3xl">
        {p.name} <BadgeCheck size={22} className="text-forest" aria-label="Verified publisher" />
      </h1>
      <p className="text-ink-soft">
        {p.nameAlt} · Since {p.since}
      </p>

      <div className="mt-4 grid grid-cols-3 rounded-2xl border border-line bg-surface py-4">
        <Stat value={k(p.followers + (following ? 1 : 0))} label="Followers" />
        <Stat value={titles} label="Titles" />
        <Stat value={p.promos.length} label="Offers" />
      </div>

      <Link href="/boimela" className="mt-4 flex items-center gap-3 rounded-2xl px-4 py-3 text-white" style={{ background: p.color }}>
        <MapPin size={20} />
        <span className="font-medium">Boi Mela · {p.stall}</span>
        <span className="ml-auto text-sm opacity-80">Map</span>
      </Link>

      <section className="mt-7" aria-label="Offers">
        <SectionHead title="Offers" />
        <Rail className="gap-3 pb-3 pt-1" label="Offers">
          {p.promos.map((pr) => {
            const on = claimed.includes(pr.title);
            return (
              <li key={pr.title} className="w-[78%] max-w-72 shrink-0">
                <button
                  onClick={() => {
                    setClaimed((c) => (on ? c.filter((x) => x !== pr.title) : [...c, pr.title]));
                    toast(on ? "Offer removed" : "Offer saved · show it at the stall");
                  }}
                  aria-pressed={on}
                  className="relative flex h-32 w-full flex-col justify-end overflow-hidden rounded-2xl p-4 text-left text-white shadow-[0_8px_20px_-12px_rgba(0,0,0,.6)]"
                  style={{ background: `linear-gradient(135deg, ${pr.tint}, ${p.color})` }}
                >
                  <span className="hero-sheen absolute inset-0" aria-hidden />
                  <span
                    className={`absolute right-3 top-3 flex h-7 items-center gap-1 rounded-full px-2.5 text-xs font-semibold ${
                      on ? "bg-white text-ink" : "bg-white/20 backdrop-blur"
                    }`}
                  >
                    {on ? <Check size={14} className="pop" /> : <Ticket size={14} />} {on ? "Saved" : "Save"}
                  </span>
                  <span className="relative font-serif text-2xl">{pr.title}</span>
                  <span className="relative text-sm opacity-90">{pr.sub}</span>
                </button>
              </li>
            );
          })}
        </Rail>
      </section>

      {p.sections.map((s) => (
        <section key={s.title} className="mt-7">
          <SectionHead title={s.title} />
          <Rail className="gap-4 pb-3 pt-1">
            {s.bookIds.map((bid) => {
              const b = getBook(bid);
              if (!b) return null;
              return (
                <li key={bid} className="w-28 shrink-0">
                  <Link href={`/book/${b.id}`}>
                    <BookCover book={b} />
                    <p className="mt-2 line-clamp-1 font-serif text-sm">{b.title}</p>
                    <Stars value={b.rating} size={11} />
                  </Link>
                </li>
              );
            })}
          </Rail>
        </section>
      ))}

      <section className="mt-7">
        <SectionHead title="Other publishers" />
        <Rail className="gap-3 pb-1">
          {publishers
            .filter((x) => x.id !== p.id)
            .map((x) => (
              <li key={x.id} className="shrink-0">
                <Link href={`/publisher/${x.id}`} className="flex items-center gap-2 rounded-full border border-line bg-surface py-1 pl-1 pr-4 text-sm">
                  <span className="grid size-8 place-items-center rounded-full font-serif text-white" style={{ background: x.color }}>
                    {[...x.name][0]}
                  </span>
                  {x.name}
                </Link>
              </li>
            ))}
        </Rail>
      </section>
    </>
  );
}
