"use client";

import { Check, Clock, Download, Headphones, Pause, Play } from "lucide-react";
import { notFound, useParams } from "next/navigation";
import { useAudio } from "@/components/audio/audio-store";
import { BookCover } from "@/components/book-cover";
import { Stars } from "@/components/stars";
import { Accordion, Avatar, BackButton, Button, Progress } from "@/components/ui";
import { getBook } from "@/lib/mock-data";
import { chapterStarts, fmtDuration, fmtTime, getAudiobook, getNarrator, totalSecs } from "@/lib/mock/audio";

export default function AudiobookPage() {
  const { id } = useParams<{ id: string }>();
  const ab = getAudiobook(id);
  const book = getBook(id);
  const a = useAudio();
  if (!ab || !book) notFound();

  const narrator = getNarrator(ab.narrator)!;
  const total = totalSecs(ab);
  const starts = chapterStarts(ab);
  const isCurrent = a.bookId === ab.bookId;
  const pos = isCurrent ? a.pos : a.resume[ab.bookId] ?? 0;
  const dl = a.downloads[ab.bookId];

  return (
    <>
      <BackButton href="/audio" />
      <div className="flex flex-col items-center text-center">
        <BookCover book={book} size="lg" />
        <h1 className="mt-5 font-serif text-3xl leading-tight">{book.title}</h1>
        <p className="text-ink-soft">{book.author}</p>
        <div className="mt-2 flex items-center gap-3 text-sm text-ink-soft">
          <span className="flex items-center gap-1">
            <Clock size={14} /> {fmtDuration(total)}
          </span>
          <span className="flex items-center gap-1">
            <Headphones size={14} /> {(ab.listeners / 1000).toFixed(1)}k
          </span>
          <Stars value={book.rating} size={12} />
        </div>
      </div>

      {pos > 0 && (
        <div className="mt-5 flex items-center gap-3 text-xs text-ink-soft">
          <Progress value={(pos / total) * 100} className="flex-1" />
          {fmtTime(pos)} / {fmtTime(total)}
        </div>
      )}

      <div className="mt-5 grid grid-cols-2 gap-3">
        <Button onClick={() => (isCurrent ? a.toggle() : a.play(ab.bookId))}>
          {isCurrent && a.playing ? <Pause size={18} /> : <Play size={18} />}
          {isCurrent && a.playing ? "Pause" : pos > 0 ? "Resume" : "Play"}
        </Button>
        {dl === undefined ? (
          <Button variant="outline" onClick={() => a.download(ab.bookId)}>
            <Download size={18} /> Download
          </Button>
        ) : dl < 100 ? (
          <div className="flex items-center gap-2 rounded-full border border-line px-4" aria-label={`Downloading ${dl}%`}>
            <Progress value={dl} className="flex-1" />
            <span className="text-xs text-ink-soft">{dl}%</span>
          </div>
        ) : (
          <Button variant="outline" disabled>
            <Check size={18} /> Offline
          </Button>
        )}
      </div>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
        <Avatar name={narrator.name} />
        <div className="min-w-0 flex-1">
          <p className="text-xs text-ink-soft">Narrated by</p>
          <p className="font-medium">{narrator.name}</p>
          <p className="text-sm text-ink-soft">
            {narrator.bio} · {narrator.titles} titles
          </p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-surface px-4">
        <Accordion title="Chapters" meta={ab.chapters.length} defaultOpen>
          <ol className="-mx-1 flex flex-col">
            {ab.chapters.map((c, i) => {
              const active = isCurrent && a.chapter === i;
              return (
                <li key={c.title}>
                  <button
                    onClick={() => a.play(ab.bookId, starts[i])}
                    className="flex h-12 w-full items-center gap-3 rounded-xl px-1 text-left hover:bg-surface-2"
                  >
                    <span className="w-6 text-xs text-ink-soft">{i + 1}</span>
                    <span className={`flex-1 ${active ? "font-semibold text-forest" : "text-ink"}`}>{c.title}</span>
                    {active && a.playing ? <Pause size={14} className="text-forest" /> : <Play size={14} />}
                    <span className="w-12 text-right text-xs">{fmtTime(c.secs)}</span>
                  </button>
                </li>
              );
            })}
          </ol>
        </Accordion>
        <Accordion title="About">
          <p className="font-serif text-ink">{book.blurb}</p>
        </Accordion>
      </div>
    </>
  );
}
