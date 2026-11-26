"use client";

import { BookMarked, Compass, House, UserRound, UsersRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/", label: "Home", icon: House },
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/library", label: "Library", icon: BookMarked },
  { href: "/community", label: "Community", icon: UsersRound },
  { href: "/profile", label: "Profile", icon: UserRound },
];

function isActive(path: string, href: string) {
  return href === "/" ? path === "/" : path.startsWith(href);
}

export function BottomNav() {
  const path = usePathname();
  return (
    <nav
      aria-label="Main"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
    >
      <ul className="mx-auto grid max-w-lg grid-cols-5">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = isActive(path, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                className={`flex h-16 flex-col items-center justify-center gap-0.5 text-[11px] ${
                  active ? "font-semibold text-forest" : "text-ink-soft"
                }`}
              >
                <Icon size={22} strokeWidth={active ? 2.25 : 1.75} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SideNav() {
  const path = usePathname();
  return (
    <nav aria-label="Main" className="sticky top-0 hidden h-dvh w-60 shrink-0 flex-col gap-1 px-4 py-6 lg:flex">
      <Link href="/" className="mb-6 px-3 font-serif text-3xl text-forest">
        Boi-O
      </Link>
      {tabs.map(({ href, label, icon: Icon }) => {
        const active = isActive(path, href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={`flex h-11 items-center gap-3 rounded-full px-3 ${
              active ? "bg-forest-soft font-semibold text-forest" : "text-ink-soft hover:bg-surface-2"
            }`}
          >
            <Icon size={20} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
