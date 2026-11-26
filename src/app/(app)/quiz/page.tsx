"use client";

import { ChevronRight, Flame, Sparkles, Timer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Chip, PageTitle, Rail } from "@/components/ui";
import { quizCategories, quizzes } from "@/lib/mock/fandom";

export default function Quizzes() {
  const [cat, setCat] = useState<string | null>(null);
  const daily = quizzes.find((q) => q.id === "daily")!;
  const list = quizzes.filter((q) => q.id !== "daily" && (!cat || q.category === cat));

  return (
    <>
      <PageTitle action={<Link href="/achievements" className="text-sm font-medium text-forest">Achievements</Link>}>
        Quizzes
      </PageTitle>

      <Link href={`/quiz/${daily.id}`} className="block rounded-2xl bg-forest p-5 text-on-forest">
        <p className="flex items-center gap-2 text-sm opacity-80">
          <Flame size={16} /> Daily challenge
        </p>
        <p className="mt-1 font-serif text-2xl">{daily.questions.length} questions</p>
        <p className="mt-3 inline-flex h-9 items-center rounded-full bg-on-forest px-4 text-sm font-semibold text-forest">
          Play · +{daily.xp} XP
        </p>
      </Link>

      <Link href="/quiz/which-character" className="mt-3 flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
        <Sparkles size={20} className="text-gold" />
        <span className="flex-1 font-medium">Which character are you?</span>
        <ChevronRight size={18} className="text-ink-soft" />
      </Link>

      <Rail as="div" className="mt-6 gap-2" role="group" label="Categories">
        {quizCategories.map((c) => (
          <Chip key={c} active={cat === c} onClick={() => setCat(cat === c ? null : c)}>
            {c}
          </Chip>
        ))}
      </Rail>

      <ul className="mt-3 divide-y divide-line">
        {list.map((q) => (
          <li key={q.id}>
            <Link href={`/quiz/${q.id}`} className="flex items-center gap-3 py-4">
              <div className="min-w-0 flex-1">
                <p className="font-medium">{q.title}</p>
                <p className="flex items-center gap-2 text-sm text-ink-soft">
                  {q.category} · {q.questions.length} Q · <Timer size={13} /> {q.seconds}s
                </p>
              </div>
              <span className="text-sm font-semibold text-gold">+{q.xp} XP</span>
            </Link>
          </li>
        ))}
        {list.length === 0 && <li className="py-8 text-center text-ink-soft">No quizzes yet.</li>}
      </ul>
    </>
  );
}
