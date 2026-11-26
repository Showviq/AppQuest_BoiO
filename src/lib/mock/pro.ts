// Demo data for verified author profiles and the Studio dashboard.

export type AuthorProfile = {
  id: string;
  name: string;
  nameAlt: string;
  bio: string;
  born: string;
  followers: number;
  books: string[]; // book ids
  upcoming: { title: string; date: string; note: string }[];
  posts: { text: string; ago: string; likes: number }[];
};

export const authors: AuthorProfile[] = [
  {
    id: "humayun-ahmed",
    name: "হুমায়ূন আহমেদ",
    nameAlt: "Humayun Ahmed",
    bio: "Novelist, dramatist and filmmaker. Creator of Himu and Misir Ali.",
    born: "1948 · Netrokona",
    followers: 182000,
    books: ["himu", "misir-ali"],
    upcoming: [
      { title: "Himu collection — new edition", date: "Feb 2027", note: "Boi Mela launch" },
      { title: "Misir Ali omnibus", date: "Jun 2027", note: "Pre-order soon" },
    ],
    posts: [
      { text: "New illustrated edition of the Himu series arrives at the fair. (Estate account · demo)", ago: "2d", likes: 1240 },
      { text: "Which Misir Ali case should we adapt next? (demo)", ago: "1w", likes: 860 },
    ],
  },
  {
    id: "zafar-iqbal",
    name: "মুহম্মদ জাফর ইকবাল",
    nameAlt: "Muhammed Zafar Iqbal",
    bio: "Writer of science fiction and young adult novels. Educator.",
    born: "1952 · Sylhet",
    followers: 96000,
    books: ["dipu"],
    upcoming: [
      { title: "New YA novel (untitled)", date: "Feb 2027", note: "Boi Mela" },
      { title: "Science fiction anthology", date: "Aug 2027", note: "Announced" },
    ],
    posts: [
      { text: "Thank you, young readers, for all the letters this year. (demo)", ago: "4d", likes: 640 },
    ],
  },
];

export const getAuthor = (id: string) => authors.find((a) => a.id === id);

/* ── Studio ─────────────────────────────────────────────────────────────── */

export type InventoryItem = { bookId: string; stock: number; price: number };
export const inventory: InventoryItem[] = [
  { bookId: "himu", stock: 420, price: 250 },
  { bookId: "misir-ali", stock: 85, price: 280 },
  { bookId: "dipu", stock: 12, price: 300 },
  { bookId: "hajar-bochor", stock: 0, price: 220 },
];

export type Release = { title: string; date: string; format: string };
export const releases: Release[] = [
  { title: "Boi Mela special edition", date: "2027-02-01", format: "Hardcover" },
  { title: "Audiobook: Mayurakshi", date: "2027-03-15", format: "Audio" },
];

export type Campaign = { name: string; status: "Live" | "Scheduled" | "Ended"; budget: number; reach: number };
export const campaigns: Campaign[] = [
  { name: "Mela week boost", status: "Live", budget: 5000, reach: 18400 },
  { name: "Pohela Boishakh offer", status: "Scheduled", budget: 3000, reach: 0 },
  { name: "Eid reading list", status: "Ended", budget: 2000, reach: 9100 },
];

export const demographics = {
  age: [
    { label: "13–17", value: 14 },
    { label: "18–24", value: 38 },
    { label: "25–34", value: 29 },
    { label: "35–44", value: 12 },
    { label: "45+", value: 7 },
  ],
  district: [
    { label: "Dhaka", value: 46 },
    { label: "Chattogram", value: 18 },
    { label: "Sylhet", value: 9 },
    { label: "Rajshahi", value: 8 },
    { label: "Other", value: 19 },
  ],
  language: { bn: 78, en: 22 },
};

export const ratingDist = [
  { stars: 5, value: 612 },
  { stars: 4, value: 388 },
  { stars: 3, value: 120 },
  { stars: 2, value: 41 },
  { stars: 1, value: 19 },
];

export const recentReviews = [
  { user: "Nusrat", rating: 5, text: "Read it twice in one week.", bookId: "himu" },
  { user: "Rafi", rating: 4, text: "Slow start, great ending.", bookId: "misir-ali" },
  { user: "Ayesha", rating: 3.5, text: "Wanted more of the side characters.", bookId: "dipu" },
];
