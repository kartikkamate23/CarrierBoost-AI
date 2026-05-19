// AI analysis server function. Runs Gemini through the Lovable AI Gateway.
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const analysisSchema = z.object({
  resumeId: z.string().uuid(),
  resumeText: z.string().min(50).max(50000),
  targetRole: z.string().trim().min(1).max(120),
});

type AnalysisJSON = {
  ats_score: number;
  role_match_score: number;
  summary: string;
  skills: string[];
  strengths: string[];
  weaknesses: string[];
  matched_keywords: string[];
  missing_keywords: string[];
  suggestions: string[];
  grammar_feedback: string;
  formatting_feedback: string;
  job_recommendations: { title: string; reason: string }[];
};

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) and senior technical recruiter.
Analyze the resume against the target role and return STRICT JSON only (no markdown, no prose).

Schema:
{
  "ats_score": integer 0-100,
  "role_match_score": integer 0-100,
  "summary": "2-3 sentence professional summary of the candidate",
  "skills": ["array of 8-15 technical/professional skills found"],
  "strengths": ["array of 4-6 specific strengths"],
  "weaknesses": ["array of 3-5 honest weaknesses"],
  "matched_keywords": ["10-20 keywords from the resume that align with the role"],
  "missing_keywords": ["6-12 important keywords missing for this role"],
  "suggestions": ["5-8 concrete, actionable improvement suggestions"],
  "grammar_feedback": "1-2 paragraphs on grammar, spelling, tone",
  "formatting_feedback": "1-2 paragraphs on structure, length, readability for ATS",
  "job_recommendations": [{"title": "Job title", "reason": "Why this fits"}] (3-5 items)
}

Be honest, specific, and constructive. Use the candidate's actual content.`;

export const analyzeResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => analysisSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      throw new Error("AI service is not configured.");
    }

    // Verify resume belongs to user (RLS will also enforce on insert)
    const { data: resume, error: rErr } = await supabase
      .from("resumes")
      .select("id, user_id")
      .eq("id", data.resumeId)
      .single();
    if (rErr || !resume) throw new Error("Resume not found.");
    if (resume.user_id !== userId) throw new Error("Forbidden");

    const userPrompt = `TARGET ROLE: ${data.targetRole}\n\nRESUME TEXT:\n${data.resumeText}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: userPrompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (res.status === 429) throw new Error("Rate limit exceeded. Please try again in a moment.");
    if (res.status === 402) throw new Error("AI credits exhausted. Please add credits to your workspace.");
    if (!res.ok) {
      const txt = await res.text();
      console.error("AI gateway error", res.status, txt);
      throw new Error("AI analysis failed. Please try again.");
    }

    const payload = await res.json();
    const content: string = payload.choices?.[0]?.message?.content ?? "{}";

    let parsed: AnalysisJSON;
    try {
      parsed = JSON.parse(content);
    } catch {
      console.error("Failed to parse AI JSON", content.slice(0, 500));
      throw new Error("AI returned malformed response. Please try again.");
    }

    // Insert analysis report
    const { data: report, error: iErr } = await supabase
      .from("analysis_reports")
      .insert({
        resume_id: data.resumeId,
        user_id: userId,
        target_role: data.targetRole,
        ats_score: Math.max(0, Math.min(100, Math.round(parsed.ats_score ?? 0))),
        role_match_score: Math.max(0, Math.min(100, Math.round(parsed.role_match_score ?? 0))),
        summary: parsed.summary ?? "",
        skills: parsed.skills ?? [],
        strengths: parsed.strengths ?? [],
        weaknesses: parsed.weaknesses ?? [],
        matched_keywords: parsed.matched_keywords ?? [],
        missing_keywords: parsed.missing_keywords ?? [],
        suggestions: parsed.suggestions ?? [],
        grammar_feedback: parsed.grammar_feedback ?? "",
        formatting_feedback: parsed.formatting_feedback ?? "",
        job_recommendations: parsed.job_recommendations ?? [],
      })
      .select("id")
      .single();

    if (iErr || !report) {
      console.error("Failed to save report", iErr);
      throw new Error("Failed to save analysis report.");
    }

    // Also save target role on resume for history display
    await supabase.from("resumes").update({ target_role: data.targetRole }).eq("id", data.resumeId);

    return { reportId: report.id };
  });
