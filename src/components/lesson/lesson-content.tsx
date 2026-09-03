import { useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  BookOpen,
  Check,
  CheckCircle2,
  Copy,
  ExternalLink,
  Info,
  PlayCircle,
  Sigma,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { revealOnce, slideUpSm, stagger } from "@/lib/motion";
import { LessonDiagram } from "@/components/lesson/lesson-diagram";
import type { ContentBlock } from "@/lib/types/course";

/**
 * Renders one lesson `ContentBlock`.
 *
 * Each block type gets a distinct visual treatment so a learner can scan a
 * lesson and tell definitions, comparisons, flows, warnings, and code apart at
 * a glance. Blocks reveal on scroll; motion is decorative and collapses under
 * `prefers-reduced-motion`.
 */

const CALLOUT_TONES = {
  info: {
    icon: Info,
    shell: "border-primary/25 bg-primary/5",
    badge: "bg-primary/10 text-primary",
  },
  success: {
    icon: CheckCircle2,
    shell: "border-success/30 bg-success/10",
    badge: "bg-success/15 text-success",
  },
  warning: {
    icon: AlertTriangle,
    shell: "border-warning/35 bg-warning/10",
    badge: "bg-warning/15 text-warning",
  },
} as const;

const LANGUAGE_LABELS: Record<string, string> = {
  python: "Python",
  sql: "SQL",
  excel: "Excel",
  java: "Java",
  javascript: "JavaScript",
  typescript: "TypeScript",
  json: "JSON",
  bash: "Terminal",
  html: "HTML",
  css: "CSS",
};

/** Fades a block in as it scrolls into view. */
function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div {...revealOnce} variants={slideUpSm} className={className}>
      {children}
    </motion.div>
  );
}

function Callout({ title, text, tone = "info" }: { title: string; text: string; tone?: keyof typeof CALLOUT_TONES }) {
  const { icon: Icon, shell, badge } = CALLOUT_TONES[tone] ?? CALLOUT_TONES.info;
  return (
    <Reveal>
      <aside className={cn("mt-6 flex gap-3.5 rounded-xl border p-4", shell)}>
        <span className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", badge)}>
          <Icon className="h-4 w-4" />
        </span>
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">{text}</p>
        </div>
      </aside>
    </Reveal>
  );
}

/** Code sample with a language badge and copy-to-clipboard. */
function CodeBlock({ language, code }: { language: string; code: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    void navigator.clipboard?.writeText(code).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    });
  };
  return (
    <Reveal>
      <div className="mt-6 overflow-hidden rounded-xl border bg-slate-950">
        <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-2">
          <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">
            {LANGUAGE_LABELS[language] ?? language}
          </span>
          <button
            type="button"
            onClick={copy}
            className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-300 transition-colors hover:bg-white/10 hover:text-white"
          >
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="scrollbar-slim max-w-full overflow-x-auto p-4 text-sm leading-6 text-slate-100">
          <code>{code}</code>
        </pre>
      </div>
    </Reveal>
  );
}

/** Comparison table. Zebra rows and a highlighted first column aid scanning. */
function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <Reveal>
      <div className="scrollbar-slim mt-6 overflow-x-auto rounded-xl border shadow-sm">
        <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
          <thead>
            <tr className="bg-primary/5">
              {headers.map((header) => (
                <th
                  key={header}
                  scope="col"
                  className="whitespace-nowrap px-4 py-3 text-xs font-bold uppercase tracking-[0.08em] text-primary"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={cn("border-t", rowIndex % 2 === 1 && "bg-secondary/30")}>
                {row.map((cell, cellIndex) => (
                  <td
                    key={cellIndex}
                    className={cn(
                      "px-4 py-3 align-top leading-6",
                      cellIndex === 0 ? "font-semibold text-foreground" : "text-muted-foreground",
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}

function Formula({ expression, explanation }: { expression: string; explanation: string }) {
  return (
    <Reveal>
      <div className="mt-6 overflow-hidden rounded-xl border">
        <div className="flex items-center gap-3 border-b bg-secondary/40 px-4 py-3">
          <Sigma className="h-4 w-4 shrink-0 text-primary" />
          <p className="scrollbar-slim min-w-0 overflow-x-auto whitespace-nowrap font-mono text-base text-foreground">
            {expression}
          </p>
        </div>
        <p className="px-4 py-3 text-sm leading-6 text-muted-foreground">{explanation}</p>
      </div>
    </Reveal>
  );
}

/** Bulleted list rendered as checked items so takeaways read as a checklist. */
function CheckList({ items }: { items: string[] }) {
  return (
    <motion.ul {...revealOnce} variants={stagger(0.05)} className="mt-4 space-y-2">
      {items.map((item, index) => (
        <motion.li
          key={`${item}-${index}`}
          variants={slideUpSm}
          className="flex items-start gap-2.5 text-base leading-7 text-muted-foreground"
        >
          <span
            aria-hidden
            className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary/60"
          />
          <span className="min-w-0">{item}</span>
        </motion.li>
      ))}
    </motion.ul>
  );
}

export function LessonBlock({ block, index }: { block: ContentBlock; index?: number }) {
  switch (block.type) {
    case "heading":
      return (
        <h2
          id={index === undefined ? undefined : `lesson-heading-${index}`}
          className="mt-10 scroll-mt-24 border-l-2 border-primary/40 pl-3 font-display text-h3 text-foreground"
        >
          {block.text}
        </h2>
      );
    case "paragraph":
      return <p className="mt-4 text-base leading-7 text-muted-foreground">{block.text}</p>;
    case "list":
      return <CheckList items={block.items} />;
    case "callout":
      return <Callout title={block.title} text={block.text} tone={block.tone} />;
    case "code":
      return <CodeBlock language={block.language} code={block.code} />;
    case "formula":
      return <Formula expression={block.expression} explanation={block.explanation} />;
    case "table":
      return <DataTable headers={block.headers} rows={block.rows} />;
    case "diagram":
      return <LessonDiagram items={block.items} variant={block.variant} />;
    case "resource":
      return (
        <Reveal>
          <a
            className="lift mt-6 flex items-start gap-3.5 rounded-xl border bg-card p-4"
            href={block.url}
            target="_blank"
            rel="noreferrer"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <BookOpen className="h-4 w-4" />
            </span>
            <span className="min-w-0">
              <span className="flex items-center gap-1.5 font-semibold text-primary">
                {block.title}
                <ExternalLink className="h-3.5 w-3.5" />
              </span>
              <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                {block.description}
              </span>
            </span>
          </a>
        </Reveal>
      );
    case "video":
      return (
        <Reveal>
          <div className="mt-6 flex items-center gap-3.5 rounded-xl border bg-card p-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <PlayCircle className="h-4 w-4" />
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{block.title}</p>
              {block.url ? (
                <a
                  className="mt-0.5 block text-sm text-primary hover:underline"
                  href={block.url}
                  target="_blank"
                  rel="noreferrer"
                >
                  Open video resource
                </a>
              ) : null}
            </div>
          </div>
        </Reveal>
      );
    case "image":
      return (
        <Reveal>
          <figure className="mt-6">
            <img
              src={block.src}
              alt={block.alt}
              width={block.width}
              height={block.height}
              loading="lazy"
              className="max-w-full rounded-xl border"
            />
            {block.caption ? (
              <figcaption className="mt-2 text-center text-sm text-muted-foreground">
                {block.caption}
              </figcaption>
            ) : null}
          </figure>
        </Reveal>
      );
  }
}

/** Renders a full lesson body. */
export function LessonContent({ blocks }: { blocks: ContentBlock[] }) {
  return (
    <div>
      {blocks.map((block, index) => (
        <LessonBlock key={`${block.type}-${index}`} block={block} index={index} />
      ))}
    </div>
  );
}
