"use client";

import { useRef } from "react";

/** 6 single-digit boxes; supports typing, backspace and paste. */
export function OtpBoxes({ value, onChange, length = 6 }: { value: string; onChange: (v: string) => void; length?: number }) {
  const refs = useRef<(HTMLInputElement | null)[]>([]);
  const digits = value.padEnd(length, " ").slice(0, length).split("");

  const setAt = (i: number, d: string) => {
    const next = digits.map((c, j) => (j === i ? d || " " : c)).join("").trimEnd();
    onChange(next.replace(/ /g, ""));
  };

  return (
    <div className="flex justify-between gap-2" role="group" aria-label="Verification code">
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          autoComplete={i === 0 ? "one-time-code" : "off"}
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          value={d.trim()}
          autoFocus={i === 0}
          onChange={(e) => {
            const v = e.target.value.replace(/\D/g, "").slice(-1);
            setAt(i, v);
            if (v) refs.current[i + 1]?.focus();
          }}
          onKeyDown={(e) => {
            if (e.key === "Backspace" && !d.trim()) refs.current[i - 1]?.focus();
          }}
          onPaste={(e) => {
            const p = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
            if (!p) return;
            e.preventDefault();
            onChange(p);
            refs.current[Math.min(p.length, length - 1)]?.focus();
          }}
          className="h-14 w-full min-w-0 rounded-xl border border-line bg-surface text-center text-2xl font-semibold outline-none focus:border-forest"
        />
      ))}
    </div>
  );
}
