import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Copy, Download, FileText, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { extractPdfText } from "@/lib/pdf-extract";
import { generateCoverLetter } from "@/lib/cover-letter.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

type StoredLetter = {
  id: string;
  target_role: string;
  company: string | null;
  content: string;
  created_at: string;
};

type ResumeOption = { id: string; file_name: string; extracted_text: string | null };

export const Route = createFileRoute("/_authenticated/tools/cover-letter")({
  validateSearch: (s: Record<string, unknown>) => ({ role: (s.role as string) ?? "" }),
  component: CoverLetterPage,
  head: () => ({ meta: [{ title: "Cover Letter Generator — CareerBoost AI" }] }),
});

function CoverLetterPage() {
  const { user } = useAuth();
  const { role: initialRole } = Route.useSearch();
  const run = useServerFn(generateCoverLetter);

  const [resumes, setResumes] = useState<ResumeOption[]>([]);
  const [letters, setLetters] = useState<StoredLetter[]>([]);
  const [resumeId, setResumeId] = useState<string>("");
  const [pastedText, setPastedText] = useState("");
  const [role, setRole] = useState(initialRole);
  const [company, setCompany] = useState("");
  const [tone, setTone] = useState<"professional" | "enthusiastic" | "concise">("professional");
  const [output, setOutput] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("resumes")
      .select("id, file_name, extracted_text")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20)
      .then(({ data }) => setResumes((data as ResumeOption[] | null) ?? []));
    supabase
      .from("cover_letters")
      .select("id, target_role, company, content, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(10)
      .then(({ data }) => setLetters((data as StoredLetter[] | null) ?? []));
  }, [user]);

  const handlePdf = async (f: File | null | undefined) => {
    if (!f) return;
    if (f.type !== "application/pdf") return toast.error("PDF only.");
    if (f.size > 5 * 1024 * 1024) return toast.error("Max 5 MB.");
    setUploading(true);
    try {
      const t = await extractPdfText(f);
      if (t.length < 50) toast.error("Couldn't read enough text.");
      else { setPastedText(t); setResumeId(""); toast.success("PDF parsed."); }
    } catch {
      toast.error("Failed to read PDF.");
    } finally {
      setUploading(false);
    }
  };

  const resolveResumeText = (): { text: string; id?: string } | null => {
    if (resumeId) {
      const r = resumes.find((x) => x.id === resumeId);
      if (r?.extracted_text) return { text: r.extracted_text, id: r.id };
    }
    if (pastedText.trim().length >= 50) return { text: pastedText.trim() };
    return null;
  };

  const generate = async () => {
    const src = resolveResumeText();
    if (!src) return toast.error("Add resume text (select one or upload/paste).");
    if (role.trim().length < 2) return toast.error("Enter target role.");
    setBusy(true);
    setOutput("");
    try {
      const res = await run({
        data: {
          resumeId: src.id,
          resumeText: src.text,
          targetRole: role.trim(),
          company: company.trim() || undefined,
          tone,
        },
      });
      setOutput(res.content);
      toast.success("Cover letter ready!");
      const { data } = await supabase
        .from("cover_letters")
        .select("id, target_role, company, content, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(10);
      setLetters((data as StoredLetter[] | null) ?? []);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed.");
    } finally {
      setBusy(false);
    }
  };

  const copy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const downloadTxt = (text: string) => {
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cover-letter-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteLetter = async (id: string) => {
    if (!confirm("Delete this cover letter?")) return;
    const { error } = await supabase.from("cover_letters").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { setLetters((l) => l.filter((x) => x.id !== id)); toast.success("Deleted"); }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">AI Cover Letter Generator</h1>
        <p className="mt-1 text-muted-foreground">Tailored to your resume and target role in seconds.</p>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="glass-strong rounded-2xl p-6 space-y-4">
          <div className="space-y-2">
            <Label>Resume source</Label>
            {resumes.length > 0 && (
              <Select value={resumeId} onValueChange={(v) => { setResumeId(v); setPastedText(""); }}>
                <SelectTrigger><SelectValue placeholder="Choose a previous resume" /></SelectTrigger>
                <SelectContent>
                  {resumes.map((r) => <SelectItem key={r.id} value={r.id}>{r.file_name}</SelectItem>)}
                </SelectContent>
              </Select>
            )}
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />or upload / paste<span className="h-px flex-1 bg-border" /></div>
            <label className="flex items-center justify-center rounded-lg border-2 border-dashed border-border p-4 text-sm text-muted-foreground hover:border-primary cursor-pointer">
              <input type="file" accept="application/pdf" className="sr-only" onChange={(e) => handlePdf(e.target.files?.[0])} disabled={uploading} />
              {uploading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Reading PDF…</> : <><FileText className="mr-2 h-4 w-4" />Upload resume PDF</>}
            </label>
            <Textarea
              placeholder="…or paste your resume text here"
              value={pastedText}
              onChange={(e) => { setPastedText(e.target.value); setResumeId(""); }}
              className="min-h-32"
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="role">Target role</Label>
              <Input id="role" value={role} onChange={(e) => setRole(e.target.value)} placeholder="Frontend Engineer" maxLength={120} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="co">Company (optional)</Label>
              <Input id="co" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Inc." maxLength={120} />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                <SelectItem value="concise">Concise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button onClick={generate} disabled={busy} className="w-full btn-glow" size="lg">
            {busy ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Generating…</> : <><Sparkles className="mr-2 h-4 w-4" />Generate cover letter</>}
          </Button>
        </div>

        <div className="glass-strong rounded-2xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Output</h2>
            {output && (
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" onClick={() => copy(output)}><Copy className="h-4 w-4" /></Button>
                <Button size="sm" variant="ghost" onClick={() => downloadTxt(output)}><Download className="h-4 w-4" /></Button>
              </div>
            )}
          </div>
          <Textarea
            value={output}
            onChange={(e) => setOutput(e.target.value)}
            placeholder="Your cover letter will appear here — fully editable."
            className="min-h-[28rem] font-mono text-sm"
          />
        </div>
      </div>

      {letters.length > 0 && (
        <div className="glass-strong rounded-2xl p-6">
          <h2 className="mb-4 font-semibold">Recent cover letters</h2>
          <div className="space-y-3">
            {letters.map((l) => (
              <div key={l.id} className="rounded-xl border border-border/60 bg-card/60 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-sm">{l.target_role} {l.company && <span className="text-muted-foreground">· {l.company}</span>}</p>
                    <p className="text-xs text-muted-foreground">{format(new Date(l.created_at), "MMM d, yyyy 'at' h:mm a")}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setOutput(l.content)}>Open</Button>
                    <Button size="sm" variant="ghost" onClick={() => copy(l.content)}><Copy className="h-4 w-4" /></Button>
                    <Button size="sm" variant="ghost" onClick={() => deleteLetter(l.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
