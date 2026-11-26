"use client";

import { Flame, NotebookPen, Plus, Timer } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import { allSessions, readingStreak, useLibrary } from "@/components/library-store";
import { Sheet } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { Accordion, BackButton, Button, PageTitle, Stat, Tabs, field } from "@/components/ui";
import { getBook } from "@/lib/mock-data";

const DAY = 86_400_000;
const dayLabel = (t: number) => {
  const d = Math.floor(Date.now() / DAY) - Math.floor(t / DAY);
  if (d === 0) return "Today";
  if (d === 1) return "Yesterday";
  return new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
};

export default function Diary() {
  const { library, logSession, addNote, set } = useLibrary();
  const toast = useToast();
  const [tab, setTab] = useState<"log" | "notes">("log");
  const [sheet, setSheet] = useState<"session" | "note" | null>(null);

  const active = Object.entries(library).filter(([, e]) => ["reading", "rereading", "onhold"].includes(e.shelf));
  const [bookId, setBookId] = useState(active[0]?.[0] ?? "himu");
  const [pages, setPages] = useState(10);
  const [minutes, setMinutes] = useState(20);
  const [note, setNote] = useState("");

  const sessions = allSessions(library);
  const streak = readingStreak(library);
  const weekStart = Date.now() - 7 * DAY;
  const week = sessions.filter((s) => s.date >= weekStart);
  const notes = Object.entries(library)
    .flatMap(([id, e]) => (e.notes ?? []).map((n) => ({ bookId: id, ...n })))
    .sort((a, b) => b.date - a.date);

  // last 7 days dots
  const today = Math.floor(Date.now() / DAY);
  const days = new Set(sessions.map((s) => Math.floor(s.date / DAY)));
  const dots = Array.from({ length: 7 }, (_, i) => today - 6 + i);

  return (
    <>
      <BackButton href="/library" />
      <PageTitle
        action={
          <Button className="min-h-10 px-4 text-sm" onClick={() => setSheet(tab === "notes" ? "note" : "session")}>
            <Plus size={16} /> {tab === "notes" ? "Note" : "Log"}
          </Button>
        }
      >
        Diary
      </PageTitle>

      <div className="rounded-2xl bg-forest p-4 text-on-forest">
        <div className="flex items-center gap-3">
          <Flame size={32} className="text-gold" />
          <div>
            <p className="text-3xl font-semibold leading-none">{streak}</p>
            <p className="text-sm opacity-80">day streak</p>
          </div>
        </div>
        <ul className="mt-4 flex justify-between" aria-label="Last 7 days">
          {dots.map((d) => (
            <li key={d} className="flex flex-col items-center gap-1 text-[11px] opacity-90">
              <span className={`size-7 rounded-full ${days.has(d) ? "bg-gold" : "border border-on-forest/30"}`} />
              {new Date(d * DAY).toLocaleDateString("en-GB", { weekday: "narrow" })}
            </li>
          ))}
        </ul>
      </div>

      <div className="my-5 grid grid-cols-3 rounded-2xl border border-line bg-surface py-4">
        <Stat value={week.length} label="Sessions · 7d" />
        <Stat value={week.reduce((n, s) => n + s.pages, 0)} label="Pages · 7d" />
        <Stat value={`${Math.round(week.reduce((n, s) => n + s.minutes, 0) / 60 * 10) / 10}h`} label="Time · 7d" />
      </div>

      <Tabs
        label="Diary"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "log", label: "Sessions" },
          { id: "notes", label: `Notes ${notes.length}` },
        ]}
      />

      {tab === "log" ? (
        <ul className="divide-y divide-line">
          {sessions.map((s, i) => {
            const b = getBook(s.bookId);
            if (!b) return null;
            return (
              <li key={i} className="flex items-center gap-3 py-3">
                <BookCover book={b} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-serif">{b.title}</p>
                  <p className="flex items-center gap-1 text-sm text-ink-soft">
                    {s.pages} pages · <Timer size={13} /> {s.minutes}m
                  </p>
                </div>
                <span className="text-xs text-ink-soft">{dayLabel(s.date)}</span>
              </li>
            );
          })}
          {sessions.length === 0 && <li className="py-12 text-center text-ink-soft">No sessions yet.</li>}
        </ul>
      ) : (
        <div className="rounded-2xl border border-line bg-surface px-4">
          {Object.entries(library)
            .filter(([, e]) => e.notes?.length)
            .map(([id, e]) => {
              const b = getBook(id);
              if (!b) return null;
              return (
                <Accordion key={id} title={b.title} meta={e.notes!.length} defaultOpen>
                  <ul className="flex flex-col gap-3">
                    {[...e.notes!].reverse().map((n, i) => (
                      <li key={i} className="border-l-2 border-gold pl-3">
                        <p className="font-serif text-ink">{n.text}</p>
                        <p className="text-xs">
                          {n.page ? `p. ${n.page} · ` : ""}
                          {dayLabel(n.date)}
                        </p>
                      </li>
                    ))}
                  </ul>
                  <Link href={`/book/${id}`} className="mt-3 inline-block text-sm text-forest">
                    Open book
                  </Link>
                </Accordion>
              );
            })}
          {notes.length === 0 && (
            <p className="flex flex-col items-center gap-2 py-12 text-ink-soft">
              <NotebookPen size={24} /> No notes yet.
            </p>
          )}
        </div>
      )}

      <Sheet open={sheet !== null} onClose={() => setSheet(null)} title={sheet === "note" ? "New note" : "Log session"}>
        <label className="text-sm text-ink-soft" htmlFor="diary-book">
          Book
        </label>
        <select id="diary-book" value={bookId} onChange={(e) => setBookId(e.target.value)} className={`${field} mt-1`}>
          {(active.length ? active : Object.entries(library)).map(([id]) => (
            <option key={id} value={id}>
              {getBook(id)?.title ?? id}
            </option>
          ))}
        </select>

        {sheet === "session" ? (
          <div className="mt-4 grid grid-cols-2 gap-3">
            <label className="text-sm text-ink-soft">
              Pages
              <input type="number" min={1} value={pages} onChange={(e) => setPages(Math.max(1, Number(e.target.value) || 1))} className={`${field} mt-1`} />
            </label>
            <label className="text-sm text-ink-soft">
              Minutes
              <input type="number" min={1} value={minutes} onChange={(e) => setMinutes(Math.max(1, Number(e.target.value) || 1))} className={`${field} mt-1`} />
            </label>
          </div>
        ) : (
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={4}
            placeholder="Thought, line, page…"
            className="mt-4 w-full resize-none rounded-xl border border-line bg-bg p-3"
          />
        )}

        <Button
          className="mt-5 w-full"
          disabled={sheet === "note" && !note.trim()}
          onClick={() => {
            const b = getBook(bookId);
            const e = library[bookId];
            if (sheet === "session") {
              logSession(bookId, { date: Date.now(), pages, minutes });
              if (b && e) set(bookId, { page: Math.min(b.pages, e.page + pages) });
              toast("Session logged");
            } else {
              addNote(bookId, { date: Date.now(), text: note.trim(), page: e?.page || undefined });
              setNote("");
              toast("Note saved");
            }
            setSheet(null);
          }}
        >
          Save
        </Button>
      </Sheet>
    </>
  );
}
