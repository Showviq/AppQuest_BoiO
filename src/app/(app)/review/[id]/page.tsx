"use client";

import { Bold, EyeOff, Heart, ImagePlus, Italic, Plus, Quote, Trash2, X } from "lucide-react";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BookCover } from "@/components/book-cover";
import { useLibrary } from "@/components/library-store";
import { StarInput } from "@/components/stars";
import { useToast } from "@/components/toast";
import { BackButton, Button, Tabs } from "@/components/ui";
import { getBook } from "@/lib/mock-data";

type Para = { id: number; text: string; spoiler: boolean };
const MICRO = 280;

/** Tiny markdown: **bold**, _italic_, lines starting with "> " become quotes. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => {
        const quote = line.startsWith("> ");
        const body = (quote ? line.slice(2) : line).split(/(\*\*[^*]+\*\*|_[^_]+_)/g).map((part, j) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <b key={j}>{part.slice(2, -2)}</b>
          ) : part.startsWith("_") && part.endsWith("_") && part.length > 2 ? (
            <i key={j}>{part.slice(1, -1)}</i>
          ) : (
            part
          )
        );
        return quote ? (
          <blockquote key={i} className="my-1 border-l-2 border-gold pl-3 font-serif italic text-ink-soft">
            {body}
          </blockquote>
        ) : (
          <span key={i} className="block min-h-[1em]">
            {body}
          </span>
        );
      })}
    </>
  );
}

function SpoilerPara({ p }: { p: Para }) {
  const [shown, setShown] = useState(false);
  if (!p.spoiler || shown)
    return (
      <div className="leading-relaxed">
        <Rich text={p.text} />
      </div>
    );
  return (
    <button onClick={() => setShown(true)} className="relative w-full overflow-hidden rounded-xl text-left">
      <span className="block select-none blur-md" aria-hidden>
        <Rich text={p.text} />
      </span>
      <span className="absolute inset-0 grid place-items-center bg-surface-2/60 text-sm font-medium">
        <span className="flex items-center gap-1.5">
          <EyeOff size={15} /> Spoiler · tap to show
        </span>
      </span>
    </button>
  );
}

export default function ReviewEditor() {
  const { id } = useParams<{ id: string }>();
  const book = getBook(id);
  const router = useRouter();
  const toast = useToast();
  const { library, set } = useLibrary();
  const entry = library[id];

  const [mode, setMode] = useState<"micro" | "long">("long");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [rating, setRating] = useState(entry?.rating ?? 0);
  const [fav, setFav] = useState(Boolean(entry?.favourite));
  const [micro, setMicro] = useState(entry?.review?.slice(0, MICRO) ?? "");
  const [paras, setParas] = useState<Para[]>([{ id: 1, text: entry?.review ?? "", spoiler: false }]);
  const [images, setImages] = useState<string[]>([]);
  const [focus, setFocus] = useState(1);
  const refs = useRef<Record<number, HTMLTextAreaElement | null>>({});
  const nextId = useRef(2);

  // Release object URLs when leaving the page.
  const imagesRef = useRef(images);
  imagesRef.current = images;
  useEffect(() => () => imagesRef.current.forEach((u) => URL.revokeObjectURL(u)), []);

  if (!book) notFound();

  const patch = (pid: number, p: Partial<Para>) => setParas((ps) => ps.map((x) => (x.id === pid ? { ...x, ...p } : x)));

  const wrap = (before: string, after = before) => {
    const el = refs.current[focus];
    const p = paras.find((x) => x.id === focus);
    if (!el || !p) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const sel = p.text.slice(s, e) || "text";
    patch(focus, { text: p.text.slice(0, s) + before + sel + after + p.text.slice(e) });
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + sel.length);
    });
  };
  const quote = () => {
    const p = paras.find((x) => x.id === focus);
    if (p) patch(focus, { text: p.text.startsWith("> ") ? p.text.slice(2) : `> ${p.text}` });
  };

  const text = mode === "micro" ? micro.trim() : paras.map((p) => p.text.trim()).filter(Boolean).join("\n\n");
  const canSave = Boolean(rating || text);

  const save = () => {
    set(book.id, {
      rating: rating || undefined,
      favourite: fav,
      review: text || undefined,
      shelf: entry?.shelf ?? "read",
      page: entry?.page ?? book.pages,
    });
    toast("Review published");
    router.push(`/book/${book.id}`);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <BackButton />
        <Button className="min-h-10 px-5 text-sm" disabled={!canSave} onClick={save}>
          Publish
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <BookCover book={book} size="sm" />
        <div className="min-w-0">
          <p className="truncate font-serif text-lg">{book.title}</p>
          <p className="truncate text-sm text-ink-soft">{book.author}</p>
        </div>
      </div>

      <div className="flex flex-col items-center rounded-2xl border border-line bg-surface p-4">
        <StarInput value={rating} onChange={setRating} />
        <div className="mt-1 flex items-center gap-3 text-sm text-ink-soft">
          <span>{rating ? `${rating} / 5` : "Tap to rate · half stars allowed"}</span>
          <button
            onClick={() => setFav((f) => !f)}
            aria-pressed={fav}
            aria-label="Favourite"
            className={`grid size-10 place-items-center rounded-full hover:bg-surface-2 ${fav ? "text-danger" : ""}`}
          >
            <Heart size={22} fill={fav ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <div role="radiogroup" aria-label="Length" className="mt-4 grid grid-cols-2 gap-1 rounded-full bg-surface-2 p-1 text-sm">
        {(["micro", "long"] as const).map((m) => (
          <button
            key={m}
            role="radio"
            aria-checked={mode === m}
            onClick={() => setMode(m)}
            className={`h-9 rounded-full ${mode === m ? "bg-surface font-semibold shadow-sm" : "text-ink-soft"}`}
          >
            {m === "micro" ? "Micro" : "Long-form"}
          </button>
        ))}
      </div>

      <div className="mt-4">
        <Tabs
          label="Editor"
          value={tab}
          onChange={setTab}
          tabs={[
            { id: "write", label: "Write" },
            { id: "preview", label: "Preview" },
          ]}
        />
      </div>

      {tab === "write" ? (
        mode === "micro" ? (
          <div>
            <textarea
              value={micro}
              onChange={(e) => setMicro(e.target.value.slice(0, MICRO))}
              rows={5}
              placeholder="এক কথায়…"
              className="w-full resize-none rounded-xl border border-line bg-surface p-3 text-[16px]"
            />
            <p className={`text-right text-xs ${micro.length > MICRO - 20 ? "text-danger" : "text-ink-soft"}`}>
              {micro.length}/{MICRO}
            </p>
          </div>
        ) : (
          <>
            <div className="sticky top-0 z-10 -mx-1 mb-2 flex items-center gap-1 bg-bg px-1 py-1" role="toolbar" aria-label="Formatting">
              <ToolBtn label="Bold" onClick={() => wrap("**")}>
                <Bold size={17} />
              </ToolBtn>
              <ToolBtn label="Italic" onClick={() => wrap("_")}>
                <Italic size={17} />
              </ToolBtn>
              <ToolBtn label="Quote" onClick={quote}>
                <Quote size={17} />
              </ToolBtn>
              <label className="grid size-10 cursor-pointer place-items-center rounded-full hover:bg-surface-2" aria-label="Add image">
                <ImagePlus size={17} />
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={(e) => {
                    const files = Array.from(e.target.files ?? []).slice(0, 4 - images.length);
                    setImages((im) => [...im, ...files.map((f) => URL.createObjectURL(f))]);
                    e.target.value = "";
                  }}
                />
              </label>
            </div>

            <ul className="flex flex-col gap-3">
              {paras.map((p, i) => (
                <li key={p.id} className={`rounded-xl border p-2 ${p.spoiler ? "border-gold bg-gold/10" : "border-line bg-surface"}`}>
                  <textarea
                    ref={(el) => {
                      refs.current[p.id] = el;
                    }}
                    value={p.text}
                    onFocus={() => setFocus(p.id)}
                    onChange={(e) => patch(p.id, { text: e.target.value })}
                    rows={3}
                    placeholder={i === 0 ? "What did you think?" : "Next paragraph…"}
                    aria-label={`Paragraph ${i + 1}`}
                    className="w-full resize-y bg-transparent p-1 text-[16px] leading-relaxed outline-none"
                  />
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => patch(p.id, { spoiler: !p.spoiler })}
                      aria-pressed={p.spoiler}
                      className={`flex h-8 items-center gap-1.5 rounded-full px-3 text-xs ${
                        p.spoiler ? "bg-gold font-semibold text-[#2a1f0a]" : "bg-surface-2 text-ink-soft"
                      }`}
                    >
                      <EyeOff size={13} /> Spoiler
                    </button>
                    {paras.length > 1 && (
                      <button
                        onClick={() => setParas((ps) => ps.filter((x) => x.id !== p.id))}
                        aria-label="Delete paragraph"
                        className="grid size-8 place-items-center rounded-full text-ink-soft hover:bg-surface-2"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
            <Button
              variant="ghost"
              className="mt-2 w-full text-forest"
              onClick={() => {
                const nid = nextId.current++;
                setParas((ps) => [...ps, { id: nid, text: "", spoiler: false }]);
                setFocus(nid);
              }}
            >
              <Plus size={16} /> Paragraph
            </Button>

            {images.length > 0 && (
              <ul className="mt-3 grid grid-cols-4 gap-2">
                {images.map((src) => (
                  <li key={src} className="relative aspect-square overflow-hidden rounded-xl bg-surface-2">
                    {/* eslint-disable-next-line @next/next/no-img-element -- local object URL preview */}
                    <img src={src} alt="" className="size-full object-cover" />
                    <button
                      onClick={() => {
                        URL.revokeObjectURL(src);
                        setImages((im) => im.filter((x) => x !== src));
                      }}
                      aria-label="Remove image"
                      className="absolute right-1 top-1 grid size-6 place-items-center rounded-full bg-black/60 text-white"
                    >
                      <X size={12} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )
      ) : (
        <article className="rounded-2xl border border-line bg-surface p-4">
          {mode === "micro" ? (
            <p className="leading-relaxed">{micro || <span className="text-ink-soft">Nothing yet.</span>}</p>
          ) : (
            <div className="flex flex-col gap-3">
              {paras.filter((p) => p.text.trim()).map((p) => (
                <SpoilerPara key={p.id} p={p} />
              ))}
              {!paras.some((p) => p.text.trim()) && <p className="text-ink-soft">Nothing yet.</p>}
              {images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {images.map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element -- local object URL preview
                    <img key={src} src={src} alt="" className="aspect-square w-full rounded-xl object-cover" />
                  ))}
                </div>
              )}
            </div>
          )}
        </article>
      )}
    </>
  );
}

function ToolBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onMouseDown={(e) => e.preventDefault()}
      onClick={onClick}
      aria-label={label}
      className="grid size-10 place-items-center rounded-full hover:bg-surface-2"
    >
      {children}
    </button>
  );
}
