"use client";

import { useState } from "react";
import { useToast } from "@/components/toast";
import { PageTitle } from "@/components/ui";
import { communities } from "@/lib/mock-data";

const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

export default function Community() {
  const [joined, setJoined] = useState<Set<string>>(new Set(["c1"]));
  const toast = useToast();

  const toggle = (id: string, name: string) => {
    setJoined((s) => {
      const next = new Set(s);
      if (next.has(id)) {
        next.delete(id);
        toast(`Left ${name}`);
      } else {
        next.add(id);
        toast(`Joined ${name}`);
      }
      return next;
    });
  };

  return (
    <>
      <PageTitle>Community</PageTitle>
      <ul className="divide-y divide-line">
        {communities.map((c) => {
          const isIn = joined.has(c.id);
          return (
            <li key={c.id} className="flex items-center gap-4 py-4">
              <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-forest-soft font-serif text-xl text-forest">
                {c.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium">{c.name}</p>
                <p className="text-sm text-ink-soft">
                  {c.topic} · {fmt(c.members + (isIn ? 1 : 0))} members
                </p>
              </div>
              <button
                onClick={() => toggle(c.id, c.name)}
                aria-pressed={isIn}
                className={`h-9 rounded-full px-4 text-sm font-semibold ${
                  isIn ? "border border-line text-ink-soft" : "bg-forest text-on-forest"
                }`}
              >
                {isIn ? "Joined" : "Join"}
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}
