"use client";

import { BadgeCheck, Clock, Feather, Landmark, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePartner, roleLabel, type PartnerRole } from "@/components/partner-store";
import { Sheet } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { Accordion, Button, Card, PageTitle } from "@/components/ui";

const roles: { role: PartnerRole; icon: typeof Feather; blurb: string; nameLabel: string; proofLabel: string }[] = [
  { role: "author", icon: Feather, blurb: "Profile, posts, tips", nameLabel: "Pen name", proofLabel: "ISBN of a published book" },
  {
    role: "publisher",
    icon: Landmark,
    blurb: "Catalog, stall, promotions",
    nameLabel: "Publishing house",
    proofLabel: "Trade licence no.",
  },
];

const field = "h-12 w-full rounded-xl border border-line bg-bg px-4 text-ink outline-none focus:border-forest";

export default function Partner() {
  const p = usePartner();
  const toast = useToast();
  const [signedIn, setSignedIn] = useState<boolean | undefined>(undefined);
  const [form, setForm] = useState<PartnerRole | null>(null);
  const [name, setName] = useState("");
  const [link, setLink] = useState("");
  const [proof, setProof] = useState("");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setSignedIn(Boolean(d.user)))
      .catch(() => setSignedIn(false));
  }, []);

  if (signedIn === undefined || !p.ready) {
    return <div className="mt-24 h-24 skeleton rounded-2xl" aria-label="Loading" />;
  }

  const meta = form ? roles.find((r) => r.role === form)! : null;
  const valid = name.trim().length >= 2 && /^https?:\/\/\S+\.\S+/.test(link.trim()) && proof.trim().length >= 4;

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form || !valid) return;
    p.apply({ role: form, name: name.trim(), link: link.trim(), proof: proof.trim() });
    setForm(null);
    toast("Application sent");
  };

  return (
    <>
      <PageTitle>Authors & Publishers</PageTitle>

      {!signedIn ? (
        <Card className="p-5">
          <p className="font-medium">Sign in with your phone first</p>
          <p className="mt-1 text-sm text-ink-soft">One Boi-O account for reading and publishing.</p>
          <div className="mt-4 flex gap-3">
            <Link href="/join" className="inline-flex h-11 items-center rounded-full bg-forest px-5 font-semibold text-on-forest">
              Join
            </Link>
            <Link href="/login" className="inline-flex h-11 items-center rounded-full border border-line px-5 font-semibold">
              Sign in
            </Link>
          </div>
        </Card>
      ) : !p.app ? (
        <ul className="grid gap-3 sm:grid-cols-2">
          {roles.map(({ role, icon: Icon, blurb }) => (
            <li key={role}>
              <button
                onClick={() => {
                  setForm(role);
                  setName("");
                  setLink("");
                  setProof("");
                }}
                className="flex w-full items-center gap-4 rounded-2xl border border-line bg-surface p-4 text-left hover:bg-surface-2"
              >
                <span className="grid size-12 place-items-center rounded-full bg-forest-soft text-forest">
                  <Icon size={22} />
                </span>
                <span>
                  <span className="block font-semibold">I&apos;m {role === "author" ? "an" : "a"} {roleLabel[role]}</span>
                  <span className="text-sm text-ink-soft">{blurb}</span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <StatusCard />
      )}

      <div className="mt-6 rounded-2xl border border-line bg-surface px-4">
        <Accordion title="How verification works">
          <ol className="list-decimal pl-5">
            <li>Apply with proof</li>
            <li>Our team checks it (1–3 days)</li>
            <li>Approved: badge + Studio</li>
          </ol>
          <p className="mt-2">Paid plans never buy a badge.</p>
        </Accordion>
      </div>

      <Sheet open={form !== null} onClose={() => setForm(null)} title={meta ? `Apply as ${roleLabel[meta.role]}` : ""}>
        {meta && (
          <form onSubmit={submit} className="grid gap-3">
            <label className="grid gap-1 text-sm font-medium">
              {meta.nameLabel}
              <input className={field} value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              Official link
              <input
                className={field}
                type="url"
                placeholder="https://"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                required
              />
            </label>
            <label className="grid gap-1 text-sm font-medium">
              {meta.proofLabel}
              <input className={field} value={proof} onChange={(e) => setProof(e.target.value)} required />
            </label>
            <Button type="submit" className="mt-2" disabled={!valid}>
              Send for review
            </Button>
          </form>
        )}
      </Sheet>
    </>
  );

  function StatusCard() {
    const a = p.app!;
    const view = {
      pending: { icon: Clock, title: "Under review", tone: "text-gold" },
      approved: { icon: BadgeCheck, title: "Verified", tone: "text-forest" },
      rejected: { icon: XCircle, title: "Not approved", tone: "text-danger" },
    }[a.status];
    const Icon = view.icon;
    return (
      <Card className="p-5">
        <div className="flex items-center gap-3">
          <Icon size={28} className={view.tone} />
          <div>
            <p className="font-semibold">{view.title}</p>
            <p className="text-sm text-ink-soft">
              {roleLabel[a.role]} · {a.name}
            </p>
          </div>
        </div>
        {a.status === "rejected" && a.reason && <p className="mt-3 text-sm text-ink-soft">{a.reason}</p>}
        <div className="mt-4 flex flex-wrap gap-3">
          {a.status === "approved" && (
            <Link href="/studio" className="inline-flex h-11 items-center rounded-full bg-forest px-5 font-semibold text-on-forest">
              Open Studio
            </Link>
          )}
          {a.status === "pending" && (
            <Link href="/admin/verify" className="inline-flex h-11 items-center rounded-full border border-line px-5 text-sm font-semibold">
              Review as admin (demo)
            </Link>
          )}
          {a.status !== "approved" && (
            <Button variant="ghost" onClick={p.withdraw}>
              {a.status === "rejected" ? "Apply again" : "Withdraw"}
            </Button>
          )}
        </div>
      </Card>
    );
  }
}
