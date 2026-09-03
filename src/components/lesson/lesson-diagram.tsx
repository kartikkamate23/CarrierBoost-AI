import { Fragment, type ReactNode } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowRight, Check, CornerDownRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { EASE_ENTRANCE, revealOnce, stagger, useReducedMotion } from "@/lib/motion";

/**
 * Visual renderer for lesson `diagram` blocks.
 *
 * Every lesson carries a diagram whose `variant` describes the shape of the
 * idea (a flow, a pipeline, a layered architecture, and so on). This component
 * draws each shape properly instead of listing the steps, so the relationship
 * between items is visible rather than implied.
 *
 * Motion is decorative only: nodes fade in on scroll and connectors carry a
 * slow travelling pulse. Both collapse under `prefers-reduced-motion`.
 */

export type DiagramVariant =
  | "flow"
  | "concept"
  | "pipeline"
  | "architecture"
  | "steps"
  | "timeline"
  | "decision-tree";

type DiagramProps = { items: string[]; variant?: DiagramVariant; caption?: string };

/** Rotating accent so adjacent nodes stay distinguishable without extra markup. */
const ACCENTS = [
  "border-chart-1/35 bg-chart-1/10",
  "border-chart-2/35 bg-chart-2/10",
  "border-chart-3/35 bg-chart-3/10",
  "border-chart-4/35 bg-chart-4/10",
  "border-chart-5/35 bg-chart-5/10",
] as const;

const accentAt = (index: number) => ACCENTS[index % ACCENTS.length];

const node = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: EASE_ENTRANCE } },
};

function Figure({
  label,
  children,
  caption,
}: {
  label: string;
  children: ReactNode;
  caption?: string;
}) {
  return (
    <figure className="mt-6" role="group" aria-label={label}>
      {children}
      {caption ? (
        <figcaption className="mt-3 text-center text-xs text-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

/**
 * Connector between two nodes. `flowing` adds the travelling pulse used by
 * flow and pipeline diagrams to suggest a direction of movement.
 */
function Connector({ vertical, flowing }: { vertical?: boolean; flowing?: boolean }) {
  const reduced = useReducedMotion();
  const Arrow = vertical ? ArrowDown : ArrowRight;
  return (
    <div
      aria-hidden
      className={cn(
        "flex shrink-0 items-center justify-center",
        vertical ? "h-7 w-full flex-col" : "h-full w-8 sm:w-10",
      )}
    >
      <span
        className={cn(
          "relative overflow-hidden rounded-full bg-border",
          vertical ? "h-full w-px" : "h-px w-full",
        )}
      >
        {flowing && !reduced ? (
          <span
            className={cn(
              "absolute bg-primary",
              vertical
                ? "inset-x-0 h-1/2 animate-flow-down"
                : "inset-y-0 w-1/2 animate-flow-right",
            )}
          />
        ) : null}
      </span>
      <Arrow
        className={cn(
          "text-muted-foreground",
          vertical ? "-mt-1 h-3.5 w-3.5" : "-ml-1.5 h-3.5 w-3.5",
        )}
      />
    </div>
  );
}

/** Horizontal chain of stages, stacking vertically on small screens. */
function FlowDiagram({ items, pipeline }: { items: string[]; pipeline?: boolean }) {
  return (
    <motion.ol
      {...revealOnce}
      variants={stagger(0.08)}
      className="flex flex-col items-stretch sm:flex-row sm:flex-wrap sm:items-center"
    >
      {items.map((item, index) => (
        <Fragment key={`${item}-${index}`}>
          <motion.li
            variants={node}
            className={cn(
              "flex min-w-0 flex-1 items-center gap-3 rounded-xl border bg-card px-3.5 py-3 text-sm font-medium shadow-sm sm:min-w-[8.5rem]",
              pipeline ? accentAt(index) : "border-border",
            )}
          >
            <span
              className={cn(
                "flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-xs font-bold",
                pipeline ? "bg-background/70 text-foreground" : "bg-primary/10 text-primary",
              )}
            >
              {index + 1}
            </span>
            <span className="min-w-0 text-foreground">{item}</span>
          </motion.li>
          {index < items.length - 1 ? (
            <>
              <span className="sm:hidden">
                <Connector vertical flowing />
              </span>
              <span className="hidden self-stretch sm:block">
                <Connector flowing />
              </span>
            </>
          ) : null}
        </Fragment>
      ))}
    </motion.ol>
  );
}

/** Vertical numbered timeline with a rail running through every step. */
function StepsDiagram({ items }: { items: string[] }) {
  return (
    <motion.ol {...revealOnce} variants={stagger(0.08)} className="relative space-y-3 pl-9">
      <span
        aria-hidden
        className="absolute bottom-4 left-[0.9375rem] top-4 w-px bg-gradient-to-b from-primary/50 via-border to-transparent"
      />
      {items.map((item, index) => (
        <motion.li key={`${item}-${index}`} variants={node} className="relative">
          <span className="absolute -left-9 top-1.5 flex h-8 w-8 items-center justify-center rounded-full border bg-card text-xs font-bold text-primary shadow-sm">
            {index + 1}
          </span>
          <p className="rounded-xl border bg-card px-4 py-3 text-sm font-medium text-foreground shadow-sm">
            {item}
          </p>
        </motion.li>
      ))}
    </motion.ol>
  );
}

/** Horizontal rail of milestones. Falls back to the vertical rail on mobile. */
function TimelineDiagram({ items }: { items: string[] }) {
  return (
    <>
      <div className="sm:hidden">
        <StepsDiagram items={items} />
      </div>
      <motion.ol
        {...revealOnce}
        variants={stagger(0.08)}
        className="relative hidden items-start justify-between gap-2 sm:flex"
      >
        <span
          aria-hidden
          className="absolute left-0 right-0 top-3 h-px bg-gradient-to-r from-primary/50 via-border to-transparent"
        />
        {items.map((item, index) => (
          <motion.li
            key={`${item}-${index}`}
            variants={node}
            className="relative flex flex-1 flex-col items-center text-center"
          >
            <span
              className={cn(
                "z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 bg-card text-[10px] font-bold text-foreground",
                accentAt(index),
              )}
            >
              {index + 1}
            </span>
            <span className="mt-2 text-xs font-medium leading-snug text-foreground">{item}</span>
          </motion.li>
        ))}
      </motion.ol>
    </>
  );
}

/** Stacked layers, top to bottom, the way an architecture is normally drawn. */
function ArchitectureDiagram({ items }: { items: string[] }) {
  return (
    <motion.ol {...revealOnce} variants={stagger(0.07)} className="space-y-1.5">
      {items.map((item, index) => (
        <motion.li key={`${item}-${index}`} variants={node}>
          <div
            className={cn(
              "flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm",
              accentAt(index),
            )}
          >
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
              L{index + 1}
            </span>
            <span className="text-sm font-medium text-foreground">{item}</span>
          </div>
          {index < items.length - 1 ? (
            <div aria-hidden className="flex justify-center py-0.5 text-muted-foreground">
              <ArrowDown className="h-3.5 w-3.5" />
            </div>
          ) : null}
        </motion.li>
      ))}
    </motion.ol>
  );
}

/** Related ideas of equal weight, shown as a responsive grid of tiles. */
function ConceptDiagram({ items }: { items: string[] }) {
  return (
    <motion.ul
      {...revealOnce}
      variants={stagger(0.06)}
      className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {items.map((item, index) => (
        <motion.li
          key={`${item}-${index}`}
          variants={node}
          className={cn(
            "rounded-xl border px-4 py-3.5 text-sm font-medium text-foreground shadow-sm",
            accentAt(index),
          )}
        >
          <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")}
          </span>
          {item}
        </motion.li>
      ))}
    </motion.ul>
  );
}

/**
 * Root question with branching outcomes. The first item is the decision; the
 * rest are the branches taken from it.
 */
function DecisionTreeDiagram({ items }: { items: string[] }) {
  const [root, ...branches] = items;
  return (
    <motion.div {...revealOnce} variants={stagger(0.08)} className="space-y-3">
      <motion.p
        variants={node}
        className="rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-center text-sm font-semibold text-foreground"
      >
        {root}
      </motion.p>
      <div aria-hidden className="flex justify-center text-muted-foreground">
        <ArrowDown className="h-4 w-4" />
      </div>
      <ol className="grid gap-2.5 sm:grid-cols-2">
        {branches.map((branch, index) => {
          const affirmative = index === 0;
          const Icon = affirmative ? Check : branches.length === 2 ? X : CornerDownRight;
          return (
            <motion.li
              key={`${branch}-${index}`}
              variants={node}
              className={cn(
                "flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm shadow-sm",
                affirmative ? "border-success/35 bg-success/10" : "border-border bg-card",
              )}
            >
              <Icon
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0",
                  affirmative ? "text-success" : "text-muted-foreground",
                )}
              />
              <span className="font-medium text-foreground">{branch}</span>
            </motion.li>
          );
        })}
      </ol>
    </motion.div>
  );
}

export function LessonDiagram({ items, variant = "flow", caption }: DiagramProps) {
  if (!items.length) return null;
  const label = `${variant.replace("-", " ")} diagram: ${items.join(", then ")}`;
  const wrap = (children: ReactNode) => (
    <Figure label={label} caption={caption}>
      {children}
    </Figure>
  );
  switch (variant) {
    case "steps":
      return wrap(<StepsDiagram items={items} />);
    case "timeline":
      return wrap(<TimelineDiagram items={items} />);
    case "architecture":
      return wrap(<ArchitectureDiagram items={items} />);
    case "concept":
      return wrap(<ConceptDiagram items={items} />);
    case "decision-tree":
      return wrap(<DecisionTreeDiagram items={items} />);
    case "pipeline":
      return wrap(<FlowDiagram items={items} pipeline />);
    case "flow":
    default:
      return wrap(<FlowDiagram items={items} />);
  }
}
