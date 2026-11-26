"use client";

import {
  Bookmark, BookmarkPlus, Check, ChevronDown, Download, Moon, Pause, Play, RotateCcw, RotateCw, SkipBack,
  SkipForward, Trash2, X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import { Sheet } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { Progress } from "@/components/ui";
import { getBook } from "@/lib/mock-data";
import { chapterStarts, fmtTime, getNarrator, totalSecs } from "@/lib/mock/audio";
import { type Sleep, useAudio } from "./audio-store";

const speeds = [0.75, 1, 1.25, 1.5, 2];
const sleeps: { label: string; value: Sleep }[] = [
  { label: "Off", value: null },
  { label: "15m", value: { kind: "mins", left: 15 * 60 } },
  { label: "30m", value: { kind: "mins", left: 30 * 60 } },
  { label: "45m", value: { kind: "mins", left: 45 * 60 } },
  { label: "Chapter", value: { kind: "chapter" } },
];

/** Keeps page content clear of the fixed mini player. */
export function AudioSpacer() {
  const { book } = useAudio();
  return book ? <div className="h-16" aria-hidden /> : null;
}

export function MiniPlayer() {
  const a = useAudio();
  const [open, setOpen] = useState(false);
  if (!a.book) return null;
  const book = getBook(a.book.bookId);
  if (!book) return null;
  const total = totalSecs(a.book);

  return (
    <>
      <div className="fixed inset-x-0 bottom-16 z-30 pb-[env(safe-area-inset-bottom)] lg:bottom-0 lg:pb-0">
        {/* mirrors the app layout so the bar sits over the main column on desktop */}
        <div className="mx-auto flex max-w-6xl">
        <div className="hidden w-60 shrink-0 lg:block" aria-hidden />
        <div className="w-full max-w-2xl px-2 pb-2 lg:px-4 lg:pb-3">
          <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-lg">
            <Progress value={(a.pos / total) * 100} className="h-1 rounded-none" />
            <div className="flex items-center gap-3 px-3 py-2">
              <button onClick={() => setOpen(true)} className="flex min-w-0 flex-1 items-center gap-3 text-left" aria-label="Open player">
                <BookCover book={book} size="sm" />
                <span className="min-w-0">
                  <span className="block truncate font-serif">{book.title}</span>
                  <span className="block truncate text-xs text-ink-soft">
                    {a.book.chapters[a.chapter].title} · {fmtTime(a.pos)}
                  </span>
                </span>
              </button>
              <button onClick={() => a.skip(-15)} aria-label="Back 15 seconds" className="hidden size-10 place-items-center rounded-full hover:bg-surface-2 sm:grid">
                <RotateCcw size={18} />
              </button>
              <button
                onClick={a.toggle}
                aria-label={a.playing ? "Pause" : "Play"}
                className="grid size-11 place-items-center rounded-full bg-forest text-on-forest"
              >
                {a.playing ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
              </button>
              <button onClick={a.close} aria-label="Close player" className="grid size-10 place-items-center rounded-full text-ink-soft hover:bg-surface-2">
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>
      <FullPlayer open={open} onClose={() => setOpen(false)} />
    </>
  );
}

function FullPlayer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const a = useAudio();
  const toast = useToast();
  const [panel, setPanel] = useState<"chapters" | "bookmarks" | null>(null);
  if (!a.book) return null;
  const book = getBook(a.book.bookId);
  if (!book) return null;
  const total = totalSecs(a.book);
  const starts = chapterStarts(a.book);
  const marks = a.bookmarks[a.book.bookId] ?? [];
  const dl = a.downloads[a.book.bookId];
  const sleepLabel =
    a.sleep?.kind === "mins" ? fmtTime(a.sleep.left) : a.sleep?.kind === "chapter" ? "End of chapter" : null;

  return (
    <Sheet open={open} onClose={onClose} title="Now playing">
      <div className="flex flex-col items-center text-center">
        <BookCover book={book} size="lg" />
        <p className="mt-4 font-serif text-2xl">{book.title}</p>
        <p className="text-sm text-ink-soft">{getNarrator(a.book.narrator)?.name}</p>
        <p className="mt-1 text-sm font-medium text-forest">{a.book.chapters[a.chapter].title}</p>
      </div>

      <input
        type="range"
        min={0}
        max={total}
        value={a.pos}
        onChange={(e) => a.seek(Number(e.target.value))}
        aria-label="Seek"
        className="mt-5 w-full accent-[var(--forest)]"
      />
      <div className="flex justify-between text-xs text-ink-soft">
        <span>{fmtTime(a.pos)}</span>
        <span>-{fmtTime(total - a.pos)}</span>
      </div>

      <div className="mt-3 flex items-center justify-center gap-3">
        <IconBtn label="Previous chapter" onClick={() => a.goChapter(a.pos - starts[a.chapter] > 3 ? a.chapter : a.chapter - 1)}>
          <SkipBack size={22} />
        </IconBtn>
        <IconBtn label="Back 15 seconds" onClick={() => a.skip(-15)}>
          <RotateCcw size={22} />
        </IconBtn>
        <button
          onClick={a.toggle}
          aria-label={a.playing ? "Pause" : "Play"}
          className="grid size-16 place-items-center rounded-full bg-forest text-on-forest"
        >
          {a.playing ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
        </button>
        <IconBtn label="Forward 15 seconds" onClick={() => a.skip(15)}>
          <RotateCw size={22} />
        </IconBtn>
        <IconBtn label="Next chapter" onClick={() => a.goChapter(a.chapter + 1)}>
          <SkipForward size={22} />
        </IconBtn>
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs text-ink-soft">Speed</p>
        <div role="radiogroup" aria-label="Playback speed" className="grid grid-cols-5 gap-2">
          {speeds.map((sp) => (
            <Seg key={sp} active={a.speed === sp} onClick={() => a.setSpeed(sp)}>
              {sp}×
            </Seg>
          ))}
        </div>
      </div>

      <div className="mt-4">
        <p className="mb-2 flex items-center gap-1 text-xs text-ink-soft">
          <Moon size={12} /> Sleep timer {sleepLabel && <span className="ml-auto font-medium text-forest">{sleepLabel}</span>}
        </p>
        <div role="radiogroup" aria-label="Sleep timer" className="grid grid-cols-5 gap-2">
          {sleeps.map((o) => (
            <Seg
              key={o.label}
              active={o.value === null ? a.sleep === null : o.value.kind === "chapter" ? a.sleep?.kind === "chapter" : false}
              onClick={() => {
                a.setSleep(o.value);
                if (o.value) toast(`Sleep timer: ${o.label}`);
              }}
            >
              {o.label}
            </Seg>
          ))}
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2 text-sm">
        <ActionBtn onClick={() => { a.addBookmark(); toast("Bookmarked"); }}>
          <BookmarkPlus size={18} /> Bookmark
        </ActionBtn>
        <ActionBtn onClick={() => setPanel(panel === "chapters" ? null : "chapters")} active={panel === "chapters"}>
          <ChevronDown size={18} /> Chapters
        </ActionBtn>
        <ActionBtn onClick={() => setPanel(panel === "bookmarks" ? null : "bookmarks")} active={panel === "bookmarks"}>
          <Bookmark size={18} /> {marks.length}
        </ActionBtn>
      </div>

      {panel === "chapters" && (
        <ol className="mt-3 divide-y divide-line rounded-2xl border border-line">
          {a.book.chapters.map((c, i) => (
            <li key={c.title}>
              <button onClick={() => a.goChapter(i)} className="flex h-12 w-full items-center gap-3 px-4 text-left">
                <span className={`flex-1 ${i === a.chapter ? "font-semibold text-forest" : ""}`}>{c.title}</span>
                <span className="text-xs text-ink-soft">{fmtTime(c.secs)}</span>
              </button>
            </li>
          ))}
        </ol>
      )}
      {panel === "bookmarks" && (
        <ul className="mt-3 divide-y divide-line rounded-2xl border border-line">
          {marks.length === 0 && <li className="p-4 text-center text-sm text-ink-soft">No bookmarks</li>}
          {marks.map((m) => (
            <li key={m.at} className="flex items-center gap-2 px-4">
              <button onClick={() => a.seek(m.at)} className="flex h-12 flex-1 items-center gap-3 text-left">
                <Bookmark size={16} className="text-gold" />
                <span className="flex-1">{m.label}</span>
                <span className="text-xs text-ink-soft">{fmtTime(m.at)}</span>
              </button>
              <button onClick={() => a.removeBookmark(m.at)} aria-label="Remove bookmark" className="grid size-9 place-items-center text-ink-soft">
                <Trash2 size={16} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex items-center gap-3 border-t border-line pt-4 text-sm">
        {dl === undefined ? (
          <button onClick={() => a.download(a.book!.bookId)} className="flex items-center gap-2 font-medium text-forest">
            <Download size={18} /> Download for offline
          </button>
        ) : dl < 100 ? (
          <div className="flex flex-1 items-center gap-3">
            <Download size={18} className="text-ink-soft" />
            <Progress value={dl} className="flex-1" />
            <span className="w-10 text-right text-xs text-ink-soft">{dl}%</span>
          </div>
        ) : (
          <span className="flex items-center gap-2 text-forest">
            <Check size={18} /> Downloaded
          </span>
        )}
        <Link href={`/audio/${a.book.bookId}`} onClick={onClose} className="ml-auto text-ink-soft underline-offset-4 hover:underline">
          Details
        </Link>
      </div>
    </Sheet>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick} aria-label={label} className="grid size-12 place-items-center rounded-full hover:bg-surface-2">
      {children}
    </button>
  );
}

function Seg({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={`h-9 rounded-xl border text-sm ${active ? "border-forest bg-forest-soft font-semibold text-forest" : "border-line"}`}
    >
      {children}
    </button>
  );
}

function ActionBtn({ onClick, active, children }: { onClick: () => void; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex h-11 items-center justify-center gap-2 rounded-xl border ${active ? "border-forest text-forest" : "border-line"}`}
    >
      {children}
    </button>
  );
}
