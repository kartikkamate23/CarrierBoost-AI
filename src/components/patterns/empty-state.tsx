import { type ComponentType, type ReactNode } from "react";
import { Inbox } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Shown when a list or panel has no content yet.
 *
 * Presentational only — the caller decides when a collection is empty and what
 * the call to action should be.
 */
export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  size = "default",
  className,
}: {
  icon?: ComponentType<{ className?: string }>;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  size?: "sm" | "default";
  className?: string;
}) {
  const small = size === "sm";

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 text-center",
        small ? "px-5 py-8" : "px-6 py-14",
        className,
      )}
    >
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-full bg-background text-muted-foreground shadow-sm",
          small ? "h-10 w-10" : "h-14 w-14",
        )}
        aria-hidden="true"
      >
        <Icon className={small ? "h-4.5 w-4.5" : "h-6 w-6"} />
      </span>
      <p className={cn("mt-4 font-display text-foreground", small ? "text-body" : "text-h3")}>
        {title}
      </p>
      {description ? (
        <p className="mt-2 max-w-sm text-small text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-5 flex flex-wrap justify-center gap-2.5">{action}</div> : null}
    </div>
  );
}
