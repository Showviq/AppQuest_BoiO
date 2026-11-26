"use client";

import { ArrowDown, ArrowUp, Globe, Lock, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { BookCover } from "@/components/book-cover";
import { ShelfForm } from "@/components/library/shelf-form";
import { ShelfTile } from "@/components/library/shelf-tile";
import { useShelves } from "@/components/library/shelves-store";
import { Sheet } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { BackButton, Button } from "@/components/ui";
import { books, getBook, searchBooks } from "@/lib/mock-data";

export default function ShelfDetail() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const toast = useToast();
  const { shelves, ready, update, remove } = useShelves();
  const [sheet, setSheet] = useState<"edit" | "add" | "delete" | null>(null);
  const [q, setQ] = useState("");
  const shelf = shelves.find((s) => s.id === id);

  if (!shelf) {
    return ready ? (
      <>
        <BackButton href="/shelves" />
        <p className="mt-16 text-center text-ink-soft">Shelf not found.</p>
      </>
    ) : (
      <div className="mt-24 h-24 skeleton rounded-2xl" aria-label="Loading" />
    );
  }

  const move = (i: number, dir: -1 | 1) => {
    const ids = [...shelf.bookIds];
    [ids[i], ids[i + dir]] = [ids[i + dir], ids[i]];
    update(shelf.id, { bookIds: ids });
  };
  const toggleBook = (bookId: string) =>
    update(shelf.id, {
      bookIds: shelf.bookIds.includes(bookId) ? shelf.bookIds.filter((b) => b !== bookId) : [...shelf.bookIds, bookId],
    });

  const candidates = q.trim() ? searchBooks(q) : books;

  return (
    <>
      <BackButton href="/shelves" />
      <div className="mx-auto max-w-56">
        <ShelfTile shelf={shelf} />
      </div>
      <div className="mt-4 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-serif text-3xl">{shelf.name}</h1>
          <p className="flex items-center gap-1.5 text-sm text-ink-soft">
            {shelf.isPublic ? <Globe size={14} /> : <Lock size={14} />}
            {shelf.isPublic ? "Public" : "Private"} · {shelf.bookIds.length} books
          </p>
        </div>
        <div className="flex">
          <button onClick={() => setSheet("edit")} aria-label="Edit" className="grid size-11 place-items-center rounded-full hover:bg-surface-2">
            <Pencil size={18} />
          </button>
          <button onClick={() => setSheet("delete")} aria-label="Delete" className="grid size-11 place-items-center rounded-full text-danger hover:bg-surface-2">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <Button variant="outline" className="mt-4 w-full" onClick={() => setSheet("add")}>
        <Plus size={18} /> Add books
      </Button>

      <ol className="mt-4 divide-y divide-line">
        {shelf.bookIds.map((bid, i) => {
          const b = getBook(bid);
          if (!b) return null;
          return (
            <li key={bid} className="flex items-center gap-3 py-3">
              <span className="w-5 text-center text-sm text-ink-soft">{i + 1}</span>
              <Link href={`/book/${b.id}`} className="flex min-w-0 flex-1 items-center gap-3">
                <BookCover book={b} size="sm" />
                <span className="min-w-0">
                  <span className="block truncate font-serif">{b.title}</span>
                  <span className="block truncate text-sm text-ink-soft">{b.author}</span>
                </span>
              </Link>
              <div className="flex flex-col">
                <button disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up" className="grid size-8 place-items-center rounded-full hover:bg-surface-2 disabled:opacity-30">
                  <ArrowUp size={16} />
                </button>
                <button disabled={i === shelf.bookIds.length - 1} onClick={() => move(i, 1)} aria-label="Move down" className="grid size-8 place-items-center rounded-full hover:bg-surface-2 disabled:opacity-30">
                  <ArrowDown size={16} />
                </button>
              </div>
              <button onClick={() => toggleBook(bid)} aria-label="Remove" className="grid size-9 place-items-center rounded-full text-ink-soft hover:bg-surface-2">
                <X size={16} />
              </button>
            </li>
          );
        })}
        {shelf.bookIds.length === 0 && <li className="py-12 text-center text-ink-soft">Empty shelf.</li>}
      </ol>

      <Sheet open={sheet === "edit"} onClose={() => setSheet(null)} title="Edit shelf">
        <ShelfForm
          initial={shelf}
          onSave={(d) => {
            update(shelf.id, d);
            toast("Saved");
            setSheet(null);
          }}
        />
      </Sheet>

      <Sheet open={sheet === "add"} onClose={() => setSheet(null)} title="Add books">
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" aria-label="Search books" className="h-11 w-full rounded-full border border-line bg-bg pl-10 pr-4" />
        </div>
        <ul className="mt-3 divide-y divide-line">
          {candidates.map((b) => {
            const inShelf = shelf.bookIds.includes(b.id);
            return (
              <li key={b.id} className="flex items-center gap-3 py-2">
                <BookCover book={b} size="sm" />
                <span className="min-w-0 flex-1 truncate font-serif">{b.title}</span>
                <button
                  onClick={() => toggleBook(b.id)}
                  aria-pressed={inShelf}
                  className={`h-9 rounded-full px-4 text-sm font-semibold ${inShelf ? "border border-line text-ink-soft" : "bg-forest text-on-forest"}`}
                >
                  {inShelf ? "Added" : "Add"}
                </button>
              </li>
            );
          })}
        </ul>
      </Sheet>

      <Sheet open={sheet === "delete"} onClose={() => setSheet(null)} title="Delete shelf?">
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => setSheet(null)}>
            Cancel
          </Button>
          <Button
            className="!bg-danger"
            onClick={() => {
              remove(shelf.id);
              toast("Shelf deleted");
              router.push("/shelves");
            }}
          >
            Delete
          </Button>
        </div>
      </Sheet>
    </>
  );
}
