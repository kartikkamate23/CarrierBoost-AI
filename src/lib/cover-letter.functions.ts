import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const inputSchema = z.object({
  resumeId: z.string().uuid().optional(),
  resumeText: z.string().trim().min(50).max(50000),
  targetRole: z.string().trim().min(1).max(120),
  company: z.string().trim().max(120).optional(),
  tone: z.enum(["professional", "enthusiastic", "concise"]).default("professional"),
});

export const generateCoverLetter = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("AI service is not configured.");

    const system = `You are an expert career coach writing personalized cover letters.
Write a single cover letter (no preamble, no markdown) in a ${data.tone} tone, 3-4 short paragraphs, ~280-360 words.
Use specifics from the candidate's resume. Address the hiring team at ${data.company || "the company"}.
End with a clear call-to-action and the candidate's name placeholder "[Your Name]".`;

    const user = `TARGET ROLE: ${data.targetRole}
COMPANY: ${data.company || "(not specified)"}

RESUME:
${data.resumeText}`;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
      }),
    });

    if (res.status === 429) throw new Error("Rate limit exceeded. Please try again shortly.");
    if (res.status === 402) throw new Error("AI credits exhausted. Add credits to continue.");
    if (!res.ok) {
      console.error("AI gateway error", res.status, await res.text());
      throw new Error("Cover letter generation failed.");
    }

    const payload = await res.json();
    const content: string = (payload.choices?.[0]?.message?.content ?? "").trim();
    if (!content) throw new Error("Empty response from AI.");

    const { data: row, error } = await supabase
      .from("cover_letters")
      .insert({
        user_id: userId,
        resume_id: data.resumeId ?? null,
        target_role: data.targetRole,
        company: data.company ?? null,
        content,
      })
      .select("id, content, created_at")
      .single();

    if (error || !row) {
      console.error("Failed to save cover letter", error);
      throw new Error("Failed to save cover letter.");
    }
    return { id: row.id, content: row.content };
  });
