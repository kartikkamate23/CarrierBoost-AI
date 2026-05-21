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
  job_recommendations: { title: string; reason: string; type?: string }[];
  career_roadmap: { stage: string; timeframe: string; items: string[] }[];
  skill_gap: { have: string[]; missing: string[]; priority: string[] };
  interview_questions: { category: string; difficulty: string; question: string; answer_hint: string }[];
  recommended_courses: { title: string; platform: string; level: string; duration: string; free: boolean; url?: string }[];
  reference_videos: { title: string; topic: string; query: string }[];
};

const SYSTEM_PROMPT = `You are an expert ATS (Applicant Tracking System) analyst, senior technical recruiter, and career coach.
Analyze the resume against the target role and return STRICT JSON only (no markdown, no prose, no code fences).

Use this exact schema. All arrays must be populated with realistic, specific, actionable content based on the resume and role.

{
  "ats_score": <int 0-100>,
  "role_match_score": <int 0-100>,
  "summary": "<2-3 sentence professional summary of the candidate>",
  "skills": ["8-15 technical/professional skills found"],
  "strengths": ["4-6 specific strengths"],
  "weaknesses": ["3-5 honest weaknesses"],
  "matched_keywords": ["10-20 keywords from the resume aligned with the role"],
  "missing_keywords": ["6-12 important keywords missing for this role"],
  "suggestions": ["5-8 concrete, actionable improvement suggestions"],
  "grammar_feedback": "<1-2 paragraphs on grammar, spelling, tone>",
  "formatting_feedback": "<1-2 paragraphs on structure, length, ATS readability>",
  "job_recommendations": [
    {"title": "Job title", "reason": "Why this fits", "type": "Full-time | Internship | Contract"}
  ],
  "career_roadmap": [
    {"stage": "Beginner | Intermediate | Advanced | Expert", "timeframe": "e.g. 1 month / 3 months / 6 months / 1 year", "items": ["3-5 concrete learning or work milestones"]}
  ],
  "skill_gap": {
    "have": ["5-10 skills candidate already has for the role"],
    "missing": ["5-10 skills the candidate is missing for the role"],
    "priority": ["3-5 high-priority skills to learn first"]
  },
  "interview_questions": [
    {"category": "HR | Technical | Behavioral", "difficulty": "Easy | Medium | Hard", "question": "...", "answer_hint": "1-2 sentence guidance"}
  ],
  "recommended_courses": [
    {"title": "Course title", "platform": "Coursera | Udemy | freeCodeCamp | Google | edX | Pluralsight", "level": "Beginner | Intermediate | Advanced", "duration": "e.g. 4 weeks", "free": true|false, "url": "optional homepage URL"}
  ],
  "reference_videos": [
    {"title": "Video topic title", "topic": "Resume | Interview | Skill | Career", "query": "YouTube search query that returns a great real video for this"}
  ]
}

Rules:
- Provide 4 entries in career_roadmap (Beginner, Intermediate, Advanced, Expert).
- Provide 8-12 interview_questions covering all three categories.
- Provide 5-8 recommended_courses.
- Provide 4-6 reference_videos.
- Be honest, specific, and constructive. Use the candidate's actual content.
- Output ONLY the JSON object, nothing else.`;

export const analyzeResume = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => analysisSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI service is not configured.");

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
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
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
        career_roadmap: parsed.career_roadmap ?? [],
        skill_gap: parsed.skill_gap ?? { have: [], missing: [], priority: [] },
        interview_questions: parsed.interview_questions ?? [],
        recommended_courses: parsed.recommended_courses ?? [],
        reference_videos: parsed.reference_videos ?? [],
      })
      .select("id")
      .single();

    if (iErr || !report) {
      console.error("Failed to save report", iErr);
      throw new Error("Failed to save analysis report.");
    }

    await supabase.from("resumes").update({ target_role: data.targetRole }).eq("id", data.resumeId);

    return { reportId: report.id };
  });
