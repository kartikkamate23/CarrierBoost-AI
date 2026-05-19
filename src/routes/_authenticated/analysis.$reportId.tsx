import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, CheckCircle2, AlertCircle, Sparkles, Target, FileText, Briefcase } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/_authenticated/analysis/$reportId")({
  component: AnalysisPage,
  head: () => ({ meta: [{ title: "Analysis Report — ResumeIQ" }] }),
});

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
  job_recommendations: { title: string; reason: string }[];
  created_at: string;
  resumes: { file_name: string } | null;
};

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
        if (error || !data) {
          toast.error("Report not found.");
        } else {
          setReport(data as unknown as Report);
        }
        setLoading(false);
      });
  }, [reportId]);

  const downloadPdf = async () => {
    if (!report) return;
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const w = doc.internal.pageSize.getWidth();
    let y = 50;

    doc.setFontSize(20).setFont("helvetica", "bold").text("ResumeIQ — Analysis Report", 40, y);
    y += 24;
    doc.setFontSize(11).setFont("helvetica", "normal").setTextColor(100);
    doc.text(`${report.resumes?.file_name ?? "Resume"} · ${report.target_role ?? ""}`, 40, y);
    y += 28;
    doc.setTextColor(0);

    doc.setFontSize(14).setFont("helvetica", "bold").text(`ATS Score: ${report.ats_score}/100`, 40, y);
    doc.text(`Role Match: ${report.role_match_score}%`, w / 2, y);
    y += 24;

    const section = (title: string, items: string[] | string | null) => {
      if (!items || (Array.isArray(items) && items.length === 0)) return;
      doc.setFontSize(13).setFont("helvetica", "bold").text(title, 40, y);
      y += 18;
      doc.setFontSize(10).setFont("helvetica", "normal");
      const arr = Array.isArray(items) ? items.map((i) => `• ${i}`) : [items];
      for (const line of arr) {
        const wrapped = doc.splitTextToSize(line, w - 80);
        for (const w2 of wrapped) {
          if (y > 780) { doc.addPage(); y = 50; }
          doc.text(w2, 40, y);
          y += 14;
        }
      }
      y += 8;
    };

    section("Summary", report.summary);
    section("Strengths", report.strengths);
    section("Weaknesses", report.weaknesses);
    section("Missing keywords", report.missing_keywords);
    section("Suggestions", report.suggestions);
    section("Grammar feedback", report.grammar_feedback);
    section("Formatting feedback", report.formatting_feedback);

    doc.save(`resumeiq-report-${report.id.slice(0, 8)}.pdf`);
  };

  if (loading) return <p className="text-muted-foreground">Loading…</p>;
  if (!report) {
    return (
      <div className="glass-strong rounded-2xl p-10 text-center">
        <p>Report not found.</p>
        <Link to="/dashboard"><Button variant="outline" className="mt-4">Back to dashboard</Button></Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to dashboard
        </Link>
        <Button onClick={downloadPdf} variant="outline"><Download className="mr-2 h-4 w-4" /> Download PDF</Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">{report.resumes?.file_name ?? "Resume analysis"}</h1>
        <p className="mt-1 text-muted-foreground">Target role: <span className="font-medium text-foreground">{report.target_role}</span></p>
      </motion.div>

      <div className="grid gap-5 md:grid-cols-3">
        <ScoreCard label="ATS Score" value={report.ats_score} />
        <ScoreCard label="Role Match" value={report.role_match_score} suffix="%" tone="success" />
        <div className="glass rounded-2xl p-5">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">Keywords</p>
          <p className="mt-2 text-4xl font-bold">
            {report.matched_keywords.length}
            <span className="text-base text-muted-foreground">/{report.matched_keywords.length + report.missing_keywords.length}</span>
          </p>
          <p className="text-sm text-muted-foreground">matched</p>
        </div>
      </div>

      {report.summary && (
        <Section title="Professional Summary" icon={FileText}>
          <p className="text-sm leading-relaxed">{report.summary}</p>
        </Section>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Section title="Strengths" icon={CheckCircle2} tone="success">
          <ul className="space-y-2 text-sm">
            {report.strengths.map((s, i) => <li key={i} className="flex gap-2"><CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />{s}</li>)}
          </ul>
        </Section>
        <Section title="Weaknesses" icon={AlertCircle} tone="warning">
          <ul className="space-y-2 text-sm">
            {report.weaknesses.map((s, i) => <li key={i} className="flex gap-2"><AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-warning" />{s}</li>)}
          </ul>
        </Section>
      </div>

      <Section title="Keyword Scanner" icon={Target}>
        <div className="space-y-4">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-success">Matched ({report.matched_keywords.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {report.matched_keywords.map((k, i) => <Badge key={i} variant="secondary" className="bg-success/15 text-success border-success/30">{k}</Badge>)}
            </div>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-warning">Missing ({report.missing_keywords.length})</p>
            <div className="flex flex-wrap gap-1.5">
              {report.missing_keywords.map((k, i) => <Badge key={i} variant="outline" className="border-warning/40 text-warning">{k}</Badge>)}
            </div>
          </div>
        </div>
      </Section>

      <Section title="AI Suggestions" icon={Sparkles}>
        <ol className="space-y-3 text-sm">
          {report.suggestions.map((s, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-primary/15 text-xs font-semibold text-primary">{i + 1}</span>
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

      {report.job_recommendations.length > 0 && (
        <Section title="Job Recommendations" icon={Briefcase}>
          <div className="grid gap-3 sm:grid-cols-2">
            {report.job_recommendations.map((j, i) => (
              <div key={i} className="rounded-xl border border-border/60 bg-card/60 p-4">
                <p className="font-semibold">{j.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{j.reason}</p>
              </div>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

function ScoreCard({ label, value, suffix = "/100", tone = "primary" }: { label: string; value: number; suffix?: string; tone?: "primary" | "success" }) {
  const color = tone === "success" ? "text-success" : "text-primary";
  return (
    <div className="glass-strong rounded-2xl p-6">
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className={`mt-2 text-5xl font-bold ${color}`}>{value}<span className="text-xl text-muted-foreground">{suffix}</span></p>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
        <div className={`h-full ${tone === "success" ? "bg-success" : "bg-primary"}`} style={{ width: `${Math.min(100, value)}%` }} />
      </div>
    </div>
  );
}

function Section({ title, icon: Icon, children, tone }: { title: string; icon: React.ComponentType<{ className?: string }>; children: React.ReactNode; tone?: "success" | "warning" }) {
  const accent = tone === "success" ? "text-success" : tone === "warning" ? "text-warning" : "text-primary";
  return (
    <motion.section initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="glass-strong rounded-2xl p-6">
      <h2 className="mb-4 flex items-center gap-2 font-semibold"><Icon className={`h-5 w-5 ${accent}`} /> {title}</h2>
      {children}
    </motion.section>
  );
}
