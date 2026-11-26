"use client";

import { ArrowLeft, Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Sheet } from "@/components/sheet";
import { useToast } from "@/components/toast";
import { Button } from "@/components/ui";

type Plan = { amount: string; frequency: string; free: boolean };
type Step = "phone" | "otp" | "profile";

async function post(url: string, body: unknown) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
  return data;
}

const RESEND_AFTER = 30;

export function JoinFlow({ plan, mock }: { plan: Plan; mock: boolean }) {
  const router = useRouter();
  const toast = useToast();
  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [last3, setLast3] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [consentOpen, setConsentOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);
  const otpRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const phoneValid = /^(?:\+?88)?01[49]\d{8}$/.test(phone.replace(/[\s-]/g, ""));
  const price = plan.free ? "Free" : `৳${plan.amount} / ${plan.frequency}`;

  async function sendCode() {
    setBusy(true);
    setError("");
    try {
      const d = await post("/api/auth/otp/request", { phone, consent: true });
      setLast3(d.last3);
      setConsentOpen(false);
      setStep("otp");
      setOtp("");
      setCooldown(RESEND_AFTER);
      setTimeout(() => otpRef.current?.focus(), 50);
    } catch (e) {
      setConsentOpen(false);
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const d = await post("/api/auth/otp/verify", { otp });
      if (d.user.profileComplete) {
        toast("Welcome back");
        router.push("/");
      } else {
        setStep("profile");
      }
    } catch (err) {
      setError((err as Error).message);
      setOtp("");
    } finally {
      setBusy(false);
    }
  }

  async function saveProfile(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      await post("/api/auth/profile", { name, password });
      toast("Welcome to Boi-O");
      router.push("/");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  }

  const back = () => {
    setError("");
    if (step === "otp") setStep("phone");
    else router.push("/");
  };

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col px-5 pb-10 pt-4">
      {step !== "profile" && (
        <button onClick={back} aria-label="Back" className="-ml-2 grid size-11 place-items-center rounded-full hover:bg-surface-2">
          <ArrowLeft size={22} />
        </button>
      )}

      <p className="mt-6 font-serif text-4xl text-forest">Boi-O</p>

      <Steps step={step} />

      {step === "phone" && (
        <form
          className="mt-8 flex flex-1 flex-col"
          onSubmit={(e) => {
            e.preventDefault();
            if (phoneValid) setConsentOpen(true);
          }}
        >
          <h1 className="text-2xl font-semibold">Your mobile number</h1>
          <label htmlFor="phone" className="sr-only">
            Mobile number
          </label>
          <div className="mt-5 flex h-14 items-center rounded-2xl border border-line bg-surface focus-within:border-forest">
            <span className="pl-4 pr-2 text-ink-soft">+88</span>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="019XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-full flex-1 bg-transparent pr-4 text-lg tracking-wide outline-none"
              aria-invalid={Boolean(error)}
              aria-describedby="phone-hint"
              autoFocus
            />
          </div>
          <p id="phone-hint" className={`mt-2 text-sm ${error ? "text-danger" : "text-ink-soft"}`} role={error ? "alert" : undefined}>
            {error || "Banglalink (014 / 019)"}
          </p>
          <Button type="submit" className="mt-auto w-full" disabled={!phoneValid}>
            Continue
          </Button>
          <p className="mt-4 text-center text-sm text-ink-soft">
            Have an account?{" "}
            <Link href="/login" className="font-medium text-forest">
              Sign in
            </Link>
          </p>
        </form>
      )}

      {step === "otp" && (
        <form className="mt-8 flex flex-1 flex-col" onSubmit={verify}>
          <h1 className="text-2xl font-semibold">Enter the code</h1>
          <p className="mt-1 text-ink-soft">Sent to •••••••••{last3}</p>
          <label htmlFor="otp" className="sr-only">
            Verification code
          </label>
          <input
            ref={otpRef}
            id="otp"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            className="mt-5 h-16 w-full rounded-2xl border border-line bg-surface text-center text-3xl tracking-[0.5em] outline-none focus:border-forest"
            aria-invalid={Boolean(error)}
          />
          {error && (
            <p className="mt-2 text-sm text-danger" role="alert">
              {error}
            </p>
          )}
          {mock && <p className="mt-2 text-xs text-ink-soft">Test mode · code 123456</p>}
          <button
            type="button"
            disabled={cooldown > 0 || busy}
            onClick={sendCode}
            className="mt-4 self-start text-sm font-medium text-forest disabled:text-ink-soft"
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend code"}
          </button>
          <Button type="submit" className="mt-auto w-full" disabled={otp.length < 4 || busy}>
            {busy ? "Verifying…" : "Verify"}
          </Button>
        </form>
      )}

      {step === "profile" && (
        <form className="mt-8 flex flex-1 flex-col gap-4" onSubmit={saveProfile}>
          <h1 className="text-2xl font-semibold">Set up your profile</h1>
          <div>
            <label htmlFor="name" className="text-sm text-ink-soft">
              Name
            </label>
            <input
              id="name"
              autoComplete="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 h-12 w-full rounded-xl border border-line bg-surface px-4 outline-none focus:border-forest"
              autoFocus
            />
          </div>
          <div>
            <label htmlFor="password" className="text-sm text-ink-soft">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 h-12 w-full rounded-xl border border-line bg-surface px-4 outline-none focus:border-forest"
              aria-describedby="pw-hint"
            />
            <p id="pw-hint" className="mt-1 text-xs text-ink-soft">
              8+ characters
            </p>
          </div>
          {error && (
            <p className="text-sm text-danger" role="alert">
              {error}
            </p>
          )}
          <Button type="submit" className="mt-auto w-full" disabled={name.trim().length < 2 || password.length < 8 || busy}>
            Start reading
          </Button>
        </form>
      )}

      <Sheet open={consentOpen} onClose={() => setConsentOpen(false)} title="Join Boi-O">
        <ul className="flex flex-col gap-3 text-[15px]">
          <li className="flex justify-between gap-4 border-b border-line pb-3">
            <span className="text-ink-soft">Number</span>
            <span className="font-medium">{phone}</span>
          </li>
          <li className="flex justify-between gap-4 border-b border-line pb-3">
            <span className="text-ink-soft">Charge</span>
            <span className="font-medium">{price}</span>
          </li>
          <li className="flex items-center gap-2 text-ink-soft">
            <Check size={16} className="text-forest" /> Cancel anytime
          </li>
        </ul>
        <Button className="mt-6 w-full" onClick={sendCode} disabled={busy}>
          {busy ? "Sending…" : "Agree & send code"}
        </Button>
      </Sheet>
    </main>
  );
}

function Steps({ step }: { step: Step }) {
  const i = { phone: 0, otp: 1, profile: 2 }[step];
  return (
    <ol className="mt-6 flex gap-2" aria-label={`Step ${i + 1} of 3`}>
      {[0, 1, 2].map((n) => (
        <li key={n} className={`h-1 flex-1 rounded-full ${n <= i ? "bg-forest" : "bg-line"}`} />
      ))}
    </ol>
  );
}
