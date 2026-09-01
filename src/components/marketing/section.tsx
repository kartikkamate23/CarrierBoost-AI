import { type ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { revealOnce, slideUp, stagger } from "@/lib/motion";

/**
 * Landing-page layout primitives. Presentational only.
 */

export function Section({
  id,
  children,
  className,
  containerClassName,
  tone = "default",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  tone?: "default" | "muted" | "mesh";
}) {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={cn(
        "scroll-mt-20 py-20 lg:py-28",
        tone === "muted" && "border-y bg-card/40",
        tone === "mesh" && "bg-mesh",
        className,
      )}
    >
      <div className={cn("container mx-auto max-w-7xl px-4", containerClassName)}>{children}</div>
    </motion.section>
  );
}

/**
 * Centered heading block used at the top of most sections.
 */
export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "center",
  className,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  body?: ReactNode;
  align?: "center" | "start";
  className?: string;
}) {
  return (
    <motion.div
      {...revealOnce}
      variants={slideUp}
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow ? <p className="text-caption uppercase text-primary">{eyebrow}</p> : null}
      <h2 className={cn("font-display text-h2 text-foreground sm:text-h1", eyebrow && "mt-3")}>
        {title}
      </h2>
      {body ? <p className="mt-4 text-body-lg text-muted-foreground">{body}</p> : null}
    </motion.div>
  );
}

/**
 * Reveals its children on scroll, staggering direct children that use the
 * `slideUp` variant.
 */
export function Reveal({
  children,
  className,
  staggerChildren = 0.06,
  delayChildren = 0,
  as: Tag = "div",
}: {
  children: ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  as?: "div" | "ul" | "ol";
}) {
  const Motion = motion[Tag];
  return (
    <Motion
      {...revealOnce}
      variants={stagger(staggerChildren, delayChildren)}
      className={className}
    >
      {children}
    </Motion>
  );
}

/** Single item inside a Reveal group. */
export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={slideUp} className={className}>
      {children}
    </motion.div>
  );
}
