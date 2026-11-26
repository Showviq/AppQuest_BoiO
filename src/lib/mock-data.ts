// Demo data for the UI mockup. Public metadata only (title, author, year).
// Covers are generated from title + palette — no copyrighted cover art.

export type Book = {
  id: string;
  title: string; // display title (original language)
  titleAlt: string; // English / transliterated title
  author: string;
  authorAlt: string;
  year: number;
  pages: number;
  lang: "bn" | "en";
  genres: string[];
  moods: string[];
  rating: number; // avg, 0–5
  ratings: number;
  aliases: string[]; // Banglish spellings, series names, common typos
  cover: { bg: string; fg: string };
  blurb: string;
};

export const books: Book[] = [
  {
    id: "himu",
    title: "ময়ূরাক্ষী",
    titleAlt: "Mayurakshi",
    author: "হুমায়ূন আহমেদ",
    authorAlt: "Humayun Ahmed",
    year: 1990,
    pages: 96,
    lang: "bn",
    genres: ["Fiction"],
    moods: ["Comfort reads", "Short reads"],
    rating: 4.4,
    ratings: 12840,
    aliases: ["himu", "himuu", "হিমু", "moyurakkhi", "mayurakkhi", "humayun"],
    cover: { bg: "#e2b33c", fg: "#2a1f0a" },
    blurb: "হিমুর প্রথম আবির্ভাব — হলুদ পাঞ্জাবি, খালি পা, আর এক অদ্ভুত নদী।",
  },
  {
    id: "misir-ali",
    title: "দেবী",
    titleAlt: "Debi",
    author: "হুমায়ূন আহমেদ",
    authorAlt: "Humayun Ahmed",
    year: 1985,
    pages: 112,
    lang: "bn",
    genres: ["Mystery", "Psychological"],
    moods: ["Short reads", "Emotionally intense"],
    rating: 4.3,
    ratings: 9310,
    aliases: ["misir ali", "মিসির আলি", "debi", "devi", "humayun"],
    cover: { bg: "#3b2a4a", fg: "#efe3c8" },
    blurb: "মিসির আলির প্রথম রহস্য — যুক্তি বনাম অলৌকিক।",
  },
  {
    id: "feluda",
    title: "সোনার কেল্লা",
    titleAlt: "Sonar Kella",
    author: "সত্যজিৎ রায়",
    authorAlt: "Satyajit Ray",
    year: 1971,
    pages: 128,
    lang: "bn",
    genres: ["Mystery", "Adventure"],
    moods: ["Comfort reads"],
    rating: 4.6,
    ratings: 15220,
    aliases: ["feluda", "ফেলুদা", "shonar kella", "sonar kela", "satyajit"],
    cover: { bg: "#c4672f", fg: "#fff3dc" },
    blurb: "জাতিস্মর মুকুল আর রাজস্থানের মরুভূমিতে ফেলুদা।",
  },
  {
    id: "pather-panchali",
    title: "পথের পাঁচালী",
    titleAlt: "Pather Panchali",
    author: "বিভূতিভূষণ বন্দ্যোপাধ্যায়",
    authorAlt: "Bibhutibhushan Bandyopadhyay",
    year: 1929,
    pages: 288,
    lang: "bn",
    genres: ["Classic", "Fiction"],
    moods: ["Books that make you cry", "Perspective"],
    rating: 4.7,
    ratings: 11400,
    aliases: ["pother pachali", "pather panchali", "opu", "apu", "অপু", "durga", "bibhutibhushan"],
    cover: { bg: "#56713f", fg: "#f4ecd2" },
    blurb: "নিশ্চিন্দিপুরের অপু আর দুর্গার শৈশব।",
  },
  {
    id: "lalsalu",
    title: "লালসালু",
    titleAlt: "Lalsalu",
    author: "সৈয়দ ওয়ালীউল্লাহ্",
    authorAlt: "Syed Waliullah",
    year: 1948,
    pages: 120,
    lang: "bn",
    genres: ["Classic", "Fiction"],
    moods: ["Perspective", "Short reads"],
    rating: 4.2,
    ratings: 7020,
    aliases: ["lal shalu", "lalshalu", "tree without roots", "waliullah"],
    cover: { bg: "#8c2b25", fg: "#f6e6cf" },
    blurb: "মজিদ, একটি মাজার, আর বিশ্বাসের ব্যবসা।",
  },
  {
    id: "padma-nadir-majhi",
    title: "পদ্মানদীর মাঝি",
    titleAlt: "Padma Nadir Majhi",
    author: "মানিক বন্দ্যোপাধ্যায়",
    authorAlt: "Manik Bandopadhyay",
    year: 1936,
    pages: 176,
    lang: "bn",
    genres: ["Classic", "Fiction"],
    moods: ["Emotionally intense"],
    rating: 4.4,
    ratings: 8650,
    aliases: ["podda nodir majhi", "padma", "boatman of the padma", "kuber", "manik"],
    cover: { bg: "#2c5866", fg: "#e9f0ea" },
    blurb: "পদ্মার জেলে কুবেরের জীবন ও স্বপ্ন।",
  },
  {
    id: "srikanta",
    title: "শ্রীকান্ত",
    titleAlt: "Srikanta",
    author: "শরৎচন্দ্র চট্টোপাধ্যায়",
    authorAlt: "Sarat Chandra Chattopadhyay",
    year: 1917,
    pages: 320,
    lang: "bn",
    genres: ["Classic", "Fiction"],
    moods: ["Perspective"],
    rating: 4.3,
    ratings: 6120,
    aliases: ["shrikanto", "srikanto", "sarat", "shorotchandra"],
    cover: { bg: "#4a3b2a", fg: "#ecdcbc" },
    blurb: "ভবঘুরে শ্রীকান্ত আর ইন্দ্রনাথের অভিযান।",
  },
  {
    id: "gitanjali",
    title: "গীতাঞ্জলি",
    titleAlt: "Gitanjali",
    author: "রবীন্দ্রনাথ ঠাকুর",
    authorAlt: "Rabindranath Tagore",
    year: 1910,
    pages: 160,
    lang: "bn",
    genres: ["Poetry", "Classic"],
    moods: ["Philosophical", "Comfort reads"],
    rating: 4.8,
    ratings: 13900,
    aliases: ["geetanjali", "gitanjoli", "tagore", "robindronath", "rabindranath"],
    cover: { bg: "#1f3d2b", fg: "#e7d29a" },
    blurb: "নোবেলজয়ী গানের সংকলন।",
  },
  {
    id: "agnibina",
    title: "অগ্নিবীণা",
    titleAlt: "Agnibina",
    author: "কাজী নজরুল ইসলাম",
    authorAlt: "Kazi Nazrul Islam",
    year: 1922,
    pages: 64,
    lang: "bn",
    genres: ["Poetry", "Classic"],
    moods: ["Short reads", "Emotionally intense"],
    rating: 4.6,
    ratings: 7480,
    aliases: ["ognibina", "agniveena", "bidrohi", "বিদ্রোহী", "nazrul", "nojrul"],
    cover: { bg: "#b23a1e", fg: "#fbe8c4" },
    blurb: "“বিদ্রোহী” সহ নজরুলের প্রথম কাব্যগ্রন্থ।",
  },
  {
    id: "ekattorer-dingulo",
    title: "একাত্তরের দিনগুলি",
    titleAlt: "Ekattorer Dinguli",
    author: "জাহানারা ইমাম",
    authorAlt: "Jahanara Imam",
    year: 1986,
    pages: 272,
    lang: "bn",
    genres: ["Memoir", "History"],
    moods: ["Books that make you cry", "Perspective"],
    rating: 4.8,
    ratings: 10230,
    aliases: ["ekattorer dinguli", "ekattor", "1971", "jahanara", "rumi"],
    cover: { bg: "#2a2b27", fg: "#e6d6ac" },
    blurb: "মুক্তিযুদ্ধের ঢাকা, এক মায়ের দিনলিপি।",
  },
  {
    id: "hajar-bochor",
    title: "হাজার বছর ধরে",
    titleAlt: "Hajar Bochor Dhore",
    author: "জহির রায়হান",
    authorAlt: "Zahir Raihan",
    year: 1964,
    pages: 112,
    lang: "bn",
    genres: ["Classic", "Fiction"],
    moods: ["Short reads", "Emotionally intense"],
    rating: 4.3,
    ratings: 5910,
    aliases: ["hajar bochor dhore", "hazar bachar", "zahir raihan", "johir"],
    cover: { bg: "#6d6a3a", fg: "#f6f0d4" },
    blurb: "পরীর দিঘির পাড়ে এক গ্রামের জীবনচক্র।",
  },
  {
    id: "dipu",
    title: "দীপু নাম্বার টু",
    titleAlt: "Dipu Number Two",
    author: "মুহম্মদ জাফর ইকবাল",
    authorAlt: "Muhammed Zafar Iqbal",
    year: 1984,
    pages: 144,
    lang: "bn",
    genres: ["Young adult", "Adventure"],
    moods: ["Comfort reads", "Friendship"],
    rating: 4.5,
    ratings: 9870,
    aliases: ["dipu number 2", "dipu no 2", "zafar iqbal", "jafor ikbal"],
    cover: { bg: "#3e6fa3", fg: "#f2f2ea" },
    blurb: "নতুন স্কুল, নতুন বন্ধু, আর এক রহস্যময় অভিযান।",
  },
  {
    id: "1984",
    title: "Nineteen Eighty-Four",
    titleAlt: "1984",
    author: "George Orwell",
    authorAlt: "জর্জ অরওয়েল",
    year: 1949,
    pages: 328,
    lang: "en",
    genres: ["Classic", "Dystopia"],
    moods: ["Perspective"],
    rating: 4.6,
    ratings: 18400,
    aliases: ["1984", "orwell", "big brother"],
    cover: { bg: "#9b2226", fg: "#f1e9da" },
    blurb: "Big Brother is watching.",
  },
  {
    id: "alchemist",
    title: "The Alchemist",
    titleAlt: "দ্য আলকেমিস্ট",
    author: "Paulo Coelho",
    authorAlt: "পাওলো কোয়েলহো",
    year: 1988,
    pages: 208,
    lang: "en",
    genres: ["Fiction", "Philosophy"],
    moods: ["Philosophical", "Short reads"],
    rating: 4.1,
    ratings: 16200,
    aliases: ["alkemist", "coelho", "santiago"],
    cover: { bg: "#d9a441", fg: "#3a2a10" },
    blurb: "A shepherd follows a recurring dream across the desert.",
  },
];

export const moods = [
  "Comfort reads",
  "Short reads",
  "Books that make you cry",
  "Perspective",
  "Philosophical",
  "Emotionally intense",
];

export const getBook = (id: string) => books.find((b) => b.id === id);

/* ── Search: Bangla / Banglish / typo tolerant (demo version) ───────────── */

const norm = (s: string) =>
  s
    .normalize("NFC")
    .toLowerCase()
    .replace(/[‌‍]/g, "") // zero-width joiners
    .replace(/[^\p{L}\p{N}\s]/gu, "")
    .replace(/(.)\1+/g, "$1") // himuu → himu
    .replace(/\s+/g, " ")
    .trim();

// Common Banglish spelling variants collapse to one form.
const banglish = (s: string) =>
  norm(s)
    .replace(/sh/g, "s")
    .replace(/oo|ou/g, "u")
    .replace(/ee/g, "i")
    .replace(/w/g, "o")
    .replace(/z/g, "j")
    .replace(/v/g, "b")
    .replace(/ph/g, "f")
    .replace(/o/g, "a");

function score(book: Book, q: string): number {
  const nq = norm(q);
  const bq = banglish(q);
  const fields = [book.title, book.titleAlt, book.author, book.authorAlt, ...book.aliases];
  let best = 0;
  for (const f of fields) {
    const nf = norm(f);
    const bf = banglish(f);
    if (nf === nq || bf === bq) best = Math.max(best, 3);
    else if (nf.startsWith(nq) || bf.startsWith(bq)) best = Math.max(best, 2);
    else if (nf.includes(nq) || bf.includes(bq)) best = Math.max(best, 1);
  }
  return best;
}

export function searchBooks(q: string): Book[] {
  if (!q.trim()) return [];
  return books
    .map((b) => ({ b, s: score(b, q) }))
    .filter((x) => x.s > 0)
    .sort((a, b) => b.s - a.s || b.b.ratings - a.b.ratings)
    .map((x) => x.b);
}

/* ── Feed, communities, Boi Mela ─────────────────────────────────────────── */

export type FeedItem = {
  id: string;
  user: string;
  handle: string;
  bookId: string;
  kind: "review" | "finished" | "started";
  rating?: number;
  text?: string;
  spoiler?: boolean;
  likes: number;
  ago: string;
};

export const feed: FeedItem[] = [
  { id: "f1", user: "Nusrat", handle: "nusrat.reads", bookId: "pather-panchali", kind: "review", rating: 5, text: "দুর্গার জন্য এখনো মন খারাপ।", likes: 48, ago: "2h" },
  { id: "f2", user: "Tanvir", handle: "tanvir", bookId: "feluda", kind: "finished", rating: 4.5, likes: 21, ago: "5h" },
  { id: "f3", user: "Ayesha", handle: "ayesha_k", bookId: "misir-ali", kind: "review", rating: 4, text: "শেষটা আসলে কে ছিল, সেটা নিয়ে ভাবছি…", spoiler: true, likes: 33, ago: "1d" },
  { id: "f4", user: "Rafi", handle: "rafi.bd", bookId: "1984", kind: "started", likes: 9, ago: "1d" },
];

export type Community = { id: string; name: string; members: number; topic: string };

export const communities: Community[] = [
  { id: "c1", name: "হুমায়ূন পাঠক সমাজ", members: 18200, topic: "Bangla fiction" },
  { id: "c2", name: "Thriller & Rohossho", members: 9400, topic: "Mystery" },
  { id: "c3", name: "কবিতার আড্ডা", members: 6100, topic: "Poetry" },
  { id: "c4", name: "DU Readers' Club", members: 2300, topic: "University" },
  { id: "c5", name: "Classics, slowly", members: 4100, topic: "World literature" },
];

export type Stall = { publisher: string; stall: string; zone: string };

export const stalls: Stall[] = [
  { publisher: "অন্যপ্রকাশ", stall: "Pavilion 12", zone: "Suhrawardy Udyan" },
  { publisher: "প্রথমা প্রকাশন", stall: "Pavilion 3", zone: "Suhrawardy Udyan" },
  { publisher: "সময় প্রকাশন", stall: "Stall 214", zone: "Suhrawardy Udyan" },
  { publisher: "আগামী প্রকাশনী", stall: "Stall 88", zone: "Bangla Academy" },
  { publisher: "মাওলা ব্রাদার্স", stall: "Stall 41", zone: "Bangla Academy" },
  { publisher: "বাতিঘর", stall: "Pavilion 7", zone: "Suhrawardy Udyan" },
];
// Note: stall numbers are illustrative demo data, not the real fair layout.
