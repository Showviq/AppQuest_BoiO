"use client";

import { Download } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { useToast } from "@/components/toast";
import { BackButton, Button, Chip, PageTitle, Switch, field, Rail } from "@/components/ui";
import { type Book, books, getBook } from "@/lib/mock-data";

type Design = { id: string; label: string; paint: (ctx: CanvasRenderingContext2D, w: number, h: number) => void; ink: string; soft: string };

const designs: Design[] = [
  {
    id: "paper",
    label: "Paper",
    ink: "#262722",
    soft: "#66665a",
    paint: (c, w, h) => {
      c.fillStyle = "#f3eedd";
      c.fillRect(0, 0, w, h);
      c.strokeStyle = "#b08d3c";
      c.lineWidth = 6;
      c.strokeRect(40, 40, w - 80, h - 80);
    },
  },
  {
    id: "forest",
    label: "Forest",
    ink: "#f3eedd",
    soft: "#c9c3ad",
    paint: (c, w, h) => {
      const g = c.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, "#1f3d2b");
      g.addColorStop(1, "#0f2117");
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
    },
  },
  {
    id: "dusk",
    label: "Dusk",
    ink: "#fff3dc",
    soft: "#f2d3b5",
    paint: (c, w, h) => {
      const g = c.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, "#3b2a4a");
      g.addColorStop(1, "#c4672f");
      c.fillStyle = g;
      c.fillRect(0, 0, w, h);
    },
  },
  {
    id: "alpona",
    label: "Alpona",
    ink: "#fbe8c4",
    soft: "#e9c99a",
    paint: (c, w, h) => {
      c.fillStyle = "#8c2b25";
      c.fillRect(0, 0, w, h);
      c.strokeStyle = "rgba(251,232,196,.18)";
      c.lineWidth = 3;
      for (let x = 0; x < w + 120; x += 120)
        for (let y = 0; y < h + 120; y += 120) {
          c.beginPath();
          c.arc(x, y, 40, 0, Math.PI * 2);
          c.stroke();
          c.beginPath();
          c.arc(x, y, 14, 0, Math.PI * 2);
          c.stroke();
        }
    },
  },
  {
    id: "night",
    label: "Night",
    ink: "#ece5d1",
    soft: "#a3a08f",
    paint: (c, w, h) => {
      c.fillStyle = "#131814";
      c.fillRect(0, 0, w, h);
      c.fillStyle = "#d2b061";
      c.beginPath();
      c.arc(w - 160, 180, 70, 0, Math.PI * 2);
      c.fill();
    },
  },
];

const sizes = { s: 52, m: 64, l: 80 } as const;
type Size = keyof typeof sizes;
type Aspect = "square" | "story";

function wrapLines(ctx: CanvasRenderingContext2D, text: string, max: number) {
  const out: string[] = [];
  for (const para of text.split("\n")) {
    let line = "";
    for (const word of para.split(/\s+/)) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > max && line) {
        out.push(line);
        line = word;
      } else line = test;
    }
    out.push(line);
  }
  return out;
}

function draw(
  canvas: HTMLCanvasElement,
  o: { design: Design; quote: string; book: Book; family: string; size: Size; aspect: Aspect; cover: boolean }
) {
  const w = 1080;
  const h = o.aspect === "square" ? 1080 : 1920;
  canvas.width = w;
  canvas.height = h;
  const c = canvas.getContext("2d");
  if (!c) return;
  o.design.paint(c, w, h);

  const pad = 120;
  const fs = sizes[o.size] * (o.aspect === "story" ? 1.1 : 1);
  c.font = `${fs}px ${o.family}`;
  const lines = wrapLines(c, o.quote || "…", w - pad * 2);
  const lh = fs * 1.45;
  const coverH = o.cover ? 300 : 0;
  const block = lines.length * lh + 60 + 50 + (o.cover ? coverH + 60 : 0);
  let y = Math.max(pad, (h - block) / 2);

  // opening mark
  c.fillStyle = o.design.soft;
  c.font = `${fs * 2.4}px Georgia, serif`;
  c.textAlign = "left";
  c.textBaseline = "top";
  c.fillText("“", pad - 10, y - fs * 1.6);

  c.fillStyle = o.design.ink;
  c.font = `${fs}px ${o.family}`;
  for (const l of lines) {
    c.fillText(l, pad, y);
    y += lh;
  }

  y += 40;
  c.fillStyle = o.design.soft;
  c.font = `${Math.round(fs * 0.55)}px ${o.family}`;
  c.fillText(`— ${o.book.title} · ${o.book.author}`, pad, y);
  y += 60;

  if (o.cover) {
    const cw = coverH * (2 / 3);
    c.fillStyle = o.book.cover.bg;
    c.shadowColor = "rgba(0,0,0,.35)";
    c.shadowBlur = 24;
    c.shadowOffsetY = 10;
    c.fillRect(pad, y, cw, coverH);
    c.shadowColor = "transparent";
    c.fillStyle = "rgba(0,0,0,.25)";
    c.fillRect(pad + cw * 0.07, y, 2, coverH);
    c.fillStyle = o.book.cover.fg;
    c.font = `${Math.round(cw * 0.13)}px ${o.family}`;
    wrapLines(c, o.book.title, cw * 0.72).forEach((l, i) => c.fillText(l, pad + cw * 0.18, y + 26 + i * cw * 0.17));
  }

  // watermark
  c.fillStyle = o.design.soft;
  c.textAlign = "right";
  c.textBaseline = "alphabetic";
  c.font = `36px ${o.family}`;
  c.fillText("Boi-O", w - 70, h - 64);
}

export default function QuotePage() {
  return (
    <Suspense>
      <QuoteInner />
    </Suspense>
  );
}

function QuoteInner() {
  const params = useSearchParams();
  const toast = useToast();
  const [bookId, setBookId] = useState(getBook(params.get("book") ?? "")?.id ?? "pather-panchali");
  const [quote, setQuote] = useState("পৃথিবীর পথে পথে কত না অজানা আনন্দ ছড়ানো রয়েছে।");
  const [designId, setDesignId] = useState("paper");
  const [typo, setTypo] = useState<"serif" | "sans">("serif");
  const [size, setSize] = useState<Size>("m");
  const [aspect, setAspect] = useState<Aspect>("square");
  const [cover, setCover] = useState(true);
  const canvas = useRef<HTMLCanvasElement>(null);
  const serifProbe = useRef<HTMLSpanElement>(null);
  const sansProbe = useRef<HTMLSpanElement>(null);

  const book = getBook(bookId) ?? books[0];
  const design = designs.find((d) => d.id === designId) ?? designs[0];

  useEffect(() => {
    let live = true;
    // next/font uses generated family names — read them off probe elements, wait for load.
    const family = getComputedStyle((typo === "serif" ? serifProbe : sansProbe).current!).fontFamily;
    Promise.all([document.fonts.load(`40px ${family}`, "অa"), document.fonts.ready]).catch(() => {}).then(() => {
      if (live && canvas.current) draw(canvas.current, { design, quote, book, family, size, aspect, cover });
    });
    return () => {
      live = false;
    };
  }, [design, quote, book, typo, size, aspect, cover]);

  const download = () => {
    canvas.current?.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `boio-quote-${book.id}.png`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      toast("Saved image");
    }, "image/png");
  };

  return (
    <>
      <span ref={serifProbe} className="hidden font-serif" aria-hidden />
      <span ref={sansProbe} className="hidden font-sans" aria-hidden />
      <BackButton />
      <PageTitle
        action={
          <Button className="min-h-10 px-4 text-sm" onClick={download}>
            <Download size={16} /> PNG
          </Button>
        }
      >
        Quote card
      </PageTitle>

      <div className={`mx-auto ${aspect === "square" ? "max-w-sm" : "max-w-[15rem]"}`}>
        <canvas ref={canvas} className="h-auto w-full rounded-2xl shadow-lg" aria-label="Quote card preview" role="img" />
      </div>

      <div className="mt-5 flex flex-col gap-4">
        <select value={bookId} onChange={(e) => setBookId(e.target.value)} className={field} aria-label="Book">
          {books.map((b) => (
            <option key={b.id} value={b.id}>
              {b.title} — {b.author}
            </option>
          ))}
        </select>
        <textarea
          value={quote}
          onChange={(e) => setQuote(e.target.value.slice(0, 240))}
          rows={3}
          aria-label="Quote"
          placeholder="Quote"
          className="w-full resize-none rounded-xl border border-line bg-bg p-3 font-serif text-[16px]"
        />

        <div>
          <p className="mb-2 text-sm text-ink-soft">Background</p>
          <Rail as="div" className="gap-2">
            {designs.map((d) => (
              <Chip key={d.id} active={designId === d.id} onClick={() => setDesignId(d.id)}>
                {d.label}
              </Chip>
            ))}
          </Rail>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Segment label="Font" value={typo} onChange={setTypo} options={[["serif", "Serif"], ["sans", "Sans"]]} />
          <Segment label="Size" value={size} onChange={setSize} options={[["s", "S"], ["m", "M"], ["l", "L"]]} />
        </div>
        <Segment label="Format" value={aspect} onChange={setAspect} options={[["square", "Square 1:1"], ["story", "Story 9:16"]]} />
        <Switch label="Show cover" checked={cover} onChange={setCover} />
      </div>
    </>
  );
}

function Segment<T extends string>({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: T;
  onChange: (v: T) => void;
  options: [T, string][];
}) {
  return (
    <div>
      <p className="mb-2 text-sm text-ink-soft">{label}</p>
      <div role="radiogroup" aria-label={label} className="flex gap-1 rounded-full bg-surface-2 p-1 text-sm">
        {options.map(([v, l]) => (
          <button
            key={v}
            role="radio"
            aria-checked={value === v}
            onClick={() => onChange(v)}
            className={`h-9 flex-1 rounded-full ${value === v ? "bg-surface font-semibold shadow-sm" : "text-ink-soft"}`}
          >
            {l}
          </button>
        ))}
      </div>
    </div>
  );
}
