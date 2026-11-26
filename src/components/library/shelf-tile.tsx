import { BookCover } from "@/components/book-cover";
import type { CustomShelf } from "@/components/library/shelves-store";
import { getBook } from "@/lib/mock-data";

/** Shelf cover: chosen book cover on its colour, or a fan of the first books. */
export function ShelfTile({ shelf }: { shelf: CustomShelf }) {
  const cover = shelf.coverBookId ? getBook(shelf.coverBookId) : undefined;
  const fan = shelf.bookIds.slice(0, 3).map(getBook).filter((b) => b !== undefined);
  return (
    <div className="relative flex aspect-[4/3] items-end justify-center overflow-hidden rounded-2xl pb-3" style={{ background: shelf.color }}>
      {cover ? (
        <BookCover book={cover} size="sm" />
      ) : (
        <div className="flex">
          {fan.map((b, i) => (
            <span key={b.id} className={i ? "-ml-5" : ""} style={{ transform: `rotate(${(i - 1) * 8}deg)` }}>
              <BookCover book={b} size="sm" />
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
