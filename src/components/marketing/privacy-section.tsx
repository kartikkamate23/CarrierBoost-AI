import { Link } from "@tanstack/react-router";
import { ArrowRight, BarChart3, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { Reveal, RevealItem } from "@/components/marketing/section";

/**
 * Compact trust strip.
 *
 * Every claim below is restated from behavior the application already has, and
 * matches the wording of the published notice at /privacy:
 *
 *  - Guest analysis runs in the browser; the file and extracted text are not
 *    uploaded by the guest analyzer. Signed-in files are stored privately and
 *    can be permanently deleted by the user.
 *  - Each rubric dimension exposes detected evidence, the missing signal, the
 *    recommended action and the expected gain, alongside a rubric version.
 *  - Resume content is sent to an AI provider only when an AI-powered feature
 *    is requested, and is not used for model training without separate,
 *    explicit consent.
 *
 * No guarantee is stated here that the product does not already make.
 */
const pillars = [
  {
    icon: ShieldCheck,
    title: "Private by design",
    body: "Guest analysis runs in your browser — the file and the text pulled from it are never uploaded. Signed-in resumes are stored privately and you can delete them permanently.",
  },
  {
    icon: BarChart3,
    title: "Every score explained",
    body: "No unexplained numbers. Each dimension shows the evidence detected, the signal that is missing, the recommended action and the gain you can expect, against a stated rubric version.",
  },
  {
    icon: SlidersHorizontal,
    title: "No training by default",
    body: "Resume content reaches an AI provider only when you ask for an AI feature, and is never used for model training without separate, explicit consent.",
  },
];

export function PrivacySection() {
  return (
    <section className="border-b">
      <div className="container mx-auto max-w-7xl px-4 py-16">
        <Reveal className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => (
            <RevealItem key={pillar.title} className="surface-card lift flex h-full flex-col p-6">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-success/10 text-success"
                aria-hidden="true"
              >
                <pillar.icon className="h-5 w-5" />
              </span>
              <h2 className="mt-5 font-display text-h3 text-foreground">{pillar.title}</h2>
              <p className="mt-2.5 flex-1 text-small leading-6 text-muted-foreground">
                {pillar.body}
              </p>
            </RevealItem>
          ))}
        </Reveal>

        <div className="mt-6 text-center">
          <Link
            to="/privacy"
            className="inline-flex items-center gap-1.5 rounded-md text-small font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Read the full privacy notice
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
