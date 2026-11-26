import type { Book } from "@/lib/mock-data";

const sizes = {
  sm: "w-14 text-[10px] rounded-[3px_8px_8px_3px]",
  md: "w-28 text-sm rounded-[4px_10px_10px_4px]",
  lg: "w-40 text-lg rounded-[5px_12px_12px_5px]",
};

/** Generated cloth-bound cover: spine edge, title in the book serif, author below. */
export function BookCover({ book, size = "md" }: { book: Book; size?: keyof typeof sizes }) {
  return (
    <div
      role="img"
      aria-label={`${book.title} — ${book.author}`}
      className={`relative aspect-[2/3] shrink-0 overflow-hidden shadow-[0_6px_14px_-6px_rgba(0,0,0,.45)] ${sizes[size]}`}
      style={{ background: book.cover.bg, color: book.cover.fg }}
    >
      {/* spine hinge */}
      <span className="absolute inset-y-0 left-[7%] w-px bg-black/25" aria-hidden />
      <span className="absolute inset-y-0 left-[8%] w-px bg-white/15" aria-hidden />
      {/* cloth texture */}
      <span
        className="absolute inset-0 opacity-[.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg,#fff 0 1px,transparent 1px 3px),repeating-linear-gradient(-45deg,#000 0 1px,transparent 1px 3px)",
        }}
        aria-hidden
      />
      {size !== "sm" && (
        <div className="relative flex h-full flex-col justify-between py-[14%] pl-[18%] pr-[10%]">
          <span className="font-serif leading-tight">{book.title}</span>
          <span className="text-[0.65em] opacity-80">{book.author}</span>
        </div>
      )}
      {size === "sm" && (
        <span className="relative block px-[18%] pt-[20%] font-serif leading-tight">{book.title}</span>
      )}
    </div>
  );
}
