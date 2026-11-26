"use client";

import { BookOpen, Clock, Drama, PenTool, Search as SearchIcon, TrendingUp, X } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { BookCover } from "@/components/book-cover";
import { Stars } from "@/components/stars";
import { BackButton } from "@/components/ui";
import { type Suggestion, suggest, trendingSearches } from "@/lib/mock/discovery";
import { searchBooks } from "@/lib/mock-data";

const RECENT = "boio-recent-searches";
const kindIcon = { book: BookOpen, author: PenTool, character: Drama };
const kindLabel = { book: "Book", author: "Author", character: "Character" };
const isLatin = (s: string) => /^[\x00-\x7F]*$/.test(s);

export default function SearchPage() {
  return (
    <Suspense>
      <SearchInner />
    </Suspense>
  );
}

function SearchInner() {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("q") ?? "");
  const [submitted, setSubmitted] = useState(params.get("q") ?? "");
  const [recent, setRecent] = useState<string[]>([]);
  const [focused, setFocused] = useState(true);

  useEffect(() => {
    try {
      setRecent(JSON.parse(localStorage.getItem(RECENT) ?? "[]"));
    } catch {}
  }, []);

  const suggestions = useMemo(() => suggest(q, searchBooks), [q]);
  const results = useMemo(() => searchBooks(submitted), [submitted]);

  const commit = (term: string) => {
    const t = term.trim();
    if (!t) return;
    setQ(t);
    setSubmitted(t);
    setFocused(false);
    const next = [t, ...recent.filter((r) => r !== t)].slice(0, 6);
    setRecent(next);
    try {
      localStorage.setItem(RECENT, JSON.stringify(next));
    } catch {}
  };

  const open = (s: Suggestion) => {
    if (s.kind === "book") router.push(`/book/${s.id}`);
    else if (s.kind === "character") router.push(`/book/${s.bookId}`);
    else commit(s.alt);
  };

  // "Himu → হিমু" when the reader typed one script and the match is in the other.
  const bridge =
    submitted && results[0] && isLatin(submitted) !== isLatin(results[0].title)
      ? `${submitted} ↔ ${results[0].title}`
      : null;

  const showDropdown = focused && q.trim().length > 0 && suggestions.length > 0;

  return (
    <>
      <div className="flex items-center gap-1">
        <BackButton />
        <form
          className="relative mb-1 flex-1"
          onSubmit={(e) => {
            e.preventDefault();
            commit(q);
          }}
        >
          <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
          <input
            type="search"
            autoFocus
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setFocused(true);
            }}
            onFocus={() => setFocused(true)}
            placeholder="বই, লেখক, চরিত্র… Himu"
            aria-label="Search"
            role="combobox"
            aria-expanded={showDropdown}
            aria-controls="suggestions"
            className="h-12 w-full rounded-full border border-line bg-surface pl-11 pr-11 text-[16px]"
          />
          {q && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                setSubmitted("");
              }}
              aria-label="Clear"
              className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-ink-soft hover:bg-surface-2"
            >
              <X size={16} />
            </button>
          )}

          {showDropdown && (
            <ul
              id="suggestions"
              role="listbox"
              className="absolute inset-x-0 top-14 z-30 overflow-hidden rounded-2xl border border-line bg-surface shadow-xl"
            >
              {suggestions.map((s) => {
                const Icon = kindIcon[s.kind];
                return (
                  <li key={`${s.kind}-${s.id}`} role="option" aria-selected={false}>
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => open(s)}
                      className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-surface-2"
                    >
                      {s.kind === "book" ? (
                        <span className="w-8">
                          <BookCover book={s.book} size="sm" />
                        </span>
                      ) : (
                        <span className="grid size-8 place-items-center rounded-full bg-forest-soft text-forest">
                          <Icon size={16} />
                        </span>
                      )}
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{s.label}</span>
                        <span className="block truncate text-xs text-ink-soft">{s.alt}</span>
                      </span>
                      <span className="text-[11px] text-ink-soft">{kindLabel[s.kind]}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </form>
      </div>

      {!submitted ? (
        <div className="mt-6 flex flex-col gap-6">
          {recent.length > 0 && (
            <section>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-ink-soft">Recent</h2>
                <button
                  onClick={() => {
                    setRecent([]);
                    try {
                      localStorage.removeItem(RECENT);
                    } catch {}
                  }}
                  className="text-sm text-forest"
                >
                  Clear
                </button>
              </div>
              <ul>
                {recent.map((r) => (
                  <li key={r}>
                    <button onClick={() => commit(r)} className="flex h-11 w-full items-center gap-3 text-left">
                      <Clock size={16} className="text-ink-soft" /> {r}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section>
            <h2 className="mb-2 text-sm font-semibold text-ink-soft">Trending</h2>
            <div className="flex flex-wrap gap-2">
              {trendingSearches.map((t) => (
                <button key={t} onClick={() => commit(t)} className="flex h-9 items-center gap-1.5 rounded-full border border-line bg-surface px-3 text-sm">
                  <TrendingUp size={14} className="text-gold" /> {t}
                </button>
              ))}
            </div>
          </section>
        </div>
      ) : (
        <section className="mt-4">
          <p className="mb-4 text-sm text-ink-soft">
            {results.length} results{bridge && <span className="ml-2 rounded-full bg-surface-2 px-2 py-0.5 text-xs">{bridge}</span>}
          </p>
          {results.length === 0 ? (
            <p className="mt-12 text-center text-ink-soft">No books match “{submitted}”.</p>
          ) : (
            <ul className="divide-y divide-line">
              {results.map((b) => (
                <li key={b.id}>
                  <Link href={`/book/${b.id}`} className="flex gap-4 py-3">
                    <BookCover book={b} size="sm" />
                    <div className="min-w-0">
                      <p className="font-serif text-lg leading-snug">{b.title}</p>
                      <p className="text-sm text-ink-soft">
                        {b.titleAlt} · {b.author}
                      </p>
                      <Stars value={b.rating} size={12} />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}
