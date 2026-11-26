// Demo data for social feed, comments, communities and book discussions.

export type PostKind = "progress" | "shelved" | "review" | "quote" | "poll" | "recommend" | "community" | "thought";

/** Who can see a post. See `reach` in components/social/my-posts.tsx. */
export type Audience = "public" | "followers" | "community";

export type Post = {
  id: string;
  user: string;
  handle: string;
  kind: PostKind;
  bookId?: string;
  page?: number;
  shelf?: string;
  rating?: number;
  text?: string;
  spoiler?: boolean;
  poll?: { q: string; options: { label: string; votes: number }[] };
  community?: string;
  communityId?: string;
  audience?: Audience;
  mine?: boolean;
  ts?: number;
  likes: number;
  comments: number;
  ago: string;
  feeds: ("foryou" | "following" | "trending" | "latest")[];
};

export const posts: Post[] = [
  { id: "p1", user: "Nusrat", handle: "nusrat.reads", kind: "review", bookId: "pather-panchali", rating: 5, text: "দুর্গার জন্য এখনো মন খারাপ।", likes: 48, comments: 6, ago: "2h", feeds: ["foryou", "following", "trending"] },
  { id: "p2", user: "Tanvir", handle: "tanvir", kind: "progress", bookId: "feluda", page: 96, likes: 12, comments: 1, ago: "3h", feeds: ["following", "latest"] },
  { id: "p3", user: "Ayesha", handle: "ayesha_k", kind: "review", bookId: "misir-ali", rating: 4, text: "শেষটা আসলে কে ছিল, সেটা নিয়ে ভাবছি…", spoiler: true, likes: 33, comments: 9, ago: "4h", feeds: ["foryou", "following"] },
  { id: "p4", user: "Rafi", handle: "rafi.bd", kind: "poll", poll: { q: "Best detective?", options: [{ label: "ফেলুদা", votes: 214 }, { label: "ব্যোমকেশ", votes: 168 }, { label: "মিসির আলি", votes: 190 }] }, likes: 40, comments: 22, ago: "5h", feeds: ["foryou", "trending", "latest"] },
  { id: "p5", user: "Nusrat", handle: "nusrat.reads", kind: "quote", bookId: "gitanjali", text: "আমার মাথা নত করে দাও হে তোমার চরণধুলার তলে।", likes: 87, comments: 4, ago: "6h", feeds: ["foryou", "following", "trending"] },
  { id: "p6", user: "Tanvir", handle: "tanvir", kind: "shelved", bookId: "1984", shelf: "Want to read", likes: 3, comments: 0, ago: "8h", feeds: ["following", "latest"] },
  { id: "p7", user: "Ayesha", handle: "ayesha_k", kind: "recommend", bookId: "dipu", text: "If you liked Feluda as a kid, read this next.", likes: 25, comments: 3, ago: "1d", feeds: ["foryou", "latest"] },
  { id: "p8", user: "Rafi", handle: "rafi.bd", kind: "community", community: "Thriller & Rohossho", text: "December buddy read: দেবী। Who's in?", likes: 18, comments: 11, ago: "1d", feeds: ["foryou", "trending"] },
];

export type Comment = { id: string; user: string; handle: string; text: string; likes: number; ago: string; replies?: Comment[] };

export const comments: Record<string, Comment[]> = {
  p1: [
    { id: "c1", user: "Tanvir", handle: "tanvir", text: "রেলগাড়ির দৃশ্যটা!", likes: 8, ago: "1h", replies: [
      { id: "c1r1", user: "Nusrat", handle: "nusrat.reads", text: "একদম। ছবিটাও দেখো।", likes: 3, ago: "50m" },
    ] },
    { id: "c2", user: "Ayesha", handle: "ayesha_k", text: "Next read: অপরাজিত", likes: 5, ago: "40m" },
  ],
};

export const defaultComments: Comment[] = [
  { id: "d1", user: "Rafi", handle: "rafi.bd", text: "Adding this to my list.", likes: 2, ago: "1h", replies: [
    { id: "d1r1", user: "Ayesha", handle: "ayesha_k", text: "Same here", likes: 1, ago: "30m" },
  ] },
];

/* ── People ───────────────────────────────────────────────────────────── */

export const people = [
  { handle: "nusrat.reads", name: "Nusrat" },
  { handle: "tanvir", name: "Tanvir" },
  { handle: "ayesha_k", name: "Ayesha" },
  { handle: "rafi.bd", name: "Rafi" },
];

export const nameOf = (handle: string) => people.find((p) => p.handle === handle)?.name ?? handle;

/* ── Communities ──────────────────────────────────────────────────────── */

export type Room = {
  id: string;
  name: string;
  type: string; // literature type
  genre: string;
  members: number;
  private?: boolean;
  blurb: string;
};

export const rooms: Room[] = [
  { id: "c1", name: "হুমায়ূন পাঠক সমাজ", type: "Fiction", genre: "Bangla fiction", members: 18200, blurb: "হিমু, মিসির আলি, শুভ্র" },
  { id: "c2", name: "Thriller & Rohossho", type: "Fiction", genre: "Mystery", members: 9400, blurb: "Feluda to Nordic noir" },
  { id: "c3", name: "কবিতার আড্ডা", type: "Poetry", genre: "Poetry", members: 6100, blurb: "রবীন্দ্র, নজরুল, জীবনানন্দ" },
  { id: "c4", name: "DU Readers' Club", type: "Non-fiction", genre: "University", members: 2300, private: true, blurb: "Dhaka University readers" },
  { id: "c5", name: "Classics, slowly", type: "Fiction", genre: "World literature", members: 4100, blurb: "One classic a month" },
  { id: "c6", name: "১৯৭১ পাঠচক্র", type: "Non-fiction", genre: "History", members: 3600, blurb: "মুক্তিযুদ্ধের বই" },
  { id: "c7", name: "Kishore Corner", type: "Children & YA", genre: "Young adult", members: 5200, blurb: "জাফর ইকবাল আর আরও" },
  { id: "c8", name: "Sci-fi Dhaka", type: "Fiction", genre: "Science fiction", members: 1900, private: true, blurb: "Bangla & world SF" },
];

export type Topic = { id: string; title: string; user: string; replies: number; ago: string; spoiler?: boolean; body: string; thread: Comment[] };

export const announcements = [
  { id: "a1", text: "December read: দেবী — discussion on the 20th" },
  { id: "a2", text: "Be kind. Mark spoilers." },
];

export const topics: Topic[] = [
  { id: "t1", title: "Favourite Himu moment?", user: "Nusrat", replies: 42, ago: "2h", body: "Mine is the river in ময়ূরাক্ষী.", thread: [
    { id: "x1", user: "Tanvir", handle: "tanvir", text: "Walking barefoot in the rain.", likes: 6, ago: "1h", replies: [
      { id: "x1r", user: "Ayesha", handle: "ayesha_k", text: "Classic", likes: 2, ago: "40m" },
    ] },
  ] },
  { id: "t2", title: "Misir Ali vs Feluda logic", user: "Rafi", replies: 18, ago: "5h", body: "Who's the better reasoner?", thread: [
    { id: "x2", user: "Ayesha", handle: "ayesha_k", text: "Misir Ali, because he admits doubt.", likes: 4, ago: "3h" },
  ] },
  { id: "t3", title: "Ending of দেবী explained", user: "Ayesha", replies: 27, ago: "1d", spoiler: true, body: "Ranu's final scene…", thread: [] },
];

export const leaderboard = [
  { handle: "nusrat.reads", name: "Nusrat", points: 1240 },
  { handle: "ayesha_k", name: "Ayesha", points: 980 },
  { handle: "rafi.bd", name: "Rafi", points: 760 },
  { handle: "tanvir", name: "Tanvir", points: 610 },
];

export const joinRequests = [
  { handle: "mehedi", name: "Mehedi" },
  { handle: "sadia.b", name: "Sadia" },
];

export const reports = [
  { id: "r1", user: "anon_44", text: "Selling PDF copies, DM me", reason: "Piracy" },
  { id: "r2", user: "troll99", text: "This book is trash and so are you", reason: "Harassment" },
];

/* ── Book discussion ──────────────────────────────────────────────────── */

export type Discussion = { id: string; title: string; user: string; replies: number; spoiler?: boolean };

export const bookDiscussions: Record<"plot" | "themes" | "characters", Discussion[]> = {
  plot: [
    { id: "b1", title: "The ending — what really happened?", user: "Ayesha", replies: 31, spoiler: true },
    { id: "b2", title: "Pacing in the middle chapters", user: "Tanvir", replies: 8 },
  ],
  themes: [
    { id: "b3", title: "Poverty and dignity", user: "Nusrat", replies: 14 },
    { id: "b4", title: "Nature as a character", user: "Rafi", replies: 6 },
  ],
  characters: [
    { id: "b5", title: "Is the narrator reliable?", user: "Rafi", replies: 19, spoiler: true },
    { id: "b6", title: "Favourite side character", user: "Nusrat", replies: 22 },
  ],
};
