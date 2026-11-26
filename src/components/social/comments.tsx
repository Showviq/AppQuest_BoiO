"use client";

import { Heart, SendHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Avatar } from "@/components/ui";
import type { Comment } from "@/lib/mock/social";

/** Two-level threaded comments with a sticky reply box. */
export function Comments({ initial, sticky = true }: { initial: Comment[]; sticky?: boolean }) {
  const [list, setList] = useState(initial);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState<Comment | null>(null);

  const send = () => {
    const c: Comment = { id: `n${Date.now()}`, user: "You", handle: "me", text: text.trim(), likes: 0, ago: "now" };
    setList((l) =>
      replyTo
        ? l.map((x) => (x.id === replyTo.id ? { ...x, replies: [...(x.replies ?? []), c] } : x))
        : [...l, c]
    );
    setText("");
    setReplyTo(null);
  };

  return (
    <>
      <ul className="flex flex-col gap-4">
        {list.map((c) => (
          <li key={c.id}>
            <CommentRow c={c} onReply={() => setReplyTo(c)} />
            {c.replies && c.replies.length > 0 && (
              <ul className="ml-11 mt-3 flex flex-col gap-3 border-l-2 border-line pl-3">
                {c.replies.map((r) => (
                  <li key={r.id}>
                    <CommentRow c={r} onReply={() => setReplyTo(c)} small />
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
        {list.length === 0 && <li className="py-6 text-center text-ink-soft">No comments yet</li>}
      </ul>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim()) send();
        }}
        className={`mt-6 rounded-2xl border border-line bg-surface p-2 ${
          sticky ? "sticky bottom-[calc(4.5rem+env(safe-area-inset-bottom))] lg:bottom-4" : ""
        }`}
      >
        {replyTo && (
          <p className="flex items-center justify-between px-2 pb-1 text-xs text-ink-soft">
            Replying to {replyTo.user}
            <button type="button" onClick={() => setReplyTo(null)} aria-label="Cancel reply">
              <X size={14} />
            </button>
          </p>
        )}
        <div className="flex gap-2">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={replyTo ? "Reply" : "Comment"}
            aria-label="Comment"
            className="h-11 flex-1 rounded-xl bg-bg px-3 outline-none"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            aria-label="Send"
            className="grid size-11 place-items-center rounded-xl bg-forest text-on-forest disabled:opacity-40"
          >
            <SendHorizontal size={18} />
          </button>
        </div>
      </form>
    </>
  );
}

function CommentRow({ c, onReply, small = false }: { c: Comment; onReply: () => void; small?: boolean }) {
  const [liked, setLiked] = useState(false);
  return (
    <div className="flex gap-3">
      {c.handle === "me" ? <Avatar name="You" size="sm" /> : (
        <Link href={`/u/${c.handle}`} aria-label={c.user}>
          <Avatar name={c.user} size="sm" />
        </Link>
      )}
      <div className="min-w-0 flex-1">
        <p className={small ? "text-sm" : "text-[15px]"}>
          <b>{c.user}</b> <span className="text-xs text-ink-soft">{c.ago}</span>
        </p>
        <p className={small ? "text-sm" : "text-[15px]"}>{c.text}</p>
        <div className="mt-1 flex gap-4 text-xs text-ink-soft">
          <button
            onClick={() => setLiked((l) => !l)}
            aria-pressed={liked}
            className={`flex items-center gap-1 ${liked ? "text-danger" : ""}`}
          >
            <Heart size={13} fill={liked ? "currentColor" : "none"} />
            {c.likes + (liked ? 1 : 0)}
          </button>
          <button onClick={onReply}>Reply</button>
        </div>
      </div>
    </div>
  );
}
