"use client";

import { CalendarDays, Check, MapPin, Send } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import { useToast } from "@/components/toast";
import { Avatar, BackButton, Button, Progress, Tabs } from "@/components/ui";
import { getBook } from "@/lib/mock-data";
import { getClub } from "@/lib/mock/clubs";

type Tab = "schedule" | "board" | "members";

export default function ClubPage() {
  const { id } = useParams<{ id: string }>();
  const club = getClub(id);
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("schedule");
  const [done, setDone] = useState<Set<number>>(new Set([0]));
  const [rsvp, setRsvp] = useState(false);
  const [posts, setPosts] = useState(club?.posts ?? []);
  const [text, setText] = useState("");
  if (!club) notFound();

  const book = getBook(club.bookId);
  const pct = (done.size / club.schedule.length) * 100;

  return (
    <>
      <BackButton href="/clubs" />
      <h1 className="font-serif text-3xl">{club.name}</h1>
      <p className="text-sm text-ink-soft">{club.members} members</p>

      <div className="mt-4 flex gap-4 rounded-2xl bg-forest p-4 text-on-forest">
        {book && (
          <Link href={`/book/${book.id}`}>
            <BookCover book={book} size="sm" />
          </Link>
        )}
        <div className="flex-1">
          <p className="text-xs opacity-80">Now reading</p>
          <p className="font-serif text-xl">{book?.title}</p>
          <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-on-forest/25">
            <div className="h-full bg-gold" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1 text-xs opacity-80">{Math.round(pct)}% of schedule</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
        <CalendarDays size={20} className="text-forest" />
        <div className="min-w-0 flex-1">
          <p className="font-medium">{club.meeting.when}</p>
          <p className="flex items-center gap-1 text-sm text-ink-soft">
            <MapPin size={12} /> {club.meeting.where} · {club.meeting.going + (rsvp ? 1 : 0)} going
          </p>
        </div>
        <Button
          variant={rsvp ? "outline" : "primary"}
          className="min-h-9 px-4 text-sm"
          onClick={() => {
            setRsvp(!rsvp);
            toast(rsvp ? "RSVP removed" : "You're going");
          }}
        >
          {rsvp ? <><Check size={16} /> Going</> : "RSVP"}
        </Button>
      </div>

      <div className="mt-5">
        <Tabs
          tabs={[
            { id: "schedule", label: "Schedule" },
            { id: "board", label: "Board" },
            { id: "members", label: "Members" },
          ]}
          value={tab}
          onChange={setTab}
          label="Club"
        />
      </div>

      {tab === "schedule" && (
        <ul className="flex flex-col gap-2">
          {club.schedule.map((s, n) => {
            const on = done.has(n);
            return (
              <li key={s.week}>
                <button
                  onClick={() =>
                    setDone((d) => {
                      const x = new Set(d);
                      if (x.has(n)) x.delete(n);
                      else x.add(n);
                      return x;
                    })
                  }
                  aria-pressed={on}
                  className="flex w-full items-center gap-3 rounded-2xl border border-line bg-surface p-4 text-left"
                >
                  <span className={`grid size-7 shrink-0 place-items-center rounded-full border-2 ${on ? "border-forest bg-forest text-on-forest" : "border-line"}`}>
                    {on && <Check size={14} />}
                  </span>
                  <span className="flex-1">
                    <span className="block font-medium">{s.week} · {s.part}</span>
                    <span className="text-sm text-ink-soft">Due {s.due}</span>
                  </span>
                </button>
              </li>
            );
          })}
          <Progress value={pct} className="mt-2" />
        </ul>
      )}

      {tab === "board" && (
        <>
          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!text.trim()) return;
              setPosts((p) => [{ user: "You", handle: "me", text: text.trim(), ago: "now" }, ...p]);
              setText("");
            }}
          >
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Post to the club"
              aria-label="Post to the club"
              className="h-11 flex-1 rounded-full border border-line bg-surface px-4"
            />
            <button type="submit" aria-label="Send" disabled={!text.trim()} className="grid size-11 place-items-center rounded-full bg-forest text-on-forest disabled:opacity-50">
              <Send size={18} />
            </button>
          </form>
          <ul className="mt-2 divide-y divide-line">
            {posts.map((p) => (
              <li key={p.user + p.text} className="flex gap-3 py-3">
                <Avatar name={p.user} size="sm" />
                <div>
                  <p className="text-sm">
                    {p.handle === "me" ? <b>{p.user}</b> : <Link href={`/u/${p.handle}`} className="font-semibold">{p.user}</Link>}{" "}
                    <span className="text-ink-soft">· {p.ago}</span>
                  </p>
                  <p className="text-[15px]">{p.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === "members" && (
        <ul className="divide-y divide-line">
          {club.people.map((m) => (
            <li key={m.handle}>
              <Link href={`/u/${m.handle}`} className="flex items-center gap-3 py-3">
                <Avatar name={m.name} size="sm" />
                <span className="flex-1 font-medium">{m.name}</span>
                {m.role && <span className="rounded-full bg-forest-soft px-2.5 py-0.5 text-xs text-forest">{m.role}</span>}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
