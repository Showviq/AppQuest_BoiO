import { ChevronDown } from "lucide-react";
import Link from "next/link";

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
