"use client";

import { Award, BookOpen, Flame, MapPin, PenLine, Settings, UserCheck, UserPlus } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import { Sheet } from "@/components/sheet";
import { Stars } from "@/components/stars";
import { useToast } from "@/components/toast";
import { Avatar, BackButton, Button, Card, Hero, Stat, Tabs, field } from "@/components/ui";
import { getBook } from "@/lib/mock-data";
import { getPerson, type Person } from "@/lib/mock/people";
import { useMyPosts } from "@/components/social/my-posts";
import { PostCard } from "@/components/social/post-card";
import { posts as allPosts } from "@/lib/mock/social";

type Tab = "overview" | "posts" | "shelf" | "stats" | "reviews" | "lists" | "badges";
const tabs = [
  { id: "overview", label: "Overview" },
  { id: "posts", label: "Posts" },
  { id: "shelf", label: "Shelf" },
  { id: "stats", label: "Stats" },
  { id: "reviews", label: "Reviews" },
  { id: "lists", label: "Lists" },
  { id: "badges", label: "Badges" },
] as const;

function Pills({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((x) => (
        <span key={x} className="rounded-full bg-surface-2 px-3 py-1 text-sm">
          {x}
        </span>
      ))}
    </div>
  );
}

function Covers({ ids, cols = "grid-cols-4" }: { ids: string[]; cols?: string }) {
  return (
    <ul className={`grid gap-3 ${cols}`}>
      {ids.map((id) => {
        const b = getBook(id);
        return b ? (
          <li key={id}>
            <Link href={`/book/${id}`}>
              <BookCover book={b} size="sm" />
            </Link>
          </li>
        ) : null;
      })}
    </ul>
  );
}

export default function PublicProfile() {
  const { handle } = useParams<{ handle: string }>();
  const found = getPerson(handle);
  if (!found) notFound();

  const toast = useToast();
  const [p, setP] = useState<Person>(found);
  const [tab, setTab] = useState<Tab>("overview");
  const [following, setFollowing] = useState(p.followers.includes("me"));
  const [list, setList] = useState<"followers" | "following" | null>(null);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ name: p.name, bio: p.bio, location: p.location });
  const isMe = p.handle === "me";
  const { posts: mine } = useMyPosts();
  // Visitors see public posts; you see all of yours (followers-only and community ones are marked).
  const theirPosts = isMe ? mine : allPosts.filter((x) => x.handle === p.handle && x.kind !== "community");
  const followers = isMe
    ? p.followers.length
    : p.followers.filter((h) => h !== "me").length + (following ? 1 : 0);

  return (
    <>
      <BackButton />
      <Hero
        background={p.cover}
        avatar={
          <span className="block rounded-full shadow-lg ring-4 ring-bg">
            <Avatar name={p.name} size="lg" />
          </span>
        }
        actions={
          isMe ? (
          <>
            <Link href="/settings" aria-label="Settings" className="grid size-11 place-items-center rounded-full border border-line bg-surface">
              <Settings size={18} />
            </Link>
            <Button variant="outline" onClick={() => setEditing(true)}>
              <PenLine size={16} /> Edit profile
            </Button>
          </>
        ) : (
          <>
            <Button
              variant={following ? "outline" : "primary"}
              onClick={() => {
                setFollowing(!following);
                toast(following ? `Unfollowed ${p.name}` : `Following ${p.name}`);
              }}
            >
              {following ? <UserCheck size={16} /> : <UserPlus size={16} />}
              {following ? "Following" : "Follow"}
            </Button>
          </>
        )
        }
      />

      <h1 className="mt-3 text-2xl font-semibold">{p.name}</h1>
      <p className="text-sm text-ink-soft">@{p.handle}</p>
      <p className="mt-2">{p.bio}</p>
      <p className="mt-1 flex items-center gap-1 text-sm text-ink-soft">
        <MapPin size={14} /> {p.location}
      </p>
      <div className="mt-3 flex gap-5 text-sm">
        <button onClick={() => setList("followers")}>
          <b>{followers}</b> <span className="text-ink-soft">followers</span>
        </button>
        <button onClick={() => setList("following")}>
          <b>{p.following.length}</b> <span className="text-ink-soft">following</span>
        </button>
      </div>

      <div className="mt-5">
        <Tabs tabs={tabs} value={tab} onChange={setTab} label="Profile sections" />
      </div>

      {tab === "posts" &&
        (theirPosts.length ? (
          <ul className="stagger flex flex-col divide-y divide-line">
            {theirPosts.map((x) => (
              <li key={x.id}>
                <PostCard post={x} />
              </li>
            ))}
          </ul>
        ) : (
          <div className="rounded-2xl border border-dashed border-line p-8 text-center text-ink-soft">
            No posts yet
            {isMe && (
              <Link href="/compose" className="mt-3 block font-semibold text-forest">
                Write one
              </Link>
            )}
          </div>
        ))}

      {tab === "overview" && (
        <div className="flex flex-col gap-5">
          <section>
            <h2 className="mb-2 font-semibold">Favourite books</h2>
            <Covers ids={p.featured.slice(0, 4)} />
          </section>
          <section>
            <h2 className="mb-2 font-semibold">Genres</h2>
            <Pills items={p.genres} />
          </section>
          <section>
            <h2 className="mb-2 font-semibold">Languages</h2>
            <Pills items={p.languages} />
          </section>
          <section>
            <h2 className="mb-2 font-semibold">Authors</h2>
            <Pills items={p.authors} />
          </section>
        </div>
      )}

      {tab === "shelf" && <Covers ids={p.shelf} cols="grid-cols-4 sm:grid-cols-6" />}

      {tab === "stats" && (
        <Card className="grid grid-cols-2 gap-y-5 py-5">
          <Stat value={p.stats.books} label="Books" />
          <Stat value={p.stats.pages.toLocaleString()} label="Pages" />
          <Stat
            value={
              <span className="inline-flex items-center gap-1">
                <Flame size={20} className="text-gold" />
                {p.stats.streak}
              </span>
            }
            label="Day streak"
          />
          <Stat value={p.stats.reviews} label="Reviews" />
        </Card>
      )}

      {tab === "reviews" &&
        (p.reviews.length === 0 ? (
          <p className="py-10 text-center text-ink-soft">No reviews yet.</p>
        ) : (
          <ul className="divide-y divide-line">
            {p.reviews.map((r) => {
              const b = getBook(r.bookId);
              if (!b) return null;
              return (
                <li key={r.bookId} className="flex gap-3 py-4">
                  <Link href={`/book/${b.id}`}>
                    <BookCover book={b} size="sm" />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif">{b.title}</p>
                    <Stars value={r.rating} />
                    <p className="mt-1 text-[15px]">{r.text}</p>
                    <p className="mt-1 text-xs text-ink-soft">{r.ago}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        ))}

      {tab === "lists" &&
        (p.lists.length === 0 ? (
          <p className="py-10 text-center text-ink-soft">No lists yet.</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {p.lists.map((l) => (
              <Card key={l.title} className="p-4">
                <p className="mb-3 flex items-center gap-2 font-medium">
                  <BookOpen size={16} className="text-forest" /> {l.title}
                  <span className="ml-auto text-sm text-ink-soft">{l.bookIds.length}</span>
                </p>
                <Covers ids={l.bookIds} cols="grid-cols-5" />
              </Card>
            ))}
          </ul>
        ))}

      {tab === "badges" && (
        <ul className="grid grid-cols-3 gap-3">
          {p.badges.map((b) => (
            <li key={b} className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-surface p-3 text-center text-xs">
              <span className="grid size-12 place-items-center rounded-full bg-forest-soft text-gold">
                <Award size={24} />
              </span>
              {b}
            </li>
          ))}
        </ul>
      )}

      <Sheet open={list !== null} onClose={() => setList(null)} title={list === "followers" ? "Followers" : "Following"}>
        <ul className="flex flex-col gap-1">
          {(list === "followers" ? p.followers : p.following).map((h) => {
            const q = getPerson(h);
            if (!q) return null;
            return (
              <li key={h}>
                <Link
                  href={`/u/${h}`}
                  onClick={() => setList(null)}
                  className="flex items-center gap-3 rounded-xl p-2 hover:bg-surface-2"
                >
                  <Avatar name={q.name} size="sm" />
                  <span className="flex-1">
                    <span className="block font-medium">{q.name}</span>
                    <span className="text-sm text-ink-soft">@{q.handle}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </Sheet>

      <Sheet open={editing} onClose={() => setEditing(false)} title="Edit profile">
        <div className="flex flex-col gap-3">
          <label className="text-sm text-ink-soft">
            Name
            <input className={`${field} mt-1`} value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} />
          </label>
          <label className="text-sm text-ink-soft">
            Bio
            <textarea
              rows={3}
              maxLength={160}
              className="mt-1 w-full resize-none rounded-xl border border-line bg-bg p-3 text-ink outline-none focus:border-forest"
              value={draft.bio}
              onChange={(e) => setDraft({ ...draft, bio: e.target.value })}
            />
          </label>
          <label className="text-sm text-ink-soft">
            Location
            <input
              className={`${field} mt-1`}
              value={draft.location}
              onChange={(e) => setDraft({ ...draft, location: e.target.value })}
            />
          </label>
          <Button
            className="mt-2 w-full"
            onClick={() => {
              setP({ ...p, ...draft });
              setEditing(false);
              toast("Profile updated");
            }}
          >
            Save
          </Button>
        </div>
      </Sheet>
    </>
  );
}
