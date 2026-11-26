import { MapPin, Truck } from "lucide-react";
import Link from "next/link";
import { BookCover } from "@/components/book-cover";
import { getBook } from "@/lib/mock-data";
import type { Listing } from "@/lib/mock/market";
import { taka } from "./my-listings";

export const conditionTint: Record<string, string> = {
  "Brand New": "bg-forest text-on-forest",
  "Like New": "bg-forest-soft text-forest",
  Good: "bg-surface-2 text-ink",
  Acceptable: "border border-line text-ink-soft",
};

export function ConditionBadge({ condition }: { condition: string }) {
  return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${conditionTint[condition]}`}>{condition}</span>;
}

export function ListingCard({ listing }: { listing: Listing }) {
  const book = getBook(listing.bookId);
  if (!book) return null;
  return (
    <Link href={`/market/${listing.id}`} className="flex gap-3 rounded-2xl border border-line bg-surface p-3">
      <BookCover book={book} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="line-clamp-1 font-serif">{book.title}</p>
          <p className="shrink-0 font-semibold">{taka(listing.price)}</p>
        </div>
        <p className="line-clamp-1 text-xs text-ink-soft">{book.author}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-ink-soft">
          <ConditionBadge condition={listing.condition} />
          <span className="flex items-center gap-0.5">
            <MapPin size={12} /> {listing.area}
          </span>
          {listing.delivery && <Truck size={13} aria-label="Delivery" />}
          <span className="ml-auto">{listing.ago}</span>
        </div>
      </div>
    </Link>
  );
}
