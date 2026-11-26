"use client";

import { Clock, MapPin, Minus, Phone, Plus, Search, Trash2, UsersRound } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BookCover } from "@/components/book-cover";
import { Sheet } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { Accordion, BackButton, Button, PageTitle, Progress, Tabs, field, Rail } from "@/components/ui";
import { books, getBook } from "@/lib/mock-data";
import { type Crowd, type MelaStall, crowd, crowdByHour, melaStalls, signings } from "@/lib/mock/events";

type Tab = "map" | "stalls" | "schedule" | "wishlist";
type Wish = { bookId: string; price: number; qty: number };

const crowdTint: Record<Crowd, string> = { Low: "bg-forest", Medium: "bg-gold", High: "bg-danger" };
const crowdBar: Record<Crowd, number> = { Low: 33, Medium: 66, High: 100 };
const WKEY = "boio-mela-wishlist-v1";

export default function BoiMela() {
  const [tab, setTab] = useState<Tab>("map");
  const [q, setQ] = useState("");
  const [stall, setStall] = useState<MelaStall | null>(null);

  const matches = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s
      ? melaStalls.filter((x) => x.publisher.includes(q.trim()) || x.stall.toLowerCase().includes(s) || x.publisherId?.includes(s))
      : melaStalls;
  }, [q]);
  const highlight = new Set(q.trim() ? matches.map((m) => m.id) : []);

  return (
    <>
      <BackButton />
      <PageTitle>Boi Mela</PageTitle>

      <div className="mb-4 flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
        <Phone size={20} className="text-forest" />
        <div className="flex-1">
          <p className="font-medium">No internet? Dial *XXX#</p>
          <p className="text-sm text-ink-soft">Any Banglalink phone</p>
        </div>
      </div>

      <div className="relative mb-4">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Publisher or stall no."
          aria-label="Find a publisher or stall"
          className="h-12 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-[16px]"
        />
      </div>

      <Tabs
        label="Boi Mela"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "map", label: "Map" },
          { id: "stalls", label: "Stalls" },
          { id: "schedule", label: "Today" },
          { id: "wishlist", label: "Wishlist" },
        ]}
      />

      {tab === "map" && (
        <>
          <VenueMap highlight={highlight} onPick={setStall} />
          {q.trim() && (
            <p className="mt-2 text-sm text-ink-soft">
              {matches.length ? `${matches.length} found` : "No stall found"}
            </p>
          )}
          <section className="mt-5" aria-label="Crowd">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-semibold">
              <UsersRound size={18} /> Crowd now
            </h2>
            <ul className="grid grid-cols-2 gap-3">
              {crowd.map((c) => (
                <li key={c.zone} className="rounded-2xl border border-line bg-surface p-3">
                  <p className="text-sm">{c.zone}</p>
                  <p className="mt-1 flex items-center gap-2 font-semibold">
                    <span className={`size-2.5 rounded-full ${crowdTint[c.level]}`} /> {c.level}
                  </p>
                  <p className="text-xs text-ink-soft">{c.updated}</p>
                </li>
              ))}
            </ul>
            <div className="mt-3 rounded-2xl border border-line bg-surface p-3">
              <p className="mb-2 text-xs text-ink-soft">Usually busy</p>
              <ul className="flex h-20 items-end gap-2">
                {crowdByHour.map((h) => (
                  <li key={h.hour} className="flex flex-1 flex-col items-center gap-1">
                    <span
                      className={`w-full rounded-t-md ${crowdTint[h.level]} opacity-80`}
                      style={{ height: `${crowdBar[h.level] * 0.5}px` }}
                      aria-label={`${h.hour}: ${h.level}`}
                    />
                    <span className="text-[10px] text-ink-soft">{h.hour}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </>
      )}

      {tab === "stalls" && (
        <ul className="divide-y divide-line">
          {matches.map((s) => (
            <li key={s.id}>
              <button onClick={() => setStall(s)} className="flex w-full items-center gap-3 py-3 text-left">
                <MapPin size={18} className="text-gold" />
                <span className="flex-1 font-medium">{s.publisher}</span>
                <span className="text-right text-sm text-ink-soft">
                  {s.stall}
                  <br />
                  {s.zone}
                </span>
              </button>
            </li>
          ))}
          {matches.length === 0 && <li className="py-6 text-center text-ink-soft">No publisher found.</li>}
        </ul>
      )}

      {tab === "schedule" && (
        <ol className="relative ml-2 border-l border-line">
          {signings.map((s) => (
            <li key={s.time + s.author} className="relative pb-5 pl-5">
              <span className="absolute -left-[5px] top-1.5 size-2.5 rounded-full bg-gold" aria-hidden />
              <p className="flex items-center gap-1 text-sm font-semibold text-forest">
                <Clock size={14} /> {s.time}
              </p>
              <p className="font-medium">{s.author}</p>
              <p className="text-sm text-ink-soft">
                {s.book} · {s.stall}
              </p>
            </li>
          ))}
        </ol>
      )}

      {tab === "wishlist" && <Wishlist />}

      <div className="mt-6 rounded-2xl border border-line bg-surface px-4">
        <Accordion title="Trending at the fair">
          <Rail className="gap-3 pb-1" bleed={false}>
            {[...books]
              .filter((b) => b.lang === "bn")
              .sort((a, b) => b.ratings - a.ratings)
              .slice(0, 6)
              .map((b) => (
                <li key={b.id} className="w-20 shrink-0">
                  <Link href={`/book/${b.id}`}>
                    <BookCover book={b} size="sm" />
                  </Link>
                </li>
              ))}
          </Rail>
        </Accordion>
      </div>
      <p className="mt-4 text-center text-xs text-ink-soft">Demo stall data</p>

      <Sheet open={!!stall} onClose={() => setStall(null)} title={stall?.publisher ?? ""}>
        {stall && (
          <>
            <p className="flex items-center gap-2 text-lg">
              <MapPin size={20} className="text-gold" /> {stall.stall}
            </p>
            <p className="text-ink-soft">{stall.zone}</p>
            <ul className="mt-4 flex flex-col gap-2 text-sm">
              {signings
                .filter((s) => s.stall === stall.stall)
                .map((s) => (
                  <li key={s.time} className="flex items-center gap-2 rounded-xl bg-surface-2 px-3 py-2">
                    <Clock size={14} /> {s.time} · {s.author}
                  </li>
                ))}
            </ul>
            {stall.publisherId && (
              <Link
                href={`/publisher/${stall.publisherId}`}
                className="mt-5 inline-flex min-h-11 w-full items-center justify-center rounded-full bg-forest font-semibold text-on-forest"
              >
                Storefront
              </Link>
            )}
          </>
        )}
      </Sheet>
    </>
  );
}

/** Two venue zones on one stylised plan. Not the real layout. */
function VenueMap({ highlight, onPick }: { highlight: Set<string>; onPick: (s: MelaStall) => void }) {
  const dim = highlight.size > 0;
  return (
    <div className="relative aspect-square overflow-hidden rounded-2xl border border-line bg-surface-2 sm:aspect-[4/3]">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
        <rect x="4" y="56" width="38" height="40" rx="4" fill="var(--gold)" opacity=".15" />
        <rect x="46" y="4" width="50" height="62" rx="4" fill="var(--forest)" opacity=".12" />
        <path d="M0 50 L100 50" stroke="var(--line)" strokeWidth="3" />
        <path d="M44 0 L44 100" stroke="var(--line)" strokeWidth="2" strokeDasharray="2 2" />
        <g fontSize="3.2" fill="var(--ink-soft)">
          <text x="6" y="62">Bangla Academy</text>
          <text x="48" y="10">Suhrawardy Udyan</text>
          <text x="6" y="48">TSC →</text>
          <text x="10" y="30">Entrance</text>
        </g>
      </svg>
      {melaStalls.map((s) => {
        const hit = highlight.has(s.id);
        const pav = s.stall.startsWith("Pavilion");
        return (
          <button
            key={s.id}
            onClick={() => onPick(s)}
            aria-label={`${s.publisher}, ${s.stall}`}
            className={`absolute grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-lg border text-[10px] font-semibold transition ${
              pav ? "h-8 w-11" : "h-6 w-9"
            } ${
              hit
                ? "z-10 scale-125 border-gold bg-gold text-[#2a1f0a] shadow-lg"
                : `border-line bg-surface ${dim ? "opacity-40" : ""}`
            }`}
            style={{ left: `${s.x}%`, top: `${s.y}%` }}
          >
            {pav ? `P${s.stall.split(" ")[1]}` : s.stall.split(" ")[1]}
          </button>
        );
      })}
    </div>
  );
}

function Wishlist() {
  const toast = useToast();
  const [items, setItems] = useState<Wish[]>([
    { bookId: "himu", price: 200, qty: 1 },
    { bookId: "dipu", price: 250, qty: 1 },
  ]);
  const [budget, setBudget] = useState(1500);
  const [addOpen, setAddOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WKEY);
      if (raw) {
        const d = JSON.parse(raw);
        setItems(d.items);
        setBudget(d.budget);
      }
    } catch {}
    setLoaded(true);
  }, []);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(WKEY, JSON.stringify({ items, budget }));
    } catch {}
  }, [items, budget, loaded]);

  const total = items.reduce((n, i) => n + i.price * i.qty, 0);
  const left = budget - total;
  const discount = Math.round(total * 0.25); // fair-wide 25% commission discount

  return (
    <>
      <div className="rounded-2xl border border-line bg-surface p-4">
        <label className="flex items-center justify-between gap-3">
          <span className="text-sm text-ink-soft">Budget</span>
          <span className="flex items-center gap-1">
            ৳
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={budget}
              onChange={(e) => setBudget(Math.max(0, Number(e.target.value) || 0))}
              className="w-24 rounded-lg border border-line bg-bg px-2 py-1 text-right text-lg font-semibold"
              aria-label="Budget in taka"
            />
          </span>
        </label>
        <Progress value={budget ? (total / budget) * 100 : 100} className="mt-3" />
        <div className="mt-3 grid grid-cols-3 text-center">
          <div>
            <p className="font-semibold">৳{total}</p>
            <p className="text-xs text-ink-soft">List price</p>
          </div>
          <div>
            <p className="font-semibold">৳{total - discount}</p>
            <p className="text-xs text-ink-soft">With 25% off</p>
          </div>
          <div>
            <p className={`font-semibold ${left < 0 ? "text-danger" : "text-forest"}`}>
              {left < 0 ? `−৳${-left}` : `৳${left}`}
            </p>
            <p className="text-xs text-ink-soft">{left < 0 ? "Over" : "Left"}</p>
          </div>
        </div>
      </div>

      <ul className="mt-4 divide-y divide-line">
        {items.map((i) => {
          const b = getBook(i.bookId)!;
          const setQty = (qty: number) =>
            setItems((xs) => (qty <= 0 ? xs.filter((x) => x.bookId !== i.bookId) : xs.map((x) => (x.bookId === i.bookId ? { ...x, qty } : x))));
          return (
            <li key={i.bookId} className="flex items-center gap-3 py-3">
              <BookCover book={b} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate font-serif">{b.title}</p>
                <p className="text-sm text-ink-soft">৳{i.price}</p>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => setQty(i.qty - 1)} aria-label="Less" className="grid size-8 place-items-center rounded-full border border-line">
                  {i.qty === 1 ? <Trash2 size={14} /> : <Minus size={14} />}
                </button>
                <span className="w-6 text-center">{i.qty}</span>
                <button onClick={() => setQty(i.qty + 1)} aria-label="More" className="grid size-8 place-items-center rounded-full border border-line">
                  <Plus size={14} />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <Button variant="outline" className="mt-3 w-full" onClick={() => setAddOpen(true)}>
        <Plus size={18} /> Add book
      </Button>

      {addOpen && (
        <AddWish
          exclude={items.map((i) => i.bookId)}
          onClose={() => setAddOpen(false)}
          onAdd={(w) => {
            setItems((xs) => [...xs, w]);
            setAddOpen(false);
            toast("Added to wishlist");
          }}
        />
      )}
    </>
  );
}

function AddWish({ exclude, onClose, onAdd }: { exclude: string[]; onClose: () => void; onAdd: (w: Wish) => void }) {
  const options = books.filter((b) => !exclude.includes(b.id));
  const [bookId, setBookId] = useState(options[0]?.id ?? "");
  const [price, setPrice] = useState(250);
  return (
    <Sheet open onClose={onClose} title="Add to wishlist">
      {options.length === 0 ? (
        <p className="text-ink-soft">All books added.</p>
      ) : (
        <>
          <label className="block">
            <span className="text-sm text-ink-soft">Book</span>
            <select value={bookId} onChange={(e) => setBookId(e.target.value)} className={`${field} mt-1`}>
              {options.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title}
                </option>
              ))}
            </select>
          </label>
          <label className="mt-3 block">
            <span className="text-sm text-ink-soft">Price (৳)</span>
            <input
              type="number"
              inputMode="numeric"
              min={0}
              value={price}
              onChange={(e) => setPrice(Math.max(0, Number(e.target.value) || 0))}
              className={`${field} mt-1`}
            />
          </label>
          <Button className="mt-5 w-full" disabled={!bookId} onClick={() => onAdd({ bookId, price, qty: 1 })}>
            Add
          </Button>
        </>
      )}
    </Sheet>
  );
}
