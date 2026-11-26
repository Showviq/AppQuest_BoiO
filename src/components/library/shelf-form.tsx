"use client";

import { Check, Globe, Lock } from "lucide-react";
import { useState } from "react";
import { type CustomShelf, shelfColors } from "@/components/library/shelves-store";
import { Button, field } from "@/components/ui";
import { books } from "@/lib/mock-data";

type Draft = Omit<CustomShelf, "id">;

/** Create / edit form for a custom shelf (used inside a Sheet). */
export function ShelfForm({ initial, onSave }: { initial?: Draft; onSave: (d: Draft) => void }) {
  const [d, setD] = useState<Draft>(initial ?? { name: "", isPublic: true, color: shelfColors[0], bookIds: [] });

  return (
    <>
      <input value={d.name} onChange={(e) => setD({ ...d, name: e.target.value })} placeholder="Shelf name" maxLength={40} className={field} aria-label="Shelf name" />

      <div role="radiogroup" aria-label="Visibility" className="mt-4 grid grid-cols-2 gap-2">
        {[true, false].map((pub) => (
          <button
            key={String(pub)}
            role="radio"
            aria-checked={d.isPublic === pub}
            onClick={() => setD({ ...d, isPublic: pub })}
            className={`flex h-11 items-center justify-center gap-2 rounded-xl border text-sm ${
              d.isPublic === pub ? "border-forest bg-forest-soft font-semibold text-forest" : "border-line"
            }`}
          >
            {pub ? <Globe size={16} /> : <Lock size={16} />} {pub ? "Public" : "Private"}
          </button>
        ))}
      </div>

      <p className="mb-2 mt-4 text-sm text-ink-soft">Cover</p>
      <div className="flex flex-wrap gap-2">
        {shelfColors.map((c) => (
          <button
            key={c}
            onClick={() => setD({ ...d, color: c, coverBookId: undefined })}
            aria-label={`Colour ${c}`}
            aria-pressed={d.color === c && !d.coverBookId}
            className="grid size-9 place-items-center rounded-full"
            style={{ background: c }}
          >
            {d.color === c && !d.coverBookId && <Check size={16} className="text-white" />}
          </button>
        ))}
      </div>
      <select
        value={d.coverBookId ?? ""}
        onChange={(e) => setD({ ...d, coverBookId: e.target.value || undefined })}
        className={`${field} mt-3`}
        aria-label="Use a book as cover"
      >
        <option value="">Plain colour</option>
        {books.map((b) => (
          <option key={b.id} value={b.id}>
            {b.title}
          </option>
        ))}
      </select>

      <Button className="mt-5 w-full" disabled={!d.name.trim()} onClick={() => onSave({ ...d, name: d.name.trim() })}>
        Save
      </Button>
    </>
  );
}
