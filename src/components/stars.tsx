"use client";

import { Star, StarHalf } from "lucide-react";

export function Stars({ value, size = 14 }: { value: number; size?: number }) {
  return (
    <span className="inline-flex text-gold" aria-label={`${value} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) =>
        value >= i ? (
          <Star key={i} size={size} fill="currentColor" strokeWidth={0} />
        ) : value >= i - 0.5 ? (
          <StarHalf key={i} size={size} fill="currentColor" strokeWidth={0} />
        ) : (
          <Star key={i} size={size} strokeWidth={1.5} className="opacity-40" />
        )
      )}
    </span>
  );
}

/** Half-star input: left half of a star = .5, right half = full. */
export function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="flex items-center justify-center gap-1 text-gold" role="radiogroup" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className="relative">
          {value >= i ? (
            <Star size={40} fill="currentColor" strokeWidth={0} />
          ) : value >= i - 0.5 ? (
            <StarHalf size={40} fill="currentColor" strokeWidth={0} />
          ) : (
            <Star size={40} strokeWidth={1.25} className="opacity-50" />
          )}
          <button
            role="radio"
            aria-checked={value === i - 0.5}
            aria-label={`${i - 0.5} stars`}
            onClick={() => onChange(i - 0.5)}
            className="absolute inset-y-0 left-0 w-1/2"
          />
          <button
            role="radio"
            aria-checked={value === i}
            aria-label={`${i} stars`}
            onClick={() => onChange(i)}
            className="absolute inset-y-0 right-0 w-1/2"
          />
        </span>
      ))}
    </div>
  );
}
