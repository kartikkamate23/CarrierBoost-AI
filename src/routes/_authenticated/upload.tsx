import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { extractPdfText } from "@/lib/pdf-extract";
import { analyzeResume } from "@/lib/analyze.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MAX_BYTES = 5 * 1024 * 1024;

export const Route = createFileRoute("/_authenticated/upload")({
  component: UploadPage,
  head: () => ({ meta: [{ title: "Upload Resume — ResumeIQ" }] }),
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
      const filePath = `${user.id}/${Date.now()}-${file.name.replace(/[^\w.\-]/g, "_")}`;
      const up = await supabase.storage.from("resumes").upload(filePath, file, { contentType: "application/pdf" });
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
      const { reportId } = await runAnalyze({ data: { resumeId: resume.id, resumeText: text, targetRole: role } });

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

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold">Analyze a new resume</h1>
        <p className="mt-1 text-muted-foreground">Upload a PDF and choose the role you're targeting.</p>
      </motion.div>

      <div className="glass-strong space-y-6 rounded-2xl p-8">
        <div className="space-y-2">
          <Label htmlFor="role">Target role</Label>
          <Input
            id="role"
            placeholder="e.g. Senior Frontend Engineer"
            value={targetRole}
            onChange={(e) => setTargetRole(e.target.value)}
            maxLength={120}
            disabled={busy}
          />
        </div>

        <div className="space-y-2">
          <Label>Resume PDF (max 5 MB)</Label>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFile(e.dataTransfer.files?.[0] ?? null);
            }}
            className={`relative rounded-2xl border-2 border-dashed p-10 text-center transition ${
              dragOver ? "border-primary bg-primary/5" : "border-border bg-card/40"
            }`}
          >
            {file ? (
              <div className="flex items-center justify-center gap-3">
                <FileText className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">{file.name}</span>
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  className="rounded-full p-1 hover:bg-accent"
                  aria-label="Remove file"
                  disabled={busy}
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                <p className="mt-3 text-sm">Drag & drop your PDF here, or</p>
                <label className="mt-3 inline-block">
                  <input
                    type="file"
                    accept="application/pdf"
                    className="sr-only"
                    onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
                  />
                  <span className="cursor-pointer rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                    Browse files
                  </span>
                </label>
              </>
            )}
          </div>
        </div>

        <Button onClick={onSubmit} disabled={!file || busy} className="w-full btn-glow" size="lg">
          {busy && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {statusLabel}
        </Button>
      </div>
    </div>
  );
}
