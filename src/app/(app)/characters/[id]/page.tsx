"use client";

import { Link2, Quote, Sparkles } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { BookCover } from "@/components/book-cover";
import { Accordion, BackButton } from "@/components/ui";
import { getBook } from "@/lib/mock-data";
import { getCharacter } from "@/lib/mock/fandom";

export default function CharacterPage() {
  const { id } = useParams<{ id: string }>();
  const c = getCharacter(id);
  if (!c) notFound();

  return (
    <>
      <BackButton href="/characters" />

      <div className="overflow-hidden rounded-3xl" style={{ background: c.tint }}>
        <div className="px-5 pb-6 pt-10 text-[#f3eedd]">
          <p className="text-xs uppercase tracking-wide opacity-80">{c.universe}</p>
          <h1 className="font-serif text-5xl leading-tight">{c.name}</h1>
          <p className="text-lg opacity-90">{c.nameAlt}</p>
          <p className="mt-2 opacity-90">{c.tagline}</p>
        </div>
      </div>

      <ul className="mt-4 flex flex-wrap gap-2" aria-label="Traits">
        {c.traits.map((t) => (
          <li key={t} className="rounded-full bg-forest-soft px-3 py-1 text-sm text-forest">
            {t}
          </li>
        ))}
      </ul>

      <div className="mt-5 rounded-2xl border border-line bg-surface px-4">
        <Accordion title="Background" defaultOpen>
          {c.background}
        </Accordion>
        <Accordion title="Relationships" meta={c.relations.length}>
          <ul className="flex flex-col gap-2">
            {c.relations.map((r) => (
              <li key={r.id}>
                <Link href={`/characters/${r.id}`} className="flex items-center gap-2 text-ink hover:text-forest">
                  <Link2 size={16} className="text-ink-soft" /> {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </Accordion>
        <Accordion title="Quotes" meta={<Quote size={14} />}>
          <ul className="flex flex-col gap-3">
            {c.quotes.map((q) => (
              <li key={q} className="border-l-2 border-gold pl-3 font-serif text-ink">
                “{q}”
              </li>
            ))}
          </ul>
          <p className="mt-2 text-xs">Demo quotes</p>
        </Accordion>
        <Accordion title="Universe">
          <ul className="list-disc pl-5">
            {c.connections.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </Accordion>
      </div>

      <section className="mt-6">
        <h2 className="mb-3 text-lg font-semibold">Appears in</h2>
        <ul className="flex gap-3">
          {c.books.map((bid) => {
            const b = getBook(bid);
            return (
              b && (
                <li key={bid}>
                  <Link href={`/book/${bid}`}>
                    <BookCover book={b} />
                  </Link>
                </li>
              )
            );
          })}
        </ul>
      </section>

      <Link
        href="/quiz/which-character"
        className="mt-6 flex items-center justify-center gap-2 rounded-full bg-forest px-5 py-3 font-semibold text-on-forest"
      >
        <Sparkles size={18} /> Which character are you?
      </Link>
    </>
  );
}
