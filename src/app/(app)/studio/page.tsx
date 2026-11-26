"use client";

import { BadgeCheck, Coins, Megaphone, Store, UsersRound } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { publisherPlans, roleLabel, usePartner, type PlanId } from "@/components/partner-store";
import { Sheet } from "@/components/sheet";
import { StudioDashboard } from "@/components/studio/dashboard";
import { useToast } from "@/components/toast";
import { Accordion, Button, Card, PageTitle } from "@/components/ui";
import { books } from "@/lib/mock-data";

const field = "h-12 w-full rounded-xl border border-line bg-bg px-4 text-ink outline-none focus:border-forest";
const when = (t: number) => new Date(t).toLocaleDateString("en-GB", { day: "numeric", month: "short" });

export default function Studio() {
  const p = usePartner();
  const toast = useToast();
  const [post, setPost] = useState("");
  const [plan, setPlan] = useState<PlanId | null>(null);
  const [bookId, setBookId] = useState(books[0].id);
  const [stall, setStall] = useState<string | null>(null);

  if (!p.ready) return <div className="mt-24 h-24 skeleton rounded-2xl" aria-label="Loading" />;

  if (p.app?.status !== "approved") {
    return (
      <>
        <PageTitle>Studio</PageTitle>
        <Card className="p-5">
          <p className="font-medium">For verified authors and publishers</p>
          <Link href="/partner" className="mt-4 inline-flex h-11 items-center rounded-full bg-forest px-5 font-semibold text-on-forest">
            {p.app ? "See application" : "Apply"}
          </Link>
        </Card>
      </>
    );
  }

  const { role, name } = p.app;
  const isPub = role === "publisher";
  const chosen = publisherPlans.find((x) => x.id === plan);

  const stats = isPub
    ? [
        { label: "Followers", value: 0, icon: UsersRound },
        { label: "Promotions", value: p.plans.length, icon: Megaphone },
        { label: "Stall", value: p.stall || "—", icon: Store },
      ]
    : [
        { label: "Followers", value: 0, icon: UsersRound },
        { label: "Posts", value: p.posts.length, icon: Megaphone },
        { label: "Tips", value: "৳0", icon: Coins },
      ];

  return (
    <>
      <PageTitle>Studio</PageTitle>

      <div className="flex items-center gap-4">
        <div className="grid size-16 place-items-center rounded-full bg-forest font-serif text-2xl text-on-forest">
          {name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="flex items-center gap-1 text-xl font-semibold">
            {name} <BadgeCheck size={18} className="text-forest" aria-label="Verified" />
          </p>
          <p className="text-sm text-ink-soft">{roleLabel[role]}</p>
        </div>
      </div>

      <dl className="mt-6 grid grid-cols-3 rounded-2xl border border-line bg-surface py-4 text-center">
        {stats.map((s) => (
          <div key={s.label}>
            <dd className="text-2xl font-semibold">{s.value}</dd>
            <dt className="flex items-center justify-center gap-1 text-xs text-ink-soft">
              <s.icon size={12} /> {s.label}
            </dt>
          </div>
        ))}
      </dl>

      <div className="mt-6 rounded-2xl border border-line bg-surface px-4">
        <Accordion title="Announcement" defaultOpen>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!post.trim()) return;
              p.addPost(post.trim());
              setPost("");
              toast("Posted to followers");
            }}
          >
            <textarea
              value={post}
              onChange={(e) => setPost(e.target.value)}
              maxLength={280}
              rows={3}
              placeholder={isPub ? "New release, offer, fair news…" : "Writing update, new book…"}
              className="w-full rounded-xl border border-line bg-bg p-3 text-ink outline-none focus:border-forest"
              aria-label="Announcement"
            />
            <Button type="submit" className="mt-2" disabled={!post.trim()}>
              Post
            </Button>
          </form>
          {p.posts.length > 0 && (
            <ul className="mt-4 divide-y divide-line">
              {p.posts.map((x) => (
                <li key={x.at} className="py-2 text-ink">
                  {x.text} <span className="text-xs text-ink-soft">· {when(x.at)}</span>
                </li>
              ))}
            </ul>
          )}
        </Accordion>

        {isPub ? (
          <>
            <Accordion title="Boi Mela stall" meta={p.stall}>
              <form
                className="flex gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!stall?.trim()) return;
                  p.setStall(stall.trim());
                  toast("Stall saved");
                }}
              >
                <input
                  className={field}
                  placeholder="e.g. Stall 214"
                  aria-label="Stall number"
                  value={stall ?? p.stall ?? ""}
                  onChange={(e) => setStall(e.target.value)}
                />
                <Button type="submit">Save</Button>
              </form>
              <p className="mt-2 text-sm">Shown in the app and the USSD stall finder.</p>
            </Accordion>
            <Accordion title="Promote" meta="Invoice">
              <ul className="grid gap-3">
                {publisherPlans.map((x) => (
                  <li key={x.id} className="rounded-xl border border-line p-3">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-semibold text-ink">{x.name}</span>
                      <span className="text-sm">{x.price}</span>
                    </div>
                    <ul className="mt-1 list-disc pl-5 text-sm">
                      {x.perks.map((k) => (
                        <li key={k}>{k}</li>
                      ))}
                    </ul>
                    <Button variant="outline" className="mt-3 min-h-9 text-sm" onClick={() => setPlan(x.id)}>
                      Request
                    </Button>
                  </li>
                ))}
              </ul>
              {p.plans.length > 0 && (
                <ul className="mt-4 divide-y divide-line text-sm">
                  {p.plans.map((r) => (
                    <li key={r.at} className="flex justify-between py-2">
                      <span className="text-ink">
                        {publisherPlans.find((x) => x.id === r.plan)?.name}
                        {r.bookId && ` · ${books.find((b) => b.id === r.bookId)?.titleAlt}`}
                      </span>
                      <span>Invoice requested</span>
                    </li>
                  ))}
                </ul>
              )}
            </Accordion>
          </>
        ) : (
          <Accordion title="Tips" meta="CaaS">
            <p>Readers tip ৳2 / ৳5 / ৳10 from mobile balance. Boi-O keeps 15%.</p>
            <p className="mt-2 text-sm">Opens when Applink CaaS is live.</p>
          </Accordion>
        )}
      </div>

      <StudioDashboard />

      <Sheet open={plan !== null} onClose={() => setPlan(null)} title={chosen?.name ?? ""}>
        {chosen && (
          <>
            <p className="text-2xl font-semibold">{chosen.price}</p>
            {chosen.id === "boost" && (
              <label className="mt-4 grid gap-1 text-sm font-medium">
                Book
                <select className={field} value={bookId} onChange={(e) => setBookId(e.target.value)}>
                  {books.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.titleAlt}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <p className="mt-3 text-sm text-ink-soft">We email an invoice. Starts after payment.</p>
            <Button
              className="mt-5 w-full"
              onClick={() => {
                p.requestPlan(chosen.id, chosen.id === "boost" ? bookId : undefined);
                setPlan(null);
                toast("Invoice requested");
              }}
            >
              Request invoice
            </Button>
          </>
        )}
      </Sheet>
    </>
  );
}
