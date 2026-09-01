import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader, SectionHeader } from "@/components/patterns/page-header";
import { EmptyState } from "@/components/patterns/empty-state";

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
      else {
        setPastedText(t);
        setResumeId("");
        toast.success("PDF parsed.");
      }
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
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Clipboard access is unavailable. Select the text and copy it manually.");
    }
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
    else {
      setLetters((l) => l.filter((x) => x.id !== id));
      toast.success("Deleted");
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <PageHeader
        eyebrow="ResumeIQ tools"
        title="AI cover letter generator"
        description="Tailored to a saved resume and your target role, in a professional, enthusiastic or concise tone."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Composer */}
        <section className="surface-card p-6" aria-labelledby="composer-heading">
          <SectionHeader
            title={<span id="composer-heading">Source and settings</span>}
            description="Pick a saved resume, or upload and paste text for a one-off letter."
          />

          <div className="mt-5 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="saved-resume" className="text-small font-medium">
                Resume source
              </Label>
              {resumes.length > 0 && (
                <Select
                  value={resumeId}
                  onValueChange={(v) => {
                    setResumeId(v);
                    setPastedText("");
                  }}
                >
                  <SelectTrigger id="saved-resume" className="h-11">
                    <SelectValue placeholder="Choose a previous resume" />
                  </SelectTrigger>
                  <SelectContent>
                    {resumes.map((r) => (
                      <SelectItem key={r.id} value={r.id}>
                        {r.file_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <div
                className="flex items-center gap-3 py-1 text-caption uppercase text-muted-foreground"
                aria-hidden="true"
              >
                <span className="h-px flex-1 bg-border" />
                or upload / paste
                <span className="h-px flex-1 bg-border" />
              </div>

              <label className="flex min-h-20 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 p-4 text-small text-muted-foreground transition-colors hover:border-primary/40 focus-within:ring-2 focus-within:ring-ring">
                <input
                  type="file"
                  accept="application/pdf"
                  className="sr-only"
                  onChange={(e) => handlePdf(e.target.files?.[0])}
                  disabled={uploading}
                />
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    Reading PDF…
                  </>
                ) : (
                  <>
                    <FileText className="h-4 w-4" aria-hidden="true" />
                    Upload resume PDF
                  </>
                )}
              </label>

              <Label htmlFor="pasted-resume" className="sr-only">
                Pasted resume text
              </Label>
              <Textarea
                id="pasted-resume"
                placeholder="…or paste your resume text here"
                value={pastedText}
                onChange={(e) => {
                  setPastedText(e.target.value);
                  setResumeId("");
                }}
                className="min-h-32"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="role" className="text-small font-medium">
                  Target role
                </Label>
                <Input
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Frontend Engineer"
                  maxLength={120}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="co" className="text-small font-medium">
                  Company <span className="font-normal text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="co"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Acme Inc."
                  maxLength={120}
                  className="h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cover-letter-tone" className="text-small font-medium">
                Tone
              </Label>
              <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                <SelectTrigger id="cover-letter-tone" className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="concise">Concise</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={generate}
              disabled={busy}
              className="btn-glow h-12 w-full text-body"
              size="lg"
            >
              {busy ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Generating…
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" aria-hidden="true" />
                  Generate cover letter
                </>
              )}
            </Button>
          </div>
        </section>

        {/* Output */}
        <section className="surface-card flex flex-col p-6" aria-labelledby="output-heading">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="output-heading" className="font-display text-h3 text-foreground">
                Output
              </h2>
              <p className="mt-1 text-small text-muted-foreground">
                Fully editable before you send it.
              </p>
            </div>
            {output && (
              <div className="flex gap-1">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copy(output)}
                  aria-label="Copy generated cover letter"
                >
                  <Copy className="h-4 w-4" aria-hidden="true" /> Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => downloadTxt(output)}
                  aria-label="Download generated cover letter"
                >
                  <Download className="h-4 w-4" aria-hidden="true" /> .txt
                </Button>
              </div>
            )}
          </div>

          <Label htmlFor="cover-letter-output" className="sr-only">
            Generated cover letter output
          </Label>

          <div className="relative mt-5 flex-1">
            <Textarea
              id="cover-letter-output"
              value={output}
              onChange={(e) => setOutput(e.target.value)}
              placeholder="Your cover letter will appear here — fully editable."
              className="min-h-[26rem] leading-7"
            />
            {busy ? (
              <div
                className="absolute inset-0 grid place-items-center rounded-md bg-card/75 backdrop-blur-sm"
                aria-live="polite"
              >
                <div className="text-center">
                  <Loader2
                    className="mx-auto h-5 w-5 animate-spin text-primary"
                    aria-hidden="true"
                  />
                  <p className="mt-3 text-small font-medium text-foreground">
                    Writing your cover letter…
                  </p>
                  <p className="mt-1 text-small text-muted-foreground">
                    This usually takes a few seconds.
                  </p>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </div>

      <section className="surface-card p-6" aria-labelledby="recent-letters-heading">
        <SectionHeader
          title={<span id="recent-letters-heading">Recent cover letters</span>}
          description="Your ten most recent saved letters."
        />

        <div className="mt-5">
          {letters.length === 0 ? (
            <EmptyState
              size="sm"
              icon={FileText}
              title="No cover letters yet"
              description="Letters you generate are saved to your account and listed here."
            />
          ) : (
            <ul className="space-y-2.5">
              {letters.map((l) => (
                <li
                  key={l.id}
                  className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border bg-card p-4"
                >
                  <div className="min-w-0">
                    <p className="truncate text-small font-semibold text-foreground">
                      {l.target_role}
                      {l.company && (
                        <span className="font-normal text-muted-foreground"> · {l.company}</span>
                      )}
                    </p>
                    <p className="mt-0.5 text-small text-muted-foreground">
                      {format(new Date(l.created_at), "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <Button size="sm" variant="ghost" onClick={() => setOutput(l.content)}>
                      Open
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copy(l.content)}
                      aria-label={`Copy cover letter for ${l.target_role}`}
                    >
                      <Copy className="h-4 w-4" aria-hidden="true" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => deleteLetter(l.id)}
                      aria-label={`Delete cover letter for ${l.target_role}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" aria-hidden="true" />
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
