"use client";

import { BadgeCheck, ChevronRight, Crown, LogOut, MapPin, Settings } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { BookCover } from "@/components/book-cover";
import { useLibrary } from "@/components/library-store";
import { usePartner } from "@/components/partner-store";
import { Sheet } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { Accordion, Button, CountUp, Hero, PageTitle } from "@/components/ui";
import { getBook } from "@/lib/mock-data";
import { getPerson } from "@/lib/mock/people";

type Me = { id: string; name: string | null; phone: string; subscriptionStatus: string; profileComplete: boolean };
type Theme = "system" | "light" | "dark";
const statusText = { pending: "Under review", approved: "Verified", rejected: "Not approved" };

export default function Profile() {
  const [me, setMe] = useState<Me | null | undefined>(undefined);
  const [proOpen, setProOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>("system");
  const { library } = useLibrary();
  const toast = useToast();
  const partner = usePartner();

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

  const demo = getPerson("me")!; // bio/location/cover are demo data until the profile API stores them

  if (me === undefined) {
    return <div className="mt-24 h-24 skeleton rounded-2xl" aria-label="Loading" />;
  }

  return (
    <>
      <PageTitle
        action={
          <Link href="/settings" aria-label="Settings" className="grid size-11 place-items-center rounded-full hover:bg-surface-2">
            <Settings size={22} />
          </Link>
        }
      >
        Profile
      </PageTitle>

      {me ? (
        <>
          <Hero
            background={demo.cover}
            avatar={
              <span className="grid size-20 place-items-center rounded-full bg-forest font-serif text-3xl text-on-forest shadow-lg ring-4 ring-bg">
                {(me.name ?? "B").charAt(0).toUpperCase()}
              </span>
            }
            actions={
              <Link
                href="/u/me"
                className="inline-flex h-11 items-center gap-1 rounded-full border border-line bg-surface pl-4 pr-3 text-sm font-semibold hover:bg-surface-2"
              >
                Public profile <ChevronRight size={16} className="text-ink-soft" />
              </Link>
            }
          />
          <h2 className="mt-3 text-2xl font-semibold">{me.name ?? "Reader"}</h2>
          <p className="flex items-center gap-1 text-sm text-ink-soft">
            {me.phone} <BadgeCheck size={14} className="text-forest" aria-label="Verified" />
          </p>
          <p className="mt-2">{demo.bio}</p>
          <p className="mt-1 flex items-center gap-1 text-sm text-ink-soft">
            <MapPin size={14} /> {demo.location}
          </p>
        </>
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
            <dd className="text-2xl font-semibold">
              <CountUp value={s.value} />
            </dd>
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
        <Accordion
          title="Authors & Publishers"
          meta={partner.app ? <span className="text-xs">{statusText[partner.app.status]}</span> : undefined}
        >
          <div className="flex flex-wrap gap-3">
            <Link
              href={partner.app?.status === "approved" ? "/studio" : "/partner"}
              className="inline-flex h-11 items-center rounded-full bg-forest px-5 font-semibold text-on-forest"
            >
              {partner.app?.status === "approved" ? "Open Studio" : partner.app ? "See application" : "Apply"}
            </Link>
          </div>
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
