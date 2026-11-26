"use client";

import { Headphones, Play } from "lucide-react";
import Link from "next/link";
import { useAudio } from "@/components/audio/audio-store";
import { BookCover } from "@/components/book-cover";
import { Avatar, BackButton, PageTitle, Progress, SectionHead, Rail } from "@/components/ui";
import { getBook } from "@/lib/mock-data";
import { audiobooks, fmtDuration, narrators, totalSecs } from "@/lib/mock/audio";

export default function AudioHome() {
  const a = useAudio();
  const continuing = audiobooks.filter((b) => (a.resume[b.bookId] ?? 0) > 0);
  const popular = [...audiobooks].sort((x, y) => y.listeners - x.listeners);

  return (
    <>
      <BackButton href="/more" />
      <PageTitle>Audiobooks</PageTitle>

      {continuing.length > 0 && (
        <section className="mb-8">
          <SectionHead title="Continue listening" />
          <ul className="flex flex-col gap-3">
            {continuing.map((ab) => {
              const book = getBook(ab.bookId)!;
              const pos = a.resume[ab.bookId] ?? 0;
              const total = totalSecs(ab);
              return (
                <li key={ab.bookId} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
                  <Link href={`/audio/${ab.bookId}`} className="flex min-w-0 flex-1 items-center gap-3">
                    <BookCover book={book} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate font-serif">{book.title}</span>
                      <span className="block text-xs text-ink-soft">{fmtDuration(total - pos)} left</span>
                      <Progress value={(pos / total) * 100} className="mt-2" />
                    </span>
                  </Link>
                  <button
                    onClick={() => a.play(ab.bookId)}
                    aria-label={`Play ${book.title}`}
                    className="grid size-11 shrink-0 place-items-center rounded-full bg-forest text-on-forest"
                  >
                    <Play size={18} fill="currentColor" />
                  </button>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <section className="mb-8">
        <SectionHead title="Popular" />
        <Rail className="gap-4 pb-3 pt-1">
          {popular.map((ab) => {
            const book = getBook(ab.bookId)!;
            return (
              <li key={ab.bookId} className="w-28 shrink-0">
                <Link href={`/audio/${ab.bookId}`}>
                  <BookCover book={book} />
                  <p className="mt-2 line-clamp-1 font-serif text-sm">{book.title}</p>
                  <p className="flex items-center gap-1 text-xs text-ink-soft">
                    <Headphones size={11} /> {fmtDuration(totalSecs(ab))}
                  </p>
                </Link>
              </li>
            );
          })}
        </Rail>
      </section>

      <section>
        <SectionHead title="Narrators" />
        <ul className="divide-y divide-line">
          {narrators.map((n) => {
            const theirs = audiobooks.filter((ab) => ab.narrator === n.id);
            return (
              <li key={n.id} className="py-4">
                <div className="flex items-center gap-3">
                  <Avatar name={n.name} />
                  <div>
                    <p className="font-medium">{n.name}</p>
                    <p className="text-sm text-ink-soft">{n.bio}</p>
                  </div>
                </div>
                <ul className="mt-3 flex gap-3">
                  {theirs.map((ab) => (
                    <li key={ab.bookId}>
                      <Link href={`/audio/${ab.bookId}`}>
                        <BookCover book={getBook(ab.bookId)!} size="sm" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </section>
      <p className="mt-6 text-center text-xs text-ink-soft">Demo · no audio files</p>
    </>
  );
}
