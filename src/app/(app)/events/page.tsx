"use client";

import { CalendarDays, Check, Clock, List, Map as MapIcon, MapPin, UsersRound, Video } from "lucide-react";
import { useState } from "react";
import { Sheet } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { BackButton, Button, Chip, PageTitle, Progress, Rail } from "@/components/ui";
import { type EventType, type LitEvent, eventTypes, events } from "@/lib/mock/events";

const TODAY = new Date("2026-11-27");
const iso = (d: Date) => d.toISOString().slice(0, 10);
const days = Array.from({ length: 14 }, (_, i) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() + i);
  return d;
});
const dayLabel = (s: string) => new Date(s).toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short" });
const typeTint: Record<EventType, string> = {
  "Book launch": "#b08d3c",
  Meetup: "#2c5866",
  Workshop: "#8c2b25",
  "Book club": "#56713f",
};

export default function Events() {
  const toast = useToast();
  const [view, setView] = useState<"list" | "map">("list");
  const [type, setType] = useState<EventType | null>(null);
  const [date, setDate] = useState<string | null>(null);
  const [open, setOpen] = useState<LitEvent | null>(null);
  const [going, setGoing] = useState<Set<string>>(new Set(["e2"]));

  const list = events.filter((e) => (!type || e.type === type) && (!date || e.date === date));
  const hasEvent = new Set(events.map((e) => e.date));

  const register = (e: LitEvent) => {
    const leaving = going.has(e.id);
    setGoing((s) => {
      const n = new Set(s);
      if (leaving) n.delete(e.id);
      else n.add(e.id);
      return n;
    });
    toast(leaving ? "Registration cancelled" : "You're going");
  };

  return (
    <>
      <BackButton href="/more" />
      <PageTitle
        action={
          <div role="radiogroup" aria-label="View" className="flex rounded-full border border-line bg-surface p-1">
            {(["list", "map"] as const).map((v) => (
              <button
                key={v}
                role="radio"
                aria-checked={view === v}
                aria-label={v === "list" ? "List view" : "Map view"}
                onClick={() => setView(v)}
                className={`grid h-9 w-11 place-items-center rounded-full ${view === v ? "bg-forest text-on-forest" : "text-ink-soft"}`}
              >
                {v === "list" ? <List size={18} /> : <MapIcon size={18} />}
              </button>
            ))}
          </div>
        }
      >
        Events
      </PageTitle>

      <Rail className="gap-2 pb-1" label="Dates">
        {days.map((d) => {
          const k = iso(d);
          const on = date === k;
          return (
            <li key={k}>
              <button
                onClick={() => setDate(on ? null : k)}
                aria-pressed={on}
                className={`flex h-16 w-12 flex-col items-center justify-center rounded-2xl border text-xs ${
                  on ? "border-forest bg-forest text-on-forest" : "border-line bg-surface"
                }`}
              >
                <span className={on ? "" : "text-ink-soft"}>{d.toLocaleDateString("en-GB", { weekday: "short" })}</span>
                <span className="text-lg font-semibold leading-tight">{d.getDate()}</span>
                <span className={`size-1 rounded-full ${hasEvent.has(k) ? (on ? "bg-on-forest" : "bg-gold") : "bg-transparent"}`} />
              </button>
            </li>
          );
        })}
      </Rail>

      <Rail as="div" className="mt-3 gap-2">
        {eventTypes.map((t) => (
          <Chip key={t} active={type === t} onClick={() => setType(type === t ? null : t)}>
            {t}
          </Chip>
        ))}
      </Rail>

      {view === "map" ? (
        <DhakaMap events={list} onOpen={setOpen} />
      ) : null}

      {list.length === 0 ? (
        <p className="mt-12 text-center text-ink-soft">No events.</p>
      ) : (
        <ul className={`flex flex-col gap-3 ${view === "map" ? "mt-4" : "mt-5"}`}>
          {list
            .filter((e) => view === "list" || !e.pin)
            .map((e) => (
              <li key={e.id}>
                <EventCard e={e} going={going.has(e.id)} onOpen={() => setOpen(e)} />
              </li>
            ))}
        </ul>
      )}

      <Sheet open={!!open} onClose={() => setOpen(null)} title={open?.type ?? ""}>
        {open && (
          <>
            <p className="font-serif text-2xl leading-snug">{open.title}</p>
            <p className="text-sm text-ink-soft">{open.host}</p>
            <ul className="mt-4 flex flex-col gap-2 text-[15px]">
              <li className="flex items-center gap-3">
                <CalendarDays size={18} className="text-forest" /> {dayLabel(open.date)}
              </li>
              <li className="flex items-center gap-3">
                <Clock size={18} className="text-forest" /> {open.time}
              </li>
              <li className="flex items-center gap-3">
                {open.pin ? <MapPin size={18} className="text-forest" /> : <Video size={18} className="text-forest" />}
                {open.venue}
                {open.pin && `, ${open.area}`}
              </li>
              <li className="flex items-center gap-3">
                <UsersRound size={18} className="text-forest" />
                {open.going + (going.has(open.id) ? 1 : 0)} / {open.seats}
              </li>
            </ul>
            <Progress value={((open.going + (going.has(open.id) ? 1 : 0)) / open.seats) * 100} className="mt-3" />
            <p className="mt-4 font-serif">{open.about}</p>
            {open.going >= open.seats && !going.has(open.id) ? (
              <Button className="mt-5 w-full" variant="outline" onClick={() => toast("Added to waitlist")}>
                Join waitlist
              </Button>
            ) : (
              <Button className="mt-5 w-full" variant={going.has(open.id) ? "outline" : "primary"} onClick={() => register(open)}>
                {going.has(open.id) ? (
                  <>
                    <Check size={18} /> Going · Cancel
                  </>
                ) : open.price ? (
                  `Register · ৳${open.price}`
                ) : (
                  "Register · Free"
                )}
              </Button>
            )}
          </>
        )}
      </Sheet>
    </>
  );
}

function EventCard({ e, going, onOpen }: { e: LitEvent; going: boolean; onOpen: () => void }) {
  const d = new Date(e.date);
  return (
    <button onClick={onOpen} className="flex w-full gap-4 rounded-2xl border border-line bg-surface p-3 text-left">
      <span className="flex w-14 shrink-0 flex-col items-center justify-center rounded-xl text-white" style={{ background: typeTint[e.type] }}>
        <span className="text-xs uppercase">{d.toLocaleDateString("en-GB", { month: "short" })}</span>
        <span className="text-2xl font-semibold leading-tight">{d.getDate()}</span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs font-medium" style={{ color: typeTint[e.type] }}>
          {e.type}
        </span>
        <span className="line-clamp-1 block font-serif text-lg">{e.title}</span>
        <span className="flex items-center gap-1 text-xs text-ink-soft">
          {e.time} · {e.pin ? e.area : "Online"}
          {e.price ? ` · ৳${e.price}` : " · Free"}
        </span>
      </span>
      {going && (
        <span className="self-start rounded-full bg-forest-soft px-2 py-0.5 text-[11px] font-medium text-forest">Going</span>
      )}
    </button>
  );
}

/** Stylised Dhaka: river, lake, main roads, pins. Not to scale. */
function DhakaMap({ events: list, onOpen }: { events: LitEvent[]; onOpen: (e: LitEvent) => void }) {
  const pinned = list.filter((e) => e.pin);
  return (
    <div className="relative mt-4 aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-surface-2">
      <svg viewBox="0 0 100 75" className="absolute inset-0 size-full" aria-hidden preserveAspectRatio="none">
        <path d="M0 68 C 20 60, 35 74, 55 70 S 85 62, 100 66 L100 75 L0 75 Z" fill="#2c5866" opacity=".25" />
        <path d="M30 42 c3 -3 7 -2 8 2 c1 4 -3 6 -6 5 c-3 -1 -4 -4 -2 -7z" fill="#2c5866" opacity=".3" />
        <path d="M62 10 c4 -2 8 0 7 4 c-1 3 -5 4 -8 2 z" fill="#2c5866" opacity=".3" />
        <g stroke="var(--line)" strokeWidth="1.2" fill="none">
          <path d="M45 0 L48 30 L52 75" />
          <path d="M0 38 L40 40 L100 34" />
          <path d="M20 0 L30 50 L28 75" />
          <path d="M70 0 L66 30 L72 75" />
        </g>
        <g fill="var(--ink-soft)" fontSize="2.6" opacity=".7">
          <text x="62" y="20">Gulshan</text>
          <text x="22" y="34">Mohammadpur</text>
          <text x="33" y="55">Dhanmondi</text>
          <text x="53" y="45">Shahbag</text>
          <text x="40" y="72">Buriganga</text>
        </g>
      </svg>
      {pinned.map((e) => (
        <button
          key={e.id}
          onClick={() => onOpen(e)}
          aria-label={`${e.title}, ${e.area}`}
          className="absolute -translate-x-1/2 -translate-y-full"
          style={{ left: `${e.pin!.x}%`, top: `${e.pin!.y}%`, color: typeTint[e.type] }}
        >
          <MapPin size={30} fill="currentColor" stroke="var(--surface)" strokeWidth={1.5} />
        </button>
      ))}
      <p className="absolute bottom-2 right-3 text-[10px] text-ink-soft">Not to scale</p>
    </div>
  );
}
