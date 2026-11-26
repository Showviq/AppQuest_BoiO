"use client";

// Mockup audio engine: no real audio. A 1-second clock advances the position while "playing".

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { type Audiobook, chapterStarts, getAudiobook, totalSecs } from "@/lib/mock/audio";

export type Sleep = null | { kind: "mins"; left: number } | { kind: "chapter" };
export type Bookmark = { at: number; label: string };

type State = {
  bookId: string | null;
  pos: number; // secs from start of book
  playing: boolean;
  speed: number;
  sleep: Sleep;
  bookmarks: Record<string, Bookmark[]>;
  downloads: Record<string, number>; // 0–100
  resume: Record<string, number>; // last position per book
};

type Ctx = State & {
  book: Audiobook | null;
  chapter: number;
  play: (bookId: string, at?: number) => void;
  toggle: () => void;
  seek: (secs: number) => void;
  skip: (delta: number) => void;
  goChapter: (i: number) => void;
  setSpeed: (s: number) => void;
  setSleep: (s: Sleep) => void;
  addBookmark: () => void;
  removeBookmark: (at: number) => void;
  download: (bookId: string) => void;
  close: () => void;
};

const AudioCtx = createContext<Ctx | null>(null);
const KEY = "boio-audio-v1";

const initial: State = {
  bookId: null,
  pos: 0,
  playing: false,
  speed: 1,
  sleep: null,
  bookmarks: {},
  downloads: { feluda: 100 },
  resume: { himu: 1840, feluda: 3900 },
};

function chapterAt(book: Audiobook, pos: number) {
  const starts = chapterStarts(book);
  let i = 0;
  starts.forEach((s, j) => {
    if (pos >= s) i = j;
  });
  return i;
}

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<State>(initial);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const saved = JSON.parse(raw) as Partial<State>;
        setS((cur) => ({ ...cur, ...saved, playing: false, sleep: null }));
      }
    } catch {}
    loaded.current = true;
  }, []);

  // Persist the durable bits (not the playing flag).
  useEffect(() => {
    if (!loaded.current) return;
    try {
      const { bookId, speed, bookmarks, downloads, resume } = s;
      localStorage.setItem(KEY, JSON.stringify({ bookId, speed, bookmarks, downloads, resume }));
    } catch {}
  }, [s]);

  // Playback clock.
  useEffect(() => {
    if (!s.playing) return;
    const t = setInterval(() => {
      setS((cur) => {
        const book = cur.bookId ? getAudiobook(cur.bookId) : undefined;
        if (!book) return { ...cur, playing: false };
        const total = totalSecs(book);
        const pos = Math.min(total, cur.pos + cur.speed);
        let { sleep, playing } = cur;
        if (sleep?.kind === "mins") {
          const left = sleep.left - 1;
          sleep = left > 0 ? { kind: "mins", left } : null;
          if (left <= 0) playing = false;
        } else if (sleep?.kind === "chapter" && chapterAt(book, pos) !== chapterAt(book, cur.pos)) {
          sleep = null;
          playing = false;
        }
        if (pos >= total) playing = false;
        return { ...cur, pos, playing, sleep, resume: { ...cur.resume, [book.bookId]: pos } };
      });
    }, 1000);
    return () => clearInterval(t);
  }, [s.playing]);

  // Fake download progress.
  const downloading = Object.entries(s.downloads).some(([, p]) => p < 100);
  useEffect(() => {
    if (!downloading) return;
    const t = setInterval(() => {
      setS((cur) => ({
        ...cur,
        downloads: Object.fromEntries(
          Object.entries(cur.downloads).map(([k, p]) => [k, p < 100 ? Math.min(100, p + 7) : p])
        ),
      }));
    }, 400);
    return () => clearInterval(t);
  }, [downloading]);

  const book = s.bookId ? getAudiobook(s.bookId) ?? null : null;

  const play = useCallback((bookId: string, at?: number) => {
    setS((cur) => ({
      ...cur,
      bookId,
      pos: at ?? (cur.bookId === bookId ? cur.pos : cur.resume[bookId] ?? 0),
      playing: true,
    }));
  }, []);

  const seek = useCallback((secs: number) => {
    setS((cur) => {
      const b = cur.bookId ? getAudiobook(cur.bookId) : undefined;
      if (!b) return cur;
      const pos = Math.max(0, Math.min(totalSecs(b), secs));
      return { ...cur, pos, resume: { ...cur.resume, [b.bookId]: pos } };
    });
  }, []);

  const value = useMemo<Ctx>(
    () => ({
      ...s,
      book,
      chapter: book ? chapterAt(book, s.pos) : 0,
      play,
      seek,
      toggle: () => setS((cur) => ({ ...cur, playing: cur.bookId ? !cur.playing : false })),
      skip: (d) => seek(s.pos + d),
      goChapter: (i) => {
        if (!book) return;
        const starts = chapterStarts(book);
        seek(starts[Math.max(0, Math.min(starts.length - 1, i))]);
      },
      setSpeed: (speed) => setS((cur) => ({ ...cur, speed })),
      setSleep: (sleep) => setS((cur) => ({ ...cur, sleep })),
      addBookmark: () =>
        setS((cur) => {
          if (!cur.bookId) return cur;
          const b = getAudiobook(cur.bookId);
          const label = b ? b.chapters[chapterAt(b, cur.pos)].title : "";
          const list = cur.bookmarks[cur.bookId] ?? [];
          if (list.some((x) => Math.abs(x.at - cur.pos) < 5)) return cur;
          return {
            ...cur,
            bookmarks: { ...cur.bookmarks, [cur.bookId]: [...list, { at: cur.pos, label }].sort((a, c) => a.at - c.at) },
          };
        }),
      removeBookmark: (at) =>
        setS((cur) =>
          cur.bookId
            ? { ...cur, bookmarks: { ...cur.bookmarks, [cur.bookId]: (cur.bookmarks[cur.bookId] ?? []).filter((x) => x.at !== at) } }
            : cur
        ),
      download: (bookId) =>
        setS((cur) => (bookId in cur.downloads ? cur : { ...cur, downloads: { ...cur.downloads, [bookId]: 0 } })),
      close: () => setS((cur) => ({ ...cur, bookId: null, playing: false, sleep: null })),
    }),
    [s, book, play, seek]
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error("useAudio outside AudioProvider");
  return ctx;
}
