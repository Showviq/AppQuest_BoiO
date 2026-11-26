"use client";

import { BookPlus, ChevronDown, Globe, Lock, Plus, UsersRound, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import { Sheet } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { BackButton, Button, Chip, Switch, field, Rail } from "@/components/ui";
import { reach, useMyPosts } from "@/components/social/my-posts";
import { type Book, books, searchBooks } from "@/lib/mock-data";
import { type Audience, type PostKind, rooms } from "@/lib/mock/social";

const kindOf: Record<Type, PostKind> = { Thought: "thought", Quote: "quote", Poll: "poll", Recommendation: "recommend" };

const types = ["Thought", "Quote", "Poll", "Recommendation"] as const;
type Type = (typeof types)[number];

export default function Compose() {
  const router = useRouter();
  const toast = useToast();
  const [type, setType] = useState<Type>("Thought");
  const [text, setText] = useState("");
  const [book, setBook] = useState<Book | null>(null);
  const [picker, setPicker] = useState(false);
  const [q, setQ] = useState("");
  const [options, setOptions] = useState(["", ""]);
  const [spoiler, setSpoiler] = useState(false);
  const [audience, setAudience] = useState<Audience>("public");
  const [roomId, setRoomId] = useState(rooms[0].id);
  const { add } = useMyPosts();
  const room = rooms.find((r) => r.id === roomId)!;

  const submit = () => {
    const pollOpts = options.map((o) => o.trim()).filter(Boolean);
    add({
      kind: audience === "community" ? "community" : kindOf[type],
      text: type === "Poll" ? undefined : text.trim(),
      bookId: book?.id,
      spoiler,
      audience,
      ...(audience === "community" ? { community: room.name, communityId: room.id } : {}),
      ...(type === "Poll" ? { poll: { q: text.trim(), options: pollOpts.map((label) => ({ label, votes: 0 })) } } : {}),
    });
    toast(audience === "community" ? `Posted in ${room.name}` : "Posted");
    router.push(audience === "community" ? `/community/${room.id}` : "/");
  };

  const needsBook = type === "Quote" || type === "Recommendation";
  const pollOk = type !== "Poll" || options.filter((o) => o.trim()).length >= 2;
  const canPost = text.trim().length > 0 && pollOk && (!needsBook || book);
  const list = q.trim() ? searchBooks(q) : books;

  const placeholder = {
    Thought: "What are you reading?",
    Quote: "Type the quote",
    Poll: "Ask a question",
    Recommendation: "Why should people read it?",
  }[type];

  return (
    <>
      <div className="flex items-center justify-between">
        <BackButton href="/" />
        <Button
          className="min-h-10 px-5"
          disabled={!canPost}
          onClick={submit}
        >
          Post
        </Button>
      </div>

      <Rail as="div" className="mt-3 gap-2" role="group" label="Post type">
        {types.map((t) => (
          <Chip key={t} active={type === t} onClick={() => setType(t)}>
            {t}
          </Chip>
        ))}
      </Rail>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        rows={type === "Quote" ? 4 : 5}
        maxLength={1000}
        autoFocus
        className={`mt-4 w-full resize-none rounded-2xl border border-line bg-surface p-4 text-[17px] outline-none focus:border-forest ${
          type === "Quote" ? "font-serif text-xl" : ""
        }`}
      />
      <p className="text-right text-xs text-ink-soft">{text.length}/1000</p>

      {type === "Poll" && (
        <ul className="mt-2 flex flex-col gap-2">
          {options.map((o, i) => (
            <li key={i} className="flex gap-2">
              <input
                value={o}
                onChange={(e) => setOptions(options.map((x, j) => (j === i ? e.target.value : x)))}
                placeholder={`Option ${i + 1}`}
                aria-label={`Option ${i + 1}`}
                className={field}
              />
              {options.length > 2 && (
                <button
                  onClick={() => setOptions(options.filter((_, j) => j !== i))}
                  aria-label={`Remove option ${i + 1}`}
                  className="grid size-12 shrink-0 place-items-center rounded-xl text-ink-soft hover:bg-surface-2"
                >
                  <X size={18} />
                </button>
              )}
            </li>
          ))}
          {options.length < 4 && (
            <li>
              <Button variant="ghost" className="-ml-3" onClick={() => setOptions([...options, ""])}>
                <Plus size={18} /> Option
              </Button>
            </li>
          )}
        </ul>
      )}

      {book ? (
        <div className="mt-4 flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
          <BookCover book={book} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="font-serif">{book.title}</p>
            <p className="text-sm text-ink-soft">{book.author}</p>
          </div>
          <button
            onClick={() => setBook(null)}
            aria-label="Remove book"
            className="grid size-9 place-items-center rounded-full text-ink-soft hover:bg-surface-2"
          >
            <X size={18} />
          </button>
        </div>
      ) : (
        <Button variant="outline" className="mt-4 w-full" onClick={() => setPicker(true)}>
          <BookPlus size={18} /> {needsBook ? "Choose book" : "Attach book"}
        </Button>
      )}

      <div className="mt-4 rounded-2xl border border-line bg-surface px-4">
        <Switch checked={spoiler} onChange={setSpoiler} label="Spoiler" />
        <div className="border-t border-line py-3">
          <p className="mb-2">Who can see this</p>
          <div role="radiogroup" aria-label="Audience" className="grid grid-cols-3 gap-1 rounded-2xl bg-surface-2 p-1">
            {(
              [
                ["public", "Everyone", Globe],
                ["followers", "Followers", Lock],
                ["community", "Community", UsersRound],
              ] as const
            ).map(([id, label, Icon]) => (
              <button
                key={id}
                role="radio"
                aria-checked={audience === id}
                onClick={() => setAudience(id)}
                className={`flex h-10 items-center justify-center gap-1.5 rounded-xl text-sm ${
                  audience === id ? "bg-surface font-semibold text-forest shadow-sm" : "text-ink-soft hover:text-ink"
                }`}
              >
                <Icon size={15} /> {label}
              </button>
            ))}
          </div>
          {audience === "community" && (
            <label className="relative mt-2 block">
              <span className="sr-only">Community</span>
              <select value={roomId} onChange={(e) => setRoomId(e.target.value)} className={`${field} appearance-none pr-10`}>
                {rooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
              <ChevronDown size={18} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            </label>
          )}
          <ul key={audience} className="stagger mt-3 flex flex-wrap gap-1.5" aria-label="Shows in">
            {reach[audience].filter((r) => r !== "Book page" || book).map((r) => (
              <li key={r} className="rounded-full bg-forest-soft px-2.5 py-1 text-xs text-forest">
                {r === "That community only" ? room.name : r}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Sheet open={picker} onClose={() => setPicker(false)} title="Choose book">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search"
          aria-label="Search books"
          className={field}
        />
        <ul className="mt-3 flex flex-col">
          {list.map((b) => (
            <li key={b.id}>
              <button
                onClick={() => {
                  setBook(b);
                  setPicker(false);
                }}
                className="flex w-full items-center gap-3 rounded-xl p-2 text-left hover:bg-surface-2"
              >
                <BookCover book={b} size="sm" />
                <span>
                  <span className="block font-serif">{b.title}</span>
                  <span className="block text-sm text-ink-soft">{b.author}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Sheet>
    </>
  );
}
