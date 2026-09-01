import { ArrowUpRight, CircleDot, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { sampleAnalysis } from "@/components/marketing/sample-analysis";
import { cn } from "@/lib/utils";

/**
 * A product preview rendered from the REAL deterministic rubric.
 *
 * The numbers below are not mock-ups: they come from `analyzeCareerReadiness`,
 * the same pure function the live /analyze page runs, applied to the short
 * anonymised sample résumé below. `src/routes/sample-report.tsx` already uses
 * this exact pattern. Nothing here calls an API or touches the database.
 */

const modules = ["ResumeIQ", "Roadmap", "SkillPath", "ProjectLab", "InterviewIQ"];

/**
 * Browser-chrome window wrapper.
 */
export function AppWindow({
  children,
  label = "CareerBoost workspace · Sample",
  className,
}: {
  children: React.ReactNode;
  label?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-elevated)]",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-destructive/70" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-warning/70" aria-hidden="true" />
        <span className="h-2.5 w-2.5 rounded-full bg-success/70" aria-hidden="true" />
        <p className="ml-2 truncate text-caption normal-case tracking-normal text-muted-foreground">
          {label}
        </p>
      </div>
      {children}
    </div>
  );
}

/**
 * Compact preview used beside the hero.
 */
export function HeroPreview({ className }: { className?: string }) {
  const analysis = sampleAnalysis;
  const topScores = analysis.scores.slice(0, 4);
  const topGap = analysis.topProblems[0];

  return (
    <AppWindow className={className}>
      <div className="grid gap-4 p-4 sm:grid-cols-[8rem_minmax(0,1fr)] sm:p-5">
        <nav className="hidden gap-1 sm:grid" aria-hidden="true">
          {modules.map((item, index) => (
            <span
              key={item}
              className={cn(
                "rounded-lg px-3 py-2 text-small font-medium",
                index === 0
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent",
              )}
            >
              {item}
            </span>
          ))}
        </nav>

        <div className="min-w-0 space-y-3">
          <div className="rounded-xl bg-[image:var(--gradient-brand)] p-4 text-white">
            <p className="text-caption normal-case tracking-normal text-white/75">
              Job readiness · {analysis.role}
            </p>
            <p className="mt-1 font-display text-h1 tabular-nums">
              {analysis.overall}
              <span className="text-body font-medium text-white/70">/100</span>
            </p>
            <p className="mt-1 text-small text-white/75">Rubric {analysis.rubricVersion}</p>
          </div>

          <div className="space-y-2.5 rounded-xl border p-4">
            {topScores.map((score) => (
              <div key={score.key}>
                <div className="flex items-center justify-between gap-3 text-small">
                  <span className="truncate text-muted-foreground">{score.label}</span>
                  <strong className="tabular-nums text-foreground">{score.score}</strong>
                </div>
                <Progress value={score.score} className="mt-1.5 h-1.5" />
              </div>
            ))}
          </div>

          {topGap ? (
            <div className="rounded-xl border border-warning/30 bg-warning/5 p-4">
              <p className="text-caption uppercase text-warning">Highest-impact action</p>
              <p className="mt-1.5 text-small font-medium text-foreground">{topGap.action}</p>
              <p className="mt-1 text-small text-success">
                Potential improvement +{topGap.expectedGain}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </AppWindow>
  );
}

/**
 * Full-width preview used in the product-preview section.
 */
export function ScorePanel() {
  const analysis = sampleAnalysis;
  return (
    <div className="grid gap-3 p-5 sm:grid-cols-2">
      {analysis.scores.map((score) => (
        <div key={score.key} className="rounded-xl border p-4">
          <div className="flex items-center justify-between gap-3">
            <span className="truncate text-small text-muted-foreground">{score.label}</span>
            <strong className="tabular-nums text-body font-semibold text-foreground">
              {score.score}
            </strong>
          </div>
          <Progress value={score.score} className="mt-2.5 h-1.5" />
        </div>
      ))}
    </div>
  );
}

export function GapPanel() {
  const analysis = sampleAnalysis;
  return (
    <div className="space-y-3 p-5">
      {analysis.topProblems.map((problem) => (
        <article key={problem.key} className="rounded-xl border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-body font-semibold text-foreground">{problem.label}</h3>
            <span className="rounded-full bg-success/10 px-2.5 py-1 text-caption normal-case tracking-normal text-success">
              +{problem.expectedGain} potential
            </span>
          </div>
          <p className="mt-2 text-small text-muted-foreground">{problem.missing}</p>
          <p className="mt-2.5 flex gap-2 text-small text-foreground">
            <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
            {problem.action}
          </p>
        </article>
      ))}
    </div>
  );
}

export function EvidencePanel() {
  const analysis = sampleAnalysis;
  return (
    <div className="space-y-3 p-5">
      {analysis.gaps.slice(0, 4).map((gap) => (
        <article key={gap.skill} className="rounded-xl border p-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-body font-semibold capitalize text-foreground">{gap.skill}</h3>
            <span className="rounded-full bg-warning/10 px-2.5 py-1 text-caption normal-case tracking-normal text-warning">
              {gap.importance}
            </span>
          </div>
          <p className="mt-2 flex gap-2 text-small text-muted-foreground">
            <CircleDot className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {gap.evidence}
          </p>
          <p className="mt-2 flex gap-2 text-small text-foreground">
            <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
            <span>
              <strong className="font-medium">Proof required:</strong> {gap.proof}
            </span>
          </p>
        </article>
      ))}
    </div>
  );
}
