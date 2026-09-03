import { createFileRoute, Link } from "@tanstack/react-router";
import { useRef, useState } from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  Loader2,
  LockKeyhole,
  ShieldCheck,
  Sparkles,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { KeywordCoverage, ScoreBreakdown } from "@/components/analysis-refinement";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { RoleCoursePath } from "@/components/role-course-path";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { analyzeCareerReadiness, RUBRIC_VERSION, type CareerAnalysis } from "@/lib/career-engine";
import { saveTargetRole } from "@/lib/target-role";

const MAX_BYTES = 5 * 1024 * 1024;
const acceptedTypes = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export const Route = createFileRoute("/analyze")({
  component: AnalyzePage,
  head: () => ({
    meta: [
      { title: "Free ResumeIQ Analysis | CareerBoost AI" },
      {
        name: "description",
        content:
          "Analyze your resume against a target role with a transparent, evidence-based rubric. No account required.",
      },
    ],
  }),
});

async function extractText(file: File) {
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    const { extractPdfText } = await import("@/lib/pdf-extract");
    return extractPdfText(file);
  }

  try {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    return result.value.trim();
  } catch {
    throw new Error(
      "This DOCX could not be read. Export it again as DOCX or PDF, or paste the resume text below.",
    );
  }
}

function AnalyzePage() {
  const [role, setRole] = useState("Data Engineer");
  const [jobDescription, setJobDescription] = useState("");
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const clearFile = () => {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const chooseFile = (next: File | null) => {
    setError("");
    if (!next) return;
    if (!acceptedTypes.includes(next.type) && !/\.(pdf|docx)$/i.test(next.name)) {
      const message = "Choose a PDF or DOCX resume file.";
      setError(message);
      toast.error(message);
      clearFile();
      return;
    }
    if (next.size > MAX_BYTES) {
      const message = "Resume files must be 5 MB or smaller.";
      setError(message);
      toast.error(message);
      clearFile();
      return;
    }
    setFile(next);
    setText("");
    setAnalysis(null);
  };

  const run = async () => {
    setError("");
    if (role.trim().length < 2) {
      setError("Enter a target role using at least two characters.");
      document.getElementById("target-role")?.focus();
      return;
    }
    if (!file && text.trim().length < 80) {
      setError("Upload a resume or paste at least 80 characters of resume text.");
      document.getElementById("resume-text")?.focus();
      return;
    }

    setBusy(true);
    try {
      const resumeText = file ? await extractText(file) : text.trim();
      if (resumeText.length < 80) {
        throw new Error(
          "Not enough selectable text was found. If this is a scanned PDF, export it with OCR or paste the resume text below.",
        );
      }

      const result = analyzeCareerReadiness(
        resumeText.slice(0, 50_000),
        role.trim(),
        jobDescription.trim(),
      );
      setAnalysis(result);
      saveTargetRole(result.role);

      try {
        sessionStorage.setItem("careerboost-guest-analysis", JSON.stringify(result));
        sessionStorage.setItem("careerboost-resume-text", resumeText.slice(0, 50_000));
      } catch {
        // The analysis remains usable if private browsing blocks session storage.
      }

      requestAnimationFrame(() => {
        const heading = document.getElementById("analysis-result-heading");
        heading?.scrollIntoView({ behavior: "smooth", block: "start" });
        heading?.focus({ preventScroll: true });
      });
    } catch (caught) {
      const message =
        caught instanceof Error && caught.message
          ? caught.message
          : "Resume analysis failed. Try pasting the resume text instead.";
      setError(message);
      toast.error(message, { duration: 7000 });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <main id="main-content">
        <section className="bg-mesh border-b">
          <div className="container mx-auto max-w-6xl px-4 py-16">
            <p className="text-caption uppercase text-primary">ResumeIQ by CareerBoost AI</p>
            <h1 className="mt-3 max-w-3xl font-display text-h1 text-foreground sm:text-display">
              See what is holding your resume back — before you apply.
            </h1>
            <p className="mt-5 max-w-2xl text-body-lg text-muted-foreground">
              Get an explainable preview and your three highest-impact actions. No account or credit
              card required.
            </p>
          </div>
        </section>

        <section className="container mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,.75fr)]">
          <form
            className="surface-card p-6 sm:p-8"
            aria-describedby={error ? "analysis-error" : "analysis-help"}
            onSubmit={(event) => {
              event.preventDefault();
              void run();
            }}
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="target-role">Target job role</Label>
                <Input
                  id="target-role"
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  maxLength={120}
                  placeholder="e.g. Data Engineer"
                  autoComplete="organization-title"
                  disabled={busy}
                  aria-invalid={Boolean(error && role.trim().length < 2)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="resume-file">Resume file</Label>
                <label
                  htmlFor="resume-file"
                  className="flex min-h-11 cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-3 text-sm hover:bg-accent focus-within:ring-2 focus-within:ring-ring"
                >
                  <Upload className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="min-w-0 truncate">
                    {file ? file.name : "Choose PDF or DOCX"}
                  </span>
                </label>
                <input
                  ref={fileInputRef}
                  id="resume-file"
                  className="sr-only"
                  type="file"
                  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={(event) => chooseFile(event.target.files?.[0] ?? null)}
                  disabled={busy}
                  aria-describedby="file-help file-status"
                />
                <p id="file-help" className="text-xs text-muted-foreground">
                  PDF or DOCX, up to 5 MB. Scanned PDFs require OCR.
                </p>
              </div>
            </div>

            <div id="file-status" className="min-h-11" aria-live="polite">
              {file && (
                <button
                  type="button"
                  className="mt-2 inline-flex min-h-11 items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                  onClick={clearFile}
                  disabled={busy}
                >
                  <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  Remove {file.name}
                </button>
              )}
            </div>

            <div
              className="my-4 flex items-center gap-3 text-xs text-muted-foreground"
              aria-hidden="true"
            >
              <span className="h-px flex-1 bg-border" />
              or paste resume text
              <span className="h-px flex-1 bg-border" />
            </div>
            <Label htmlFor="resume-text" className="sr-only">
              Resume text
            </Label>
            <Textarea
              id="resume-text"
              value={text}
              onChange={(event) => {
                setText(event.target.value);
                setError("");
                if (event.target.value) clearFile();
              }}
              placeholder="Paste resume text here…"
              className="min-h-44"
              maxLength={50_000}
              disabled={busy}
            />
            <p id="analysis-help" className="mt-2 text-xs text-muted-foreground">
              Your resume is analyzed locally in this browser. At least 80 readable characters are
              required.
            </p>

            <div className="mt-5 space-y-2">
              <Label htmlFor="job-description">
                Job description{" "}
                <span className="font-normal text-muted-foreground">(optional)</span>
              </Label>
              <Textarea
                id="job-description"
                value={jobDescription}
                onChange={(event) => setJobDescription(event.target.value)}
                placeholder="Paste a job description for more precise keyword matching…"
                className="min-h-24"
                maxLength={20_000}
                disabled={busy}
              />
            </div>

            {error && (
              <div
                id="analysis-error"
                role="alert"
                className="mt-5 flex gap-3 rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm"
              >
                <AlertCircle
                  className="mt-0.5 h-5 w-5 shrink-0 text-destructive"
                  aria-hidden="true"
                />
                <div>
                  <p className="font-semibold">Analysis could not start</p>
                  <p className="mt-1">{error}</p>
                </div>
              </div>
            )}

            <Button type="submit" disabled={busy} size="lg" className="mt-6 w-full">
              {busy ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
              )}
              {busy ? "Reading and analyzing resume…" : "Analyze my resume—free"}
            </Button>
            <p className="sr-only" role="status" aria-live="polite">
              {busy ? "Resume analysis in progress." : analysis ? "Resume analysis complete." : ""}
            </p>
          </form>

          <aside className="space-y-4" aria-label="Privacy and scoring information">
            <div className="surface-card p-5">
              <ShieldCheck className="h-6 w-6 text-success" aria-hidden="true" />
              <h2 className="mt-3 font-semibold">Your resume stays under your control</h2>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>Guest analysis runs in this browser.</li>
                <li>Files are not uploaded or retained for guest analysis.</li>
                <li>Resume content is never used for model training without explicit consent.</li>
                <li>Signed-in uploads are private and user-deletable.</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-amber-300/60 bg-amber-50/70 p-5 text-sm text-amber-950 dark:bg-amber-950/20 dark:text-amber-100">
              <AlertTriangle className="mb-2 h-5 w-5" aria-hidden="true" />
              Scores are estimates from rubric <strong>{RUBRIC_VERSION}</strong>. They do not
              guarantee results in every ATS or hiring process.
            </div>
          </aside>
        </section>

        {analysis && <AnalysisPreview analysis={analysis} />}
      </main>
      <Footer />
    </div>
  );
}

function AnalysisPreview({ analysis }: { analysis: CareerAnalysis }) {
  const ats = analysis.scores.find((score) => score.key === "ats")!;
  const roleMatch = analysis.scores.find((score) => score.key === "roleMatch")!;
  const demonstrated = analysis.keywords.filter((keyword) => keyword.status === "demonstrated");
  const weaknesses = analysis.topProblems
    .flatMap((score) => score.issues)
    .filter((issue, index, issues) => issues.indexOf(issue) === index)
    .slice(0, 6);
  const suggestions = analysis.topProblems.map((score) => score.action);

  return (
    <section id="analysis-result" className="scroll-mt-20 border-t bg-secondary/35">
      <div className="container mx-auto max-w-6xl px-4 py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-caption uppercase text-primary">Your free analysis preview</p>
            <h2
              id="analysis-result-heading"
              tabIndex={-1}
              className="mt-1 scroll-mt-24 font-display text-h2 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              Job readiness: {analysis.overall}%
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Target: {analysis.role} · Rubric {analysis.rubricVersion}
            </p>
          </div>
          <Button asChild>
            <Link to="/signup" search={{ redirect: "/dashboard" }}>
              <LockKeyhole className="mr-2 h-4 w-4" aria-hidden="true" />
              Create account to save report
            </Link>
          </Button>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3" aria-label="Resume score summary">
          <MetricCard label="ATS score" value={ats.score} progress={ats.score} suffix="/100" />
          <MetricCard
            label="Role match"
            value={roleMatch.score}
            progress={roleMatch.score}
            suffix="%"
            tone="success"
          />
          <MetricCard
            label="Keywords matched"
            value={demonstrated.length}
            progress={
              analysis.keywords.length
                ? Math.round((demonstrated.length / analysis.keywords.length) * 100)
                : 0
            }
            suffix={`/${analysis.keywords.length}`}
            detail="unique contextual matches"
          />
        </div>

        <Tabs defaultValue="overview" className="mt-8">
          <div className="overflow-x-auto pb-1">
            <TabsList className="h-auto min-w-max justify-start">
              <TabsTrigger className="min-h-11" value="overview">
                Overview
              </TabsTrigger>
              <TabsTrigger className="min-h-11" value="keywords">
                Keywords
              </TabsTrigger>
              <TabsTrigger className="min-h-11" value="breakdown">
                Score breakdown
              </TabsTrigger>
              <TabsTrigger className="min-h-11" value="skillpath">
                SkillPath
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview" className="mt-5 space-y-5">
            <section className="surface-card p-6" aria-labelledby="career-overview-title">
              <h3 id="career-overview-title" className="font-semibold">
                Professional overview
              </h3>
              <p className="mt-3 text-sm leading-7 text-muted-foreground">
                This resume currently scores <strong>{analysis.overall}% job readiness</strong> for
                the <strong>{analysis.role}</strong> target. It demonstrates {demonstrated.length}{" "}
                of {analysis.keywords.length} priority competencies in meaningful context. The
                actions below focus on the weakest evidence areas and do not invent experience or
                results.
              </p>
            </section>

            <div className="grid gap-5 lg:grid-cols-2">
              <section className="surface-card p-6" aria-labelledby="strengths-title">
                <h3
                  id="strengths-title"
                  className="flex items-center gap-2 font-semibold text-success"
                >
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" /> Strengths
                </h3>
                {demonstrated.length ? (
                  <ul className="mt-4 space-y-3 text-sm">
                    {demonstrated.slice(0, 6).map((keyword) => (
                      <li key={keyword.key} className="flex gap-2">
                        <CheckCircle2
                          className="mt-0.5 h-4 w-4 shrink-0 text-success"
                          aria-hidden="true"
                        />
                        <span>
                          <strong>{keyword.name}:</strong>{" "}
                          {keyword.evidence[0] ?? "Relevant contextual evidence was detected."}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-3 text-sm text-muted-foreground">
                    No role-priority competency has enough contextual evidence yet.
                  </p>
                )}
              </section>

              <section className="surface-card p-6" aria-labelledby="weaknesses-title">
                <h3
                  id="weaknesses-title"
                  className="flex items-center gap-2 font-semibold text-warning"
                >
                  <AlertTriangle className="h-5 w-5" aria-hidden="true" /> Evidence gaps
                </h3>
                <ul className="mt-4 space-y-3 text-sm">
                  {(weaknesses.length ? weaknesses : ["No critical evidence gap detected."]).map(
                    (weakness) => (
                      <li key={weakness} className="flex gap-2">
                        <AlertCircle
                          className="mt-0.5 h-4 w-4 shrink-0 text-warning"
                          aria-hidden="true"
                        />
                        {weakness}
                      </li>
                    ),
                  )}
                </ul>
              </section>
            </div>

            <section className="surface-card p-6" aria-labelledby="suggestions-title">
              <h3 id="suggestions-title" className="font-semibold text-primary">
                Priority suggestions
              </h3>
              <ol className="mt-4 space-y-3 text-sm">
                {suggestions.map((suggestion, index) => (
                  <li key={suggestion} className="flex gap-3">
                    <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
                      {index + 1}
                    </span>
                    {suggestion}
                  </li>
                ))}
              </ol>
            </section>
          </TabsContent>

          <TabsContent value="keywords" className="mt-5">
            <KeywordCoverage analysis={analysis} />
          </TabsContent>

          <TabsContent
            value="breakdown"
            className="mt-5 rounded-2xl border bg-background p-5 sm:p-6"
          >
            <ScoreBreakdown analysis={analysis} />
          </TabsContent>

          <TabsContent value="skillpath" className="mt-5">
            <RoleCoursePath targetRole={analysis.role} />
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex items-start gap-3 rounded-xl border border-success/30 bg-success/10 p-4 text-sm">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
          <p>
            <strong>No score without an explanation.</strong> Component percentages and overall
            readiness use the same versioned deterministic result. Resume text is always treated as
            untrusted content.
          </p>
        </div>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  suffix,
  progress,
  detail,
  tone = "primary",
}: {
  label: string;
  value: number;
  suffix: string;
  progress: number;
  detail?: string;
  tone?: "primary" | "success";
}) {
  return (
    <section className="surface-card p-6" aria-label={`${label}: ${value}${suffix}`}>
      <p className="text-caption uppercase text-muted-foreground">{label}</p>
      <p
        className={`mt-2.5 font-display text-h1 tabular-nums ${tone === "success" ? "text-success" : "text-primary"}`}
      >
        {value}
        <span className="ml-0.5 text-body font-medium text-muted-foreground">{suffix}</span>
      </p>
      <Progress
        value={progress}
        aria-label={`${label}: ${progress} percent`}
        className="mt-4 h-1.5"
      />
      {detail && <p className="mt-2.5 text-small text-muted-foreground">{detail}</p>}
    </section>
  );
}
