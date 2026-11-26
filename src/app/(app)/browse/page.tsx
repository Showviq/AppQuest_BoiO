"use client";

import { ArrowUpDown, Check, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { BookCover } from "@/components/book-cover";
import { Sheet } from "@/components/sheet";
import { Stars } from "@/components/stars";
import { Accordion, BackButton, Button, Chip, PageTitle, Rail } from "@/components/ui";
import { genreTree } from "@/lib/mock/discovery";
import { books } from "@/lib/mock-data";

const sorts = {
  popular: "Most popular",
  rating: "Highest rated",
  newest: "Newest",
  oldest: "Oldest",
  title: "Title A–Z",
} as const;
type Sort = keyof typeof sorts;
type Lang = "all" | "bn" | "en";

export default function Browse() {
  const [genre, setGenre] = useState<string | null>(null);
  const [subs, setSubs] = useState<Set<string>>(new Set());
  const [lang, setLang] = useState<Lang>("all");
  const [sort, setSort] = useState<Sort>("popular");
  const [sheet, setSheet] = useState<"filter" | "sort" | null>(null);

  const node = genreTree.find((g) => g.id === genre);

  const results = useMemo(() => {
    const allowed = subs.size ? subs : node ? new Set(node.subs.map((s) => s.id)) : null;
    const list = books.filter(
      (b) => (lang === "all" || b.lang === lang) && (!allowed || b.genres.some((g) => allowed.has(g)))
    );
    const cmp: Record<Sort, (a: (typeof books)[number], b: (typeof books)[number]) => number> = {
      popular: (a, b) => b.ratings - a.ratings,
      rating: (a, b) => b.rating - a.rating,
      newest: (a, b) => b.year - a.year,
      oldest: (a, b) => a.year - b.year,
      title: (a, b) => a.titleAlt.localeCompare(b.titleAlt),
    };
    return list.sort(cmp[sort]);
  }, [node, subs, lang, sort]);

  const toggleSub = (id: string) =>
    setSubs((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });

  const activeCount = (genre ? 1 : 0) + subs.size + (lang !== "all" ? 1 : 0);

  return (
    <>
      <BackButton />
      <PageTitle>Browse</PageTitle>

      <Rail as="div" className="gap-2">
        <Chip active={!genre} onClick={() => { setGenre(null); setSubs(new Set()); }}>
          All
        </Chip>
        {genreTree.map((g) => (
          <Chip key={g.id} active={genre === g.id} onClick={() => { setGenre(g.id); setSubs(new Set()); }}>
            {g.label}
          </Chip>
        ))}
      </Rail>

      {node && node.subs.length > 1 && (
        <Rail as="div" className="mt-2 gap-2">
          {node.subs.map((s) => (
            <button
              key={s.id}
              onClick={() => toggleSub(s.id)}
              aria-pressed={subs.has(s.id)}
              className={`h-8 shrink-0 rounded-full px-3 text-xs ${
                subs.has(s.id) ? "bg-forest-soft font-semibold text-forest" : "bg-surface-2 text-ink-soft"
              }`}
            >
              {s.label}
            </button>
          ))}
        </Rail>
      )}

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-ink-soft">{results.length} books</span>
        <div className="flex gap-2">
          <Button variant="outline" className="min-h-9 px-3 text-sm" onClick={() => setSheet("filter")}>
            <SlidersHorizontal size={15} /> Filter{activeCount > 0 && ` · ${activeCount}`}
          </Button>
          <Button variant="outline" className="min-h-9 px-3 text-sm" onClick={() => setSheet("sort")}>
            <ArrowUpDown size={15} /> Sort
          </Button>
        </div>
      </div>

      <ul className="mt-5 grid grid-cols-3 gap-x-4 gap-y-6 sm:grid-cols-4">
        {results.map((b) => (
          <li key={b.id}>
            <Link href={`/book/${b.id}`} className="block">
              <BookCover book={b} />
              <p className="mt-2 line-clamp-1 font-serif text-sm">{b.title}</p>
              <p className="line-clamp-1 text-xs text-ink-soft">{b.author}</p>
              <Stars value={b.rating} size={11} />
            </Link>
          </li>
        ))}
      </ul>
      {results.length === 0 && <p className="mt-12 text-center text-ink-soft">No books match these filters.</p>}

      <Sheet open={sheet === "filter"} onClose={() => setSheet(null)} title="Filter">
        <p className="mb-2 text-sm font-medium text-ink-soft">Language</p>
        <div className="mb-4 grid grid-cols-3 gap-2">
          {(["all", "bn", "en"] as Lang[]).map((l) => (
            <button
              key={l}
              onClick={() => setLang(l)}
              aria-pressed={lang === l}
              className={`h-10 rounded-xl border text-sm ${lang === l ? "border-forest bg-forest-soft font-semibold text-forest" : "border-line"}`}
            >
              {{ all: "All", bn: "বাংলা", en: "English" }[l]}
            </button>
          ))}
        </div>
        <p className="text-sm font-medium text-ink-soft">Genre</p>
        <div>
          {genreTree.map((g) => (
            <Accordion
              key={g.id}
              title={g.label}
              defaultOpen={genre === g.id}
              meta={g.subs.filter((s) => subs.has(s.id)).length || undefined}
            >
              <ul className="flex flex-col">
                {g.subs.map((s) => (
                  <li key={s.id}>
                    <button
                      onClick={() => {
                        if (genre !== g.id) {
                          setGenre(g.id);
                          setSubs(new Set([s.id]));
                        } else toggleSub(s.id);
                      }}
                      className="flex h-10 w-full items-center justify-between text-left text-ink"
                    >
                      {s.label}
                      {genre === g.id && subs.has(s.id) && <Check size={16} className="text-forest" />}
                    </button>
                  </li>
                ))}
              </ul>
            </Accordion>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <Button
            variant="outline"
            onClick={() => {
              setGenre(null);
              setSubs(new Set());
              setLang("all");
            }}
          >
            Reset
          </Button>
          <Button onClick={() => setSheet(null)}>Show {results.length}</Button>
        </div>
      </Sheet>

      <Sheet open={sheet === "sort"} onClose={() => setSheet(null)} title="Sort by">
        <ul className="flex flex-col gap-1">
          {(Object.keys(sorts) as Sort[]).map((s) => (
            <li key={s}>
              <button
                onClick={() => {
                  setSort(s);
                  setSheet(null);
                }}
                className="flex h-12 w-full items-center justify-between rounded-xl px-3 text-left hover:bg-surface-2"
              >
                {sorts[s]}
                {sort === s && <Check size={18} className="text-forest" />}
              </button>
            </li>
          ))}
        </ul>
      </Sheet>
    </>
  );
}
