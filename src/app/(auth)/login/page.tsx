"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useToast } from "@/components/toast";
import { Button } from "@/components/ui";

export default function Login() {
  const router = useRouter();
  const toast = useToast();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
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
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 h-12 w-full rounded-xl border border-line bg-surface px-4 outline-none focus:border-forest"
          />
        </div>
        {error && (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        )}
        <Button type="submit" className="mt-auto w-full" disabled={!phone || !password || busy}>
          Sign in
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
