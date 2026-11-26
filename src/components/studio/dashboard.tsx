"use client";

import { CalendarPlus, Megaphone, Pencil, Plus } from "lucide-react";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import { Sheet } from "@/components/sheet";
import { Stars } from "@/components/stars";
import { useToast } from "@/components/toast";
import { Button, Tabs, field } from "@/components/ui";
import { books, getBook } from "@/lib/mock-data";
import {
  type Campaign, type InventoryItem, type Release, campaigns as seedCampaigns, demographics,
  inventory as seedInventory, ratingDist, recentReviews, releases as seedReleases,
} from "@/lib/mock/pro";

type Tab = "inventory" | "releases" | "campaigns" | "analytics";
const tabs = [
  { id: "inventory", label: "Inventory" },
  { id: "releases", label: "Releases" },
  { id: "campaigns", label: "Campaigns" },
  { id: "analytics", label: "Analytics" },
] as const;

const dateFmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
const statusTone = { Live: "bg-forest text-on-forest", Scheduled: "bg-gold/20 text-ink", Ended: "bg-surface-2 text-ink-soft" };

/** Studio tools: inventory, release scheduler, campaigns, analytics (demo data). */
export function StudioDashboard() {
  const [tab, setTab] = useState<Tab>("inventory");
  return (
    <section className="mt-8">
      <Tabs tabs={tabs} value={tab} onChange={setTab} label="Studio tools" />
      {tab === "inventory" && <Inventory />}
      {tab === "releases" && <Releases />}
      {tab === "campaigns" && <Campaigns />}
      {tab === "analytics" && <Analytics />}
      <p className="mt-4 text-center text-xs text-ink-soft">Demo data</p>
    </section>
  );
}

function Inventory() {
  const [items, setItems] = useState<InventoryItem[]>(seedInventory);
  const [edit, setEdit] = useState<InventoryItem | null>(null);
  const toast = useToast();

  return (
    <>
      <ul className="divide-y divide-line">
        {items.map((it) => {
          const b = getBook(it.bookId);
          if (!b) return null;
          return (
            <li key={it.bookId} className="flex items-center gap-3 py-3">
              <BookCover book={b} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="font-serif">{b.title}</p>
                <p className="text-sm text-ink-soft">৳{it.price}</p>
              </div>
              <span
                className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                  it.stock === 0 ? "bg-danger/15 text-danger" : it.stock < 20 ? "bg-gold/20" : "bg-forest-soft text-forest"
                }`}
              >
                {it.stock === 0 ? "Out" : `${it.stock} in stock`}
              </span>
              <button onClick={() => setEdit(it)} aria-label={`Edit ${b.titleAlt}`} className="grid size-9 place-items-center rounded-full hover:bg-surface-2">
                <Pencil size={16} />
              </button>
            </li>
          );
        })}
      </ul>
      <Sheet open={edit !== null} onClose={() => setEdit(null)} title={getBook(edit?.bookId ?? "")?.title ?? ""}>
        {edit && (
          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();
              setItems((xs) => xs.map((x) => (x.bookId === edit.bookId ? edit : x)));
              setEdit(null);
              toast("Inventory updated");
            }}
          >
            <label className="grid gap-1 text-sm font-medium">
              Stock
              <input className={field} type="number" min={0} value={edit.stock} onChange={(e) => setEdit({ ...edit, stock: Math.max(0, Number(e.target.value) || 0) })} />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              Price (৳)
              <input className={field} type="number" min={0} value={edit.price} onChange={(e) => setEdit({ ...edit, price: Math.max(0, Number(e.target.value) || 0) })} />
            </label>
            <Button type="submit" className="mt-2">Save</Button>
          </form>
        )}
      </Sheet>
    </>
  );
}

function Releases() {
  const [list, setList] = useState<Release[]>(seedReleases);
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Release>({ title: "", date: "", format: "Paperback" });
  const toast = useToast();
  const sorted = [...list].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <>
      <ol className="relative ml-3 border-l-2 border-line">
        {sorted.map((r) => (
          <li key={r.title + r.date} className="mb-5 ml-5">
            <span className="absolute -left-[9px] mt-1 size-4 rounded-full border-2 border-surface bg-gold" aria-hidden />
            <p className="text-sm font-semibold text-forest">{dateFmt(r.date)}</p>
            <p className="font-medium">{r.title}</p>
            <p className="text-sm text-ink-soft">{r.format}</p>
          </li>
        ))}
      </ol>
      <Button variant="outline" className="w-full" onClick={() => setOpen(true)}>
        <CalendarPlus size={18} /> Schedule release
      </Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="Schedule release">
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setList((xs) => [...xs, draft]);
            setDraft({ title: "", date: "", format: "Paperback" });
            setOpen(false);
            toast("Release scheduled");
          }}
        >
          <input className={field} placeholder="Title" aria-label="Title" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} required />
          <input className={field} type="date" aria-label="Release date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} required />
          <select className={field} aria-label="Format" value={draft.format} onChange={(e) => setDraft({ ...draft, format: e.target.value })}>
            {["Paperback", "Hardcover", "eBook", "Audio"].map((f) => (
              <option key={f}>{f}</option>
            ))}
          </select>
          <Button type="submit" className="mt-2">Schedule</Button>
        </form>
      </Sheet>
    </>
  );
}

function Campaigns() {
  const [list, setList] = useState<Campaign[]>(seedCampaigns);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [budget, setBudget] = useState(2000);
  const [bookId, setBookId] = useState(books[0].id);
  const toast = useToast();

  return (
    <>
      <ul className="flex flex-col gap-3">
        {list.map((c) => (
          <li key={c.name} className="rounded-2xl border border-line bg-surface p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="font-medium">{c.name}</p>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusTone[c.status]}`}>{c.status}</span>
            </div>
            <dl className="mt-2 grid grid-cols-2 text-sm">
              <div>
                <dt className="text-ink-soft">Budget</dt>
                <dd className="font-semibold">৳{c.budget.toLocaleString()}</dd>
              </div>
              <div>
                <dt className="text-ink-soft">Reach</dt>
                <dd className="font-semibold">{c.reach ? c.reach.toLocaleString() : "—"}</dd>
              </div>
            </dl>
          </li>
        ))}
      </ul>
      <Button className="mt-4 w-full" onClick={() => setOpen(true)}>
        <Plus size={18} /> New campaign
      </Button>
      <Sheet open={open} onClose={() => setOpen(false)} title="New campaign">
        <form
          className="grid gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setList((xs) => [{ name: name.trim(), status: "Scheduled", budget, reach: 0 }, ...xs]);
            setName("");
            setOpen(false);
            toast("Campaign created");
          }}
        >
          <input className={field} placeholder="Name" aria-label="Campaign name" value={name} onChange={(e) => setName(e.target.value)} required />
          <select className={field} aria-label="Book" value={bookId} onChange={(e) => setBookId(e.target.value)}>
            {books.map((b) => (
              <option key={b.id} value={b.id}>
                {b.titleAlt}
              </option>
            ))}
          </select>
          <label className="grid gap-1 text-sm font-medium">
            Budget · ৳{budget.toLocaleString()}
            <input type="range" min={500} max={20000} step={500} value={budget} onChange={(e) => setBudget(Number(e.target.value))} className="accent-[var(--forest)]" />
          </label>
          <Button type="submit" className="mt-2" disabled={!name.trim()}>
            <Megaphone size={18} /> Create
          </Button>
        </form>
      </Sheet>
    </>
  );
}

function Bars({ data, unit = "%" }: { data: { label: string; value: number }[]; unit?: string }) {
  const max = Math.max(...data.map((d) => d.value));
  return (
    <ul className="flex flex-col gap-2">
      {data.map((d) => (
        <li key={d.label} className="grid grid-cols-[5.5rem_1fr_3rem] items-center gap-2 text-sm">
          <span className="text-ink-soft">{d.label}</span>
          <span className="h-3 overflow-hidden rounded-full bg-surface-2">
            <span className="block h-full rounded-full bg-forest" style={{ width: `${(d.value / max) * 100}%` }} />
          </span>
          <span className="text-right tabular-nums">
            {d.value}
            {unit}
          </span>
        </li>
      ))}
    </ul>
  );
}

function Analytics() {
  const total = ratingDist.reduce((n, r) => n + r.value, 0);
  const avg = ratingDist.reduce((n, r) => n + r.stars * r.value, 0) / total;
  const { bn, en } = demographics.language;

  return (
    <div className="flex flex-col gap-4">
      <div className="rounded-2xl border border-line bg-surface p-4">
        <h3 className="mb-3 font-semibold">Reader age</h3>
        <Bars data={demographics.age} />
      </div>
      <div className="rounded-2xl border border-line bg-surface p-4">
        <h3 className="mb-3 font-semibold">Districts</h3>
        <Bars data={demographics.district} />
      </div>
      <div className="rounded-2xl border border-line bg-surface p-4">
        <h3 className="mb-3 font-semibold">Language</h3>
        <div className="flex h-4 overflow-hidden rounded-full" role="img" aria-label={`Bangla ${bn}%, English ${en}%`}>
          <span className="bg-forest" style={{ width: `${bn}%` }} />
          <span className="bg-gold" style={{ width: `${en}%` }} />
        </div>
        <div className="mt-2 flex justify-between text-sm">
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-forest" /> বাংলা {bn}%</span>
          <span className="flex items-center gap-1.5"><span className="size-2.5 rounded-full bg-gold" /> English {en}%</span>
        </div>
      </div>
      <div className="rounded-2xl border border-line bg-surface p-4">
        <div className="mb-3 flex items-baseline justify-between">
          <h3 className="font-semibold">Ratings</h3>
          <span className="flex items-center gap-1.5 text-sm">
            <Stars value={Math.round(avg * 2) / 2} size={12} /> {avg.toFixed(1)} · {total.toLocaleString()}
          </span>
        </div>
        <Bars data={ratingDist.map((r) => ({ label: `${r.stars} ★`, value: r.value }))} unit="" />
      </div>
      <div className="rounded-2xl border border-line bg-surface p-4">
        <h3 className="mb-2 font-semibold">Recent reviews</h3>
        <ul className="divide-y divide-line">
          {recentReviews.map((r) => (
            <li key={r.user + r.bookId} className="py-2.5 text-sm">
              <p className="flex items-center gap-2">
                <b>{r.user}</b> <Stars value={r.rating} size={11} />
                <span className="ml-auto font-serif text-ink-soft">{getBook(r.bookId)?.title}</span>
              </p>
              <p className="mt-0.5 text-ink-soft">{r.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
