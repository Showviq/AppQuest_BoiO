"use client";

import { X } from "lucide-react";
import { useEffect, useId, useRef } from "react";

/** Bottom sheet on mobile, centred dialog on desktop. */
export function Sheet({
  open,
  onClose,
  title,
  children,
  dismissible = true,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  dismissible?: boolean;
}) {
  const titleId = useId();
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && dismissible) onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>(
      "input, button:not([data-close]), select, textarea, a[href]"
    );
    (first ?? panel.current)?.focus();
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      prev?.focus();
    };
  }, [open, onClose, dismissible]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center lg:items-center">
      <div
        className="backdrop-enter absolute inset-0 bg-black/45"
        onClick={dismissible ? onClose : undefined}
        aria-hidden
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="sheet-enter relative max-h-[88dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-surface px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl lg:rounded-3xl lg:pb-6"
      >
        <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-line lg:hidden" aria-hidden />
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          {dismissible && (
            <button
              data-close
              onClick={onClose}
              aria-label="Close"
              className="grid size-9 place-items-center rounded-full text-ink-soft hover:bg-surface-2"
            >
              <X size={18} />
            </button>
          )}
        </div>
        {children}
      </div>
    </div>
  );
}
