import { createFileRoute } from "@tanstack/react-router";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { findBrihatLabsCourse } from "@/lib/brihatlabs-courses";

type CompletionEvent = {
  eventId?: unknown;
  learnerEmail?: unknown;
  courseSlug?: unknown;
  status?: unknown;
  progressPercent?: unknown;
  completedAt?: unknown;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function expectedSignature(body: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(body)));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export const Route = createFileRoute("/api/hitavir-completion")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env.HITAVIR_WEBHOOK_SECRET;
        if (!secret) {
          return Response.json(
            { error: "course completion sync is not configured." },
            { status: 503 },
          );
        }

        const rawBody = await request.text();
        const suppliedSignature = (request.headers.get("x-hitavir-signature") ?? "").replace(
          /^sha256=/i,
          "",
        );
        const signature = await expectedSignature(rawBody, secret);
        if (!suppliedSignature || !constantTimeEqual(signature, suppliedSignature.toLowerCase())) {
          return Response.json({ error: "Invalid signature." }, { status: 401 });
        }

        let event: CompletionEvent;
        try {
          event = JSON.parse(rawBody) as CompletionEvent;
        } catch {
          return Response.json({ error: "Invalid JSON body." }, { status: 400 });
        }

        const eventId = typeof event.eventId === "string" ? event.eventId.trim() : "";
        const learnerEmail =
          typeof event.learnerEmail === "string" ? event.learnerEmail.trim().toLowerCase() : "";
        const requestedSlug = typeof event.courseSlug === "string" ? event.courseSlug.trim() : "";
        const course = findBrihatLabsCourse(requestedSlug);
        const status = event.status === "completed" ? "completed" : "in_progress";

        if (!eventId || eventId.length > 160 || !emailPattern.test(learnerEmail) || !course) {
          return Response.json({ error: "Invalid completion event." }, { status: 400 });
        }

        const suppliedProgress =
          typeof event.progressPercent === "number" && Number.isFinite(event.progressPercent)
            ? Math.round(event.progressPercent)
            : 0;
        const progressPercent =
          status === "completed" ? 100 : Math.max(0, Math.min(99, suppliedProgress));
        const completedAt =
          status === "completed" &&
          typeof event.completedAt === "string" &&
          !Number.isNaN(Date.parse(event.completedAt))
            ? new Date(event.completedAt).toISOString()
            : status === "completed"
              ? new Date().toISOString()
              : null;

        const now = new Date().toISOString();
        const { error } = await supabaseAdmin.from("hitavir_course_progress").upsert(
          {
            learner_email: learnerEmail,
            course_slug: course.id,
            status,
            progress_percent: progressPercent,
            completed_at: completedAt,
            source_event_id: eventId,
            last_event_at: now,
            updated_at: now,
          },
          { onConflict: "learner_email,course_slug" },
        );

        if (error) {
          console.error("[course completion webhook]", error);
          return Response.json({ error: "Unable to store completion event." }, { status: 500 });
        }

        return Response.json({ accepted: true, courseSlug: course.id, status });
      },
    },
  },
});
