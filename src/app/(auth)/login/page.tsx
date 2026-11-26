"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OtpBoxes } from "@/components/auth/otp-boxes";
import { useToast } from "@/components/toast";
import { Button } from "@/components/ui";

type Method = "phone" | "email";
const input = "mt-1 h-12 w-full rounded-xl border border-line bg-surface px-4 outline-none focus:border-forest";

export default function Login() {
  const router = useRouter();
  const toast = useToast();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [method, setMethod] = useState<Method>("phone");
  const [email, setEmail] = useState("");
  const [useCode, setUseCode] = useState(false);
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");

  const id = method === "phone" ? phone : email;
  const canSubmit = useCode ? Boolean(id) && (!codeSent || code.length === 6) : Boolean(id && password);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // Email and code sign-in are UI mockups only; the phone + password path is real.
    if (method === "email") return toast("Email sign-in is coming soon");
    if (useCode) {
      if (!codeSent) {
        setCodeSent(true);
        return toast("Code sent (demo)");
      }
      return toast("Code sign-in is coming soon");
    }
    setBusy(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, password }),
    });
    const d = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) return setError(d.error ?? "Something went wrong.");
    toast("Welcome back");
    router.push("/");
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-sm flex-col px-5 pb-10 pt-4">
      <button onClick={() => router.back()} aria-label="Back" className="-ml-2 grid size-11 place-items-center rounded-full hover:bg-surface-2">
        <ArrowLeft size={22} />
      </button>
      <p className="mt-6 font-serif text-4xl text-forest">Boi-O</p>
      <form onSubmit={submit} className="mt-8 flex flex-1 flex-col gap-4">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <div role="tablist" aria-label="Sign in with" className="grid grid-cols-2 rounded-full bg-surface-2 p-1">
          {(["phone", "email"] as Method[]).map((m) => (
            <button
              key={m}
              type="button"
              role="tab"
              aria-selected={method === m}
              onClick={() => {
                setMethod(m);
                setError("");
              }}
              className={`h-10 rounded-full text-sm capitalize ${method === m ? "bg-surface font-semibold shadow-sm" : "text-ink-soft"}`}
            >
              {m}
            </button>
          ))}
        </div>
        {method === "phone" ? (
          <div>
            <label htmlFor="phone" className="text-sm text-ink-soft">
              Mobile number
            </label>
            <input
              id="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="019XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={input}
              autoFocus
            />
          </div>
        ) : (
          <div>
            <label htmlFor="email" className="text-sm text-ink-soft">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={input}
              autoFocus
            />
          </div>
        )}
        {useCode ? (
          codeSent && (
            <div>
              <p className="mb-2 text-sm text-ink-soft">Code</p>
              <OtpBoxes value={code} onChange={setCode} />
            </div>
          )
        ) : (
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="password" className="text-sm text-ink-soft">
                Password
              </label>
              <Link href="/forgot-password" className="text-sm font-medium text-forest">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={input}
            />
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            setUseCode(!useCode);
            setCodeSent(false);
            setCode("");
          }}
          className="self-start text-sm font-medium text-forest"
        >
          {useCode ? "Use password instead" : "Sign in with a code"}
        </button>
        {error && (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" className="mt-auto w-full" disabled={!canSubmit || busy}>
          {useCode && !codeSent ? "Send code" : "Sign in"}
        </Button>
        <p className="text-center text-sm text-ink-soft">
          New here?{" "}
          <Link href="/join" className="font-medium text-forest">
            Join
          </Link>
        </p>
      </form>
    </main>
  );
}
