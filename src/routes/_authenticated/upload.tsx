import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, Loader2, ShieldCheck, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { saveTargetRole } from "@/lib/target-role";
import { useAuth } from "@/hooks/use-auth";
import { extractPdfText } from "@/lib/pdf-extract";
import { analyzeResume } from "@/lib/analyze.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader } from "@/components/patterns/page-header";
import { cn } from "@/lib/utils";

const MAX_BYTES = 5 * 1024 * 1024;

export const Route = createFileRoute("/_authenticated/upload")({
  component: UploadPage,
  head: () => ({ meta: [{ title: "ResumeIQ Upload | CareerBoost AI" }] }),
});

function UploadPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const runAnalyze = useServerFn(analyzeResume);
  const [file, setFile] = useState<File | null>(null);
  const [targetRole, setTargetRole] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [status, setStatus] = useState<"" | "extracting" | "uploading" | "analyzing">("");

  const handleFile = useCallback((f: File | null) => {
    if (!f) return;
    if (f.type !== "application/pdf") {
      toast.error("Only PDF files are supported.");
      return;
    }
    if (f.size > MAX_BYTES) {
      toast.error("File must be under 5 MB.");
      return;
    }
    setFile(f);
  }, []);

  const onSubmit = async () => {
    if (!user || !file) return;
    const role = targetRole.trim();
    saveTargetRole(role);
    const parsed = z.string().min(2).max(120).safeParse(role);
    if (!parsed.success) {
      toast.error("Please enter a target role (2–120 chars).");
      return;
    }

    try {
      setStatus("extracting");
      const text = await extractPdfText(file);
      if (text.length < 50) {
        toast.error("Couldn't extract enough text — is the PDF scanned/image-based?");
        setStatus("");
        return;
      }

      setStatus("uploading");
      const filePath = `${user.id}/${Date.now()}-${file.name.replace(/[^\w.-]/g, "_")}`;
      const up = await supabase.storage
        .from("resumes")
        .upload(filePath, file, { contentType: "application/pdf" });
      if (up.error) throw up.error;

      const { data: resume, error: rErr } = await supabase
        .from("resumes")
        .insert({
          user_id: user.id,
          file_name: file.name,
          file_path: filePath,
          file_size: file.size,
          extracted_text: text,
          target_role: role,
        })
        .select("id")
        .single();
      if (rErr || !resume) throw rErr ?? new Error("Failed to save resume");

      setStatus("analyzing");
      const { reportId } = await runAnalyze({
        data: { resumeId: resume.id, resumeText: text, targetRole: role },
      });

      toast.success("Analysis complete!");
      navigate({ to: "/analysis/$reportId", params: { reportId } });
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      toast.error(msg);
      setStatus("");
    }
  };

  const busy = status !== "";
  const statusLabel = {
    "": "Analyze resume",
    extracting: "Reading PDF…",
    uploading: "Uploading…",
    analyzing: "Analyzing with AI…",
  }[status];

  const steps = [
    { key: "extracting", label: "Reading PDF" },
    { key: "uploading", label: "Uploading securely" },
    { key: "analyzing", label: "Analyzing with AI" },
  ] as const;
  const activeStep = steps.findIndex((step) => step.key === status);

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <PageHeader
        eyebrow="ResumeIQ"
        title="Analyze a new resume"
        description="Upload a PDF and name the role you are targeting. The report is saved to your dashboard."
      />

      <div className="surface-card p-6 sm:p-8">
        <div className="space-y-2">
          <Label htmlFor="role" className="text-small font-medium">
            Target role
          </Label>
          <Input
            id="role"
            placeholder="e.g. Senior Frontend Engineer"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            maxLength={120}
            disabled={busy}
            className="h-11"
          />
          <p className="text-small text-muted-foreground">
            Scoring is relative to this role, so be as specific as the job posting.
          </p>
        </div>

        <div className="mt-7 space-y-2">
          <Label className="text-small font-medium">Resume PDF</Label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files?.[0] ?? null);
            }}
            className={cn(
              "relative rounded-2xl border-2 border-dashed p-8 text-center transition-colors sm:p-12",
              dragOver
                ? "border-primary bg-primary/5"
                : "border-border bg-muted/30 hover:border-primary/40",
            )}
          >
            {file ? (
              <div className="flex flex-wrap items-center justify-center gap-3">
                <span
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"
                  aria-hidden="true"
                >
                  <FileText className="h-5 w-5" />
                </span>
                <div className="min-w-0 text-left">
                  <p className="truncate text-small font-semibold text-foreground">{file.name}</p>
                  <p className="text-small text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB · PDF
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label="Remove file"
                  disabled={busy}
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ) : (
              <>
                <span
                  className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-card text-muted-foreground shadow-sm"
                  aria-hidden="true"
                >
                  <Upload className="h-6 w-6" />
                </span>
                <p className="mt-4 text-body font-medium text-foreground">
                  Drag and drop your PDF here
                </p>
                <p className="mt-1 text-small text-muted-foreground">
                  PDF only, up to 5 MB. Scanned PDFs need OCR first.
                </p>
                <label className="mt-5 inline-block">
                  <input
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  />
                  <span className="inline-flex min-h-11 cursor-pointer items-center rounded-lg bg-primary px-5 text-small font-medium text-primary-foreground transition-opacity hover:opacity-90">
                    Browse files
                  </span>
                </label>
              </>
            )}
          </div>
        </div>

        {busy ? (
          <ol className="mt-7 space-y-2.5" aria-live="polite">
            {steps.map((step, index) => {
              const done = index < activeStep;
              const current = index === activeStep;
              return (
                <li
                  key={step.key}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border p-3 text-small transition-colors",
                    current
                      ? "border-primary/40 bg-primary/5 text-foreground"
                      : done
                        ? "border-success/30 bg-success/5 text-muted-foreground"
                        : "border-border text-muted-foreground",
                  )}
                >
                  {done ? (
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success" aria-hidden="true" />
                  ) : current ? (
                    <Loader2
                      className="h-4 w-4 shrink-0 animate-spin text-primary"
                      aria-hidden="true"
                    />
                  ) : (
                    <span
                      className="h-4 w-4 shrink-0 rounded-full border border-current opacity-40"
                      aria-hidden="true"
                    />
                  )}
                  {step.label}
                </li>
              );
            })}
          </ol>
        ) : null}

        <Button
          onClick={onSubmit}
          disabled={!file || busy}
          className="btn-glow mt-7 h-12 w-full text-body"
          size="lg"
        >
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
          {statusLabel}
        </Button>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-start gap-2.5 text-small leading-6 text-muted-foreground"
      >
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
        Signed-in uploads are stored privately against your account and can be deleted. Analysis is
        sent to the configured AI provider only when you run it.
      </motion.p>
    </div>
  );
}
