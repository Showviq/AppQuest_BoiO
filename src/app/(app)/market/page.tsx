"use client";

import { Camera, Plus, Search, SlidersHorizontal, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { BookCover } from "@/components/book-cover";
import { ListingCard } from "@/components/market/listing-card";
import { ME, taka, useMyListings } from "@/components/market/my-listings";
import { Sheet } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { BackButton, Button, Chip, PageTitle, Switch, Tabs, field, Rail } from "@/components/ui";
import { books, getBook, searchBooks } from "@/lib/mock-data";
import { type Area, type Condition, areas, conditions, listings } from "@/lib/mock/market";

type Filters = { conditions: Condition[]; max: number; area: Area | null; delivery: boolean; pickup: boolean };
const noFilters: Filters = { conditions: [], max: 500, area: null, delivery: false, pickup: false };

export default function Market() {
  const [tab, setTab] = useState<"buy" | "sell">("buy");
  const [q, setQ] = useState("");
  const [f, setF] = useState<Filters>(noFilters);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sellOpen, setSellOpen] = useState(false);
  const { mine, add, remove } = useMyListings();
  const toast = useToast();

  const activeCount =
    f.conditions.length + (f.max < 500 ? 1 : 0) + (f.area ? 1 : 0) + (f.delivery ? 1 : 0) + (f.pickup ? 1 : 0);

  const results = useMemo(() => {
    const ids = q.trim() ? new Set(searchBooks(q).map((b) => b.id)) : null;
    return listings.filter(
      (l) =>
        (!ids || ids.has(l.bookId)) &&
        (f.conditions.length === 0 || f.conditions.includes(l.condition)) &&
        l.price <= f.max &&
        (!f.area || l.area === f.area) &&
        (!f.delivery || l.delivery) &&
        (!f.pickup || l.pickup)
    );
  }, [q, f]);

  return (
    <>
      <BackButton href="/more" />
      <PageTitle
        action={
          <Button className="min-h-10 px-4 text-sm" onClick={() => setSellOpen(true)}>
            <Plus size={16} /> Sell
          </Button>
        }
      >
        Marketplace
      </PageTitle>

      
      <Tabs
        label="Marketplace"
        value={tab}
        onChange={setTab}
        tabs={[
          { id: "buy", label: "Buy" },
          { id: "sell", label: <>My listings <span className="opacity-60">{mine.length}</span></> },
        ]}
      />

      {tab === "buy" ? (
        <>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
              <input
                type="search"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search listings"
                aria-label="Search listings"
                className="h-12 w-full rounded-full border border-line bg-surface pl-11 pr-4 text-[16px]"
              />
            </div>
            <button
              onClick={() => setFilterOpen(true)}
              aria-label="Filters"
              className="relative grid size-12 place-items-center rounded-full border border-line bg-surface"
            >
              <SlidersHorizontal size={18} />
              {activeCount > 0 && (
                <span className="absolute -right-0.5 -top-0.5 grid size-5 place-items-center rounded-full bg-forest text-[11px] text-on-forest">
                  {activeCount}
                </span>
              )}
            </button>
          </div>

          <Rail as="div" className="mt-3 gap-2">
            {conditions.map((c) => (
              <Chip
                key={c}
                active={f.conditions.includes(c)}
                onClick={() =>
                  setF((x) => ({
                    ...x,
                    conditions: x.conditions.includes(c) ? x.conditions.filter((y) => y !== c) : [...x.conditions, c],
                  }))
                }
              >
                {c}
              </Chip>
            ))}
          </Rail>

          <ul className="mt-4 flex flex-col gap-3">
            {results.map((l) => (
              <li key={l.id}>
                <ListingCard listing={l} />
              </li>
            ))}
          </ul>
          {results.length === 0 && (
            <div className="mt-12 text-center text-ink-soft">
              No listings match.
              <button onClick={() => { setF(noFilters); setQ(""); }} className="mt-2 block w-full font-medium text-forest">
                Clear filters
              </button>
            </div>
          )}
        </>
      ) : mine.length === 0 ? (
        <button
          onClick={() => setSellOpen(true)}
          className="mt-4 block w-full rounded-2xl border border-dashed border-line p-8 text-center text-ink-soft"
        >
          List your first book
        </button>
      ) : (
        <ul className="flex flex-col gap-3">
          {mine.map((l) => {
            const b = getBook(l.bookId)!;
            return (
              <li key={l.id} className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
                <BookCover book={b} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-serif">{b.title}</p>
                  <p className="text-sm text-ink-soft">
                    {taka(l.price)} · {l.condition} · {l.area}
                  </p>
                  <p className="text-xs text-forest">Active · 0 views</p>
                </div>
                <button
                  onClick={() => { remove(l.id); toast("Listing removed"); }}
                  aria-label="Remove listing"
                  className="grid size-10 place-items-center rounded-full text-ink-soft hover:bg-surface-2"
                >
                  <Trash2 size={18} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <Sheet open={filterOpen} onClose={() => setFilterOpen(false)} title="Filters">
        <p className="mb-2 text-sm text-ink-soft">Condition</p>
        <div className="flex flex-wrap gap-2">
          {conditions.map((c) => (
            <Chip
              key={c}
              active={f.conditions.includes(c)}
              onClick={() =>
                setF((x) => ({
                  ...x,
                  conditions: x.conditions.includes(c) ? x.conditions.filter((y) => y !== c) : [...x.conditions, c],
                }))
              }
            >
              {c}
            </Chip>
          ))}
        </div>
        <p className="mb-1 mt-5 flex justify-between text-sm text-ink-soft">
          Max price <span className="font-semibold text-ink">{f.max >= 500 ? "Any" : taka(f.max)}</span>
        </p>
        <input
          type="range"
          min={50}
          max={500}
          step={10}
          value={f.max}
          onChange={(e) => setF((x) => ({ ...x, max: Number(e.target.value) }))}
          aria-label="Max price"
          className="w-full accent-[var(--forest)]"
        />
        <p className="mb-2 mt-5 text-sm text-ink-soft">Location</p>
        <div className="flex flex-wrap gap-2">
          {areas.map((a) => (
            <Chip key={a} active={f.area === a} onClick={() => setF((x) => ({ ...x, area: x.area === a ? null : a }))}>
              {a}
            </Chip>
          ))}
        </div>
        <div className="mt-4 divide-y divide-line">
          <Switch label="Pickup" checked={f.pickup} onChange={(v) => setF((x) => ({ ...x, pickup: v }))} />
          <Switch label="Delivery" checked={f.delivery} onChange={(v) => setF((x) => ({ ...x, delivery: v }))} />
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => setF(noFilters)}>
            Reset
          </Button>
          <Button onClick={() => setFilterOpen(false)}>Show {results.length}</Button>
        </div>
      </Sheet>

      {sellOpen && (
        <SellSheet
          onClose={() => setSellOpen(false)}
          onSubmit={(l) => {
            add(l);
            setTab("sell");
            toast("Listed");
            setSellOpen(false);
          }}
        />
      )}
    </>
  );
}

function SellSheet({ onClose, onSubmit }: { onClose: () => void; onSubmit: (l: (typeof listings)[number]) => void }) {
  const [bookId, setBookId] = useState(books[0].id);
  const [condition, setCondition] = useState<Condition>("Good");
  const [price, setPrice] = useState(150);
  const [area, setArea] = useState<Area>("Dhanmondi");
  const [pickup, setPickup] = useState(true);
  const [delivery, setDelivery] = useState(false);
  const [photos, setPhotos] = useState(0);
  const book = getBook(bookId)!;

  return (
    <Sheet open onClose={onClose} title="Sell a book">
      <div className="flex gap-3">
        <BookCover book={book} size="sm" />
        <label className="flex-1">
          <span className="text-sm text-ink-soft">Book</span>
          <select value={bookId} onChange={(e) => setBookId(e.target.value)} className={`${field} mt-1`}>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="mb-2 mt-4 text-sm text-ink-soft">Photos</p>
      <div className="flex gap-2">
        {Array.from({ length: photos }).map((_, i) => (
          <div
            key={i}
            className="grid size-16 place-items-center rounded-xl text-[10px]"
            style={{ background: book.cover.bg, color: book.cover.fg }}
            aria-label={`Photo ${i + 1}`}
          >
            IMG {i + 1}
          </div>
        ))}
        {photos < 4 && (
          <button
            onClick={() => setPhotos((n) => n + 1)}
            aria-label="Add photo"
            className="grid size-16 place-items-center rounded-xl border border-dashed border-line text-ink-soft"
          >
            <Camera size={20} />
          </button>
        )}
      </div>

      <p className="mb-2 mt-4 text-sm text-ink-soft">Condition</p>
      <div className="flex flex-wrap gap-2">
        {conditions.map((c) => (
          <Chip key={c} active={condition === c} onClick={() => setCondition(c)}>
            {c}
          </Chip>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        <label>
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
        <label>
          <span className="text-sm text-ink-soft">Area</span>
          <select value={area} onChange={(e) => setArea(e.target.value as Area)} className={`${field} mt-1`}>
            {areas.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-3 divide-y divide-line">
        <Switch label="Pickup" checked={pickup} onChange={setPickup} />
        <Switch label="Delivery" checked={delivery} onChange={setDelivery} />
      </div>

      <Button
        className="mt-5 w-full"
        disabled={!price || (!pickup && !delivery)}
        onClick={() =>
          onSubmit({
            id: `m${Date.now()}`,
            bookId,
            seller: ME,
            condition,
            price,
            area,
            pickup,
            delivery,
            ago: "now",
          })
        }
      >
        List for {taka(price)}
      </Button>
    </Sheet>
  );
}
