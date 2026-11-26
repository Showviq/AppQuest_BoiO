"use client";

import { ArrowLeft, CircleCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OtpBoxes } from "@/components/auth/otp-boxes";
import { useToast } from "@/components/toast";
import { Button, field } from "@/components/ui";

// UI mockup: no API calls yet. Steps: account → code → new password → done.
type Step = "account" | "code" | "password" | "done";
const order: Step[] = ["account", "code", "password", "done"];

export default function ForgotPassword() {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState<Step>("account");
  const [id, setId] = useState("");
  const [code, setCode] = useState("");
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");

  const isPhone = /^\+?\d[\d\s-]{6,}$/.test(id.trim());
  const idValid = isPhone || /^\S+@\S+\.\S+$/.test(id.trim());
  const masked = isPhone ? `•••• ${id.trim().slice(-3)}` : id.replace(/^(.).*(@.*)$/, "$1•••$2");
  const back = () => (step === "account" || step === "done" ? router.back() : setStep(order[order.indexOf(step) - 1]));

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col px-5 pb-10 pt-4">
      <button onClick={back} aria-label="Back" className="-ml-2 grid size-11 place-items-center rounded-full hover:bg-surface-2">
        <ArrowLeft size={22} />
      </button>

      {step !== "done" && (
        <div className="mt-4 flex gap-1.5" aria-label={`Step ${order.indexOf(step) + 1} of 3`}>
          {order.slice(0, 3).map((s, i) => (
            <span key={s} className={`h-1 flex-1 rounded-full ${i <= order.indexOf(step) ? "bg-forest" : "bg-line"}`} />
          ))}
        </div>
      )}

      <form
        className="mt-8 flex flex-1 flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (step === "account") {
            setStep("code");
            toast("Code sent");
          } else if (step === "code") setStep("password");
          else if (step === "password") setStep("done");
        }}
      >
        {step === "account" && (
          <>
            <h1 className="text-2xl font-semibold">Reset password</h1>
            <label htmlFor="id" className="text-sm text-ink-soft">
              Mobile number or email
            </label>
            <input id="id" value={id} onChange={(e) => setId(e.target.value)} placeholder="019XXXXXXXX" className={field} autoFocus />
            <Button type="submit" className="mt-auto w-full" disabled={!idValid}>
              Send code
            </Button>
          </>
        )}

        {step === "code" && (
          <>
            <h1 className="text-2xl font-semibold">Enter code</h1>
            <p className="text-sm text-ink-soft">Sent to {masked}</p>
            <OtpBoxes value={code} onChange={setCode} />
            <button type="button" onClick={() => toast("Code resent")} className="self-start text-sm font-medium text-forest">
              Resend code
            </button>
            <Button type="submit" className="mt-auto w-full" disabled={code.length !== 6}>
              Verify
            </Button>
          </>
        )}

        {step === "password" && (
          <>
            <h1 className="text-2xl font-semibold">New password</h1>
            <input
              type="password"
              autoComplete="new-password"
              placeholder="New password"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              className={field}
              autoFocus
            />
            <input
              type="password"
              autoComplete="new-password"
              placeholder="Confirm password"
              value={pw2}
              onChange={(e) => setPw2(e.target.value)}
              className={field}
            />
            <p className={`text-sm ${pw && pw.length < 8 ? "text-danger" : "text-ink-soft"}`}>At least 8 characters</p>
            {pw2 && pw !== pw2 && (
              <p className="text-sm text-danger" role="alert">
                Passwords don’t match
              </p>
            )}
            <Button type="submit" className="mt-auto w-full" disabled={pw.length < 8 || pw !== pw2}>
              Save password
            </Button>
          </>
        )}

        {step === "done" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <CircleCheck size={56} className="text-forest" />
            <h1 className="text-2xl font-semibold">Password updated</h1>
            <Link href="/login" className="inline-flex h-11 items-center rounded-full bg-forest px-6 font-semibold text-on-forest">
              Sign in
            </Link>
          </div>
        )}
      </form>
    </main>
  );
}
