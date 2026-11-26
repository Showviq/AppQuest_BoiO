"use client";

import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { roleLabel, usePartner } from "@/components/partner-store";
import { Sheet } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { Button, Card, PageTitle } from "@/components/ui";

// DEMO ONLY: no admin auth. The real admin panel needs an admin role + audit log.
export default function AdminVerify() {
  const p = usePartner();
  const toast = useToast();
  const [rejecting, setRejecting] = useState(false);
  const [reason, setReason] = useState("");

  if (!p.ready) return <div className="mt-24 h-24 skeleton rounded-2xl" aria-label="Loading" />;

  const pending = p.app?.status === "pending" ? p.app : null;

  return (
    <>
      <PageTitle>Verification</PageTitle>
      <p className="-mt-3 mb-5 inline-block rounded-full bg-surface-2 px-3 py-1 text-xs text-ink-soft">Demo admin</p>

      {!pending ? (
        <p className="py-10 text-center text-ink-soft">No pending applications.</p>
      ) : (
        <Card className="p-5">
          <p className="text-sm text-ink-soft">{roleLabel[pending.role]}</p>
          <p className="text-xl font-semibold">{pending.name}</p>
          <dl className="mt-3 grid gap-1 text-sm">
            <div className="flex gap-2">
              <dt className="text-ink-soft">Link</dt>
              <dd>
                <a href={pending.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-forest">
                  {pending.link} <ExternalLink size={12} />
                </a>
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-ink-soft">Proof</dt>
              <dd>{pending.proof}</dd>
            </div>
          </dl>
          <div className="mt-5 flex gap-3">
            <Button
              onClick={() => {
                p.decide("approved");
                toast("Approved");
              }}
            >
              Approve
            </Button>
            <Button variant="outline" onClick={() => setRejecting(true)}>
              Reject
            </Button>
          </div>
        </Card>
      )}

      <Sheet open={rejecting} onClose={() => setRejecting(false)} title="Reason">
        <textarea
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          rows={3}
          aria-label="Rejection reason"
          className="w-full rounded-xl border border-line bg-bg p-3 text-ink outline-none focus:border-forest"
        />
        <Button
          className="mt-3 w-full"
          disabled={reason.trim().length < 5}
          onClick={() => {
            p.decide("rejected", reason.trim());
            setRejecting(false);
            setReason("");
            toast("Rejected");
          }}
        >
          Reject
        </Button>
      </Sheet>
    </>
  );
}
