"use client";

import { RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useToast } from "@/components/toast";
import { Button, Progress } from "@/components/ui";
import { characters, matchQuiz } from "@/lib/mock/fandom";

/** "Which character are you?" — tallies votes per character. */
export function MatchQuiz() {
  const [i, setI] = useState(0);
  const [votes, setVotes] = useState<Record<string, number>>({});
  const toast = useToast();
  const done = i >= matchQuiz.length;

  if (done) {
    const top = Object.entries(votes).sort((a, b) => b[1] - a[1])[0]?.[0];
    const c = characters.find((x) => x.id === top) ?? characters[0];
    return (
      <div className="mt-4 overflow-hidden rounded-3xl text-center" style={{ background: c.tint }}>
        <div className="px-5 py-10 text-[#f3eedd]">
          <p className="text-sm opacity-80">You are</p>
          <p className="mt-1 font-serif text-5xl">{c.name}</p>
          <p className="text-lg">{c.nameAlt}</p>
          <p className="mt-3 opacity-90">{c.tagline}</p>
        </div>
        <div className="grid grid-cols-3 gap-2 bg-surface p-4">
          <Button variant="outline" onClick={() => { setI(0); setVotes({}); }} aria-label="Retake">
            <RotateCcw size={18} />
          </Button>
          <Button variant="outline" onClick={() => toast("Shared to your feed")}>Share</Button>
          <Link href={`/characters/${c.id}`} className="inline-flex min-h-11 items-center justify-center rounded-full bg-forest font-semibold text-on-forest">
            Profile
          </Link>
        </div>
      </div>
    );
  }

  const q = matchQuiz[i];
  return (
    <div className="mt-2">
      <p className="text-sm text-ink-soft">
        {i + 1}/{matchQuiz.length}
      </p>
      <Progress value={(i / matchQuiz.length) * 100} className="mt-2" />
      <p className="mt-6 text-xl font-medium">{q.q}</p>
      <ul className="mt-4 flex flex-col gap-2">
        {q.options.map((o) => (
          <li key={o.label}>
            <button
              onClick={() => {
                setVotes((v) => {
                  const n = { ...v };
                  o.ids.forEach((id) => (n[id] = (n[id] ?? 0) + 1));
                  return n;
                });
                setI(i + 1);
              }}
              className="min-h-12 w-full rounded-xl border border-line bg-surface px-4 text-left hover:bg-surface-2"
            >
              {o.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
