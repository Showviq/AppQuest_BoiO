// Original demo articles for the literary magazine mockup.

export type Article = {
  id: string;
  section: "Essays" | "Interviews" | "Lists" | "Fair diary";
  title: string;
  dek: string;
  author: string;
  minutes: number;
  tint: string;
  body: string[];
  pull?: string;
};

export const articles: Article[] = [
  {
    id: "night-readers",
    section: "Essays",
    title: "The night readers of Dhaka",
    dek: "Why so many of us finish books after midnight.",
    author: "Editorial desk",
    minutes: 6,
    tint: "#1f3d2b",
    pull: "A city that never goes quiet leaves one quiet hour — and readers find it.",
    body: [
      "Ask a reader in this city when they read, and the answer is rarely the morning. Traffic, offices and classes take the day. What remains is the hour after the house falls asleep.",
      "That hour has its own habits: a phone torch held at an angle, a cup of tea gone cold, a promise of one more chapter that becomes four.",
      "We spoke to a dozen readers for this piece. Most said the same thing in different words — night is the only time a book gets their full attention.",
      "Perhaps that is why reading streaks break at night too. Miss the quiet hour and the day closes without a page.",
    ],
  },
  {
    id: "first-book-fair",
    section: "Fair diary",
    title: "Your first Boi Mela: a survival guide",
    dek: "Budget, route, and when to arrive.",
    author: "Boi-O team",
    minutes: 4,
    tint: "#b23a1e",
    pull: "Make a list. Then leave room for the book you didn't plan to buy.",
    body: [
      "Arrive early on weekdays; weekends after four are a crowd sport.",
      "Set a budget before you enter and keep a little aside — there is always one surprise.",
      "Start from the far pavilions and walk back towards the gate so the bags get heavier near the exit.",
    ],
  },
  {
    id: "translator",
    section: "Interviews",
    title: "Carrying a sentence across languages",
    dek: "A conversation with a young translator. (demo)",
    author: "Interview desk",
    minutes: 8,
    tint: "#2c5866",
    pull: "Some words don't travel. You build them a small house in the new language.",
    body: [
      "Translation, our guest says, starts with listening rather than writing.",
      "The hardest part is not vocabulary but rhythm — Bangla sentences breathe differently from English ones.",
      "Her advice to new translators: read the original aloud before translating a single line.",
    ],
  },
  {
    id: "short-reads",
    section: "Lists",
    title: "Seven books under 150 pages",
    dek: "For the reader with a busy week.",
    author: "Editorial desk",
    minutes: 3,
    tint: "#b08d3c",
    body: [
      "Short books are not lesser books. These seven can each be finished on a long weekend.",
      "Start with a novella, end with poetry, and you will have read more than you planned.",
    ],
  },
];

export const getArticle = (id: string) => articles.find((a) => a.id === id);
