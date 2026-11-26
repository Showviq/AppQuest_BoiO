"use client";

import { Clock } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Chip, PageTitle, Rail } from "@/components/ui";
import { articles } from "@/lib/mock/magazine";

const sections = ["Essays", "Interviews", "Lists", "Fair diary"] as const;

export default function Magazine() {
  const [sec, setSec] = useState<string | null>(null);
  const [cover, ...rest] = articles;
  const list = rest.filter((a) => !sec || a.section === sec);

  return (
    <>
      <PageTitle>Magazine</PageTitle>

      <Link href={`/magazine/${cover.id}`} className="block overflow-hidden rounded-3xl" style={{ background: cover.tint }}>
        <div className="px-5 pb-6 pt-16 text-[#f3eedd]">
          <p className="text-xs uppercase tracking-widest opacity-80">Cover story · {cover.section}</p>
          <h2 className="mt-2 font-serif text-3xl leading-tight">{cover.title}</h2>
          <p className="mt-2 opacity-90">{cover.dek}</p>
          <p className="mt-4 flex items-center gap-1 text-sm opacity-80">
            <Clock size={14} /> {cover.minutes} min
          </p>
        </div>
      </Link>

      <Rail as="div" className="mt-6 gap-2" role="group" label="Sections">
        {sections.map((s) => (
          <Chip key={s} active={sec === s} onClick={() => setSec(sec === s ? null : s)}>
            {s}
          </Chip>
        ))}
      </Rail>

      <ul className="mt-3 divide-y divide-line">
        {list.map((a) => (
          <li key={a.id}>
            <Link href={`/magazine/${a.id}`} className="flex gap-4 py-4">
              <span className="w-1.5 shrink-0 rounded-full" style={{ background: a.tint }} aria-hidden />
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-wide text-ink-soft">{a.section}</p>
                <p className="font-serif text-xl leading-snug">{a.title}</p>
                <p className="text-sm text-ink-soft">
                  {a.author} · {a.minutes} min
                </p>
              </div>
            </Link>
          </li>
        ))}
        {list.length === 0 && <li className="py-8 text-center text-ink-soft">Nothing in this section yet.</li>}
      </ul>
    </>
  );
}
