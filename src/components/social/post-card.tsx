"use client";

import { Bookmark, Globe, Heart, Link2, Lock, MessageCircle, Quote, Share2, Trash2, UsersRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import { Sheet } from "@/components/sheet";
import { Stars } from "@/components/stars";
import { useToast } from "@/components/toast";
import { Avatar } from "@/components/ui";
import { getBook } from "@/lib/mock-data";
import { useMyPosts } from "@/components/social/my-posts";
import { type Audience, type Post } from "@/lib/mock/social";

const audienceIcon: Record<Audience, { Icon: typeof Globe; label: string }> = {
  public: { Icon: Globe, label: "Everyone" },
  followers: { Icon: Lock, label: "Followers" },
  community: { Icon: UsersRound, label: "Community" },
};

function since(ts: number) {
  const m = Math.floor((Date.now() - ts) / 60000);
  if (m < 1) return "now";
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  return h < 24 ? `${h}h` : `${Math.floor(h / 24)}d`;
}

const verb: Record<Post["kind"], string> = {
  progress: "is reading",
  shelved: "added",
  review: "reviewed",
  quote: "quoted",
  poll: "asked",
  recommend: "recommends",
  community: "posted in",
  thought: "posted",
};

export function PostCard({ post, detail = false }: { post: Post; detail?: boolean }) {
  const book = post.bookId ? getBook(post.bookId) : undefined;
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [reveal, setReveal] = useState(false);
  const [share, setShare] = useState(false);
  const [vote, setVote] = useState<number | null>(null);
  const toast = useToast();
  const { remove } = useMyPosts();
  const aud = post.mine && post.audience ? audienceIcon[post.audience] : null;

  const totalVotes = (post.poll?.options.reduce((n, o) => n + o.votes, 0) ?? 0) + (vote !== null ? 1 : 0);

  return (
    <article className="flex gap-3 py-4">
      <Link href={`/u/${post.handle}`} aria-label={post.user}>
        <Avatar name={post.user} size="sm" />
      </Link>
      <div className="min-w-0 flex-1">
        <p className="text-[15px]">
          <Link href={`/u/${post.handle}`} className="font-semibold">
            {post.user}
          </Link>{" "}
          <span className="text-ink-soft">{verb[post.kind]}</span>{" "}
          {post.kind === "community" &&
            (post.communityId ? (
              <Link href={`/community/${post.communityId}`} className="font-semibold">
                {post.community}
              </Link>
            ) : (
              <b>{post.community}</b>
            ))}
          {book && post.kind !== "quote" && post.kind !== "recommend" && (
            <Link href={`/book/${book.id}`} className="font-serif">
              {book.title}
            </Link>
          )}
          <span className="text-ink-soft"> · {post.ts ? since(post.ts) : post.ago}</span>
          {aud && (
            <span className="ml-1 inline-flex translate-y-0.5 text-ink-soft" title={aud.label}>
              <aud.Icon size={13} aria-label={`Visible to: ${aud.label}`} />
            </span>
          )}
        </p>

        {post.kind === "shelved" && <p className="text-sm text-ink-soft">→ {post.shelf}</p>}
        {post.rating && <Stars value={post.rating} />}

        {post.kind === "progress" && book && post.page && (
          <div className="mt-2 flex items-center gap-2 text-xs text-ink-soft">
            <div className="h-1 flex-1 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full bg-forest" style={{ width: `${(post.page / book.pages) * 100}%` }} />
            </div>
            {post.page}/{book.pages}
          </div>
        )}

        {post.kind === "quote" && post.text && (
          <blockquote className="mt-2 rounded-2xl bg-forest-soft p-4 font-serif text-lg leading-relaxed text-forest">
            “{post.text}”
            {book && <footer className="mt-2 font-sans text-xs text-ink-soft">— {book.title}</footer>}
          </blockquote>
        )}

        {post.kind !== "quote" &&
          post.text &&
          (post.spoiler && !reveal ? (
            <button
              onClick={() => setReveal(true)}
              className="mt-1 rounded-lg bg-surface-2 px-3 py-1.5 text-sm text-ink-soft"
            >
              Spoiler · tap to show
            </button>
          ) : (
            <p className={`mt-1 leading-relaxed ${detail ? "text-[17px]" : "text-[15px]"}`}>{post.text}</p>
          ))}

        {post.kind === "recommend" && book && (
          <Link href={`/book/${book.id}`} className="mt-2 flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
            <BookCover book={book} size="sm" />
            <span className="min-w-0">
              <span className="block font-serif">{book.title}</span>
              <span className="block text-sm text-ink-soft">{book.author}</span>
              <Stars value={book.rating} size={12} />
            </span>
          </Link>
        )}

        {post.poll && (
          <div className="mt-2">
            <p className="mb-2 font-medium">{post.poll.q}</p>
            <ul className="flex flex-col gap-2">
              {post.poll.options.map((o, i) => {
                const votes = o.votes + (vote === i ? 1 : 0);
                const pct = Math.round((votes / totalVotes) * 100);
                return (
                  <li key={o.label}>
                    <button
                      onClick={() => setVote(vote === i ? null : i)}
                      aria-pressed={vote === i}
                      className={`relative h-10 w-full overflow-hidden rounded-xl border text-left text-sm ${
                        vote === i ? "border-forest" : "border-line"
                      }`}
                    >
                      {vote !== null && (
                        <span className="absolute inset-y-0 left-0 bg-forest-soft" style={{ width: `${pct}%` }} aria-hidden />
                      )}
                      <span className="relative flex justify-between px-3">
                        <span className={vote === i ? "font-semibold" : ""}>{o.label}</span>
                        {vote !== null && <span className="text-ink-soft">{pct}%</span>}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            <p className="mt-1 text-xs text-ink-soft">{totalVotes} votes</p>
          </div>
        )}

        <div className="-ml-2 mt-2 flex items-center text-sm text-ink-soft">
          <button
            onClick={() => setLiked((l) => !l)}
            aria-pressed={liked}
            aria-label="Like"
            className={`flex h-9 items-center gap-1 rounded-full px-2 hover:bg-surface-2 ${liked ? "text-danger" : ""}`}
          >
            <Heart key={String(liked)} size={17} fill={liked ? "currentColor" : "none"} className={liked ? "pop" : ""} />
            {post.likes + (liked ? 1 : 0)}
          </button>
          <Link
            href={`/post/${post.id}`}
            aria-label="Comments"
            className="flex h-9 items-center gap-1 rounded-full px-2 hover:bg-surface-2"
          >
            <MessageCircle size={17} />
            {post.comments}
          </Link>
          <button
            onClick={() => setShare(true)}
            aria-label="Share"
            className="flex h-9 items-center rounded-full px-2 hover:bg-surface-2"
          >
            <Share2 size={17} />
          </button>
          <button
            onClick={() => {
              setSaved((s) => !s);
              toast(saved ? "Removed from saved" : "Saved");
            }}
            aria-pressed={saved}
            aria-label="Bookmark"
            className={`ml-auto flex h-9 items-center rounded-full px-2 hover:bg-surface-2 ${saved ? "text-forest" : ""}`}
          >
            <Bookmark key={String(saved)} size={17} fill={saved ? "currentColor" : "none"} className={saved ? "pop" : ""} />
          </button>
        </div>
      </div>

      <Sheet open={share} onClose={() => setShare(false)} title="Share">
        <ul className="flex flex-col gap-1">
          <li>
            <button
              onClick={() => {
                try {
                  navigator.clipboard?.writeText(`${location.origin}/post/${post.id}`);
                } catch {}
                toast("Link copied");
                setShare(false);
              }}
              className="flex h-12 w-full items-center gap-3 rounded-xl px-3 hover:bg-surface-2"
            >
              <Link2 size={18} /> Copy link
            </button>
          </li>
          {book && (
            <li>
              <Link
                href={`/quote?book=${book.id}`}
                className="flex h-12 w-full items-center gap-3 rounded-xl px-3 hover:bg-surface-2"
              >
                <Quote size={18} /> Quote card
              </Link>
            </li>
          )}
          {post.mine && (
            <li>
              <button
                onClick={() => {
                  remove(post.id);
                  setShare(false);
                  toast("Post deleted");
                }}
                className="flex h-12 w-full items-center gap-3 rounded-xl px-3 text-danger hover:bg-surface-2"
              >
                <Trash2 size={18} /> Delete post
              </button>
            </li>
          )}
        </ul>
      </Sheet>
    </article>
  );
}
