import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Trash2, Users, FileText } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/admin")({
  component: AdminPage,
  head: () => ({ meta: [{ title: "Admin — ResumeIQ" }] }),
});

type ProfileRow = { id: string; full_name: string | null; created_at: string };
type ResumeRow = { id: string; file_name: string; file_size: number; created_at: string; user_id: string; target_role: string | null };

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
      supabase.from("profiles").select("id, full_name, created_at").order("created_at", { ascending: false }),
      supabase.from("resumes").select("id, file_name, file_size, created_at, user_id, target_role").order("created_at", { ascending: false }),
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
      <div>
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="mt-1 text-muted-foreground">Manage users and uploaded resumes.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="glass rounded-2xl p-5"><div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground"><Users className="h-3.5 w-3.5" /> Users</div><p className="mt-3 text-4xl font-bold">{profiles.length}</p></div>
        <div className="glass rounded-2xl p-5"><div className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground"><FileText className="h-3.5 w-3.5" /> Resumes</div><p className="mt-3 text-4xl font-bold">{resumes.length}</p></div>
      </div>

      <section className="glass-strong rounded-2xl p-6">
        <h2 className="mb-4 font-semibold">All users</h2>
        {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="py-2">Name</th><th>User ID</th><th>Joined</th></tr>
              </thead>
              <tbody>
                {profiles.map((p) => (
                  <tr key={p.id} className="border-t border-border/60">
                    <td className="py-2.5 font-medium">{p.full_name ?? "—"}</td>
                    <td className="font-mono text-xs text-muted-foreground">{p.id.slice(0, 8)}…</td>
                    <td className="text-muted-foreground">{format(new Date(p.created_at), "MMM d, yyyy")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="glass-strong rounded-2xl p-6">
        <h2 className="mb-4 font-semibold">All resumes</h2>
        {loading ? <p className="text-sm text-muted-foreground">Loading…</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase tracking-wider text-muted-foreground">
                <tr><th className="py-2">File</th><th>Target role</th><th>Size</th><th>Date</th><th></th></tr>
              </thead>
              <tbody>
                {resumes.map((r) => (
                  <tr key={r.id} className="border-t border-border/60">
                    <td className="py-2.5 max-w-xs truncate font-medium">{r.file_name}</td>
                    <td className="text-muted-foreground">{r.target_role ?? "—"}</td>
                    <td className="text-muted-foreground">{(r.file_size / 1024).toFixed(0)} KB</td>
                    <td className="text-muted-foreground">{format(new Date(r.created_at), "MMM d")}</td>
                    <td>
                      <Button size="sm" variant="ghost" onClick={() => deleteResume(r.id)} aria-label="Delete">
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Link to="/dashboard" className="inline-block text-sm text-muted-foreground hover:text-foreground">← Back to dashboard</Link>
    </div>
  );
}
