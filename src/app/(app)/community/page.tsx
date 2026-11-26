"use client";

import { Lock, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/toast";
import { Chip, PageTitle, Rail } from "@/components/ui";
import { rooms } from "@/lib/mock/social";

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));
const types = ["All", ...Array.from(new Set(rooms.map((r) => r.type)))];

export default function Community() {
  const [joined, setJoined] = useState<Set<string>>(new Set(["c1"]));
  const [pending, setPending] = useState<Set<string>>(new Set());
  const [type, setType] = useState("All");
  const [q, setQ] = useState("");
  const toast = useToast();

  const toggle = (id: string, name: string, isPrivate?: boolean) => {
    // Side effects (toast) stay outside state updaters: React may run updaters during render.
    if (isPrivate && !joined.has(id)) {
      const cancel = pending.has(id);
      setPending((s) => {
        const next = new Set(s);
        if (cancel) next.delete(id);
        else next.add(id);
        return next;
      });
      toast(cancel ? "Request cancelled" : "Request sent");
      return;
    }
    const leaving = joined.has(id);
    setJoined((s) => {
      const next = new Set(s);
      if (leaving) next.delete(id);
      else next.add(id);
      return next;
    });
    toast(leaving ? `Left ${name}` : `Joined ${name}`);
  };

  const filtered = rooms.filter(
    (r) =>
      (type === "All" || r.type === type) &&
      `${r.name} ${r.genre} ${r.blurb}`.toLowerCase().includes(q.trim().toLowerCase())
  );
  const genres = Array.from(new Set(filtered.map((r) => r.genre)));

  return (
    <>
      <PageTitle>Community</PageTitle>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Find a community"
          aria-label="Find a community"
          className="h-12 w-full rounded-full border border-line bg-surface pl-11 pr-4"
        />
      </div>

      <Rail as="div" className="mt-3 gap-2" role="group" label="Literature type">
        {types.map((t) => (
          <Chip key={t} active={type === t} onClick={() => setType(t)}>
            {t}
          </Chip>
        ))}
      </Rail>

      {genres.length === 0 && <p className="mt-16 text-center text-ink-soft">No communities found.</p>}

      {genres.map((g) => (
        <section key={g} className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-ink-soft">{g}</h2>
          <ul className="divide-y divide-line">
            {filtered
              .filter((r) => r.genre === g)
              .map((c) => {
                const isIn = joined.has(c.id);
                const isPending = pending.has(c.id);
                return (
                  <li key={c.id} className="flex items-center gap-4 py-3">
                    <Link href={`/community/${c.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                      <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-forest-soft font-serif text-xl text-forest">
                        {c.name.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="flex items-center gap-1.5 font-medium">
                          <span className="truncate">{c.name}</span>
                          {c.private && <Lock size={13} className="shrink-0 text-ink-soft" aria-label="Private" />}
                        </p>
                        <p className="truncate text-sm text-ink-soft">
                          {fmt(c.members + (isIn ? 1 : 0))} members · {c.blurb}
                        </p>
                      </div>
                    </Link>
                    <button
                      onClick={() => toggle(c.id, c.name, c.private)}
                      aria-pressed={isIn || isPending}
                      className={`h-9 shrink-0 rounded-full px-4 text-sm font-semibold ${
                        isIn || isPending ? "border border-line text-ink-soft" : "bg-forest text-on-forest"
                      }`}
                    >
                      {isIn ? "Joined" : isPending ? "Requested" : c.private ? "Request" : "Join"}
                    </button>
                  </li>
                );
              })}
          </ul>
        </section>
      ))}
    </>
  );
}
