"use client";

import { Ban, Check, Flag, Lock, MessageSquare, Pin, Plus, ShieldCheck, Trophy, VolumeX, X } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { Comments } from "@/components/social/comments";
import { Sheet } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { Avatar, BackButton, Button, Tabs, field } from "@/components/ui";
import { useMyPosts } from "@/components/social/my-posts";
import { PostCard } from "@/components/social/post-card";
import { type Topic, announcements, joinRequests, leaderboard, reports, rooms, topics } from "@/lib/mock/social";

type Tab = "topics" | "members" | "mod";
const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n));

export default function Room() {
  const { id } = useParams<{ id: string }>();
  const room = rooms.find((r) => r.id === id);
  const toast = useToast();
  const [tab, setTab] = useState<Tab>("topics");
  const [list, setList] = useState(topics);
  const [open, setOpen] = useState<Topic | null>(null);
  const [reveal, setReveal] = useState(false);
  const [newTopic, setNewTopic] = useState(false);
  const [title, setTitle] = useState("");
  const [requests, setRequests] = useState(joinRequests);
  const [flags, setFlags] = useState(reports);
  const { posts: mine } = useMyPosts();
  const roomPosts = mine.filter((p) => p.communityId === id);
  if (!room) notFound();

  const decide = (handle: string, ok: boolean) => {
    setRequests((r) => r.filter((x) => x.handle !== handle));
    toast(ok ? "Approved" : "Declined");
  };
  const moderate = (rid: string, action: string) => {
    setFlags((f) => f.filter((x) => x.id !== rid));
    toast(action);
  };

  return (
    <>
      <BackButton href="/community" />
      <div className="flex items-center gap-4">
        <div className="grid size-16 shrink-0 place-items-center rounded-2xl bg-forest-soft font-serif text-3xl text-forest">
          {room.name.charAt(0)}
        </div>
        <div className="min-w-0">
          <h1 className="flex items-center gap-2 font-serif text-2xl">
            {room.name} {room.private && <Lock size={16} className="text-ink-soft" aria-label="Private" />}
          </h1>
          <p className="text-sm text-ink-soft">
            {room.genre} · {fmt(room.members)} members
          </p>
        </div>
      </div>

      <ul className="mt-5 flex flex-col gap-2">
        {announcements.map((a) => (
          <li key={a.id} className="flex items-start gap-2 rounded-xl bg-forest-soft px-3 py-2.5 text-sm text-forest">
            <Pin size={15} className="mt-0.5 shrink-0" aria-label="Pinned" /> {a.text}
          </li>
        ))}
      </ul>

      <div className="mt-5">
        <Tabs
          label="Room"
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "topics", label: "Topics" },
            { id: "members", label: "Leaderboard" },
            {
              id: "mod",
              label: (
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} /> Moderate
                  {requests.length + flags.length > 0 && (
                    <span className="grid size-5 place-items-center rounded-full bg-danger text-[11px] text-white">
                      {requests.length + flags.length}
                    </span>
                  )}
                </span>
              ),
            },
          ]}
        />
      </div>

      {tab === "topics" && (
        <>
          {roomPosts.length > 0 && (
            <ul className="stagger mb-4 flex flex-col divide-y divide-line rounded-2xl border border-line bg-surface px-3">
              {roomPosts.map((p) => (
                <li key={p.id}>
                  <PostCard post={p} />
                </li>
              ))}
            </ul>
          )}
          <Button variant="outline" className="mb-2 w-full" onClick={() => setNewTopic(true)}>
            <Plus size={18} /> New topic
          </Button>
          <ul className="divide-y divide-line">
            {list.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => {
                    setOpen(t);
                    setReveal(!t.spoiler);
                  }}
                  className="flex w-full items-center gap-3 py-3 text-left"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium">
                      {t.title}
                      {t.spoiler && (
                        <span className="ml-2 rounded-full bg-danger/15 px-2 py-0.5 align-middle text-[11px] text-danger">
                          Spoiler
                        </span>
                      )}
                    </p>
                    <p className="text-sm text-ink-soft">
                      {t.user} · {t.ago}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-sm text-ink-soft">
                    <MessageSquare size={15} /> {t.replies}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {tab === "members" && (
        <ol className="divide-y divide-line">
          {leaderboard.map((m, i) => (
            <li key={m.handle}>
              <Link href={`/u/${m.handle}`} className="flex items-center gap-3 py-3">
                <span className={`w-6 text-center font-semibold ${i === 0 ? "text-gold" : "text-ink-soft"}`}>
                  {i === 0 ? <Trophy size={18} className="mx-auto" aria-label="1" /> : i + 1}
                </span>
                <Avatar name={m.name} size="sm" />
                <span className="flex-1 font-medium">{m.name}</span>
                <span className="text-sm text-ink-soft">{m.points.toLocaleString()} pts</span>
              </Link>
            </li>
          ))}
        </ol>
      )}

      {tab === "mod" && (
        <div className="flex flex-col gap-6">
          <section>
            <h2 className="mb-2 font-semibold">Join requests</h2>
            {requests.length === 0 ? (
              <p className="text-sm text-ink-soft">None</p>
            ) : (
              <ul className="divide-y divide-line">
                {requests.map((r) => (
                  <li key={r.handle} className="flex items-center gap-3 py-2">
                    <Avatar name={r.name} size="sm" />
                    <span className="flex-1">{r.name}</span>
                    <button onClick={() => decide(r.handle, false)} aria-label={`Decline ${r.name}`} className="grid size-9 place-items-center rounded-full border border-line">
                      <X size={16} />
                    </button>
                    <button onClick={() => decide(r.handle, true)} aria-label={`Approve ${r.name}`} className="grid size-9 place-items-center rounded-full bg-forest text-on-forest">
                      <Check size={16} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className="mb-2 font-semibold">Reported</h2>
            {flags.length === 0 ? (
              <p className="text-sm text-ink-soft">All clear</p>
            ) : (
              <ul className="flex flex-col gap-3">
                {flags.map((f) => (
                  <li key={f.id} className="rounded-2xl border border-line bg-surface p-3">
                    <p className="flex items-center gap-2 text-xs text-danger">
                      <Flag size={13} /> {f.reason} · @{f.user}
                    </p>
                    <p className="mt-1 text-[15px]">{f.text}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      <Button variant="outline" className="min-h-9 px-3 text-sm" onClick={() => moderate(f.id, "Kept")}>
                        Keep
                      </Button>
                      <Button variant="outline" className="min-h-9 px-3 text-sm" onClick={() => moderate(f.id, "Post removed")}>
                        <X size={14} /> Remove
                      </Button>
                      <Button variant="outline" className="min-h-9 px-3 text-sm" onClick={() => moderate(f.id, `Muted @${f.user}`)}>
                        <VolumeX size={14} /> Mute
                      </Button>
                      <Button variant="outline" className="min-h-9 px-3 text-sm text-danger" onClick={() => moderate(f.id, `Removed @${f.user}`)}>
                        <Ban size={14} /> Ban
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}

      <Sheet open={open !== null} onClose={() => setOpen(null)} title={open?.title ?? ""}>
        {open &&
          (reveal ? (
            <>
              {open.body && (
                <p className="mb-4 text-[15px]">
                  <b>{open.user}</b>: {open.body}
                </p>
              )}
              <Comments initial={open.thread} sticky={false} />
            </>
          ) : (
            <div className="py-6 text-center">
              <p className="font-medium text-danger">Contains spoilers</p>
              <Button variant="outline" className="mt-3" onClick={() => setReveal(true)}>
                Show
              </Button>
            </div>
          ))}
      </Sheet>

      <Sheet open={newTopic} onClose={() => setNewTopic(false)} title="New topic">
        <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" aria-label="Title" className={field} />
        <Button
          className="mt-4 w-full"
          disabled={!title.trim()}
          onClick={() => {
            setList((l) => [{ id: `n${Date.now()}`, title: title.trim(), user: "You", replies: 0, ago: "now", body: "", thread: [] }, ...l]);
            setTitle("");
            setNewTopic(false);
            toast("Topic posted");
          }}
        >
          Post
        </Button>
      </Sheet>
    </>
  );
}
