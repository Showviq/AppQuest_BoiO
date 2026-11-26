// Demo fandom data. Quotes and passages are invented for the mockup, not taken from the books.

export type Character = {
  id: string;
  name: string;
  nameAlt: string;
  universe: string;
  tagline: string;
  traits: string[];
  background: string;
  relations: { id: string; label: string }[];
  quotes: string[];
  books: string[]; // book ids
  connections: string[];
  tint: string;
};

export const universes = ["Himu-verse", "Misir Ali", "Feluda-verse", "Apu trilogy"];

export const characters: Character[] = [
  {
    id: "himu",
    name: "হিমু",
    nameAlt: "Himu",
    universe: "Himu-verse",
    tagline: "Yellow panjabi, bare feet, no plans.",
    traits: ["Wanderer", "Unpredictable", "Kind", "Mystic"],
    background:
      "A young man who walks the streets of Dhaka at night, rejects routine, and seems to know things before they happen. He treats logic as optional.",
    relations: [
      { id: "rupa", label: "Rupa · the one who waits" },
      { id: "misir-ali", label: "Misir Ali · opposite worldview" },
    ],
    quotes: ["A road at midnight has more answers than a room at noon."],
    books: ["himu"],
    connections: ["Same author as Misir Ali", "Intuition vs. logic"],
    tint: "#e2b33c",
  },
  {
    id: "rupa",
    name: "রূপা",
    nameAlt: "Rupa",
    universe: "Himu-verse",
    tagline: "Blue sari, an open window.",
    traits: ["Patient", "Hopeful", "Quiet"],
    background: "Himu's steady anchor. She waits, and her waiting is its own kind of story.",
    relations: [{ id: "himu", label: "Himu" }],
    quotes: ["Some promises are kept just by remembering them."],
    books: ["himu"],
    connections: ["Recurring across the Himu series"],
    tint: "#3e6fa3",
  },
  {
    id: "misir-ali",
    name: "মিসির আলি",
    nameAlt: "Misir Ali",
    universe: "Misir Ali",
    tagline: "Every mystery has a reason.",
    traits: ["Logical", "Curious", "Lonely", "Patient"],
    background:
      "A psychology teacher who investigates the unexplained with notebooks and reason, never quite dismissing what he cannot explain.",
    relations: [{ id: "himu", label: "Himu · opposite worldview" }],
    quotes: ["Fear is a question that hasn't been asked properly."],
    books: ["misir-ali"],
    connections: ["Logic counterpart to Himu"],
    tint: "#3b2a4a",
  },
  {
    id: "feluda",
    name: "ফেলুদা",
    nameAlt: "Feluda",
    universe: "Feluda-verse",
    tagline: "The brain is the weapon.",
    traits: ["Sharp", "Observant", "Witty", "Fit"],
    background: "Pradosh C. Mitter, a private investigator from Kolkata who travels with his cousin and a writer friend.",
    relations: [
      { id: "topshe", label: "Topshe · cousin & narrator" },
      { id: "jatayu", label: "Jatayu · friend" },
    ],
    quotes: ["Notice the thing nobody bothered to notice."],
    books: ["feluda"],
    connections: ["Travel mysteries across India"],
    tint: "#c4672f",
  },
  {
    id: "topshe",
    name: "তোপসে",
    nameAlt: "Topshe",
    universe: "Feluda-verse",
    tagline: "The one taking notes.",
    traits: ["Loyal", "Curious", "Young"],
    background: "Feluda's teenage cousin, assistant and the voice telling the stories.",
    relations: [
      { id: "feluda", label: "Feluda · cousin" },
      { id: "jatayu", label: "Jatayu" },
    ],
    quotes: ["I wrote everything down. He remembered it anyway."],
    books: ["feluda"],
    connections: ["Narrator of the series"],
    tint: "#56713f",
  },
  {
    id: "jatayu",
    name: "জটায়ু",
    nameAlt: "Jatayu",
    universe: "Feluda-verse",
    tagline: "Thriller writer, comic relief.",
    traits: ["Funny", "Brave-ish", "Generous"],
    background: "Lalmohan Ganguly, a popular thriller writer who joins the trips — and the trouble.",
    relations: [{ id: "feluda", label: "Feluda · friend" }],
    quotes: ["In my novels this part goes much faster."],
    books: ["feluda"],
    connections: ["Comic relief across the series"],
    tint: "#8c2b25",
  },
  {
    id: "apu",
    name: "অপু",
    nameAlt: "Apu",
    universe: "Apu trilogy",
    tagline: "A boy who looks at the world in wonder.",
    traits: ["Dreamer", "Sensitive", "Curious"],
    background: "Growing up in a village in Bengal, Apu discovers trains, books, loss and the wide world.",
    relations: [{ id: "durga", label: "Durga · sister" }],
    quotes: ["Past the fields there must be something more."],
    books: ["pather-panchali"],
    connections: ["Classic coming-of-age"],
    tint: "#2c5866",
  },
  {
    id: "durga",
    name: "দুর্গা",
    nameAlt: "Durga",
    universe: "Apu trilogy",
    tagline: "Rain, mango orchards, freedom.",
    traits: ["Spirited", "Protective", "Free"],
    background: "Apu's elder sister, wild and loving, who shows him the secrets of the village.",
    relations: [{ id: "apu", label: "Apu · brother" }],
    quotes: ["Run faster, the rain won't wait for us."],
    books: ["pather-panchali"],
    connections: ["One of Bangla literature's most loved characters"],
    tint: "#b23a1e",
  },
];

export const getCharacter = (id: string) => characters.find((c) => c.id === id);

/* ── Quizzes ───────────────────────────────────────────────────────────── */

export type Question =
  | { kind: "mcq"; q: string; options: string[]; answer: number }
  | { kind: "tf"; q: string; answer: boolean }
  | { kind: "fill"; q: string; answer: string[] } // accepted answers, lowercase
  | { kind: "quote"; quote: string; options: string[]; answer: number } // options = book ids
  | { kind: "image"; bookId: string; q: string; options: string[]; answer: number };

export type Quiz = {
  id: string;
  title: string;
  category: string;
  xp: number;
  seconds: number; // per question when timed
  questions: Question[];
};

export const quizCategories = ["Bangla classics", "Detectives", "Poetry", "Fandom"];

export const quizzes: Quiz[] = [
  {
    id: "daily",
    title: "Daily challenge",
    category: "Bangla classics",
    xp: 50,
    seconds: 20,
    questions: [
      { kind: "mcq", q: "Who wrote Pather Panchali?", options: ["Bibhutibhushan", "Sarat Chandra", "Tagore", "Manik"], answer: 0 },
      { kind: "tf", q: "Gitanjali is a collection of songs and poems.", answer: true },
      { kind: "fill", q: "Feluda's cousin is called ___.", answer: ["topshe", "তোপসে", "tapesh"] },
      { kind: "quote", quote: "Notice the thing nobody bothered to notice.", options: ["feluda", "himu", "lalsalu"], answer: 0 },
      { kind: "image", bookId: "agnibina", q: "Who wrote this book?", options: ["Kazi Nazrul Islam", "Jibanananda Das", "Tagore"], answer: 0 },
    ],
  },
  {
    id: "detectives",
    title: "Detectives of Bangla",
    category: "Detectives",
    xp: 40,
    seconds: 15,
    questions: [
      { kind: "mcq", q: "Misir Ali teaches…", options: ["Psychology", "Physics", "History"], answer: 0 },
      { kind: "tf", q: "Jatayu is a thriller writer.", answer: true },
      { kind: "image", bookId: "feluda", q: "Which detective stars here?", options: ["Feluda", "Byomkesh", "Kiriti"], answer: 0 },
      { kind: "fill", q: "Feluda's real first name: ___ C. Mitter", answer: ["pradosh", "প্রদোষ"] },
    ],
  },
  {
    id: "poetry",
    title: "Poets & poems",
    category: "Poetry",
    xp: 30,
    seconds: 15,
    questions: [
      { kind: "mcq", q: "Agnibina's poet is known as the…", options: ["Rebel poet", "Nature poet", "Court poet"], answer: 0 },
      { kind: "tf", q: "Tagore won the Nobel Prize in 1913.", answer: true },
      { kind: "image", bookId: "gitanjali", q: "Name this collection", options: ["Gitanjali", "Sonar Tori", "Balaka"], answer: 0 },
    ],
  },
  {
    id: "trivia-himu",
    title: "Himu trivia",
    category: "Fandom",
    xp: 30,
    seconds: 15,
    questions: [
      { kind: "mcq", q: "Himu's panjabi colour?", options: ["Yellow", "Blue", "White"], answer: 0 },
      { kind: "tf", q: "Himu always wears shoes.", answer: false },
      { kind: "fill", q: "Himu's creator: Humayun ___", answer: ["ahmed", "আহমেদ"] },
    ],
  },
];

export const getQuiz = (id: string) => quizzes.find((q) => q.id === id);

/** Character-matching personality quiz. Each option scores characters. */
export const matchQuiz: { q: string; options: { label: string; ids: string[] }[] }[] = [
  {
    q: "A free evening. You…",
    options: [
      { label: "Walk with no destination", ids: ["himu", "apu"] },
      { label: "Solve a puzzle", ids: ["feluda", "misir-ali"] },
      { label: "Wait for a friend", ids: ["rupa", "topshe"] },
      { label: "Run out into the rain", ids: ["durga", "jatayu"] },
    ],
  },
  {
    q: "Pick a tool",
    options: [
      { label: "Notebook", ids: ["misir-ali", "topshe"] },
      { label: "Magnifying glass", ids: ["feluda"] },
      { label: "Nothing at all", ids: ["himu", "durga"] },
      { label: "A typewriter", ids: ["jatayu", "apu"] },
    ],
  },
  {
    q: "Friends call you…",
    options: [
      { label: "Weird but kind", ids: ["himu", "jatayu"] },
      { label: "Too logical", ids: ["misir-ali", "feluda"] },
      { label: "Dreamy", ids: ["apu", "rupa"] },
      { label: "Fearless", ids: ["durga", "topshe"] },
    ],
  },
];

/* ── Interactive story (original demo text) ────────────────────────────── */

export type SceneKind = "night" | "rain" | "river" | "dawn";
export type Scene = { id: string; scene: SceneKind; text: string };

export const stories: Record<string, { title: string; bookId: string; scenes: Scene[] }> = {
  himu: {
    title: "A walk at midnight",
    bookId: "himu",
    scenes: [
      { id: "s1", scene: "night", text: "The city had gone quiet. A young man in a yellow panjabi stepped onto the empty road, barefoot, as if the asphalt were a riverbank." },
      { id: "s2", scene: "rain", text: "Rain arrived without warning. He didn't hurry. A rickshaw puller under a tin roof watched him and laughed — some people are simply not in a hurry to be dry." },
      { id: "s3", scene: "river", text: "In his mind there was a river no map showed. He went there when the city became too loud, and tonight it was very loud." },
      { id: "s4", scene: "dawn", text: "By dawn the tea stalls opened. He sat on a bench, counted three crows, and decided today was a good day to do nothing important." },
    ],
  },
};
