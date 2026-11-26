"use client";

import { useState } from "react";
import { useLibrary } from "@/components/library-store";
import { Accordion, BackButton, Card, Chip, PageTitle, Stat } from "@/components/ui";
import { books, getBook } from "@/lib/mock-data";

// Demo history: books finished per month over the last 12 months (oldest first).
const MONTHLY_DEMO = [1, 2, 1, 3, 2, 0, 1, 2, 4, 2, 1, 2];
const GENRE_DEMO: Record<string, number> = { Fiction: 7, Classic: 6, Mystery: 4, Poetry: 2, Memoir: 1, Adventure: 2 };
const LANG_DEMO = { bn: 14, en: 5 };

type Range = "12m" | "6m";

export default function Stats() {
  const { library } = useLibrary();
  const [range, setRange] = useState<Range>("12m");
  const [hover, setHover] = useState<number | null>(null);

  const readIds = Object.entries(library).filter(([, e]) => e.shelf === "read").map(([id]) => id);
  const readBooks = readIds.map(getBook).filter((b) => b !== undefined);

  // Months (labels) ending with the current one; current month gets this library's finished books.
  const now = new Date();
  const monthly = MONTHLY_DEMO.map((v, i) => ({
    label: new Date(now.getFullYear(), now.getMonth() - 11 + i, 1).toLocaleDateString("en-GB", { month: "short" }),
    value: v + (i === 11 ? readBooks.length : 0),
  })).slice(range === "6m" ? 6 : 0);
  const max = Math.max(...monthly.map((m) => m.value), 1);

  const genres = { ...GENRE_DEMO };
  for (const b of readBooks) for (const g of b.genres) genres[g] = (genres[g] ?? 0) + 1;
  const genreRows = Object.entries(genres).sort((a, b) => b[1] - a[1]);
  const genreMax = genreRows[0]?.[1] ?? 1;

  const lang = { ...LANG_DEMO };
  for (const b of readBooks) lang[b.lang]++;
  const langTotal = lang.bn + lang.en;
  const bnPct = Math.round((lang.bn / langTotal) * 100);

  const totalBooks = monthly.reduce((n, m) => n + m.value, 0);
  const pages = Object.values(library).reduce((n, e) => n + e.page, 0) + 4120;
  const minutes = Object.values(library).reduce((n, e) => n + (e.sessions ?? []).reduce((m, s) => m + s.minutes, 0), 0) + 5400;
  const avgPages = Math.round(books.reduce((n, b) => n + b.pages, 0) / books.length);

  const H = 140;

  return (
    <>
      <BackButton href="/library" />
      <PageTitle>Stats</PageTitle>

      <div className="grid grid-cols-4 rounded-2xl border border-line bg-surface py-4">
        <Stat value={totalBooks} label="Books" />
        <Stat value={`${(pages / 1000).toFixed(1)}k`} label="Pages" />
        <Stat value={`${Math.round(minutes / 60)}h`} label="Hours" />
        <Stat value={avgPages} label="Avg pages" />
      </div>

      <Card className="mt-4 p-4">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">Books per month</h2>
          <div className="flex gap-1">
            {(["6m", "12m"] as Range[]).map((r) => (
              <Chip key={r} active={range === r} onClick={() => setRange(r)}>
                {r}
              </Chip>
            ))}
          </div>
        </div>
        <div className="relative" style={{ height: H + 24 }} onMouseLeave={() => setHover(null)}>
          {/* recessive gridlines */}
          {[0.5, 1].map((f) => (
            <div key={f} className="absolute inset-x-0 border-t border-dashed border-line" style={{ top: H - H * f }}>
              <span className="absolute -top-2.5 right-0 bg-surface pl-1 text-[10px] text-ink-soft">{Math.round(max * f)}</span>
            </div>
          ))}
          <ul className="absolute inset-x-0 top-0 flex items-end gap-[2px] pr-6" style={{ height: H }}>
            {monthly.map((m, i) => (
              <li
                key={i}
                className="relative flex h-full flex-1 items-end justify-center"
                onMouseEnter={() => setHover(i)}
                onClick={() => setHover(i)}
              >
                <span
                  className={`w-full max-w-7 rounded-t-[4px] ${hover === null || hover === i ? "bg-forest" : "bg-forest/40"}`}
                  style={{ height: Math.max(2, (m.value / max) * H) }}
                  aria-label={`${m.label}: ${m.value}`}
                />
                {hover === i && (
                  <span className="absolute -top-8 z-10 whitespace-nowrap rounded-lg bg-ink px-2 py-1 text-xs text-bg shadow">
                    {m.label} · {m.value}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <ul className="absolute inset-x-0 bottom-0 flex gap-[2px] pr-6 text-center text-[10px] text-ink-soft">
            {monthly.map((m, i) => (
              <li key={i} className="flex-1">
                {range === "12m" && i % 2 ? "" : m.label}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card className="mt-4 p-4">
        <h2 className="mb-3 font-semibold">Bangla vs English</h2>
        <div className="flex h-4 gap-[2px] overflow-hidden rounded-full">
          <div className="bg-forest" style={{ width: `${bnPct}%` }} />
          <div className="bg-gold" style={{ width: `${100 - bnPct}%` }} />
        </div>
        <div className="mt-3 flex justify-between text-sm">
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-sm bg-forest" /> বাংলা <b>{bnPct}%</b>
            <span className="text-ink-soft">({lang.bn})</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="size-3 rounded-sm bg-gold" /> English <b>{100 - bnPct}%</b>
            <span className="text-ink-soft">({lang.en})</span>
          </span>
        </div>
      </Card>

      <Card className="mt-4 p-4">
        <h2 className="mb-3 font-semibold">Genres</h2>
        <ul className="flex flex-col gap-2.5">
          {genreRows.map(([g, n]) => (
            <li key={g} className="grid grid-cols-[6rem_1fr_2rem] items-center gap-3 text-sm">
              <span className="truncate">{g}</span>
              <span className="h-2.5 overflow-hidden rounded-full bg-surface-2">
                <span className="block h-full rounded-full bg-forest" style={{ width: `${(n / genreMax) * 100}%` }} />
              </span>
              <span className="text-right text-ink-soft">{n}</span>
            </li>
          ))}
        </ul>
      </Card>

      <div className="mt-4 rounded-2xl border border-line bg-surface px-4">
        <Accordion title="Table">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left">
                <th className="py-1 font-medium">Month</th>
                <th className="py-1 text-right font-medium">Books</th>
              </tr>
            </thead>
            <tbody>
              {monthly.map((m, i) => (
                <tr key={i} className="border-t border-line">
                  <td className="py-1">{m.label}</td>
                  <td className="py-1 text-right text-ink">{m.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Accordion>
      </div>
    </>
  );
}
