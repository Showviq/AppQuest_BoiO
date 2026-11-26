"use client";

import { Camera, CameraOff, ScanBarcode, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BookCover } from "@/components/book-cover";
import { type Shelf, shelfLabels, useLibrary } from "@/components/library-store";
import { useReducedMotion } from "@/components/play/motion";
import { useToast } from "@/components/toast";
import { BackButton, Button, PageTitle, field } from "@/components/ui";
import { type Book, books } from "@/lib/mock-data";

type Cam = "off" | "on" | "denied";

const css = `@keyframes scan-line { 0%,100% { top: 8% } 50% { top: 88% } }
.scan-line { animation: scan-line 2.4s ease-in-out infinite }`;

/** Demo ISBNs mapped onto the seed catalog. */
const isbnOf = (i: number) => `978984${String(100000 + i * 7919).slice(-6)}${i % 10}`;

export default function Scan() {
  const { set } = useLibrary();
  const toast = useToast();
  const reduced = useReducedMotion();
  const video = useRef<HTMLVideoElement>(null);
  const stream = useRef<MediaStream | null>(null);
  const [cam, setCam] = useState<Cam>("off");
  const [isbn, setIsbn] = useState("");
  const [tray, setTray] = useState<Book[]>([]);
  const [shelf, setShelf] = useState<Shelf>("want");

  useEffect(() => () => stream.current?.getTracks().forEach((t) => t.stop()), []);

  const startCam = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      stream.current = s;
      setCam("on");
      requestAnimationFrame(() => {
        if (video.current) video.current.srcObject = s;
      });
    } catch {
      setCam("denied");
    }
  };

  const stopCam = () => {
    stream.current?.getTracks().forEach((t) => t.stop());
    stream.current = null;
    setCam("off");
  };

  const add = (b: Book | undefined) => {
    if (!b) return toast("No match for that ISBN");
    if (tray.some((x) => x.id === b.id)) return toast("Already in tray");
    setTray((t) => [b, ...t]);
    toast(`Found ${b.titleAlt}`);
  };

  const simulate = () => {
    const pool = books.filter((b) => !tray.some((x) => x.id === b.id));
    add(pool[Math.floor(Math.random() * pool.length)] ?? books[0]);
  };

  const lookup = (e: React.FormEvent) => {
    e.preventDefault();
    const q = isbn.replace(/[\s-]/g, "");
    const i = books.findIndex((_, n) => isbnOf(n) === q);
    // Demo: any 10/13-digit code that isn't in the map still "finds" a book.
    add(i >= 0 ? books[i] : /^\d{10}(\d{3})?$/.test(q) ? books[q.length % books.length] : undefined);
    setIsbn("");
  };

  return (
    <>
      <BackButton />
      <PageTitle>Scan</PageTitle>
      <style>{css}</style>

      <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-[#0b1119]">
        {cam === "on" ? (
          <video ref={video} autoPlay playsInline muted className="absolute inset-0 size-full object-cover" />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-center text-[#cfd8de]">
            <div>
              {cam === "denied" ? <CameraOff size={36} className="mx-auto" /> : <Camera size={36} className="mx-auto" />}
              <p className="mt-2 text-sm">{cam === "denied" ? "Camera unavailable" : "Camera off"}</p>
            </div>
          </div>
        )}
        {/* barcode guide */}
        <div className="absolute inset-x-[12%] inset-y-[22%] rounded-2xl border-2 border-dashed border-[#f3eedd]/80">
          <span className={`absolute inset-x-2 h-0.5 bg-gold shadow-[0_0_12px_2px] shadow-gold ${reduced ? "top-1/2" : "scan-line"}`} />
        </div>
        <div className="absolute inset-x-0 bottom-3 flex justify-center">
          {cam === "on" ? (
            <button onClick={stopCam} className="h-9 rounded-full bg-black/50 px-4 text-sm text-white backdrop-blur">
              Stop camera
            </button>
          ) : (
            cam === "off" && (
              <button onClick={startCam} className="h-9 rounded-full bg-[#f3eedd] px-4 text-sm font-semibold text-[#1f3d2b]">
                Allow camera
              </button>
            )
          )}
        </div>
      </div>

      <Button variant="outline" className="mt-3 w-full" onClick={simulate}>
        <ScanBarcode size={18} /> Simulate scan
      </Button>

      <form onSubmit={lookup} className="mt-3 flex gap-2">
        <input
          className={field}
          inputMode="numeric"
          placeholder="ISBN"
          aria-label="ISBN"
          value={isbn}
          onChange={(e) => setIsbn(e.target.value)}
        />
        <Button type="submit" disabled={!isbn.trim()}>
          Find
        </Button>
      </form>

      {tray.length > 0 && (
        <section className="mt-6 rounded-2xl border border-line bg-surface p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="font-semibold">Tray · {tray.length}</h2>
            <select
              aria-label="Shelf"
              value={shelf}
              onChange={(e) => setShelf(e.target.value as Shelf)}
              className="h-9 rounded-full border border-line bg-bg px-3 text-sm"
            >
              {(Object.keys(shelfLabels) as Shelf[]).map((s) => (
                <option key={s} value={s}>
                  {shelfLabels[s]}
                </option>
              ))}
            </select>
          </div>
          <ul className="divide-y divide-line">
            {tray.map((b) => (
              <li key={b.id} className="flex items-center gap-3 py-2.5">
                <BookCover book={b} size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="font-serif">{b.title}</p>
                  <p className="text-xs text-ink-soft">{isbnOf(books.indexOf(b))}</p>
                </div>
                <button
                  onClick={() => setTray((t) => t.filter((x) => x.id !== b.id))}
                  aria-label={`Remove ${b.titleAlt}`}
                  className="grid size-9 place-items-center rounded-full text-ink-soft hover:bg-surface-2"
                >
                  <Trash2 size={16} />
                </button>
              </li>
            ))}
          </ul>
          <Button
            className="mt-3 w-full"
            onClick={() => {
              tray.forEach((b) => set(b.id, { shelf, page: shelf === "read" ? b.pages : 0 }));
              toast(`Added ${tray.length} to ${shelfLabels[shelf]}`);
              setTray([]);
            }}
          >
            Add all
          </Button>
        </section>
      )}
    </>
  );
}
