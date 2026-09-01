import { type ComponentType, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";

export type MetricTone = "default" | "primary" | "accent" | "success" | "warning" | "destructive";

const toneText: Record<MetricTone, string> = {
  default: "text-foreground",
  primary: "text-primary",
  accent: "text-brand-accent-strong",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

const toneIcon: Record<MetricTone, string> = {
  default: "bg-secondary text-secondary-foreground",
  primary: "bg-primary/10 text-primary",
  accent: "bg-brand-accent-soft text-brand-accent-strong",
  success: "bg-success/10 text-success",
  warning: "bg-warning/10 text-warning",
  destructive: "bg-destructive/10 text-destructive",
};

/**
 * A single headline number with an optional icon, progress bar and footnote.
 *
 * Presentational only — the caller supplies an already-computed value. This
 * component performs no fetching, derivation or formatting of source data.
 */
export function MetricCard({
  label,
  value,
  suffix,
  icon: Icon,
  tone = "default",
  progress,
  detail,
  compact = false,
  className,
}: {
  label: string;
  value: ReactNode;
  suffix?: string;
  icon?: ComponentType<{ className?: string }>;
  tone?: MetricTone;
  /** 0–100. Omit to hide the bar. */
  progress?: number;
  detail?: ReactNode;
  /** Renders the value smaller — for dates and other non-numeric values. */
  compact?: boolean;
  className?: string;
}) {
  return (
    <div className={cn("surface-card lift p-5", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-caption uppercase text-muted-foreground">{label}</p>
        {Icon ? (
          <span
            className={cn("grid h-8 w-8 shrink-0 place-items-center rounded-lg", toneIcon[tone])}
            aria-hidden="true"
          >
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
      </div>

      <p
        className={cn(
          "mt-3 font-display tabular-nums",
          compact ? "text-h3" : "text-h2",
          toneText[tone],
        )}
      >
        {value}
        {suffix ? (
          <span className="ml-0.5 text-small font-medium text-muted-foreground">{suffix}</span>
        ) : null}
      </p>

      {typeof progress === "number" ? (
        <Progress
          value={progress}
          className="mt-4 h-1.5"
          aria-label={`${label}: ${progress} percent`}
        />
      ) : null}

      {detail ? <p className="mt-3 text-small text-muted-foreground">{detail}</p> : null}
    </div>
  );
}

/** Responsive wrapper for a row of MetricCards. */
export function MetricGrid({
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
        "grid gap-4",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 xl:grid-cols-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
