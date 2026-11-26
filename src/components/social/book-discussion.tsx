"use client";

import { MessageSquare, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { Comments } from "@/components/social/comments";
import { Sheet } from "@/components/sheet";
import { Tabs } from "@/components/ui";
import { type Discussion, bookDiscussions, defaultComments } from "@/lib/mock/social";

type Tab = keyof typeof bookDiscussions;
const tabs = [
  { id: "plot", label: "Plot" },
  { id: "themes", label: "Themes" },
  { id: "characters", label: "Characters" },
] as const;

/** Plot / Themes / Characters threads; spoiler threads are gated. */
export function BookDiscussion() {
  const [tab, setTab] = useState<Tab>("plot");
  const [shown, setShown] = useState<Set<string>>(new Set());
  const [open, setOpen] = useState<Discussion | null>(null);

  return (
    <section className="mt-8">
      <h2 className="mb-2 text-lg font-semibold">Discussion</h2>
      <Tabs label="Discussion" tabs={tabs} value={tab} onChange={setTab} />
      <ul className="flex flex-col gap-2">
        {bookDiscussions[tab].map((d) => {
          const hidden = d.spoiler && !shown.has(d.id);
          return (
            <li key={d.id} className="rounded-2xl border border-line bg-surface">
              {hidden ? (
                <div className="flex items-center gap-3 p-3">
                  <TriangleAlert size={18} className="shrink-0 text-danger" />
                  <span className="flex-1 text-sm text-ink-soft">Contains spoilers</span>
                  <button
                    onClick={() => setShown((s) => new Set(s).add(d.id))}
                    className="h-9 rounded-full border border-line px-4 text-sm font-semibold"
                  >
                    Show
                  </button>
                </div>
              ) : (
                <button onClick={() => setOpen(d)} className="flex w-full items-center gap-3 p-3 text-left">
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{d.title}</span>
                    <span className="block text-sm text-ink-soft">{d.user}</span>
                  </span>
                  <span className="flex items-center gap-1 text-sm text-ink-soft">
                    <MessageSquare size={15} /> {d.replies}
                  </span>
                </button>
              )}
            </li>
          );
        })}
      </ul>

      <Sheet open={open !== null} onClose={() => setOpen(null)} title={open?.title ?? ""}>
        <Comments initial={defaultComments} sticky={false} />
      </Sheet>
    </section>
  );
}
