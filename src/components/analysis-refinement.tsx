import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  Award,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleHelp,
  Code2,
  FileChartColumn,
  FileText,
  FolderGit2,
  Image,
  LayoutDashboard,
  ShieldQuestion,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  addProofRoadmapItem,
  type CareerAnalysis,
  type ExperienceLevel,
  type KeywordEvidence,
  type SkillGap,
  getRoadmapPreview,
} from "@/lib/career-engine";

const statusConfig = {
  demonstrated: {
    label: "Demonstrated",
    Icon: CheckCircle2,
    className: "border-success/40 bg-success/10 text-success",
  },
  weak: {
    label: "Mentioned, weak evidence",
    Icon: AlertCircle,
    className: "border-warning/50 bg-warning/10 text-amber-800 dark:text-warning",
  },
  missing: {
    label: "Missing",
    Icon: XCircle,
    className: "border-destructive/35 bg-destructive/10 text-destructive",
  },
  insufficient: {
    label: "Insufficient information",
    Icon: CircleHelp,
    className: "border-border bg-muted text-muted-foreground",
  },
} as const;

export function KeywordCoverage({ analysis }: { analysis: CareerAnalysis }) {
  const score = analysis.scores.find((item) => item.key === "keywords")!;
  const [selected, setSelected] = useState<string | null>(null);
  const current = analysis.keywords.find((item) => item.key === selected);
  const demonstrated = analysis.keywords.filter((item) => item.status === "demonstrated").length;
  return (
    <section aria-labelledby="keyword-title" className="rounded-2xl border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 id="keyword-title" className="text-lg font-semibold">
            Keyword Coverage: {score.score}%
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {demonstrated} of {analysis.keywords.length} priority keywords demonstrated
          </p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
          {score.status}
        </span>
      </div>
      <Progress
        value={score.score}
        aria-label={`Keyword coverage ${score.score} percent; ${demonstrated} of ${analysis.keywords.length} priority keywords demonstrated`}
        className="mt-4"
      />
      <p className="mt-4 text-sm leading-6 text-muted-foreground">
        Only unique priority terms supported by experience, project, achievement, certification, or
        contextual technical evidence count toward this percentage.
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {analysis.keywords.map((keyword) => (
          <KeywordChip
            key={keyword.key}
            keyword={keyword}
            expanded={selected === keyword.key}
            onSelect={() => setSelected((value) => (value === keyword.key ? null : keyword.key))}
          />
        ))}
      </div>
      <div
        aria-label="Keyword status legend"
        className="mt-5 flex flex-wrap gap-x-4 gap-y-2 border-t pt-4 text-xs text-muted-foreground"
      >
        {Object.values(statusConfig).map(({ label, Icon }) => (
          <span key={label} className="inline-flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </span>
        ))}
      </div>
      {current && <KeywordDetails keyword={current} />}
    </section>
  );
}
function KeywordChip({
  keyword,
  expanded,
  onSelect,
}: {
  keyword: KeywordEvidence;
  expanded: boolean;
  onSelect: () => void;
}) {
  const config = statusConfig[keyword.status];
  return (
    <button
      type="button"
      aria-expanded={expanded}
      onClick={onSelect}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-3 py-2 text-sm font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${config.className}`}
    >
      <config.Icon className="h-4 w-4" aria-hidden="true" />
      <span>{keyword.name}</span>
      <span className="sr-only">— {config.label}. Select for evidence details.</span>
    </button>
  );
}
function KeywordDetails({ keyword }: { keyword: KeywordEvidence }) {
  const config = statusConfig[keyword.status];
  return (
    <div className="mt-5 rounded-xl border bg-background p-5" role="region" aria-live="polite">
      <div className="flex items-center gap-2">
        <config.Icon className="h-5 w-5" />
        <h4 className="font-semibold">{keyword.name}</h4>
        <span className="text-xs text-muted-foreground">{config.label}</span>
      </div>
      <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
        <Detail
          label="Evidence found"
          value={
            keyword.evidence.length
              ? keyword.evidence.join(" · ")
              : "No supporting evidence found in your resume"
          }
        />
        <Detail label="Why it matters" value={keyword.why} />
        <Detail label="Evidence missing" value={keyword.missing} />
        <Detail label="Recommended action" value={keyword.action} />
        <Detail label="Related learning" value={keyword.related} />
      </dl>
    </div>
  );
}

export function AchievementImpact({ analysis }: { analysis: CareerAnalysis }) {
  const score = analysis.scores.find((item) => item.key === "impact")!;
  const data = analysis.achievement;
  const [improving, setImproving] = useState(false);
  const [metric, setMetric] = useState("");
  const [value, setValue] = useState("");
  return (
    <section aria-labelledby="impact-title" className="rounded-2xl border bg-card p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 id="impact-title" className="text-lg font-semibold">
            Achievement Impact: {score.score}%
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.measurableBullets} of {data.totalBullets} experience or project bullets contain
            measurable outcomes
          </p>
        </div>
        <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
          {score.status}
        </span>
      </div>
      <Progress
        value={score.score}
        aria-label={`Achievement impact ${score.score} percent; ${data.measurableBullets} of ${data.totalBullets} bullets contain measurable outcomes`}
        className="mt-4"
      />
      <p className="mt-4 text-sm leading-6 text-muted-foreground">{data.definition}</p>
      <div className="mt-5 grid gap-2 sm:grid-cols-2">
        {data.elements.map((item) => (
          <div
            key={item.label}
            className="flex min-h-11 items-center justify-between rounded-lg border px-3 py-2 text-sm"
          >
            <span>{item.label}</span>
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              {item.status === "met" ? (
                <CheckCircle2 className="h-4 w-4 text-success" />
              ) : item.status === "partial" ? (
                <AlertCircle className="h-4 w-4 text-warning" />
              ) : (
                <XCircle className="h-4 w-4 text-destructive" />
              )}
              {item.status}
            </span>
          </div>
        ))}
      </div>
      <details className="mt-5 rounded-xl border bg-background p-4">
        <summary className="cursor-pointer font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring">
          How this is calculated
        </summary>
        <div className="mt-4 space-y-4 text-sm text-muted-foreground">
          <Detail label="Definition" value={data.definition} />
          <Detail
            label="Evidence found"
            value={
              data.strongBullets.join(" · ") ||
              "No complete measurable achievement bullet detected."
            }
          />
          <Detail
            label="Weak bullets"
            value={data.weakBullets.join(" · ") || "Insufficient bullet structure was available."}
          />
          <Detail
            label="Missing elements"
            value={
              data.elements
                .filter((item) => item.status !== "met")
                .map((item) => item.label)
                .join(", ") || "All evaluated elements have support."
            }
          />
          <Detail label="Recommended framework" value={data.framework} />
          <p>
            No metric, revenue, scale, or performance result is invented. Supply missing facts
            before finalizing a rewrite.
          </p>
        </div>
      </details>
      <Button
        variant="outline"
        className="mt-4 min-h-11"
        onClick={() => setImproving((value) => !value)}
      >
        {improving ? "Close improvement panel" : "Improve this bullet"}
      </Button>
      {improving && (
        <div className="mt-4 rounded-xl border bg-background p-5">
          <h4 className="font-semibold">Add the missing verified facts</h4>
          <p className="mt-1 text-sm text-muted-foreground">
            CareerBoost will not fabricate these values.
          </p>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="metric-name">Metric or outcome</Label>
              <Input
                id="metric-name"
                value={metric}
                onChange={(event) => setMetric(event.target.value)}
                placeholder="e.g. processing time"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metric-value">Verified value</Label>
              <Input
                id="metric-value"
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="e.g. 18%"
              />
            </div>
          </div>
          <p className="mt-4 rounded-lg bg-secondary p-3 text-sm">
            <strong>Draft structure:</strong> Improved {metric || "[verified metric]"} by{" "}
            {value || "[value provided by you]"} using [tool or method], resulting in [verified
            outcome].
          </p>
          <Button
            className="mt-4"
            disabled={!metric.trim() || !value.trim()}
            onClick={() => toast.success("Verified facts added to the draft.")}
          >
            Use verified facts
          </Button>
        </div>
      )}
    </section>
  );
}

export function ScoreBreakdown({ analysis }: { analysis: CareerAnalysis }) {
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const all = expanded.size === analysis.scores.length;
  const toggle = (key: string) =>
    setExpanded((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  return (
    <section aria-labelledby="breakdown-title">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 id="breakdown-title" className="text-xl font-bold">
            Transparent score breakdown
          </h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Every percentage uses the same backend-compatible deterministic analysis result.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(new Set(analysis.scores.map((item) => item.key)))}
          >
            Expand all
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpanded(new Set())}
            disabled={!expanded.size}
          >
            Collapse all
          </Button>
        </div>
      </div>
      <details className="mt-4 rounded-xl border bg-card p-4">
        <summary className="cursor-pointer font-medium outline-none focus-visible:ring-2 focus-visible:ring-ring">
          How overall score is calculated
        </summary>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">
          {analysis.scores.find((item) => item.key === "readiness")?.calculation}. The weighted
          result is {analysis.overall}%. Component and overall values come from the same analysis
          object, preventing frontend/backend mismatch.
        </p>
      </details>
      <div className="mt-4 grid items-start gap-3 lg:grid-cols-2">
        {analysis.scores.map((score) => (
          <article key={score.key} className="rounded-xl border bg-card">
            <button
              type="button"
              onClick={() => toggle(score.key)}
              aria-expanded={expanded.has(score.key)}
              className="flex min-h-16 w-full items-center gap-4 rounded-xl p-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="font-medium">{score.label}</h4>
                  <strong>{score.score}%</strong>
                </div>
                <div className="mt-2 flex items-center gap-3">
                  <Progress
                    value={score.score}
                    aria-label={`${score.label}: ${score.score} percent, ${score.status}`}
                    className="flex-1"
                  />
                  <span className="w-24 text-right text-xs text-muted-foreground">
                    {score.status}
                  </span>
                </div>
              </div>
              <ChevronDown
                className={`h-4 w-4 shrink-0 transition-transform ${expanded.has(score.key) ? "rotate-180" : ""}`}
                aria-hidden="true"
              />
            </button>
            {expanded.has(score.key) && (
              <div className="space-y-4 border-t px-5 py-4 text-sm text-muted-foreground">
                <Detail label="What this measures" value={score.definition} />
                <Detail label="Why you received this score" value={score.detected} />
                <Detail
                  label="Evidence found"
                  value={score.evidence.join(" · ") || "No supporting evidence found."}
                />
                <Detail
                  label="Issues or evidence missing"
                  value={score.issues.join(" · ") || "No critical issue detected."}
                />
                <Detail label="Calculation" value={score.calculation} />
                <Detail label="Overall effect" value={score.effect} />
                <Detail label="Recommended action" value={score.action} />
                <Detail
                  label="Estimated possible improvement"
                  value={`Up to ${score.expectedGain} percentage points after verified changes.`}
                />
              </div>
            )}
          </article>
        ))}
      </div>
      <span className="sr-only">
        {all ? "All score details expanded" : "Some score details collapsed"}
      </span>
    </section>
  );
}

export function SkillProofSection({ analysis }: { analysis: CareerAnalysis }) {
  const [selected, setSelected] = useState<SkillGap | null>(null);
  const [added, setAdded] = useState<Record<string, ExperienceLevel>>({});
  const [announcement, setAnnouncement] = useState("");
  useEffect(() => setAdded(readRoadmap()), []);
  const add = (gap: SkillGap, level: ExperienceLevel) => {
    const result = addProofRoadmapItem(added, gap.key, level);
    if (!result.added) return;
    const previous = { ...added };
    setAdded(result.next);
    writeRoadmap(result.next);
    setSelected(null);
    setAnnouncement(`${gap.skill} added to your roadmap at ${level} level.`);
    toast.success(`${gap.skill} added to your roadmap.`, {
      action: {
        label: "Undo",
        onClick: () => {
          setAdded(previous);
          writeRoadmap(previous);
          setAnnouncement(`${gap.skill} removed from your roadmap.`);
        },
      },
    });
  };
  return (
    <section aria-labelledby="proof-title">
      <div>
        <h3 id="proof-title" className="text-xl font-bold">
          Turn missing skills into proof
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">
          Mastery requires role-specific evidence—not a keyword mention or completed video.
        </p>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {analysis.gaps.map((gap) => (
          <article key={gap.key} className="rounded-2xl border bg-card p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h4 className="text-lg font-semibold">{gap.skill}</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Priority: <strong className="text-warning">{gap.importance}</strong> · Required
                  level: {gap.requiredLevel}
                </p>
              </div>
              <span className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-medium text-destructive">
                No supporting evidence found
              </span>
            </div>
            <div className="mt-5 grid gap-4 text-sm">
              <Detail label="Learning action" value={gap.action} />
              <Detail label="Proof to submit" value={gap.proof} />
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Visual proof types
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {gap.proofTypes.map((item) => (
                    <span
                      key={item.type}
                      className="inline-flex min-h-10 items-center gap-2 rounded-lg border bg-background px-3 py-2 text-xs"
                    >
                      <ProofIcon type={item.type} />
                      {item.type}
                    </span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Required deliverables
                </p>
                <ul className="mt-2 space-y-2 text-muted-foreground">
                  {gap.deliverables.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <p>
                <strong>Estimated effort:</strong> {gap.hours - 1}–{gap.hours} hours
              </p>
            </div>
            <Button
              variant={added[gap.key] ? "secondary" : "outline"}
              className="mt-5 min-h-11 w-full"
              disabled={Boolean(added[gap.key])}
              onClick={() => setSelected(gap)}
            >
              {added[gap.key] ? `Added · ${added[gap.key]}` : "Add to roadmap"}
            </Button>
          </article>
        ))}
      </div>
      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>
      <RoadmapDialog
        gap={selected}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
        onConfirm={add}
      />
    </section>
  );
}

function RoadmapDialog({
  gap,
  onOpenChange,
  onConfirm,
}: {
  gap: SkillGap | null;
  onOpenChange: (open: boolean) => void;
  onConfirm: (gap: SkillGap, level: ExperienceLevel) => void;
}) {
  const [level, setLevel] = useState<ExperienceLevel>("Intermediate");
  useEffect(() => {
    if (gap) setLevel("Intermediate");
  }, [gap]);
  const preview = useMemo(() => (gap ? getRoadmapPreview(gap, level) : null), [gap, level]);
  if (!gap || !preview) return null;
  return (
    <Dialog open={Boolean(gap)} onOpenChange={onOpenChange}>
      <DialogContent className="bottom-0 left-0 top-auto max-h-[92vh] max-w-none translate-x-0 translate-y-0 overflow-y-auto rounded-t-2xl p-0 sm:bottom-auto sm:left-[50%] sm:top-[50%] sm:max-w-2xl sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-2xl">
        <div className="p-6">
          <DialogHeader>
            <DialogTitle>Personalize this roadmap item</DialogTitle>
            <DialogDescription>
              Choose your current experience level for {gap.skill}. The preview updates immediately.
            </DialogDescription>
          </DialogHeader>
          <fieldset className="mt-6">
            <legend className="text-sm font-semibold">Experience level</legend>
            <RadioGroup
              value={level}
              onValueChange={(value) => setLevel(value as ExperienceLevel)}
              className="mt-3 grid gap-3 sm:grid-cols-3"
            >
              {(["Beginner", "Intermediate", "Advanced"] as ExperienceLevel[]).map((item) => (
                <Label
                  key={item}
                  htmlFor={`level-${item}`}
                  className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border p-3 ${level === item ? "border-primary bg-primary/5" : ""}`}
                >
                  <RadioGroupItem id={`level-${item}`} value={item} />
                  {item}
                </Label>
              ))}
            </RadioGroup>
          </fieldset>
          <div className="mt-6 rounded-xl border bg-secondary/50 p-5" aria-live="polite">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">{level} roadmap preview</h3>
              <span className="text-xs text-muted-foreground">
                {preview.estimatedHours} hours · {preview.difficulty}
              </span>
            </div>
            <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
              {preview.changes.map((item) => (
                <li key={item} className="flex gap-2">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
            <dl className="mt-5 grid gap-4 border-t pt-4 text-sm sm:grid-cols-2">
              <Detail label="Lessons added" value={preview.lessonsAdded.join(", ")} />
              <Detail label="Lessons skipped" value={preview.lessonsSkipped.join(", ") || "None"} />
              <Detail label="Project type" value={preview.projectType} />
              <Detail label="Proof requirements" value={preview.proof} />
              <Detail label="Expected level" value={preview.expectedLevel} />
            </dl>
          </div>
          <DialogFooter className="mt-6 gap-2">
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button
              variant="outline"
              onClick={() => toast.info("Full roadmap preview uses this same configuration.")}
            >
              Preview full roadmap
            </Button>
            <Button onClick={() => onConfirm(gap, level)}>Confirm and add</Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function readRoadmap(): Record<string, ExperienceLevel> {
  if (typeof window === "undefined") return {};
  try {
    const parsed = JSON.parse(localStorage.getItem("careerboost-proof-roadmap") ?? "{}");
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch (error) {
    console.warn("Could not read saved roadmap configuration", error);
    return {};
  }
}
function writeRoadmap(value: Record<string, ExperienceLevel>) {
  try {
    localStorage.setItem("careerboost-proof-roadmap", JSON.stringify(value));
  } catch (error) {
    console.error("Could not persist roadmap configuration", error);
    toast.error("Roadmap could not be saved on this device.");
  }
}
function ProofIcon({ type }: { type: string }) {
  const Icon = type.includes("GitHub")
    ? FolderGit2
    : type.includes("Code")
      ? Code2
      : type.includes("Architecture")
        ? LayoutDashboard
        : type.includes("Dashboard")
          ? BarChart3
          : type.includes("report")
            ? FileChartColumn
            : type.includes("screenshot")
              ? Image
              : type.includes("Certificate")
                ? Award
                : type.includes("Assessment")
                  ? ShieldQuestion
                  : FileText;
  return <Icon className="h-4 w-4 text-primary" aria-hidden="true" />;
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </dt>
      <dd className="mt-1 leading-6 text-foreground">{value}</dd>
    </div>
  );
}
