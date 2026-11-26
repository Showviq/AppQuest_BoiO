"use client";

import { Bookmark, Share2, Type } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/toast";
import { BackButton } from "@/components/ui";
import { articles, getArticle } from "@/lib/mock/magazine";

const sizes = ["text-[16px]", "text-[18px]", "text-[21px]"];

export default function Article() {
  const { id } = useParams<{ id: string }>();
  const a = getArticle(id);
  const toast = useToast();
  const [size, setSize] = useState(1);
  const [saved, setSaved] = useState(false);
  if (!a) notFound();

  const more = articles.filter((x) => x.id !== a.id).slice(0, 2);
  const mid = Math.ceil(a.body.length / 2);

  return (
    <>
      <div className="flex items-center justify-between">
        <BackButton href="/magazine" />
        <div className="flex gap-1">
          <button
            onClick={() => setSize((size + 1) % sizes.length)}
            aria-label="Text size"
            className="grid size-11 place-items-center rounded-full hover:bg-surface-2"
          >
            <Type size={20} />
          </button>
          <button
            onClick={() => {
              setSaved(!saved);
              toast(saved ? "Removed" : "Saved");
            }}
            aria-pressed={saved}
            aria-label="Save"
            className="grid size-11 place-items-center rounded-full hover:bg-surface-2"
          >
            <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
          </button>
          <button onClick={() => toast("Link copied")} aria-label="Share" className="grid size-11 place-items-center rounded-full hover:bg-surface-2">
            <Share2 size={20} />
          </button>
        </div>
      </div>

      <article className="mx-auto max-w-prose">
        <p className="text-xs uppercase tracking-widest" style={{ color: a.tint }}>
          {a.section}
        </p>
        <h1 className="mt-2 font-serif text-4xl leading-tight">{a.title}</h1>
        <p className="mt-2 text-lg text-ink-soft">{a.dek}</p>
        <p className="mt-4 border-y border-line py-3 text-sm text-ink-soft">
          By <span className="font-medium text-ink">{a.author}</span> · {a.minutes} min read
        </p>

        <div className={`mt-6 flex flex-col gap-5 font-serif leading-relaxed ${sizes[size]}`}>
          {a.body.slice(0, mid).map((p, n) => (
            <p
              key={n}
              className={n === 0 ? "first-letter:float-left first-letter:mr-2 first-letter:font-serif first-letter:text-6xl first-letter:leading-[.85] first-letter:text-forest" : ""}
            >
              {p}
            </p>
          ))}
          {a.pull && (
            <blockquote className="my-2 border-l-4 border-gold pl-4 text-2xl italic leading-snug text-forest">{a.pull}</blockquote>
          )}
          {a.body.slice(mid).map((p, n) => (
            <p key={n}>{p}</p>
          ))}
        </div>
      </article>

      <section className="mt-10 border-t border-line pt-5">
        <h2 className="mb-2 text-lg font-semibold">More to read</h2>
        <ul className="divide-y divide-line">
          {more.map((m) => (
            <li key={m.id}>
              <Link href={`/magazine/${m.id}`} className="block py-3">
                <p className="font-serif text-lg">{m.title}</p>
                <p className="text-sm text-ink-soft">{m.minutes} min</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
