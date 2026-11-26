// Demo gamification data.

export type Badge = {
  id: string;
  name: string;
  icon: "BookOpen" | "Flame" | "Languages" | "PenLine" | "Brain" | "MapPin" | "Feather" | "UsersRound" | "Moon";
  earned: boolean;
  how: string;
  progress?: number;
};

export const badges: Badge[] = [
  { id: "first", name: "First book", icon: "BookOpen", earned: true, how: "Finish one book" },
  { id: "streak7", name: "7-day streak", icon: "Flame", earned: true, how: "Read 7 days in a row" },
  { id: "bangla10", name: "Bangla 10", icon: "Languages", earned: true, how: "Read 10 Bangla books" },
  { id: "critic", name: "Critic", icon: "PenLine", earned: false, how: "Write 10 reviews", progress: 40 },
  { id: "quiz", name: "Quiz master", icon: "Brain", earned: false, how: "Score 100% in 5 quizzes", progress: 60 },
  { id: "mela", name: "Mela goer", icon: "MapPin", earned: false, how: "Check in at Boi Mela", progress: 0 },
  { id: "poet", name: "Poetry lover", icon: "Feather", earned: true, how: "Read 3 poetry books" },
  { id: "social", name: "Book buddy", icon: "UsersRound", earned: false, how: "Follow 10 readers", progress: 70 },
  { id: "night", name: "Night owl", icon: "Moon", earned: false, how: "Log reading after midnight 5 times", progress: 20 },
];

export const dailyChallenges = [
  { id: "d1", label: "Read 20 pages", done: 12, total: 20, xp: 20, href: "/library" },
  { id: "d2", label: "Daily quiz", done: 0, total: 1, xp: 50, href: "/quiz/daily" },
  { id: "d3", label: "Rate a book", done: 1, total: 1, xp: 10, href: "/discover" },
];

export const me = { name: "You", level: 7, xp: 1340, levelStart: 1100, nextXp: 1600, streak: 9 };

export type Ranked = { name: string; handle: string; xp: number; books: number };

const base: Ranked[] = [
  { name: "Nusrat", handle: "nusrat.reads", xp: 9820, books: 64 },
  { name: "Tanvir", handle: "tanvir", xp: 8710, books: 51 },
  { name: "Ayesha", handle: "ayesha_k", xp: 8105, books: 49 },
  { name: "Rafi", handle: "rafi.bd", xp: 6240, books: 37 },
  { name: "Mithila", handle: "mithila", xp: 5990, books: 35 },
  { name: "Sabbir", handle: "sabbir", xp: 5120, books: 30 },
  { name: "Farhana", handle: "farhana", xp: 4400, books: 28 },
  { name: "Imran", handle: "imran", xp: 3950, books: 22 },
];

export const leaderboards: Record<"global" | "friends" | "weekly", Ranked[]> = {
  global: base,
  friends: [base[0], base[1], base[3]],
  weekly: [base[2], base[0], base[4], base[1], base[6], base[3], base[5], base[7]].map((r, i) => ({
    ...r,
    xp: 980 - i * 95,
  })),
};

export const myRank = { global: { rank: 214, xp: 1340 }, friends: { rank: 4, xp: 1340 }, weekly: { rank: 38, xp: 210 } };
