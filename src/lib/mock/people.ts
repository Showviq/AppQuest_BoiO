// Demo reader profiles for the public profile mockup.

export type Person = {
  handle: string;
  name: string;
  bio: string;
  location: string;
  cover: string; // CSS background for the banner
  genres: string[];
  languages: string[];
  authors: string[];
  featured: string[]; // 4 book ids
  shelf: string[]; // public bookshelf book ids
  stats: { books: number; pages: number; streak: number; reviews: number };
  reviews: { bookId: string; rating: number; text: string; ago: string }[];
  lists: { title: string; bookIds: string[] }[];
  badges: string[];
  followers: string[];
  following: string[];
};

const g = (a: string, b: string) => `linear-gradient(135deg, ${a}, ${b})`;

export const people: Person[] = [
  {
    handle: "me",
    name: "You",
    bio: "পড়ি, ভাবি, আবার পড়ি।",
    location: "Dhaka",
    cover: g("#1f3d2b", "#56713f"),
    genres: ["Classic", "Mystery", "Poetry"],
    languages: ["বাংলা", "English"],
    authors: ["সত্যজিৎ রায়", "হুমায়ূন আহমেদ"],
    featured: ["feluda", "pather-panchali", "himu", "gitanjali"],
    shelf: ["feluda", "himu", "pather-panchali", "gitanjali", "1984"],
    stats: { books: 24, pages: 5820, streak: 7, reviews: 6 },
    reviews: [{ bookId: "feluda", rating: 4.5, text: "ফেলুদা কখনো পুরনো হয় না।", ago: "3d" }],
    lists: [{ title: "Rainy day reads", bookIds: ["himu", "gitanjali", "dipu"] }],
    badges: ["First review", "7-day streak", "Boi Mela 2026"],
    followers: ["nusrat.reads", "tanvir"],
    following: ["nusrat.reads", "ayesha_k", "rafi.bd"],
  },
  {
    handle: "nusrat.reads",
    name: "Nusrat",
    bio: "Classics & কবিতা. Slow reader, long reviews.",
    location: "Chattogram",
    cover: g("#8c2b25", "#c4672f"),
    genres: ["Classic", "Poetry", "Memoir"],
    languages: ["বাংলা", "English"],
    authors: ["বিভূতিভূষণ বন্দ্যোপাধ্যায়", "রবীন্দ্রনাথ ঠাকুর", "জাহানারা ইমাম"],
    featured: ["pather-panchali", "gitanjali", "ekattorer-dingulo", "srikanta"],
    shelf: ["pather-panchali", "gitanjali", "ekattorer-dingulo", "srikanta", "lalsalu", "padma-nadir-majhi"],
    stats: { books: 142, pages: 31200, streak: 41, reviews: 58 },
    reviews: [
      { bookId: "pather-panchali", rating: 5, text: "দুর্গার জন্য এখনো মন খারাপ।", ago: "2h" },
      { bookId: "ekattorer-dingulo", rating: 5, text: "প্রতিটি পাতায় এক মায়ের সাহস।", ago: "2w" },
    ],
    lists: [
      { title: "Books that made me cry", bookIds: ["pather-panchali", "ekattorer-dingulo", "padma-nadir-majhi"] },
      { title: "Bangla classics starter", bookIds: ["lalsalu", "srikanta", "gitanjali"] },
    ],
    badges: ["100 books", "30-day streak", "Top reviewer", "Poetry lover", "Boi Mela 2026"],
    followers: ["me", "tanvir", "ayesha_k", "rafi.bd"],
    following: ["ayesha_k", "me"],
  },
  {
    handle: "tanvir",
    name: "Tanvir",
    bio: "Thriller junkie. Feluda > Sherlock.",
    location: "Sylhet",
    cover: g("#2c5866", "#3e6fa3"),
    genres: ["Mystery", "Adventure", "Young adult"],
    languages: ["বাংলা"],
    authors: ["সত্যজিৎ রায়", "মুহম্মদ জাফর ইকবাল"],
    featured: ["feluda", "misir-ali", "dipu", "himu"],
    shelf: ["feluda", "misir-ali", "dipu", "himu"],
    stats: { books: 63, pages: 9800, streak: 3, reviews: 12 },
    reviews: [{ bookId: "feluda", rating: 4.5, text: "জাতিস্মর থিমটা দারুণ।", ago: "5h" }],
    lists: [{ title: "Rohossho for beginners", bookIds: ["feluda", "misir-ali"] }],
    badges: ["Mystery solver", "Quiz champ"],
    followers: ["me", "nusrat.reads"],
    following: ["me", "nusrat.reads", "rafi.bd"],
  },
  {
    handle: "ayesha_k",
    name: "Ayesha",
    bio: "Psych grad. Misir Ali is my therapist.",
    location: "Rajshahi",
    cover: g("#3b2a4a", "#6d6a3a"),
    genres: ["Psychological", "Mystery", "Fiction"],
    languages: ["বাংলা", "English"],
    authors: ["হুমায়ূন আহমেদ", "George Orwell"],
    featured: ["misir-ali", "1984", "himu", "alchemist"],
    shelf: ["misir-ali", "1984", "himu", "alchemist", "hajar-bochor"],
    stats: { books: 88, pages: 15400, streak: 12, reviews: 30 },
    reviews: [{ bookId: "misir-ali", rating: 4, text: "শেষটা আসলে কে ছিল, সেটা নিয়ে ভাবছি…", ago: "1d" }],
    lists: [{ title: "Mind games", bookIds: ["misir-ali", "1984"] }],
    badges: ["Night owl", "50 books"],
    followers: ["me", "nusrat.reads"],
    following: ["nusrat.reads"],
  },
  {
    handle: "rafi.bd",
    name: "Rafi",
    bio: "Reading 1 English book a month. Trying.",
    location: "Khulna",
    cover: g("#b08d3c", "#d9a441"),
    genres: ["Dystopia", "Philosophy"],
    languages: ["English", "বাংলা"],
    authors: ["George Orwell", "Paulo Coelho"],
    featured: ["1984", "alchemist", "agnibina", "dipu"],
    shelf: ["1984", "alchemist"],
    stats: { books: 9, pages: 2100, streak: 1, reviews: 2 },
    reviews: [{ bookId: "alchemist", rating: 3.5, text: "Nice, but a bit too neat.", ago: "1mo" }],
    lists: [],
    badges: ["First review"],
    followers: ["me", "tanvir", "nusrat.reads"],
    following: ["tanvir"],
  },
];

export const getPerson = (handle: string) => people.find((p) => p.handle === decodeURIComponent(handle));

export const blockedDemo = [
  { handle: "spam.books", name: "Cheap PDFs" },
  { handle: "troll99", name: "Anon Reader" },
];
