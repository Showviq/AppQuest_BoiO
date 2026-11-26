// Demo data for search, browse and mood discovery.

import { type Book, books } from "@/lib/mock-data";

export type GenreNode = { id: string; label: string; subs: { id: string; label: string }[] };

/** Two-level genre tree. Sub ids match Book.genres values. */
export const genreTree: GenreNode[] = [
  {
    id: "fiction",
    label: "Fiction",
    subs: [
      { id: "Fiction", label: "Literary" },
      { id: "Classic", label: "Classics" },
      { id: "Young adult", label: "Young adult" },
      { id: "Dystopia", label: "Dystopia" },
    ],
  },
  {
    id: "mystery",
    label: "Mystery & Adventure",
    subs: [
      { id: "Mystery", label: "Detective" },
      { id: "Psychological", label: "Psychological" },
      { id: "Adventure", label: "Adventure" },
    ],
  },
  { id: "poetry", label: "Poetry", subs: [{ id: "Poetry", label: "Poetry" }] },
  {
    id: "nonfiction",
    label: "Non-fiction",
    subs: [
      { id: "Memoir", label: "Memoir" },
      { id: "History", label: "History" },
      { id: "Philosophy", label: "Philosophy" },
    ],
  },
];

export type MoodCard = { id: string; label: string; bn: string; emoji: string; bg: string; fg: string; blurb: string };

export const moodCards: MoodCard[] = [
  { id: "Books that make you cry", label: "Books that make you cry", bn: "কাঁদানো বই", emoji: "😢", bg: "#2c5866", fg: "#e9f0ea", blurb: "Keep tissues close" },
  { id: "Comfort reads", label: "Comfort reads", bn: "আরামের বই", emoji: "☕", bg: "#e2b33c", fg: "#2a1f0a", blurb: "Warm, familiar, easy" },
  { id: "Short reads", label: "Short reads", bn: "এক বসায়", emoji: "⚡", bg: "#c4672f", fg: "#fff3dc", blurb: "Finish in a sitting" },
  { id: "Perspective", label: "Change your perspective", bn: "চোখ খোলা", emoji: "🔭", bg: "#56713f", fg: "#f4ecd2", blurb: "Stay with you for days" },
  { id: "Philosophical", label: "Philosophical", bn: "ভাবনার বই", emoji: "🌙", bg: "#3b2a4a", fg: "#efe3c8", blurb: "Slow and deep" },
  { id: "Emotionally intense", label: "Emotionally intense", bn: "তীব্র", emoji: "🔥", bg: "#8c2b25", fg: "#f6e6cf", blurb: "Hits hard" },
  { id: "Friendship", label: "Friendship", bn: "বন্ধুত্ব", emoji: "🤝", bg: "#3e6fa3", fg: "#f2f2ea", blurb: "Found family" },
];

/* ── Search entities (book / author / character) ─────────────────────── */

export type Suggestion =
  | { kind: "book"; id: string; label: string; alt: string; book: Book }
  | { kind: "author"; id: string; label: string; alt: string }
  | { kind: "character"; id: string; label: string; alt: string; bookId: string };

const characters = [
  { id: "himu", label: "হিমু", alt: "Himu", bookId: "himu", aliases: ["himu", "himuu", "হিমু"] },
  { id: "misir-ali", label: "মিসির আলি", alt: "Misir Ali", bookId: "misir-ali", aliases: ["misir ali", "misir", "মিসির আলি"] },
  { id: "feluda", label: "ফেলুদা", alt: "Feluda", bookId: "feluda", aliases: ["feluda", "felu", "ফেলুদা", "prodosh mitter"] },
  { id: "apu", label: "অপু", alt: "Apu", bookId: "pather-panchali", aliases: ["apu", "opu", "অপু"] },
  { id: "big-brother", label: "Big Brother", alt: "বিগ ব্রাদার", bookId: "1984", aliases: ["big brother", "winston"] },
  { id: "santiago", label: "Santiago", alt: "সান্তিয়াগো", bookId: "alchemist", aliases: ["santiago"] },
];

const norm = (s: string) =>
  s
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/(.)\1+/g, "$1")
    .replace(/sh/g, "s")
    .replace(/w/g, "o")
    .replace(/z/g, "j")
    .replace(/o/g, "a")
    .replace(/\s+/g, " ")
    .trim();

const hit = (fields: string[], q: string) => fields.some((f) => norm(f).includes(q));

const authors = Array.from(new Map(books.map((b) => [b.authorAlt, b])).values());

/** Instant suggestions across books, authors and characters. */
export function suggest(q: string, searchBooks: (q: string) => Book[]): Suggestion[] {
  const nq = norm(q);
  if (!nq) return [];
  const out: Suggestion[] = [];
  for (const c of characters)
    if (hit([c.label, c.alt, ...c.aliases], nq)) out.push({ kind: "character", id: c.id, label: c.label, alt: c.alt, bookId: c.bookId });
  for (const a of authors)
    if (hit([a.author, a.authorAlt], nq))
      out.push({ kind: "author", id: a.authorAlt, label: a.author, alt: a.authorAlt });
  for (const b of searchBooks(q).slice(0, 5))
    out.push({ kind: "book", id: b.id, label: b.title, alt: b.titleAlt, book: b });
  return out.slice(0, 8);
}

export const trendingSearches = ["হিমু", "Feluda", "Nazrul", "মুক্তিযুদ্ধ", "Misir Ali", "Orwell"];
