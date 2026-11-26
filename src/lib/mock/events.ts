// Demo literary events and Boi Mela data (illustrative, not the real fair layout).

export const eventTypes = ["Book launch", "Meetup", "Workshop", "Book club"] as const;
export type EventType = (typeof eventTypes)[number];

export type LitEvent = {
  id: string;
  title: string;
  type: EventType;
  date: string; // ISO date
  time: string;
  venue: string;
  area: string;
  host: string;
  seats: number;
  going: number;
  price: number; // 0 = free
  pin?: { x: number; y: number }; // % position on the stylised map; none = online
  about: string;
};

export const events: LitEvent[] = [
  { id: "e1", title: "“নীল খাম” প্রকাশনা উৎসব", type: "Book launch", date: "2026-11-29", time: "17:00", venue: "Bengal Boi", area: "Lalmatia", host: "অন্যপ্রকাশ", seats: 80, going: 54, price: 0, pin: { x: 34, y: 50 }, about: "Reading, signing, tea." },
  { id: "e2", title: "Feluda fan meetup", type: "Meetup", date: "2026-11-30", time: "16:00", venue: "Dhanmondi Lake", area: "Dhanmondi", host: "Thriller & Rohossho", seats: 40, going: 31, price: 0, pin: { x: 40, y: 62 }, about: "Quiz, swap, adda." },
  { id: "e3", title: "Writing short fiction", type: "Workshop", date: "2026-12-02", time: "10:00", venue: "Bishwo Shahitto Kendro", area: "Banglamotor", host: "Boi-O", seats: 25, going: 25, price: 300, pin: { x: 54, y: 52 }, about: "3-hour hands-on workshop." },
  { id: "e4", title: "পথের পাঁচালী পাঠচক্র", type: "Book club", date: "2026-12-03", time: "19:00", venue: "Online", area: "Online", host: "Classics, slowly", seats: 100, going: 47, price: 0, about: "Chapters 1–10." },
  { id: "e5", title: "Translators’ adda", type: "Meetup", date: "2026-12-05", time: "18:00", venue: "Batighor", area: "Banglamotor", host: "বাতিঘর", seats: 30, going: 12, price: 0, pin: { x: 58, y: 47 }, about: "Bangla ↔ English translation talk." },
  { id: "e6", title: "Poetry night", type: "Meetup", date: "2026-12-05", time: "18:30", venue: "Chhayanaut", area: "Dhanmondi", host: "কবিতার আড্ডা", seats: 60, going: 38, price: 0, pin: { x: 37, y: 70 }, about: "Open mic." },
  { id: "e7", title: "Zine making", type: "Workshop", date: "2026-12-06", time: "11:00", venue: "Kolaboti", area: "Gulshan", host: "DU Readers’ Club", seats: 20, going: 9, price: 200, pin: { x: 70, y: 24 }, about: "Bring scissors." },
  { id: "e8", title: "“শহরের শেষ ট্রেন” লঞ্চ", type: "Book launch", date: "2026-12-08", time: "17:30", venue: "Pathak Shamabesh", area: "Shahbag", host: "প্রথমা প্রকাশন", seats: 120, going: 63, price: 0, pin: { x: 56, y: 62 }, about: "Debut novel launch." },
];

/* ── Boi Mela ─────────────────────────────────────────────────────────────── */

export type Zone = "Bangla Academy" | "Suhrawardy Udyan";

/** Stalls placed on a 100×100 venue grid for the SVG map. */
export type MelaStall = { id: string; publisher: string; publisherId?: string; stall: string; zone: Zone; x: number; y: number };
export const melaStalls: MelaStall[] = [
  { id: "s1", publisher: "অন্যপ্রকাশ", publisherId: "onnoprokash", stall: "Pavilion 12", zone: "Suhrawardy Udyan", x: 60, y: 22 },
  { id: "s2", publisher: "প্রথমা প্রকাশন", publisherId: "prothoma", stall: "Pavilion 3", zone: "Suhrawardy Udyan", x: 80, y: 18 },
  { id: "s3", publisher: "সময় প্রকাশন", stall: "Stall 214", zone: "Suhrawardy Udyan", x: 68, y: 42 },
  { id: "s4", publisher: "আগামী প্রকাশনী", stall: "Stall 88", zone: "Bangla Academy", x: 18, y: 68 },
  { id: "s5", publisher: "মাওলা ব্রাদার্স", stall: "Stall 41", zone: "Bangla Academy", x: 32, y: 80 },
  { id: "s6", publisher: "বাতিঘর", publisherId: "batighor", stall: "Pavilion 7", zone: "Suhrawardy Udyan", x: 86, y: 36 },
  { id: "s7", publisher: "কাকলী প্রকাশনী", stall: "Stall 156", zone: "Suhrawardy Udyan", x: 56, y: 50 },
  { id: "s8", publisher: "ঐতিহ্য", stall: "Stall 19", zone: "Bangla Academy", x: 12, y: 86 },
];

export type Crowd = "Low" | "Medium" | "High";
export const crowd: { zone: Zone; level: Crowd; updated: string }[] = [
  { zone: "Bangla Academy", level: "Medium", updated: "5 min ago" },
  { zone: "Suhrawardy Udyan", level: "High", updated: "2 min ago" },
];
export const crowdByHour: { hour: string; level: Crowd }[] = [
  { hour: "3pm", level: "Low" },
  { hour: "4pm", level: "Medium" },
  { hour: "5pm", level: "High" },
  { hour: "6pm", level: "High" },
  { hour: "7pm", level: "Medium" },
  { hour: "8pm", level: "Low" },
];

export const signings: { time: string; author: string; book: string; stall: string }[] = [
  { time: "15:00", author: "মুহম্মদ জাফর ইকবাল", book: "নতুন কিশোর উপন্যাস", stall: "Pavilion 3" },
  { time: "16:30", author: "আনিসুল হক", book: "মা", stall: "Pavilion 3" },
  { time: "17:00", author: "সাদাত হোসাইন", book: "নির্বাসন", stall: "Pavilion 12" },
  { time: "18:30", author: "Shahaduz Zaman", book: "একজন কমলালেবু", stall: "Pavilion 7" },
];
