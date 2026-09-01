import { type ReactNode } from "react";
import { AlertCircle, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Full-panel failure state.
 *
 * Presentational only: the caller passes an already-derived message and
 * supplies its own retry element. This component never catches, retries or
 * transforms an error.
 */
export function ErrorState({
  title = "Something went wrong",
  message,
  action,
  className,
}: {
  title?: ReactNode;
  message?: ReactNode;
  action?: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-destructive/30 bg-destructive/5 px-6 py-12 text-center",
        className,
      )}
    >
      <span
        className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-background text-destructive shadow-sm"
        aria-hidden="true"
      >
        <AlertTriangle className="h-6 w-6" />
      </span>
      <p className="mt-4 font-display text-h3 text-foreground">{title}</p>
      {message ? <p className="mt-2 max-w-md text-small text-muted-foreground">{message}</p> : null}
      {action ? <div className="mt-5 flex flex-wrap justify-center gap-2.5">{action}</div> : null}
    </div>
  );
}

/**
 * Compact inline error, for use directly above a form control or inside a card.
 */
export function InlineError({
  title,
  message,
  className,
}: {
  title?: ReactNode;
  message: ReactNode;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-lg border border-destructive/35 bg-destructive/10 px-4 py-3 text-small",
        className,
      )}
    >
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
      <div className="min-w-0">
        {title ? <p className="font-semibold text-foreground">{title}</p> : null}
        <p className={cn("text-muted-foreground", title && "mt-0.5")}>{message}</p>
      </div>
    </div>
  );
}
