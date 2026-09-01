import { cn } from "@/lib/utils";

/**
 * The CareerBoost AI logo mark — rising bars with a leading node, matching
 * public/favicon.svg. Purely decorative; the accessible name comes from the
 * surrounding link.
 */
export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[image:var(--gradient-brand)] text-white shadow-sm",
        className,
      )}
      aria-hidden="true"
    >
      <svg viewBox="0 0 64 64" className="h-5 w-5" fill="none">
        <path
          d="M18 40.5v-7m9 7V26m9 14.5v-11m9 11V19"
          stroke="currentColor"
          strokeWidth="6"
          strokeLinecap="round"
        />
        <circle cx="45" cy="19" r="3.5" fill="currentColor" />
      </svg>
    </span>
  );
}

export function BrandWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-body-lg font-bold tracking-tight", className)}>
      CareerBoost <span className="text-primary">AI</span>
    </span>
  );
}
