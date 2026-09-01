import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { ArrowUpRight, Clock, FileText, Target, TrendingUp, Upload } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionHeader } from "@/components/patterns/page-header";
import { MetricCard, MetricGrid } from "@/components/patterns/metric-card";
import { EmptyState } from "@/components/patterns/empty-state";
import { SkeletonList, SkeletonMetricGrid } from "@/components/patterns/skeletons";
import { Skeleton } from "@/components/ui/skeleton";
import { slideUp, stagger } from "@/lib/motion";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: Dashboard,
  head: () => ({ meta: [{ title: "Overview | CareerBoost AI" }] }),
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
      .select(
        "id, ats_score, role_match_score, target_role, created_at, resume_id, resumes(file_name)",
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setReports((data as Report[] | null) ?? []);
        setLoading(false);
      });
  }, [user]);

  const avgAts = reports.length
    ? Math.round(reports.reduce((s, r) => s + r.ats_score, 0) / reports.length)
    : 0;
  const bestAts = reports.reduce((m, r) => Math.max(m, r.ats_score), 0);
  const chartData = [...reports].reverse().map((r, i) => ({
    name: `#${i + 1}`,
    ats: r.ats_score,
    match: r.role_match_score,
  }));

  // Display-only: the signup form already stores full_name in user metadata.
  // No extra request is made — this reads the session already in memory.
  const displayName =
    (user?.user_metadata?.full_name as string | undefined)?.trim().split(" ")[0] ?? null;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Overview"
        title={displayName ? `Welcome back, ${displayName}` : "Welcome back"}
        description="Every analysis you have saved, and how your scores have moved over time."
        actions={
          <Button asChild size="lg" className="btn-glow h-11">
            <Link to="/upload">
              <Upload className="h-4 w-4" aria-hidden="true" />
              New analysis
            </Link>
          </Button>
        }
      />

      {loading ? (
        <SkeletonMetricGrid />
      ) : (
        <motion.div initial="hidden" animate="visible" variants={stagger(0.05)}>
          <MetricGrid>
            <motion.div variants={slideUp}>
              <MetricCard icon={FileText} label="Total analyses" value={reports.length} />
            </motion.div>
            <motion.div variants={slideUp}>
              <MetricCard
                icon={TrendingUp}
                label="Average ATS"
                value={avgAts}
                suffix="/100"
                tone="primary"
                progress={avgAts}
              />
            </motion.div>
            <motion.div variants={slideUp}>
              <MetricCard
                icon={Target}
                label="Best score"
                value={bestAts}
                suffix="/100"
                tone="success"
                progress={bestAts}
              />
            </motion.div>
            <motion.div variants={slideUp}>
              <MetricCard
                icon={Clock}
                label="Last upload"
                value={reports[0] ? format(new Date(reports[0].created_at), "MMM d") : "—"}
                compact
                detail={
                  reports[0]
                    ? format(new Date(reports[0].created_at), "yyyy")
                    : "No analysis saved yet"
                }
              />
            </motion.div>
          </MetricGrid>
        </motion.div>
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <section className="surface-card p-6" aria-labelledby="trend-heading">
          <SectionHeader
            title={<span id="trend-heading">Score trend</span>}
            description={
              chartData.length
                ? `ATS and role-match across your last ${chartData.length} ${
                    chartData.length === 1 ? "analysis" : "analyses"
                  }.`
                : "ATS and role-match scores appear here once you save an analysis."
            }
          />

          <div className="mt-6 h-72">
            {loading ? (
              <div className="flex h-full items-end gap-2.5" aria-hidden="true">
                {["45%", "62%", "54%", "78%", "60%", "84%"].map((height, index) => (
                  <Skeleton key={index} className="flex-1 rounded-t-md" style={{ height }} />
                ))}
              </div>
            ) : chartData.length === 0 ? (
              <EmptyState
                icon={TrendingUp}
                title="No trend yet"
                description="Save your first analysis and your scores will start charting here."
                action={
                  <Button asChild>
                    <Link to="/upload">
                      <Upload className="h-4 w-4" aria-hidden="true" />
                      Analyze a resume
                    </Link>
                  </Button>
                }
                className="h-full"
              />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -18 }}>
                  <defs>
                    <linearGradient id="fillAts" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="fillMatch" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.24} />
                      <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="4 4"
                    stroke="var(--color-border)"
                    vertical={false}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={6}
                  />
                  <YAxis
                    domain={[0, 100]}
                    stroke="var(--color-muted-foreground)"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    width={44}
                  />
                  <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--color-border)" }} />
                  <Area
                    type="monotone"
                    dataKey="ats"
                    name="ATS"
                    stroke="var(--color-chart-1)"
                    strokeWidth={2.5}
                    fill="url(#fillAts)"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="match"
                    name="Match"
                    stroke="var(--color-chart-2)"
                    strokeWidth={2.5}
                    fill="url(#fillMatch)"
                    dot={false}
                    activeDot={{ r: 4, strokeWidth: 2 }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>

          {chartData.length > 0 ? (
            <ul className="mt-5 flex flex-wrap gap-x-6 gap-y-2 border-t pt-4">
              <LegendKey color="var(--color-chart-1)" label="ATS score" />
              <LegendKey color="var(--color-chart-2)" label="Role match" />
            </ul>
          ) : null}
        </section>

        <section className="surface-card p-6" aria-labelledby="recent-heading">
          <SectionHeader
            title={<span id="recent-heading">Recent analyses</span>}
            description="Your six most recent saved reports."
          />

          <div className="mt-5">
            {loading ? (
              <SkeletonList count={4} />
            ) : reports.length === 0 ? (
              <EmptyState
                size="sm"
                icon={FileText}
                title="Nothing saved yet"
                description="Analyses you run while signed in are saved here."
              />
            ) : (
              <ul className="space-y-2.5">
                {reports.slice(0, 6).map((r) => (
                  <li key={r.id}>
                    <Link
                      to="/analysis/$reportId"
                      params={{ reportId: r.id }}
                      className="lift group block rounded-xl border border-border bg-card p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <p className="min-w-0 truncate text-small font-semibold text-foreground">
                          {r.resumes?.file_name ?? "Resume"}
                        </p>
                        <ArrowUpRight
                          className="h-4 w-4 shrink-0 text-muted-foreground transition-colors group-hover:text-primary"
                          aria-hidden="true"
                        />
                      </div>
                      <p className="mt-1 truncate text-small text-muted-foreground">
                        {r.target_role ?? "—"}
                      </p>
                      <div className="mt-3 flex items-center justify-between gap-3">
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-caption normal-case tracking-normal tabular-nums text-primary">
                          ATS {r.ats_score}/100
                        </span>
                        <span className="shrink-0 text-small text-muted-foreground">
                          {format(new Date(r.created_at), "MMM d")}
                        </span>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function LegendKey({ color, label }: { color: string; label: string }) {
  return (
    <li className="inline-flex items-center gap-2 text-small text-muted-foreground">
      <span
        className="h-2.5 w-2.5 shrink-0 rounded-full"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      {label}
    </li>
  );
}

/** Presentational Recharts tooltip matching the design system. */
function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name?: string; value?: number; color?: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-border bg-popover p-3 shadow-[var(--shadow-elevated)]">
      <p className="text-caption uppercase text-muted-foreground">Analysis {label}</p>
      <ul className="mt-2 space-y-1">
        {payload.map((entry) => (
          <li key={entry.name} className="flex items-center gap-2.5 text-small">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: entry.color }}
              aria-hidden="true"
            />
            <span className="text-muted-foreground">{entry.name}</span>
            <strong className="ml-auto tabular-nums text-foreground">{entry.value}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
