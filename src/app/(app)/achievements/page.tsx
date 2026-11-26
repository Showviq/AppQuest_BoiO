"use client";

import {
  BookOpen, Brain, Check, Feather, Flame, Languages, Lock, MapPin, Moon, PenLine, Trophy, UsersRound,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Sheet } from "@/components/sheet";
import { PageTitle, Progress, SectionHead } from "@/components/ui";
import { type Badge, badges, dailyChallenges, me } from "@/lib/mock/play";

const icons = { BookOpen, Flame, Languages, PenLine, Brain, MapPin, Feather, UsersRound, Moon };

export default function Achievements() {
  const [open, setOpen] = useState<Badge | null>(null);
  const levelPct = ((me.xp - me.levelStart) / (me.nextXp - me.levelStart)) * 100;
  const earned = badges.filter((b) => b.earned).length;

  return (
    <>
      <PageTitle action={<Link href="/leaderboard" aria-label="Leaderboard" className="grid size-11 place-items-center rounded-full hover:bg-surface-2"><Trophy size={22} /></Link>}>
        Achievements
      </PageTitle>

      <div className="rounded-2xl bg-forest p-5 text-on-forest">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-sm opacity-80">Level</p>
            <p className="font-serif text-5xl leading-none">{me.level}</p>
          </div>
          <div className="flex items-center gap-1.5 text-lg font-semibold">
            <Flame size={20} className="text-gold" /> {me.streak}
            <span className="text-sm font-normal opacity-80">days</span>
          </div>
        </div>
        <div className="mt-4 h-2 overflow-hidden rounded-full bg-on-forest/25">
          <div className="h-full rounded-full bg-gold" style={{ width: `${levelPct}%` }} />
        </div>
        <p className="mt-1.5 text-right text-xs opacity-80">
          {me.xp} / {me.nextXp} XP
        </p>
      </div>

      <section className="mt-7">
        <SectionHead title="Today" />
        <ul className="flex flex-col gap-2">
          {dailyChallenges.map((c) => {
            const done = c.done >= c.total;
            return (
              <li key={c.id}>
                <Link href={c.href} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
                  <span className={`grid size-9 shrink-0 place-items-center rounded-full ${done ? "bg-forest text-on-forest" : "bg-surface-2 text-ink-soft"}`}>
                    {done ? <Check size={18} /> : <span className="text-xs">{Math.round((c.done / c.total) * 100)}%</span>}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`font-medium ${done ? "text-ink-soft line-through" : ""}`}>{c.label}</p>
                    <Progress value={(c.done / c.total) * 100} className="mt-1.5" />
                  </div>
                  <span className="text-sm font-semibold text-gold">+{c.xp}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-7">
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold">Badges</h2>
          <span className="text-sm text-ink-soft">
            {earned}/{badges.length}
          </span>
        </div>
        <ul className="grid grid-cols-3 gap-3">
          {badges.map((b) => {
            const Icon = icons[b.icon];
            return (
              <li key={b.id}>
                <button onClick={() => setOpen(b)} className="flex w-full flex-col items-center gap-2 rounded-2xl border border-line bg-surface p-3 text-center text-xs">
                  <span className={`relative grid size-14 place-items-center rounded-full ${b.earned ? "bg-gold text-[#2a1f0a]" : "bg-surface-2 text-ink-soft"}`}>
                    <Icon size={24} />
                    {!b.earned && <Lock size={14} className="absolute -bottom-0.5 -right-0.5 rounded-full bg-surface p-0.5" />}
                  </span>
                  <span className={b.earned ? "font-medium" : "text-ink-soft"}>{b.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </section>

      <Sheet open={open !== null} onClose={() => setOpen(null)} title={open?.name ?? ""}>
        {open && (
          <div className="text-center">
            {(() => {
              const Icon = icons[open.icon];
              return (
                <span className={`mx-auto grid size-20 place-items-center rounded-full ${open.earned ? "bg-gold text-[#2a1f0a]" : "bg-surface-2 text-ink-soft"}`}>
                  <Icon size={34} />
                </span>
              );
            })()}
            <p className="mt-4">{open.how}</p>
            {open.earned ? (
              <p className="mt-2 font-semibold text-forest">Earned</p>
            ) : (
              <>
                <Progress value={open.progress ?? 0} className="mt-4" />
                <p className="mt-1 text-sm text-ink-soft">{open.progress ?? 0}%</p>
              </>
            )}
          </div>
        )}
      </Sheet>
    </>
  );
}
