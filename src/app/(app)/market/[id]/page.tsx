"use client";

import { Bookmark, Check, MapPin, Send, ShieldCheck, Star, Truck, X } from "lucide-react";
import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import { ConditionBadge } from "@/components/market/listing-card";
import { ME, taka, useMyListings } from "@/components/market/my-listings";
import { useToast } from "@/components/toast";
import { Accordion, Avatar, BackButton, Button } from "@/components/ui";
import { getBook } from "@/lib/mock-data";
import { getListing, listings, sellers } from "@/lib/mock/market";

export default function ListingPage() {
  const { id } = useParams<{ id: string }>();
  const { mine } = useMyListings();
  const toast = useToast();
  const [saved, setSaved] = useState(false);
  const listing = getListing(id) ?? mine.find((l) => l.id === id);

  // Own listings load from localStorage after mount; wait before 404-ing those.
  if (!listing) {
    if (id.startsWith("m")) return <div className="mt-24 h-24 skeleton rounded-2xl" aria-label="Loading" />;
    notFound();
  }
  const book = getBook(listing.bookId);
  if (!book) notFound();
  const isMine = listing.seller === ME;
  const seller = sellers[listing.seller];
  const more = listings.filter((l) => l.seller === listing.seller && l.id !== listing.id);

  return (
    <>
      <div className="flex items-center justify-between">
        <BackButton href="/market" />
        <button
          onClick={() => { setSaved((s) => !s); toast(saved ? "Removed from saved" : "Saved"); }}
          aria-pressed={saved}
          aria-label="Save listing"
          className="grid size-11 place-items-center rounded-full hover:bg-surface-2"
        >
          <Bookmark size={20} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="-mx-4 flex justify-center bg-surface-2 py-8">
        <BookCover book={book} size="lg" />
      </div>

      <div className="mt-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-2xl leading-tight">{book.title}</h1>
          <p className="text-ink-soft">{book.author}</p>
        </div>
        <p className="text-2xl font-semibold">{taka(listing.price)}</p>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm">
        <ConditionBadge condition={listing.condition} />
        <span className="flex items-center gap-1 text-ink-soft">
          <MapPin size={14} /> {listing.area}
        </span>
        <span className="text-ink-soft">· {listing.ago}</span>
      </div>

      <ul className="mt-4 grid grid-cols-2 gap-2 text-center text-xs">
        <Opt on={listing.pickup} icon={<MapPin size={18} />} label="Pickup" />
        <Opt on={listing.delivery} icon={<Truck size={18} />} label="Delivery" />
      </ul>

      {listing.note && <p className="mt-4 font-serif">{listing.note}</p>}

      {seller && (
        <Link href={`/u/${seller.handle}`} className="mt-5 flex items-center gap-3 rounded-2xl border border-line bg-surface p-3">
          <Avatar name={seller.name} />
          <div className="flex-1">
            <p className="font-medium">{seller.name}</p>
            <p className="flex items-center gap-1 text-sm text-ink-soft">
              <Star size={12} className="text-gold" fill="currentColor" /> {seller.rating} · {seller.deals} deals
            </p>
          </div>
          <ShieldCheck size={18} className="text-forest" aria-label="Verified phone" />
        </Link>
      )}

      {!isMine && seller && (
        <div className="mt-5 grid grid-cols-2 gap-3">
          <Button onClick={() => toast(`Request sent · ${seller.name} gets an SMS`)}>
            <Send size={18} /> Request
          </Button>
          <Button variant="outline" onClick={() => toast("Offer sent")}>
            Make offer
          </Button>
        </div>
      )}

      <div className="mt-6 rounded-2xl border border-line bg-surface px-4">
        <Accordion title="Safety tips">
          <ul className="list-disc pl-5">
            <li>Meet in a public place</li>
            <li>Check the book before paying</li>
            <li>Pay on handover</li>
          </ul>
        </Accordion>
        {more.length > 0 && (
          <Accordion title={`More from ${seller?.name}`} meta={more.length}>
            <ul className="flex gap-3">
              {more.map((l) => (
                <li key={l.id}>
                  <Link href={`/market/${l.id}`} className="block w-14 text-center">
                    <BookCover book={getBook(l.bookId)!} size="sm" />
                    <span className="text-xs text-ink">{taka(l.price)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Accordion>
        )}
      </div>
    </>
  );
}

function Opt({ on, icon, label }: { on: boolean; icon: React.ReactNode; label: string }) {
  return (
    <li
      className={`flex flex-col items-center gap-1 rounded-xl border py-3 ${
        on ? "border-forest/40 bg-forest-soft text-forest" : "border-line text-ink-soft opacity-60"
      }`}
    >
      {icon}
      <span className="flex items-center gap-0.5">
        {on ? <Check size={11} /> : <X size={11} />} {label}
      </span>
    </li>
  );
}
