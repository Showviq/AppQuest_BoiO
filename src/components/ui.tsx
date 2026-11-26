"use client";

import { ArrowLeft, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

export function Accordion({
  title,
  children,
  defaultOpen = false,
  meta,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  meta?: React.ReactNode;
}) {
  return (
    <details open={defaultOpen} className="group border-b border-line last:border-b-0">
      <summary className="flex min-h-14 items-center justify-between gap-3 py-3">
        <span className="font-medium">{title}</span>
        <span className="flex items-center gap-2 text-sm text-ink-soft">
          {meta}
          <ChevronDown size={18} className="chev transition-transform" aria-hidden />
        </span>
      </summary>
      <div className="pb-4 text-[15px] leading-relaxed text-ink-soft">{children}</div>
    </details>
  );
}

export function Button({
  variant = "primary",
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "outline" }) {
  const styles = {
    primary: "bg-forest text-on-forest hover:opacity-90 disabled:opacity-50",
    outline: "border border-line bg-surface hover:bg-surface-2 disabled:opacity-50",
    ghost: "hover:bg-surface-2 disabled:opacity-50",
  }[variant];
  return (
    <button
      {...props}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold transition ${styles} ${className}`}
    />
  );
}

export function PageTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-5 flex items-center justify-between gap-3 pt-2">
      <h1 className="font-serif text-3xl">{children}</h1>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-line bg-surface ${className}`}>{children}</div>;
}

export function TextLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="text-sm font-medium text-forest underline-offset-4 hover:underline">
      {children}
    </Link>
  );
}

export function SectionHead({ title, href }: { title: string; href?: string }) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-lg font-semibold">{title}</h2>
      {href && <TextLink href={href}>See all</TextLink>}
    </div>
  );
}

/* ── Shared mockup primitives ─────────────────────────────────────────── */

export function BackButton({ href }: { href?: string }) {
  // Link when a target is known (works on first load); otherwise history back.
  if (href)
    return (
      <Link href={href} aria-label="Back" className="-ml-2 mb-1 grid size-11 place-items-center rounded-full hover:bg-surface-2">
        <ArrowLeft size={22} />
      </Link>
    );
  return (
    <button
      onClick={() => history.back()}
      aria-label="Back"
      className="-ml-2 mb-1 grid size-11 place-items-center rounded-full hover:bg-surface-2"
    >
      <ArrowLeft size={22} />
    </button>
  );
}

/** Underline tabs. Controlled. */
export function Tabs<T extends string>({
  tabs,
  value,
  onChange,
  label,
}: {
  tabs: readonly { id: T; label: React.ReactNode }[];
  value: T;
  onChange: (id: T) => void;
  label: string;
}) {
  const list = useRef<HTMLDivElement>(null);
  const [bar, setBar] = useState<{ x: number; w: number } | null>(null);

  // Sliding underline: measure the active tab, keep it in view.
  useLayoutEffect(() => {
    const el = list.current?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!el) return;
    const measure = () => setBar({ x: el.offsetLeft, w: el.offsetWidth });
    measure();
    el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: motionOK() ? "smooth" : "auto" });
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [value]);

  return (
    <div
      ref={list}
      role="tablist"
      aria-label={label}
      className="no-scrollbar relative -mx-4 mb-4 flex gap-1 overflow-x-auto border-b border-line px-4 lg:-mx-8 lg:px-8"
    >
      {tabs.map((t) => (
        <button
          key={t.id}
          role="tab"
          aria-selected={value === t.id}
          onClick={() => onChange(t.id)}
          className={`h-11 shrink-0 rounded-t-lg px-3 text-sm transition-colors hover:text-ink ${
            value === t.id ? "font-semibold text-forest" : "text-ink-soft"
          }`}
        >
          {t.label}
        </button>
      ))}
      {bar && (
        <span
          aria-hidden
          className="tab-bar pointer-events-none absolute bottom-0 left-0 h-0.5 rounded-full bg-forest"
          style={{ width: bar.w, transform: `translateX(${bar.x}px)` }}
        />
      )}
    </div>
  );
}

/** True unless the OS or the in-app setting asks for reduced motion. */
export function motionOK() {
  if (typeof window === "undefined") return false;
  if (document.documentElement.dataset.motion === "reduce") return false;
  return !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Horizontal scroller. Touch: native swipe. Mouse: drag, or the arrow buttons
 * that appear on hover. Edges fade only where there is more to see.
 */
export function Rail({
  children,
  className = "",
  as: Tag = "ul",
  label,
  role,
  bleed = true,
}: {
  children: React.ReactNode;
  className?: string;
  as?: "ul" | "div";
  label?: string;
  role?: string;
  bleed?: boolean;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [edge, setEdge] = useState({ l: false, r: false });
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () =>
      setEdge({ l: el.scrollLeft > 4, r: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    const mo = new MutationObserver(update);
    mo.observe(el, { childList: true });
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  const go = (dir: 1 | -1) => {
    const el = ref.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: motionOK() ? "smooth" : "auto" });
  };

  const fade = 28;
  const mask = `linear-gradient(to right, ${edge.l ? "transparent" : "#000"} 0, #000 ${fade}px, #000 calc(100% - ${fade}px), ${
    edge.r ? "transparent" : "#000"
  } 100%)`;
  const arrow =
    "absolute top-1/2 z-10 hidden size-9 -translate-y-1/2 place-items-center rounded-full border border-line bg-surface text-ink shadow-md opacity-0 transition-opacity group-hover/rail:opacity-100 focus-visible:opacity-100 [@media(hover:hover)]:grid";

  return (
    <div className={`group/rail relative ${bleed ? "-mx-4 lg:-mx-8" : ""}`}>
      <Tag
        ref={ref as React.Ref<never>}
        aria-label={label}
        role={role}
        className={`no-scrollbar flex snap-x snap-proximity overflow-x-auto overscroll-x-contain [&>*]:snap-start ${
          bleed ? "scroll-px-4 px-4 lg:scroll-px-8 lg:px-8" : ""
        } ${className}`}
        style={{ maskImage: mask, WebkitMaskImage: mask }}
        onPointerDown={(e: React.PointerEvent<HTMLElement>) => {
          if (e.pointerType !== "mouse" || e.button !== 0 || !ref.current) return;
          drag.current = { x: e.clientX, left: ref.current.scrollLeft, moved: false };
        }}
        onPointerMove={(e: React.PointerEvent<HTMLElement>) => {
          const d = drag.current;
          const el = ref.current;
          if (!d || !el) return;
          const dx = e.clientX - d.x;
          if (!d.moved && Math.abs(dx) > 5) {
            d.moved = true;
            el.style.scrollSnapType = "none";
            el.style.cursor = "grabbing";
          }
          if (d.moved) el.scrollLeft = d.left - dx;
        }}
        onPointerUp={() => {
          const el = ref.current;
          if (el) {
            el.style.scrollSnapType = "";
            el.style.cursor = "";
          }
          // keep `moved` until the click that follows, so the drag doesn't open a link
          setTimeout(() => (drag.current = null), 0);
        }}
        onPointerLeave={() => {
          if (drag.current && ref.current) {
            ref.current.style.scrollSnapType = "";
            ref.current.style.cursor = "";
          }
          drag.current = null;
        }}
        onClickCapture={(e: React.MouseEvent) => {
          if (drag.current?.moved) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        onDragStart={(e: React.DragEvent) => e.preventDefault()}
      >
        {children}
      </Tag>
      {edge.l && (
        <button type="button" tabIndex={-1} aria-label="Scroll left" onClick={() => go(-1)} className={`${arrow} left-2`}>
          <ChevronLeft size={18} />
        </button>
      )}
      {edge.r && (
        <button type="button" tabIndex={-1} aria-label="Scroll right" onClick={() => go(1)} className={`${arrow} right-2`}>
          <ChevronRight size={18} />
        </button>
      )}
    </div>
  );
}

/**
 * Cover banner + avatar/logo + actions. The avatar overlaps the banner;
 * actions sit below the banner so nothing collides.
 */
export function Hero({
  background,
  banner,
  avatar,
  actions,
}: {
  background: string;
  banner?: React.ReactNode;
  avatar: React.ReactNode;
  actions?: React.ReactNode;
}) {
  return (
    <div>
      <div className="relative -mx-4 h-32 overflow-hidden lg:mx-0 lg:rounded-2xl" style={{ background }} aria-hidden>
        <span className="hero-sheen absolute inset-0" />
        {banner}
      </div>
      <div className="flex items-start justify-between gap-3">
        <div className="relative z-10 -mt-10 shrink-0">{avatar}</div>
        {actions && <div className="mt-3 flex flex-wrap justify-end gap-2">{actions}</div>}
      </div>
    </div>
  );
}

/** Pill toggle (filters, tags). */
export function Chip({
  active = false,
  onClick,
  children,
}: {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`h-9 shrink-0 rounded-full border px-4 text-sm transition-colors ${
        active ? "border-forest bg-forest text-on-forest" : "border-line bg-surface hover:bg-surface-2"
      }`}
    >
      {children}
    </button>
  );
}

const avatarSizes = { sm: "size-9 text-sm", md: "size-12 text-lg", lg: "size-20 text-3xl" };
const avatarTints = ["#1f3d2b", "#8c2b25", "#2c5866", "#b08d3c", "#3b2a4a", "#56713f"];

/** Initial-letter avatar with a stable tint per name. */
export function Avatar({ name, size = "md" }: { name: string; size?: keyof typeof avatarSizes }) {
  const tint = avatarTints[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % avatarTints.length];
  return (
    <span
      aria-hidden
      className={`grid shrink-0 place-items-center rounded-full font-serif text-[#f3eedd] ${avatarSizes[size]}`}
      style={{ background: tint }}
    >
      {[...name][0]?.toUpperCase()}
    </span>
  );
}

/** On/off switch with its label. */
export function Switch({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: React.ReactNode;
}) {
  return (
    <label className="flex min-h-12 cursor-pointer items-center justify-between gap-4">
      <span>{label}</span>
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-forest" : "bg-line"}`}
      >
        <span
          className={`absolute top-1 size-5 rounded-full bg-surface shadow transition-all ${checked ? "left-6" : "left-1"}`}
        />
      </button>
    </label>
  );
}

export function Progress({ value, className = "" }: { value: number; className?: string }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={`h-1.5 overflow-hidden rounded-full bg-surface-2 ${className}`}
    >
      <div className="grow-x h-full rounded-full bg-forest transition-[width] duration-500" style={{ width: `${pct}%` }} />
    </div>
  );
}

/** Counts up from 0 once when it first scrolls into view. Static if motion is reduced. */
export function CountUp({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current || !motionOK() || value < 2) {
      setShown(value);
      return;
    }
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      done.current = true;
      const t0 = performance.now();
      const dur = Math.min(900, 300 + value * 8);
      const tick = (t: number) => {
        const k = Math.min(1, (t - t0) / dur);
        setShown(Math.round(value * (1 - Math.pow(1 - k, 3))));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      setShown(0);
      raf = requestAnimationFrame(tick);
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value]);

  return (
    <span ref={ref} className="tabular-nums">
      {shown.toLocaleString("en-US")}
    </span>
  );
}

/** Big number + small label, used in stat rows. */
export function Stat({ value, label }: { value: React.ReactNode; label: string }) {
  return (
    <div className="text-center">
      <p className="text-2xl font-semibold">{typeof value === "number" ? <CountUp value={value} /> : value}</p>
      <p className="text-xs text-ink-soft">{label}</p>
    </div>
  );
}

/** Shared text-input style. */
export const field =
  "h-12 w-full rounded-xl border border-line bg-bg px-4 text-ink outline-none focus:border-forest";
