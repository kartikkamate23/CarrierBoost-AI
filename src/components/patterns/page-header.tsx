import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { slideUpSm } from "@/lib/motion";

/**
 * Standard page heading block: optional eyebrow, title, supporting copy and a
 * trailing action slot.
 *
 * Presentational only. It renders whatever it is given and holds no state.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  align = "start",
  className,
  children,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  align?: "start" | "center";
  className?: string;
  children?: ReactNode;
}) {
  const centered = align === "center";

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={slideUpSm}
      className={cn(
        "flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between",
        centered && "sm:flex-col sm:items-center sm:text-center",
        className,
      )}
    >
      <div className={cn("min-w-0", centered && "mx-auto max-w-2xl")}>
        {eyebrow ? <p className="text-caption uppercase text-primary">{eyebrow}</p> : null}
        <h1
          className={cn(
            "font-display text-h2 text-foreground sm:text-h1",
            eyebrow ? "mt-2.5" : undefined,
          )}
        >
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-body text-muted-foreground">{description}</p>
        ) : null}
        {children}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div>
      ) : null}
    </motion.div>
  );
}

/**
 * Smaller heading for sections inside a page.
 */
export function SectionHeader({
  eyebrow,
  title,
  description,
  actions,
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}
    >
      <div className="min-w-0">
        {eyebrow ? <p className="text-caption uppercase text-primary">{eyebrow}</p> : null}
        <h2 className={cn("font-display text-h3 text-foreground", eyebrow && "mt-2")}>{title}</h2>
        {description ? (
          <p className="mt-2 max-w-2xl text-small text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  );
}
