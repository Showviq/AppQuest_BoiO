"use client";

import { BadgeCheck, Crown, LogOut } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookCover } from "@/components/book-cover";
import { useLibrary } from "@/components/library-store";
import { Sheet } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { Accordion, Button, PageTitle } from "@/components/ui";
import { getBook } from "@/lib/mock-data";

type Me = { id: string; name: string | null; phone: string; subscriptionStatus: string; profileComplete: boolean };
type Theme = "system" | "light" | "dark";

export default function Profile() {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const [proOpen, setProOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");
  const { library } = useLibrary();
  const toast = useToast();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setMe(d.user))
      .catch(() => setMe(null));
    try {
      setTheme((localStorage.getItem("boio-theme") as Theme) || "system");
    } catch {}
  }, []);

  const applyTheme = (t: Theme) => {
    setTheme(t);
    try {
      if (t === "system") {
        localStorage.removeItem("boio-theme");
        delete document.documentElement.dataset.theme;
      } else {
        localStorage.setItem("boio-theme", t);
        document.documentElement.dataset.theme = t;
      }
    } catch {}
  };

  const signOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe(null);
    toast("Signed out");
  };

  const entries = Object.entries(library);
  const stats = [
    { label: "Read", value: entries.filter(([, e]) => e.shelf === "read").length },
    { label: "Reading", value: entries.filter(([, e]) => e.shelf === "reading").length },
    { label: "Pages", value: entries.reduce((n, [, e]) => n + e.page, 0) },
  ];
  const favourites = entries
    .filter(([, e]) => e.rating)
    .sort(([, a], [, b]) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 4)
    .map(([id]) => getBook(id))
    .filter((b) => b !== undefined);

  if (me === undefined) {
    return <div className="mt-24 h-24 animate-pulse rounded-2xl bg-surface-2" aria-label="Loading" />;
  }

  return (
    <>
      <PageTitle>Profile</PageTitle>

      {me ? (
        <div className="flex items-center gap-4">
          <div className="grid size-16 place-items-center rounded-full bg-forest font-serif text-2xl text-on-forest">
            {(me.name ?? "B").charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-xl font-semibold">{me.name ?? "Reader"}</p>
            <p className="flex items-center gap-1 text-sm text-ink-soft">
              {me.phone} <BadgeCheck size={14} className="text-forest" aria-label="Verified" />
            </p>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl bg-forest p-5 text-on-forest">
          <p className="font-serif text-2xl">Save your reading</p>
          <div className="mt-4 flex gap-3">
            <Link href="/join" className="inline-flex h-11 items-center rounded-full bg-on-forest px-5 font-semibold text-forest">
              Join
            </Link>
            <Link href="/login" className="inline-flex h-11 items-center rounded-full border border-on-forest/40 px-5 font-semibold">
              Sign in
            </Link>
          </div>
        </div>
      )}

      <dl className="mt-6 grid grid-cols-3 rounded-2xl border border-line bg-surface py-4 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <dd className="text-2xl font-semibold">{s.value}</dd>
            <dt className="text-xs text-ink-soft">{s.label}</dt>
          </div>
        ))}
      </dl>

      {favourites.length > 0 && (
        <section className="mt-6">
          <h2 className="mb-3 text-lg font-semibold">Favourites</h2>
          <ul className="grid grid-cols-4 gap-3">
            {favourites.map((b) => (
              <li key={b.id}>
                <Link href={`/book/${b.id}`}>
                  <BookCover book={b} size="sm" />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-6 rounded-2xl border border-line bg-surface px-4">
        <Accordion title="Boi-O Pro" meta={<Crown size={16} className="text-gold" />}>
          <ul className="list-disc pl-5">
            <li>Reading stats</li>
            <li>Boi Mela wishlist & budget</li>
            <li>Daily quote by SMS</li>
          </ul>
          <Button className="mt-4" onClick={() => setProOpen(true)}>
            See plan
          </Button>
        </Accordion>
        <Accordion title="Appearance">
          <div role="radiogroup" aria-label="Theme" className="grid grid-cols-3 gap-2">
            {(["system", "light", "dark"] as Theme[]).map((t) => (
              <button
                key={t}
                role="radio"
                aria-checked={theme === t}
                onClick={() => applyTheme(t)}
                className={`h-10 rounded-xl border text-sm capitalize ${
                  theme === t ? "border-forest bg-forest-soft font-semibold text-forest" : "border-line"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </Accordion>
        {me && (
          <Accordion title="Account">
            <Button variant="ghost" className="-ml-3 text-danger" onClick={signOut}>
              <LogOut size={18} /> Sign out
            </Button>
          </Accordion>
        )}
      </div>

      <Sheet open={proOpen} onClose={() => setProOpen(false)} title="Boi-O Pro">
        <p className="text-3xl font-semibold">
          ৳30 <span className="text-base font-normal text-ink-soft">/ month</span>
        </p>
        <p className="mt-1 text-sm text-ink-soft">From your mobile balance. Cancel anytime.</p>
        <Button className="mt-5 w-full" disabled>
          Coming soon
        </Button>
      </Sheet>
    </>
  );
}
