import { cn } from "@/lib/utils";

export function BrandLogo({
  light = false,
  compact = false,
  className,
}: {
  light?: boolean;
  compact?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-3", className)}>
      <span
        className={cn(
          "grid h-12 w-12 shrink-0 place-items-center rounded-t-[1.35rem] rounded-b-lg border",
          light ? "border-paper/30 bg-paper text-night" : "border-night/15 bg-night text-paper",
        )}
      >
        <svg viewBox="0 0 48 48" className="h-9 w-9" aria-hidden="true">
          <path d="M24 39V15" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M24 18C19 11 12 11 8 14c3 6 9 9 16 4Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M24 18c5-7 12-7 16-4-3 6-9 9-16 4Z" fill="none" stroke="currentColor" strokeWidth="1.6" />
          <path d="M24 14c-1-6 2-10 5-12 3 5 2 10-5 12Z" fill="currentColor" opacity=".72" />
          <ellipse cx="17" cy="31" rx="4.2" ry="6.3" fill="currentColor" opacity=".88" />
          <ellipse cx="25" cy="34" rx="4.2" ry="6.3" fill="currentColor" opacity=".72" />
          <ellipse cx="33" cy="30" rx="4.2" ry="6.3" fill="currentColor" opacity=".9" />
        </svg>
      </span>
      {!compact && (
        <span className="leading-none">
          <span className={cn("block font-display text-[1.15rem] font-semibold tracking-tight", light && "text-paper")}>
            Khairpur
          </span>
          <span className={cn("mt-1.5 block font-mono text-[8px] uppercase tracking-[0.27em]", light ? "text-paper/65" : "text-night/60")}>
            Dates House
          </span>
        </span>
      )}
    </span>
  );
}
