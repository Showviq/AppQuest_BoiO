// Demo audiobook catalogue. No real audio — durations drive a fake playback clock.

export type Narrator = { id: string; name: string; bio: string; titles: number };
export const narrators: Narrator[] = [
  { id: "n1", name: "শিমুল মুস্তাফা", bio: "Voice actor · recitation", titles: 42 },
  { id: "n2", name: "Tahsin Ahmed", bio: "Radio host · thrillers", titles: 18 },
  { id: "n3", name: "জয়া রহমান", bio: "Stage actor · classics", titles: 27 },
];

export type Chapter = { title: string; secs: number };
export type Audiobook = { bookId: string; narrator: string; chapters: Chapter[]; listeners: number };

const ch = (titles: string[], mins: number[]): Chapter[] => titles.map((t, i) => ({ title: t, secs: mins[i] * 60 }));

export const audiobooks: Audiobook[] = [
  { bookId: "himu", narrator: "n1", listeners: 18200, chapters: ch(["অধ্যায় ১", "অধ্যায় ২", "অধ্যায় ৩", "অধ্যায় ৪"], [22, 18, 25, 20]) },
  { bookId: "feluda", narrator: "n2", listeners: 15400, chapters: ch(["যাত্রা শুরু", "যোধপুর", "জয়সলমীর", "সোনার কেল্লা"], [28, 31, 26, 34]) },
  { bookId: "pather-panchali", narrator: "n3", listeners: 9800, chapters: ch(["বল্লালী বালাই", "আম-আঁটির ভেঁপু", "অক্রূর সংবাদ"], [64, 72, 58]) },
  { bookId: "misir-ali", narrator: "n2", listeners: 12100, chapters: ch(["এক", "দুই", "তিন"], [30, 27, 33]) },
  { bookId: "gitanjali", narrator: "n1", listeners: 7600, chapters: ch(["প্রথম পর্ব", "দ্বিতীয় পর্ব"], [40, 38]) },
  { bookId: "alchemist", narrator: "n2", listeners: 11300, chapters: ch(["Part One", "Part Two", "Epilogue"], [70, 95, 12]) },
];

export const getAudiobook = (bookId: string) => audiobooks.find((a) => a.bookId === bookId);
export const getNarrator = (id: string) => narrators.find((n) => n.id === id);
export const totalSecs = (a: Audiobook) => a.chapters.reduce((n, c) => n + c.secs, 0);

/** Start offset (secs) of each chapter. */
export const chapterStarts = (a: Audiobook) => {
  let t = 0;
  return a.chapters.map((c) => {
    const s = t;
    t += c.secs;
    return s;
  });
};

export function fmtTime(s: number) {
  s = Math.max(0, Math.floor(s));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
}

export function fmtDuration(s: number) {
  const h = Math.floor(s / 3600);
  const m = Math.round((s % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}
