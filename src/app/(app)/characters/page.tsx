"use client";

import { Search, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { PageTitle } from "@/components/ui";
import { characters, universes } from "@/lib/mock/fandom";

export default function Characters() {
  const [q, setQ] = useState("");
  const nq = q.trim().toLowerCase();
  const list = characters.filter(
    (c) => !nq || c.name.includes(q.trim()) || c.nameAlt.toLowerCase().includes(nq) || c.universe.toLowerCase().includes(nq)
  );

  return (
    <>
      <PageTitle>Characters</PageTitle>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="হিমু, Feluda…"
          aria-label="Search characters"
          className="h-12 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-[16px]"
        />
      </div>

      <Link
        href="/quiz/which-character"
        className="mt-4 flex items-center gap-3 rounded-2xl bg-forest px-4 py-3 text-on-forest"
      >
        <Sparkles size={20} />
        <span className="font-medium">Which character are you?</span>
      </Link>

      {universes.map((u) => {
        const items = list.filter((c) => c.universe === u);
        if (!items.length) return null;
        return (
          <section key={u} className="mt-7">
            <h2 className="mb-3 text-lg font-semibold">{u}</h2>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {items.map((c) => (
                <li key={c.id}>
                  <Link href={`/characters/${c.id}`} className="block overflow-hidden rounded-2xl border border-line bg-surface">
                    <div className="grid h-20 place-items-center font-serif text-3xl text-[#f3eedd]" style={{ background: c.tint }}>
                      {c.name}
                    </div>
                    <div className="p-3">
                      <p className="font-medium">{c.nameAlt}</p>
                      <p className="line-clamp-1 text-xs text-ink-soft">{c.tagline}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      {list.length === 0 && <p className="mt-16 text-center text-ink-soft">No characters match “{q}”.</p>}
    </>
  );
}
