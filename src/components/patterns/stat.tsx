import { type ComponentType, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { slideUp } from "@/lib/motion";

/**
 * A single headline figure with a caption, used for credibility rows.
 *
 * Presentational only. Callers pass values they have already computed; this
 * component never derives, fetches or invents a figure.
 */
export function Stat({
  value,
  label,
  detail,
  icon: Icon,
  className,
}: {
  value: ReactNode;
  label: ReactNode;
  detail?: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <motion.div variants={slideUp} className={cn("min-w-0", className)}>
      {Icon ? (
        <span
          className="mb-3 grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <Icon className="h-4.5 w-4.5" />
        </span>
      ) : null}
      <p className="font-display text-h2 tabular-nums text-foreground">{value}</p>
      <p className="mt-1 text-small font-medium text-foreground">{label}</p>
      {detail ? <p className="mt-1 text-small text-muted-foreground">{detail}</p> : null}
    </motion.div>
  );
}

/**
 * Row wrapper that staggers its Stat children into view.
 */
export function StatGroup({
  children,
  columns = 4,
  className,
}: {
  children: ReactNode;
  columns?: 2 | 3 | 4;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-8",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3",
        columns === 4 && "grid-cols-2 lg:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}

/**
 * Small label chip used above headings and inside hero sections.
 */
export function Eyebrow({
  icon: Icon,
  children,
  className,
}: {
  icon?: ComponentType<{ className?: string }>;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-caption normal-case tracking-normal text-foreground shadow-sm",
        className,
      )}
    >
      {Icon ? <Icon className="h-3.5 w-3.5 text-primary" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}
