import { type ReactNode } from "react";
import { CircleSlash, Info, ShieldCheck, TriangleAlert, WifiOff } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Presentation for the AI provider states the application already reports.
 *
 * This component performs NO detection. The caller passes a status it has
 * already derived from existing values — for example the `provider` field the
 * mentor server function returns today, or the "AI service is not configured"
 * error the analysis and cover-letter server functions already throw.
 *
 * Nothing here changes how the AI service works.
 */
export type AiStatus = "connected" | "offline" | "unconfigured" | "error";

const presets: Record<
  AiStatus,
  {
    icon: typeof Info;
    label: string;
    className: string;
    iconClassName: string;
  }
> = {
  connected: {
    icon: ShieldCheck,
    label: "AI provider connected",
    className: "border-success/30 bg-success/5",
    iconClassName: "text-success",
  },
  offline: {
    icon: WifiOff,
    label: "Offline coaching engine",
    className: "border-warning/30 bg-warning/5",
    iconClassName: "text-warning",
  },
  unconfigured: {
    icon: CircleSlash,
    label: "AI service is not configured",
    className: "border-border bg-muted/40",
    iconClassName: "text-muted-foreground",
  },
  error: {
    icon: TriangleAlert,
    label: "AI request failed",
    className: "border-destructive/35 bg-destructive/10",
    iconClassName: "text-destructive",
  },
};

/**
 * Full-width banner describing the current AI provider state.
 */
export function AiStatusNotice({
  status,
  title,
  children,
  action,
  className,
}: {
  status: AiStatus;
  /** Overrides the default headline for this status. */
  title?: ReactNode;
  /** Supporting copy — typically what still works without a provider. */
  children?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  const preset = presets[status];
  const Icon = preset.icon;

  return (
    <div
      role={status === "error" ? "alert" : "status"}
      className={cn("flex gap-3 rounded-xl border p-4", preset.className, className)}
    >
      <Icon
        className={cn("mt-0.5 h-4.5 w-4.5 shrink-0", preset.iconClassName)}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="text-small font-semibold text-foreground">{title ?? preset.label}</p>
        {children ? (
          <div className="mt-1 text-small leading-6 text-muted-foreground">{children}</div>
        ) : null}
        {action ? <div className="mt-3 flex flex-wrap gap-2">{action}</div> : null}
      </div>
    </div>
  );
}

/**
 * Compact inline form of the same information, for headers and toolbars.
 */
export function AiStatusPill({
  status,
  label,
  className,
}: {
  status: AiStatus;
  /** Overrides the default text. */
  label?: ReactNode;
  className?: string;
}) {
  const preset = presets[status];
  const Icon = preset.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-caption normal-case tracking-normal",
        preset.className,
        className,
      )}
    >
      <Icon className={cn("h-3.5 w-3.5", preset.iconClassName)} aria-hidden="true" />
      <span className="text-muted-foreground">{label ?? preset.label}</span>
    </span>
  );
}
