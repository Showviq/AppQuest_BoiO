// Demo virtual book clubs.

export type Club = {
  id: string;
  name: string;
  members: number;
  privacy: "Open" | "Request";
  bookId: string;
  schedule: { week: string; part: string; due: string }[];
  meeting: { when: string; where: string; going: number };
  posts: { user: string; handle: string; text: string; ago: string }[];
  people: { name: string; handle: string; role?: string }[];
};

export const clubs: Club[] = [
  {
    id: "classics-slowly",
    name: "Classics, slowly",
    members: 128,
    privacy: "Open",
    bookId: "pather-panchali",
    schedule: [
      { week: "Week 1", part: "Ch. 1–7", due: "1 Dec" },
      { week: "Week 2", part: "Ch. 8–15", due: "8 Dec" },
      { week: "Week 3", part: "Ch. 16–23", due: "15 Dec" },
      { week: "Week 4", part: "Ch. 24–end", due: "22 Dec" },
    ],
    meeting: { when: "Sat 7 Dec · 8:00 PM", where: "Online · voice room", going: 34 },
    posts: [
      { user: "Nusrat", handle: "nusrat.reads", text: "The train scene. That's it, that's the post.", ago: "3h" },
      { user: "Tanvir", handle: "tanvir", text: "Is anyone else reading the illustrated edition?", ago: "1d" },
    ],
    people: [
      { name: "Nusrat", handle: "nusrat.reads", role: "Host" },
      { name: "Tanvir", handle: "tanvir" },
      { name: "Ayesha", handle: "ayesha_k" },
      { name: "Rafi", handle: "rafi.bd" },
    ],
  },
  {
    id: "rohossho-raat",
    name: "Rohossho Raat",
    members: 342,
    privacy: "Request",
    bookId: "misir-ali",
    schedule: [
      { week: "Week 1", part: "Ch. 1–5", due: "3 Dec" },
      { week: "Week 2", part: "Ch. 6–end", due: "10 Dec" },
    ],
    meeting: { when: "Fri 13 Dec · 9:30 PM", where: "Dhanmondi · café", going: 18 },
    posts: [{ user: "Ayesha", handle: "ayesha_k", text: "No spoilers before Friday please!", ago: "5h" }],
    people: [
      { name: "Ayesha", handle: "ayesha_k", role: "Host" },
      { name: "Rafi", handle: "rafi.bd" },
    ],
  },
  {
    id: "kobita-sondhya",
    name: "কবিতা সন্ধ্যা",
    members: 76,
    privacy: "Open",
    bookId: "gitanjali",
    schedule: [
      { week: "Week 1", part: "Poems 1–20", due: "2 Dec" },
      { week: "Week 2", part: "Poems 21–40", due: "9 Dec" },
      { week: "Week 3", part: "Poems 41–60", due: "16 Dec" },
    ],
    meeting: { when: "Sun 8 Dec · 7:00 PM", where: "Online", going: 21 },
    posts: [{ user: "Rafi", handle: "rafi.bd", text: "Bring one poem to read aloud.", ago: "2d" }],
    people: [{ name: "Rafi", handle: "rafi.bd", role: "Host" }, { name: "Nusrat", handle: "nusrat.reads" }],
  },
];

export const getClub = (id: string) => clubs.find((c) => c.id === id);
