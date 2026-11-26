// Demo marketplace data. Prices in BDT; sellers are demo users.

export const conditions = ["Brand New", "Like New", "Good", "Acceptable"] as const;
export type Condition = (typeof conditions)[number];

export const areas = ["Dhanmondi", "Mirpur", "Uttara", "Gulshan", "Mohammadpur", "Nilkhet"] as const;
export type Area = (typeof areas)[number];

export type Seller = { handle: string; name: string; rating: number; deals: number };
export const sellers: Record<string, Seller> = {
  "nusrat.reads": { handle: "nusrat.reads", name: "Nusrat", rating: 4.9, deals: 23 },
  tanvir: { handle: "tanvir", name: "Tanvir", rating: 4.6, deals: 8 },
  ayesha_k: { handle: "ayesha_k", name: "Ayesha", rating: 4.8, deals: 15 },
  "rafi.bd": { handle: "rafi.bd", name: "Rafi", rating: 4.3, deals: 4 },
};

export type Listing = {
  id: string;
  bookId: string;
  seller: string; // handle
  condition: Condition;
  price: number;
  area: Area;
  pickup: boolean;
  delivery: boolean;
  note?: string;
  ago: string;
};

export const listings: Listing[] = [
  { id: "l1", bookId: "pather-panchali", seller: "nusrat.reads", condition: "Like New", price: 280, area: "Dhanmondi", pickup: true, delivery: true, note: "No markings.", ago: "2h" },
  { id: "l2", bookId: "feluda", seller: "tanvir", condition: "Good", price: 150, area: "Mirpur", pickup: true, delivery: false, ago: "5h" },
  { id: "l3", bookId: "1984", seller: "ayesha_k", condition: "Brand New", price: 450, area: "Gulshan", pickup: false, delivery: true, note: "Sealed copy.", ago: "1d" },
  { id: "l4", bookId: "himu", seller: "rafi.bd", condition: "Acceptable", price: 90, area: "Nilkhet", pickup: true, delivery: false, note: "Spine worn.", ago: "1d" },
  { id: "l5", bookId: "dipu", seller: "nusrat.reads", condition: "Good", price: 160, area: "Dhanmondi", pickup: true, delivery: true, ago: "2d" },
  { id: "l6", bookId: "alchemist", seller: "tanvir", condition: "Like New", price: 320, area: "Uttara", pickup: false, delivery: true, ago: "3d" },
  { id: "l7", bookId: "lalsalu", seller: "ayesha_k", condition: "Good", price: 120, area: "Mohammadpur", pickup: true, delivery: true, ago: "4d" },
  { id: "l8", bookId: "gitanjali", seller: "rafi.bd", condition: "Brand New", price: 380, area: "Nilkhet", pickup: true, delivery: true, ago: "6d" },
];
export const getListing = (id: string) => listings.find((l) => l.id === id);

export type Publisher = {
  id: string;
  name: string;
  nameAlt: string;
  color: string;
  stall: string;
  followers: number;
  since: number;
  promos: { title: string; sub: string; tint: string }[];
  sections: { title: string; bookIds: string[] }[];
};
export const publishers: Publisher[] = [
  {
    id: "onnoprokash",
    name: "অন্যপ্রকাশ",
    nameAlt: "Anyaprokash",
    color: "#8c2b25",
    stall: "Pavilion 12",
    followers: 48200,
    since: 1991,
    promos: [
      { title: "২৫% ছাড়", sub: "হুমায়ূন সংগ্রহ · Dec only", tint: "#b08d3c" },
      { title: "Free delivery", sub: "Orders over ৳500", tint: "#1f3d2b" },
      { title: "নতুন বই", sub: "Boi Mela 2027 pre-order", tint: "#2c5866" },
    ],
    sections: [
      { title: "Bestsellers", bookIds: ["himu", "misir-ali", "dipu"] },
      { title: "Classics", bookIds: ["pather-panchali", "lalsalu", "srikanta", "padma-nadir-majhi"] },
    ],
  },
  {
    id: "prothoma",
    name: "প্রথমা প্রকাশন",
    nameAlt: "Prothoma",
    color: "#2c5866",
    stall: "Pavilion 3",
    followers: 31500,
    since: 2008,
    promos: [{ title: "১৫% ছাড়", sub: "মুক্তিযুদ্ধের বই", tint: "#8c2b25" }],
    sections: [
      { title: "History & memoir", bookIds: ["ekattorer-dingulo", "hajar-bochor"] },
      { title: "Poetry", bookIds: ["gitanjali", "agnibina"] },
    ],
  },
  {
    id: "batighor",
    name: "বাতিঘর",
    nameAlt: "Batighor",
    color: "#3b2a4a",
    stall: "Pavilion 7",
    followers: 22800,
    since: 2005,
    promos: [{ title: "Buy 2 get 1", sub: "World literature", tint: "#56713f" }],
    sections: [
      { title: "World literature", bookIds: ["1984", "alchemist"] },
      { title: "Staff picks", bookIds: ["feluda", "gitanjali", "pather-panchali"] },
    ],
  },
];
export const getPublisher = (id: string) => publishers.find((p) => p.id === id);
