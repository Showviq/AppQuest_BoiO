"use client";

import { Crown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar, BackButton, PageTitle, Tabs } from "@/components/ui";
import { leaderboards, myRank } from "@/lib/mock/play";

type Board = keyof typeof leaderboards;
const tabs = [
  { id: "global", label: "Global" },
  { id: "friends", label: "Friends" },
  { id: "weekly", label: "This week" },
] as const;

export default function Leaderboard() {
  const [tab, setTab] = useState<Board>("global");
  const list = leaderboards[tab];
  const podium = [list[1], list[0], list[2]].filter(Boolean);
  const mine = myRank[tab];

  return (
    <>
      <BackButton href="/achievements" />
      <PageTitle>Leaderboard</PageTitle>
      <Tabs tabs={tabs} value={tab} onChange={setTab} label="Leaderboard" />

      <ol className="mt-2 flex items-end justify-center gap-3" aria-label="Top 3">
        {podium.map((r) => {
          const place = list.indexOf(r) + 1;
          const h = { 1: "h-28", 2: "h-20", 3: "h-14" }[place];
          return (
            <li key={r.handle} className="flex w-24 flex-col items-center">
              {place === 1 && <Crown size={20} className="mb-1 text-gold" />}
              <Link href={`/u/${r.handle}`} className="flex flex-col items-center">
                <Avatar name={r.name} size={place === 1 ? "lg" : "md"} />
                <span className="mt-1 text-sm font-medium">{r.name}</span>
              </Link>
              <span className="text-xs text-ink-soft">{r.xp.toLocaleString()} XP</span>
              <div className={`mt-2 grid w-full place-items-center rounded-t-xl bg-forest-soft font-serif text-2xl text-forest ${h}`}>{place}</div>
            </li>
          );
        })}
      </ol>

      <ol className="mt-4 divide-y divide-line">
        {list.slice(3).map((r, n) => (
          <li key={r.handle}>
            <Link href={`/u/${r.handle}`} className="flex items-center gap-3 py-3">
              <span className="w-6 text-center text-sm text-ink-soft">{n + 4}</span>
              <Avatar name={r.name} size="sm" />
              <span className="flex-1 font-medium">{r.name}</span>
              <span className="text-sm text-ink-soft">{r.xp.toLocaleString()} XP</span>
            </Link>
          </li>
        ))}
      </ol>

      {/* Your rank stays visible above the bottom nav. */}
      <div className="sticky bottom-20 mt-4 flex items-center gap-3 rounded-2xl border border-forest bg-forest-soft px-4 py-3 lg:bottom-4">
        <span className="w-8 text-center font-semibold text-forest">#{mine.rank}</span>
        <Avatar name="You" size="sm" />
        <span className="flex-1 font-semibold">You</span>
        <span className="text-sm">{mine.xp.toLocaleString()} XP</span>
      </div>
    </>
  );
}
