import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { FileText, Upload, TrendingUp, Target, Clock } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Dashboard — ResumeIQ" }] }),
});

type Report = {
  id: string;
  ats_score: number;
  role_match_score: number;
  target_role: string | null;
  created_at: string;
  resume_id: string;
  resumes: { file_name: string } | null;
};

function Dashboard() {
  const { user } = useAuth();
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("analysis_reports")
      .select("id, ats_score, role_match_score, target_role, created_at, resume_id, resumes(file_name)")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setReports((data as Report[] | null) ?? []);
        setLoading(false);
      });
  }, [user]);

  const avgAts = reports.length ? Math.round(reports.reduce((s, r) => s + r.ats_score, 0) / reports.length) : 0;
  const bestAts = reports.reduce((m, r) => Math.max(m, r.ats_score), 0);
  const chartData = [...reports].reverse().map((r, i) => ({
    name: `#${i + 1}`,
    ats: r.ats_score,
    match: r.role_match_score,
  }));

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="mt-1 text-muted-foreground">Track your resume scores over time.</p>
        </div>
        <Link to="/upload"><Button size="lg" className="btn-glow"><Upload className="mr-2 h-4 w-4" />New analysis</Button></Link>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard icon={FileText} label="Total analyses" value={reports.length} />
        <StatCard icon={TrendingUp} label="Average ATS" value={avgAts} suffix="/100" tone="primary" />
        <StatCard icon={Target} label="Best score" value={bestAts} suffix="/100" tone="success" />
        <StatCard icon={Clock} label="Last upload" value={reports[0] ? format(new Date(reports[0].created_at), "MMM d") : "—"} small />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-strong rounded-2xl p-6 lg:col-span-2">
          <h2 className="font-semibold">ATS score trend</h2>
          <p className="text-sm text-muted-foreground">Your last {chartData.length} analyses</p>
          <div className="mt-4 h-64">
            {chartData.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Upload your first resume to see your trend.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="name" stroke="var(--color-muted-foreground)" fontSize={12} />
                  <YAxis domain={[0, 100]} stroke="var(--color-muted-foreground)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      background: "var(--color-card)",
                      border: "1px solid var(--color-border)",
                      borderRadius: "0.75rem",
                    }}
                  />
                  <Line type="monotone" dataKey="ats" stroke="var(--color-primary)" strokeWidth={3} dot={{ r: 4 }} name="ATS" />
                  <Line type="monotone" dataKey="match" stroke="var(--color-success)" strokeWidth={3} dot={{ r: 4 }} name="Match" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <h2 className="font-semibold">Recent uploads</h2>
          <div className="mt-4 space-y-3">
            {loading && <p className="text-sm text-muted-foreground">Loading…</p>}
            {!loading && reports.length === 0 && <p className="text-sm text-muted-foreground">No uploads yet.</p>}
            {reports.slice(0, 6).map((r) => (
              <Link
                key={r.id}
                to="/analysis/$reportId"
                params={{ reportId: r.id }}
                className="block rounded-xl border border-border/60 bg-card/60 p-3 transition hover:border-primary/50 hover:bg-accent/30"
              >
                <p className="truncate text-sm font-medium">{r.resumes?.file_name ?? "Resume"}</p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{r.target_role ?? "—"}</p>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="font-semibold text-primary">{r.ats_score}/100</span>
                  <span className="text-muted-foreground">{format(new Date(r.created_at), "MMM d")}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  suffix,
  tone = "default",
  small = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  suffix?: string;
  tone?: "default" | "primary" | "success";
  small?: boolean;
}) {
  const toneClass = tone === "primary" ? "text-primary" : tone === "success" ? "text-success" : "text-foreground";
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </div>
      <p className={`mt-3 font-bold ${toneClass} ${small ? "text-2xl" : "text-4xl"}`}>
        {value}
        {suffix && <span className="text-base font-medium text-muted-foreground">{suffix}</span>}
      </p>
    </div>
  );
}
