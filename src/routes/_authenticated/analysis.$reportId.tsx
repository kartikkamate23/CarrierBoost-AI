import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Target,
  FileText,
  Briefcase,
  Map,
  GraduationCap,
  Youtube,
  MessageSquare,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeywordCoverage, ScoreBreakdown } from "@/components/analysis-refinement";
import { EmptyState } from "@/components/patterns/empty-state";
import { SkeletonMetricGrid, SkeletonPageHeader } from "@/components/patterns/skeletons";
import { RoleCoursePath } from "@/components/role-course-path";
import { createRoadmap, type CareerAnalysis } from "@/lib/career-engine";
import { hitavirCoursePath, recommendHitavirCourses } from "@/lib/hitavir-courses";

export const Route = createFileRoute("/_authenticated/analysis/$reportId")({
  component: AnalysisPage,
  head: () => ({ meta: [{ title: "ResumeIQ Analysis | CareerBoost AI" }] }),
});

type Roadmap = { stage: string; timeframe: string; items: string[]; url?: string };
type SkillGap = { have: string[]; missing: string[]; priority: string[] };
type IQ = { category: string; difficulty: string; question: string; answer_hint: string };
type Course = {
  title: string;
  platform: string;
  level: string;
  duration: string;
  free: boolean;
  access?: string;
  url?: string;
};
type Vid = { title: string; topic: string; query: string };

type Report = {
  id: string;
  ats_score: number;
  role_match_score: number;
  target_role: string | null;
  summary: string | null;
  skills: string[];
  strengths: string[];
  weaknesses: string[];
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: string[];
  grammar_feedback: string | null;
  formatting_feedback: string | null;
  job_recommendations: { title: string; reason: string; type?: string }[];
  career_roadmap: Roadmap[];
  skill_gap: SkillGap;
  interview_questions: IQ[];
  recommended_courses: Course[];
  reference_videos: Vid[];
  created_at: string;
  resumes: { file_name: string } | null;
  score_breakdown: CareerAnalysis | null;
};

function getHitavirRecommendations(report: Report): Course[] {
  const skillKeys = report.score_breakdown?.gaps.map((gap) => gap.key) ?? report.missing_keywords;
  return recommendHitavirCourses(skillKeys, 6, report.target_role ?? "").map((course) => ({
    title: course.title,
    platform: "Hitavir Tech",
    level: course.categories.includes("Foundations") ? "Beginner" : "All levels",
    duration: course.duration,
    free: false,
    access: "Enrolled access",
    url: hitavirCoursePath(course.id),
  }));
}

function getHitavirRoadmap(report: Report): Roadmap[] {
  if (!report.score_breakdown) return report.career_roadmap;
  const stages = ["Foundation", "Core skills", "Applied practice", "Career proof"];
  return createRoadmap(report.score_breakdown, {
    role: report.target_role ?? "Target role",
    weeks: 4,
    hoursPerWeek: 6,
    level: "Intermediate",
    style: "Hands-on",
  }).map((week, index) => ({
    stage: stages[index],
    timeframe: `Week ${week.week}`,
    items: week.items,
    url: week.course.url,
  }));
}

function AnalysisPage() {
  const { reportId } = useParams({ from: "/_authenticated/analysis/$reportId" });
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("analysis_reports")
      .select("*, resumes(file_name)")
      .eq("id", reportId)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error || !data) toast.error("Report not found.");
        else setReport(data as unknown as Report);
        setLoading(false);
      });
  }, [reportId]);

  const downloadPdf = async () => {
    if (!report) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    let y = 50;

    doc
      .setFontSize(20)
      .setFont("helvetica", "bold")
      .text("CareerBoost AI — Analysis Report", 40, y);
    y += 24;
    doc.setFontSize(11).setFont("helvetica", "normal").setTextColor(100);
    doc.text(`${report.resumes?.file_name ?? "Resume"} · ${report.target_role ?? ""}`, 40, y);
    y += 28;
    doc.setTextColor(0);

    doc
      .setFontSize(14)
      .setFont("helvetica", "bold")
      .text(`ATS Score: ${report.ats_score}/100`, 40, y);
    doc.text(`Role Match: ${report.role_match_score}%`, w / 2, y);
    y += 24;

    const writeBlock = (title: string, lines: string[]) => {
      if (lines.length === 0) return;
      doc.setFontSize(13).setFont("helvetica", "bold").text(title, 40, y);
      y += 18;
      doc.setFontSize(10).setFont("helvetica", "normal");
      for (const line of lines) {
        const wrapped = doc.splitTextToSize(line, w - 80);
        for (const wl of wrapped) {
          if (y > 780) {
            doc.addPage();
            y = 50;
          }
          doc.text(wl, 40, y);
          y += 14;
        }
      }
      y += 8;
    };

    writeBlock("Summary", report.summary ? [report.summary] : []);
    writeBlock(
      "Strengths",
      report.strengths.map((s) => `• ${s}`),
    );
    writeBlock(
      "Weaknesses",
      report.weaknesses.map((s) => `• ${s}`),
    );
    writeBlock(
      "Missing keywords",
      report.missing_keywords.map((s) => `• ${s}`),
    );
    writeBlock(
      "Suggestions",
      report.suggestions.map((s) => `• ${s}`),
    );
    writeBlock("Grammar feedback", report.grammar_feedback ? [report.grammar_feedback] : []);
    writeBlock(
      "Formatting feedback",
      report.formatting_feedback ? [report.formatting_feedback] : [],
    );
    writeBlock(
      "Career roadmap",
      getHitavirRoadmap(report).flatMap((r) => [
        `${r.stage} (${r.timeframe})`,
        ...r.items.map((i) => `  • ${i}`),
      ]),
    );
    writeBlock("Priority skills to learn", report.skill_gap?.priority?.map((s) => `• ${s}`) ?? []);
    writeBlock(
      "Recommended courses",
      getHitavirRecommendations(report).map(
        (c) =>
          `• ${c.title} — ${c.platform} (${c.level}, ${c.duration})${c.access ? ` [${c.access}]` : c.free ? " [Free]" : ""}`,
      ),
    );

    doc.save(`careerboost-report-${report.id.slice(0, 8)}.pdf`);
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <SkeletonPageHeader />
        <SkeletonMetricGrid count={3} />
      </div>
    );
  }
  if (!report) {
    return (
      <EmptyState
        icon={FileText}
        title="Report not found"
        description="This analysis may have been deleted, or it belongs to another account."
        action={
          <Button asChild variant="outline">
            <Link to="/dashboard">Back to dashboard</Link>
          </Button>
        }
      />
    );
  }
  const refinedAnalysis = report.score_breakdown;
  const displayedCourses = getHitavirRecommendations(report);
  const displayedRoadmap = getHitavirRoadmap(report);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          to="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to dashboard
        </Link>
        <div className="flex gap-2">
          <Button asChild variant="outline">
            <Link to="/tools/cover-letter" search={{ role: report.target_role ?? "" }}>
              <FileText className="mr-2 h-4 w-4" /> Cover letter
            </Link>
          </Button>
          <Button onClick={downloadPdf} variant="outline">
            <Download className="mr-2 h-4 w-4" /> Download PDF
          </Button>
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="font-display text-h2 text-foreground">
          {report.resumes?.file_name ?? "Resume analysis"}
        </h1>
        <p className="mt-2 text-body text-muted-foreground">
          Target role: <span className="font-medium text-foreground">{report.target_role}</span>
        </p>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3">
        <ScoreCard label="ATS Score" value={report.ats_score} />
        <ScoreCard label="Role Match" value={report.role_match_score} suffix="%" tone="success" />
        <div className="surface-card p-6">
          <p className="text-caption uppercase text-muted-foreground">Keywords</p>
          <p className="mt-2.5 font-display text-h1 tabular-nums text-foreground">
            {report.matched_keywords.length}
            <span className="ml-0.5 text-body font-medium text-muted-foreground">
              /{report.matched_keywords.length + report.missing_keywords.length}
            </span>
          </p>
          <p className="mt-2.5 text-small text-muted-foreground">matched in context</p>
        </div>
      </div>

      {refinedAnalysis && refinedAnalysis.scores.length > 0 && (
        <section className="space-y-8" aria-label="Refined evidence analysis">
          <KeywordCoverage analysis={refinedAnalysis} />
          <ScoreBreakdown analysis={refinedAnalysis} />
        </section>
      )}

      <Tabs defaultValue="overview" className="space-y-6">
        {/*
          Below md the tab strip scrolls horizontally inside its own container,
          so eight tabs never wrap into several rows or push the page sideways.
          From md upward it wraps as before. The negative margin + padding keeps
          the focus ring of the first and last tab from being clipped.
        */}
        <div className="scrollbar-slim -mx-1 overflow-x-auto px-1 md:mx-0 md:overflow-x-visible md:px-0">
          <TabsList className="flex h-auto w-max min-w-full flex-nowrap justify-start gap-1 bg-transparent p-0 md:w-full md:flex-wrap">
            {[
              { v: "overview", label: "Overview" },
              { v: "keywords", label: "Keywords" },
              { v: "roadmap", label: "Roadmap" },
              { v: "skills", label: "SkillPath" },
              { v: "interview", label: "Interview" },
              { v: "courses", label: "Courses" },
              { v: "videos", label: "Videos" },
              { v: "jobs", label: "Jobs" },
            ].map((t) => (
              <TabsTrigger
                key={t.v}
                value={t.v}
                className="min-h-11 shrink-0 rounded-full px-4 text-small transition-colors data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value="overview" className="space-y-6">
          {report.summary && (
            <Section title="Professional Summary" icon={FileText}>
              <p className="text-sm leading-relaxed">{report.summary}</p>
            </Section>
          )}
          <div className="grid gap-6 md:grid-cols-2">
            <Section title="Strengths" icon={CheckCircle2} tone="success">
              <ul className="space-y-2 text-sm">
                {report.strengths.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                    {s}
                  </li>
                ))}
              </ul>
            </Section>
            <Section title="Weaknesses" icon={AlertCircle} tone="warning">
              <ul className="space-y-2 text-sm">
                {report.weaknesses.map((s, i) => (
                  <li key={i} className="flex gap-2">
                    <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" />
                    {s}
                  </li>
                ))}
              </ul>
            </Section>
          </div>
          <Section title="AI Suggestions" icon={Sparkles}>
            <ol className="space-y-3 text-sm">
              {report.suggestions.map((s, i) => (
                <li key={i} className="flex gap-3">
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </Section>
          <div className="grid gap-6 md:grid-cols-2">
            <Section title="Grammar & Tone" icon={FileText}>
              <p className="text-sm leading-relaxed">{report.grammar_feedback}</p>
            </Section>
            <Section title="Formatting" icon={FileText}>
              <p className="text-sm leading-relaxed">{report.formatting_feedback}</p>
            </Section>
          </div>
        </TabsContent>

        <TabsContent value="keywords">
          <Section title="Keyword Scanner" icon={Target}>
            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-success">
                  Matched ({report.matched_keywords.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {report.matched_keywords.map((k, i) => (
                    <Badge
                      key={i}
                      variant="secondary"
                      className="bg-success/15 text-success border-success/30"
                    >
                      {k}
                    </Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-medium uppercase tracking-wider text-warning">
                  Missing ({report.missing_keywords.length})
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {report.missing_keywords.map((k, i) => (
                    <Badge key={i} variant="outline" className="border-warning/40 text-warning">
                      {k}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </Section>
        </TabsContent>

        <TabsContent value="roadmap">
          <Section title="Career Roadmap" icon={Map}>
            {displayedRoadmap.length === 0 ? (
              <Empty msg="No roadmap generated." />
            ) : (
              <div className="relative space-y-5">
                {displayedRoadmap.map((r, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.07 }}
                    className="rounded-xl border border-border/60 bg-card/60 p-5"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <h3 className="font-semibold text-primary">{r.stage}</h3>
                      <Badge variant="outline">{r.timeframe}</Badge>
                    </div>
                    <ul className="space-y-1.5 text-sm">
                      {r.items.map((it, j) => (
                        <li key={j} className="flex gap-2">
                          <span className="text-primary">→</span>
                          {it}
                        </li>
                      ))}
                    </ul>
                    {r.url && (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-4 inline-flex items-center text-xs font-medium text-primary hover:underline"
                      >
                        Open Hitavir Tech course <ExternalLink className="ml-1.5 h-3.5 w-3.5" />
                      </a>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </Section>
        </TabsContent>

        <TabsContent value="skills">
          <RoleCoursePath targetRole={report.target_role ?? "Target role"} />
        </TabsContent>

        <TabsContent value="interview">
          <Section title="Interview Question Bank" icon={MessageSquare}>
            {report.interview_questions.length === 0 ? (
              <Empty msg="No interview questions yet." />
            ) : (
              <div className="space-y-3">
                {report.interview_questions.map((q, i) => (
                  <details
                    key={i}
                    className="group rounded-xl border border-border/60 bg-card/60 p-4 open:bg-card"
                  >
                    <summary className="flex cursor-pointer items-start justify-between gap-3 list-none">
                      <span className="text-sm font-medium">{q.question}</span>
                      <div className="flex flex-shrink-0 gap-1.5">
                        <Badge variant="outline" className="text-xs">
                          {q.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {q.difficulty}
                        </Badge>
                      </div>
                    </summary>
                    <p className="mt-3 text-sm text-muted-foreground border-t border-border/60 pt-3">
                      <span className="font-medium text-foreground">Answer hint: </span>
                      {q.answer_hint}
                    </p>
                  </details>
                ))}
              </div>
            )}
          </Section>
        </TabsContent>

        <TabsContent value="courses">
          <Section title="Recommended Courses" icon={GraduationCap}>
            {displayedCourses.length === 0 ? (
              <Empty msg="No courses recommended." />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {displayedCourses.map((c, i) => (
                  <div key={i} className="rounded-xl border border-border/60 bg-card/60 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold text-sm">{c.title}</p>
                      <Badge variant="outline">{c.access ?? (c.free ? "Free" : "Course")}</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {c.platform} · {c.level} · {c.duration}
                    </p>
                    {c.url && (
                      <a
                        href={c.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 inline-block text-xs text-primary hover:underline"
                      >
                        Visit course →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </Section>
        </TabsContent>

        <TabsContent value="videos">
          <Section title="Reference Videos" icon={Youtube}>
            {report.reference_videos.length === 0 ? (
              <Empty msg="No videos suggested." />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {report.reference_videos.map((v, i) => (
                  <a
                    key={i}
                    href={`https://www.youtube.com/results?search_query=${encodeURIComponent(v.query)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group rounded-xl border border-border/60 bg-card/60 p-4 transition hover:border-primary/50 hover:bg-accent/30"
                  >
                    <div className="flex items-start gap-3">
                      <div className="grid h-10 w-10 flex-shrink-0 place-items-center rounded-lg bg-destructive/15 text-destructive">
                        <Youtube className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-sm font-medium group-hover:text-primary">{v.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {v.topic} · Search YouTube →
                        </p>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </Section>
        </TabsContent>

        <TabsContent value="jobs">
          <Section title="Job Recommendations" icon={Briefcase}>
            {report.job_recommendations.length === 0 ? (
              <Empty msg="No job suggestions." />
            ) : (
              <div className="grid gap-3 sm:grid-cols-2">
                {report.job_recommendations.map((j, i) => (
                  <div key={i} className="rounded-xl border border-border/60 bg-card/60 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-semibold">{j.title}</p>
                      {j.type && (
                        <Badge variant="outline" className="text-xs">
                          {j.type}
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{j.reason}</p>
                    <a
                      href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(j.title)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center text-xs font-medium text-primary hover:underline"
                    >
                      Search on LinkedIn →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </Section>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Empty({ msg }: { msg: string }) {
  return <p className="py-8 text-center text-small text-muted-foreground">{msg}</p>;
}

function ScoreCard({
  label,
  value,
  suffix = "/100",
  tone = "primary",
}: {
  label: string;
  value: number;
  suffix?: string;
  tone?: "primary" | "success";
}) {
  const color = tone === "success" ? "text-success" : "text-primary";
  return (
    <div className="surface-card p-6">
      <p className="text-caption uppercase text-muted-foreground">{label}</p>
      <p className={`mt-2.5 font-display text-h1 tabular-nums ${color}`}>
        {value}
        <span className="ml-0.5 text-body font-medium text-muted-foreground">{suffix}</span>
      </p>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-muted">
        <div
          className={`h-full rounded-full ${tone === "success" ? "bg-success" : "bg-primary"}`}
          style={{ width: `${Math.min(100, value)}%` }}
        />
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
  tone,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  tone?: "success" | "warning";
}) {
  const accent =
    tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-primary";
  return (
    <motion.section
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="surface-card p-6"
    >
      <h2 className="mb-4 flex items-center gap-2.5 font-display text-h3 text-foreground">
        <span
          className={`grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-muted ${accent}`}
          aria-hidden="true"
        >
          <Icon className="h-4 w-4" />
        </span>
        {title}
      </h2>
      {children}
    </motion.section>
  );
}
