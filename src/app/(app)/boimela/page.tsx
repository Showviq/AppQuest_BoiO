"use client";

import { ArrowLeft, MapPin, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import { Accordion, PageTitle } from "@/components/ui";
import { books, stalls } from "@/lib/mock-data";

export default function BoiMela() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const list = stalls.filter((s) => s.publisher.includes(q.trim()));
  const trending = [...books].filter((b) => b.lang === "bn").sort((a, b) => b.ratings - a.ratings).slice(0, 6);

  return (
    <>
      <button
        onClick={() => router.back()}
        aria-label="Back"
        className="-ml-2 mb-1 grid size-11 place-items-center rounded-full hover:bg-surface-2"
      >
        <ArrowLeft size={22} />
      </button>
      <PageTitle>Boi Mela</PageTitle>

      <div className="mb-6 flex items-center gap-3 rounded-2xl border border-line bg-surface p-4">
        <Phone size={20} className="text-forest" />
        <div className="flex-1">
          <p className="font-medium">No internet? Dial *XXX#</p>
          <p className="text-sm text-ink-soft">Any Banglalink phone</p>
        </div>
      </div>

      <input
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Find a publisher"
        aria-label="Find a publisher"
        className="h-12 w-full rounded-full border border-line bg-surface px-5 text-[16px]"
      />
      <ul className="mt-3 divide-y divide-line">
        {list.map((s) => (
          <li key={s.publisher} className="flex items-center gap-3 py-3">
            <MapPin size={18} className="text-gold" />
            <span className="flex-1 font-medium">{s.publisher}</span>
            <span className="text-right text-sm text-ink-soft">
              {s.stall}
              <br />
              {s.zone}
            </span>
          </li>
        ))}
        {list.length === 0 && <li className="py-6 text-center text-ink-soft">No publisher found.</li>}
      </ul>

      <div className="mt-6 rounded-2xl border border-line bg-surface px-4">
        <Accordion title="Trending at the fair" defaultOpen>
          <ul className="no-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-1">
            {trending.map((b) => (
              <li key={b.id} className="w-20 shrink-0">
                <BookCover book={b} size="sm" />
              </li>
            ))}
          </ul>
        </Accordion>
        <Accordion title="Wishlist & budget" meta="Pro">
          Plan what to buy and how much to spend.
        </Accordion>
      </div>
      <p className="mt-4 text-center text-xs text-ink-soft">Demo stall data</p>
    </>
  );
}
