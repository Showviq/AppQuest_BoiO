"use client";

import { Lock, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ShelfForm } from "@/components/library/shelf-form";
import { ShelfTile } from "@/components/library/shelf-tile";
import { useShelves } from "@/components/library/shelves-store";
import { Sheet } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { BackButton, Button, PageTitle } from "@/components/ui";

export default function Shelves() {
  const { shelves, create } = useShelves();
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const toast = useToast();

  return (
    <>
      <BackButton href="/library" />
      <PageTitle
        action={
          <Button className="min-h-10 px-4 text-sm" onClick={() => setOpen(true)}>
            <Plus size={16} /> New
          </Button>
        }
      >
        Shelves
      </PageTitle>

      <ul className="grid grid-cols-2 gap-4">
        {shelves.map((s) => (
          <li key={s.id}>
            <Link href={`/shelves/${s.id}`} className="block">
              <ShelfTile shelf={s} />
              <p className="mt-2 flex items-center gap-1.5 font-medium">
                {s.name} {!s.isPublic && <Lock size={13} className="text-ink-soft" aria-label="Private" />}
              </p>
              <p className="text-xs text-ink-soft">{s.bookIds.length} books</p>
            </Link>
          </li>
        ))}
        <li>
          <button
            onClick={() => setOpen(true)}
            className="grid aspect-[4/3] w-full place-items-center rounded-2xl border-2 border-dashed border-line text-ink-soft"
            aria-label="New shelf"
          >
            <Plus size={28} />
          </button>
        </li>
      </ul>

      <Sheet open={open} onClose={() => setOpen(false)} title="New shelf">
        <ShelfForm
          onSave={(d) => {
            const id = create(d);
            toast("Shelf created");
            setOpen(false);
            router.push(`/shelves/${id}`);
          }}
        />
      </Sheet>
    </>
  );
}
