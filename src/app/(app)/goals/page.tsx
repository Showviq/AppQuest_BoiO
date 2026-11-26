"use client";

import { Pencil } from "lucide-react";
import { useEffect, useState } from "react";
import { allSessions, useLibrary } from "@/components/library-store";
import { Sheet } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { BackButton, Button, Card, PageTitle, Progress, field } from "@/components/ui";

type Goals = { yearBooks: number; monthBooks: number; yearPages: number; dailyMinutes: number };
const KEY = "boio-goals";
const defaults: Goals = { yearBooks: 24, monthBooks: 2, yearPages: 6000, dailyMinutes: 20 };
// Demo history so the dashboard isn't empty: books finished earlier this year.
const DEMO_BOOKS_THIS_YEAR = 17;
const DEMO_PAGES_THIS_YEAR = 4120;
const DEMO_BOOKS_THIS_MONTH = 1;

function Ring({ value, size = 160 }: { value: number; size?: number }) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  const pct = Math.min(1, value);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={12} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--forest)"
        strokeWidth={12}
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c * (1 - pct)}
      />
    </svg>
  );
}

export default function GoalsPage() {
  const { library } = useLibrary();
  const toast = useToast();
  const [goals, setGoals] = useState<Goals>(defaults);
  const [draft, setDraft] = useState<Goals>(defaults);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setGoals({ ...defaults, ...JSON.parse(raw) });
    } catch {}
  }, []);

  const read = Object.values(library).filter((e) => e.shelf === "read").length;
  const booksYear = DEMO_BOOKS_THIS_YEAR + read;
  const booksMonth = DEMO_BOOKS_THIS_MONTH + read;
  const pagesYear = DEMO_PAGES_THIS_YEAR + Object.values(library).reduce((n, e) => n + e.page, 0);
  const DAY = 86_400_000;
  const todayMin = allSessions(library)
    .filter((s) => Math.floor(s.date / DAY) === Math.floor(Date.now() / DAY))
    .reduce((n, s) => n + s.minutes, 0);

  const now = new Date();
  const dayOfYear = Math.floor((+now - +new Date(now.getFullYear(), 0, 1)) / DAY) + 1;
  const expected = Math.round((goals.yearBooks * dayOfYear) / 365);
  const diff = booksYear - expected;

  const rows = [
    { label: "This month", value: booksMonth, goal: goals.monthBooks, unit: "books" },
    { label: "Pages this year", value: pagesYear, goal: goals.yearPages, unit: "pages" },
    { label: "Today", value: todayMin, goal: goals.dailyMinutes, unit: "min" },
  ];

  return (
    <>
      <BackButton href="/library" />
      <PageTitle
        action={
          <button
            onClick={() => {
              setDraft(goals);
              setOpen(true);
            }}
            aria-label="Edit goals"
            className="grid size-11 place-items-center rounded-full hover:bg-surface-2"
          >
            <Pencil size={20} />
          </button>
        }
      >
        Goals
      </PageTitle>

      <Card className="flex flex-col items-center p-6">
        <div className="relative">
          <Ring value={booksYear / goals.yearBooks} />
          <div className="absolute inset-0 grid place-items-center text-center">
            <div>
              <p className="text-4xl font-semibold">{booksYear}</p>
              <p className="text-sm text-ink-soft">of {goals.yearBooks}</p>
            </div>
          </div>
        </div>
        <p className="mt-3 font-medium">{now.getFullYear()} reading challenge</p>
        <p className={`text-sm ${diff >= 0 ? "text-forest" : "text-danger"}`}>
          {diff >= 0 ? `${diff} ahead of schedule` : `${-diff} behind schedule`}
        </p>
      </Card>

      <ul className="mt-4 flex flex-col gap-3">
        {rows.map((r) => (
          <li key={r.label}>
            <Card className="p-4">
              <div className="mb-2 flex items-baseline justify-between">
                <span className="font-medium">{r.label}</span>
                <span className="text-sm text-ink-soft">
                  <b className="text-ink">{r.value.toLocaleString()}</b> / {r.goal.toLocaleString()} {r.unit}
                </span>
              </div>
              <Progress value={(r.value / r.goal) * 100} />
            </Card>
          </li>
        ))}
      </ul>

      <Sheet open={open} onClose={() => setOpen(false)} title="Edit goals">
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              ["yearBooks", "Books / year"],
              ["monthBooks", "Books / month"],
              ["yearPages", "Pages / year"],
              ["dailyMinutes", "Minutes / day"],
            ] as [keyof Goals, string][]
          ).map(([k, label]) => (
            <label key={k} className="text-sm text-ink-soft">
              {label}
              <input
                type="number"
                min={1}
                value={draft[k]}
                onChange={(e) => setDraft({ ...draft, [k]: Math.max(1, Number(e.target.value) || 1) })}
                className={`${field} mt-1`}
              />
            </label>
          ))}
        </div>
        <Button
          className="mt-5 w-full"
          onClick={() => {
            setGoals(draft);
            try {
              localStorage.setItem(KEY, JSON.stringify(draft));
            } catch {}
            toast("Goals updated");
            setOpen(false);
          }}
        >
          Save
        </Button>
      </Sheet>
    </>
  );
}
