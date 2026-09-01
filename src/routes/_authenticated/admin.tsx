import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, FileText, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { PageHeader, SectionHeader } from "@/components/patterns/page-header";
import { MetricCard, MetricGrid } from "@/components/patterns/metric-card";
import { EmptyState } from "@/components/patterns/empty-state";
import { SkeletonList, SkeletonMetricGrid } from "@/components/patterns/skeletons";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin | CareerBoost AI" }] }),
});

type ProfileRow = { id: string; full_name: string | null; created_at: string };
type ResumeRow = {
  id: string;
  file_name: string;
  file_size: number;
  created_at: string;
  user_id: string;
  target_role: string | null;
};

function AdminPage() {
  const { isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [profiles, setProfiles] = useState<ProfileRow[]>([]);
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) {
      toast.error("Admin access only.");
      navigate({ to: "/dashboard" });
      return;
    }
    Promise.all([
      supabase
        .from("profiles")
        .select("id, full_name, created_at")
        .order("created_at", { ascending: false }),
      supabase
        .from("resumes")
        .select("id, file_name, file_size, created_at, user_id, target_role")
        .order("created_at", { ascending: false }),
    ]).then(([p, r]) => {
      setProfiles((p.data as ProfileRow[] | null) ?? []);
      setResumes((r.data as ResumeRow[] | null) ?? []);
      setLoading(false);
    });
  }, [isAdmin, authLoading, navigate]);

  const deleteResume = async (id: string) => {
    if (!confirm("Delete this resume and its analysis?")) return;
    const { error } = await supabase.from("resumes").delete().eq("id", id);
    if (error) toast.error(error.message);
    else {
      setResumes((rs) => rs.filter((r) => r.id !== id));
      toast.success("Deleted.");
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Administration"
        title="Admin panel"
        description="Manage users and uploaded resumes."
      />

      {loading ? (
        <SkeletonMetricGrid count={2} />
      ) : (
        <MetricGrid columns={2}>
          <MetricCard icon={Users} label="Users" value={profiles.length} />
          <MetricCard icon={FileText} label="Resumes" value={resumes.length} tone="primary" />
        </MetricGrid>
      )}

      <section className="surface-card p-6" aria-labelledby="users-heading">
        <SectionHeader
          title={<span id="users-heading">All users</span>}
          description={`${profiles.length} ${profiles.length === 1 ? "profile" : "profiles"}, newest first.`}
        />
        <div className="mt-5">
          {loading ? (
            <SkeletonList count={4} />
          ) : profiles.length === 0 ? (
            <EmptyState size="sm" icon={Users} title="No users yet" />
          ) : (
            <div className="scrollbar-slim -mx-6 overflow-x-auto px-6">
              <table className="w-full min-w-[34rem] border-collapse text-left">
                <caption className="sr-only">All registered user profiles</caption>
                <thead>
                  <tr className="border-b">
                    <th scope="col" className="py-2.5 text-caption uppercase text-muted-foreground">
                      Name
                    </th>
                    <th scope="col" className="py-2.5 text-caption uppercase text-muted-foreground">
                      User ID
                    </th>
                    <th scope="col" className="py-2.5 text-caption uppercase text-muted-foreground">
                      Joined
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {profiles.map((p) => (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-3 text-small font-medium text-foreground">
                        {p.full_name ?? "—"}
                      </td>
                      <td className="py-3 font-mono text-small text-muted-foreground">
                        {p.id.slice(0, 8)}…
                      </td>
                      <td className="py-3 text-small text-muted-foreground">
                        {format(new Date(p.created_at), "MMM d, yyyy")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <section className="surface-card p-6" aria-labelledby="resumes-heading">
        <SectionHeader
          title={<span id="resumes-heading">All resumes</span>}
          description={`${resumes.length} ${resumes.length === 1 ? "file" : "files"}, newest first.`}
        />
        <div className="mt-5">
          {loading ? (
            <SkeletonList count={4} />
          ) : resumes.length === 0 ? (
            <EmptyState size="sm" icon={FileText} title="No resumes uploaded yet" />
          ) : (
            <div className="scrollbar-slim -mx-6 overflow-x-auto px-6">
              <table className="w-full min-w-[42rem] border-collapse text-left">
                <caption className="sr-only">All uploaded resumes</caption>
                <thead>
                  <tr className="border-b">
                    <th scope="col" className="py-2.5 text-caption uppercase text-muted-foreground">
                      File
                    </th>
                    <th scope="col" className="py-2.5 text-caption uppercase text-muted-foreground">
                      Target role
                    </th>
                    <th scope="col" className="py-2.5 text-caption uppercase text-muted-foreground">
                      Size
                    </th>
                    <th scope="col" className="py-2.5 text-caption uppercase text-muted-foreground">
                      Date
                    </th>
                    <th scope="col" className="py-2.5">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {resumes.map((r) => (
                    <tr key={r.id} className="border-b last:border-0">
                      <td className="max-w-xs truncate py-3 text-small font-medium text-foreground">
                        {r.file_name}
                      </td>
                      <td className="py-3 text-small text-muted-foreground">
                        {r.target_role ?? "—"}
                      </td>
                      <td className="py-3 text-small tabular-nums text-muted-foreground">
                        {(r.file_size / 1024).toFixed(0)} KB
                      </td>
                      <td className="py-3 text-small text-muted-foreground">
                        {format(new Date(r.created_at), "MMM d")}
                      </td>
                      <td className="py-3 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteResume(r.id)}
                          aria-label={`Delete ${r.file_name}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>

      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 rounded-md text-small text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        Back to dashboard
      </Link>
    </div>
  );
}
