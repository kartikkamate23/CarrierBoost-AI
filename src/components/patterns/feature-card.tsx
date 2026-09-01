import { type ComponentType, type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { slideUp } from "@/lib/motion";

/**
 * Marketing feature tile: icon, title, copy and an optional footer slot.
 *
 * Presentational only. When `index` is supplied a step number is shown; the
 * component never derives or fetches anything.
 */
export function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
  footer,
  className,
}: {
  icon?: ComponentType<{ className?: string }>;
  title: ReactNode;
  description: ReactNode;
  /** Zero-based. Renders a padded ordinal in the corner. */
  index?: number;
  footer?: ReactNode;
  className?: string;
}) {
  return (
    <motion.article
      variants={slideUp}
      className={cn("surface-card lift group flex h-full flex-col p-6", className)}
    >
      <div className="flex items-start justify-between gap-4">
        {Icon ? (
          <span
            className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary transition-colors duration-200 group-hover:bg-primary group-hover:text-primary-foreground"
            aria-hidden="true"
          >
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
        {typeof index === "number" ? (
          <span className="text-caption tabular-nums text-muted-foreground" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
        ) : null}
      </div>

      <h3 className="mt-5 font-display text-h3 text-foreground">{title}</h3>
      <div className="mt-2 flex-1 text-body text-muted-foreground">{description}</div>
      {footer ? <div className="mt-5">{footer}</div> : null}
    </motion.article>
  );
}

/**
 * Numbered step tile for "how it works" sequences.
 */
export function StepCard({
  index,
  title,
  description,
  icon: Icon,
  className,
}: {
  index: number;
  title: ReactNode;
  description: ReactNode;
  icon?: ComponentType<{ className?: string }>;
  className?: string;
}) {
  return (
    <motion.li variants={slideUp} className={cn("surface-card lift relative p-6", className)}>
      <span className="font-display text-h2 text-primary/25 tabular-nums" aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="mt-3 flex items-center gap-2.5">
        {Icon ? (
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
        <h3 className="font-display text-h3 text-foreground">{title}</h3>
      </div>
      <p className="mt-2.5 text-body text-muted-foreground">{description}</p>
    </motion.li>
  );
}
