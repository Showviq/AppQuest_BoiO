import {
  Award, BookHeart, BookOpenText, CalendarDays, ChartPie, Drama, Gamepad2, Headphones, Library, MapPin,
  Newspaper, NotebookPen, PenLine, Quote, ScanBarcode, Search, Settings, ShoppingBag,
  Sparkles, Store, Target, UsersRound, SlidersHorizontal, BadgeCheck, Trophy,
} from "lucide-react";
import Link from "next/link";
import { PageTitle } from "@/components/ui";

const groups = [
  {
    title: "Find",
    items: [
      { href: "/search", label: "Search", icon: Search },
      { href: "/browse", label: "Browse", icon: SlidersHorizontal },
      { href: "/moods", label: "Moods", icon: Sparkles },
      { href: "/scan", label: "Scan", icon: ScanBarcode },
    ],
  },
  {
    title: "My reading",
    items: [
      { href: "/library", label: "Library", icon: Library },
      { href: "/diary", label: "Diary", icon: NotebookPen },
      { href: "/goals", label: "Goals", icon: Target },
      { href: "/stats", label: "Stats", icon: ChartPie },
      { href: "/shelves", label: "Shelves", icon: BookHeart },
      { href: "/quote", label: "Quote card", icon: Quote },
    ],
  },
  {
    title: "Social",
    items: [
      { href: "/community", label: "Communities", icon: UsersRound },
      { href: "/clubs", label: "Book clubs", icon: BookOpenText },
      { href: "/compose", label: "New post", icon: PenLine },
    ],
  },
  {
    title: "Marketplace",
    items: [
      { href: "/market", label: "Buy & sell", icon: ShoppingBag },
      { href: "/publisher/onnoprokash", label: "Publishers", icon: Store },
    ],
  },
  {
    title: "Listen & play",
    items: [
      { href: "/audio", label: "Audiobooks", icon: Headphones },
      { href: "/story/himu", label: "Stories", icon: BookOpenText },
      { href: "/characters", label: "Characters", icon: Drama },
      { href: "/quiz", label: "Quizzes", icon: Gamepad2 },
      { href: "/achievements", label: "Achievements", icon: Award },
      { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    ],
  },
  {
    title: "Events & more",
    items: [
      { href: "/events", label: "Events", icon: CalendarDays },
      { href: "/boimela", label: "Boi Mela", icon: MapPin },
      { href: "/magazine", label: "Magazine", icon: Newspaper },
      { href: "/author/humayun-ahmed", label: "Authors", icon: BadgeCheck },
      { href: "/settings", label: "Settings", icon: Settings },
    ],
  },
];

export default function More() {
  return (
    <>
      <PageTitle>More</PageTitle>
      <div className="flex flex-col gap-7">
        {groups.map((g) => (
          <section key={g.title}>
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-ink-soft">{g.title}</h2>
            <ul className="stagger grid grid-cols-4 gap-3 sm:grid-cols-6">
              {g.items.map(({ href, label, icon: Icon }) => (
                <li key={href}>
                  <Link href={href} className="group flex flex-col items-center gap-1.5 text-center text-xs">
                    <span className="grid size-14 place-items-center rounded-2xl border border-line bg-surface text-forest transition group-hover:-translate-y-0.5 group-hover:border-forest/40 group-hover:shadow-md">
                      <Icon size={22} />
                    </span>
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
