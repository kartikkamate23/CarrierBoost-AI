import { Info, Quote } from "lucide-react";
import { Section, SectionHeading, Reveal, RevealItem } from "@/components/marketing/section";

/**
 * IMPORTANT: these are written examples of how the product is intended to be
 * used, not statements from real people. CareerBoost AI has no collected
 * testimonials yet, so nothing here is attributed to a real user, no photograph
 * is used, and the section is labelled as illustrative in the UI itself.
 *
 * Replace this array with verified quotes once they exist.
 */
const examples = [
  {
    initials: "DA",
    role: "Data analyst moving into data engineering",
    quote:
      "The score mattered less than the sentence underneath it. Seeing that orchestration was never demonstrated anywhere in my resume told me exactly what to build next.",
  },
  {
    initials: "CS",
    role: "Final-year computer science student",
    quote:
      "Being able to run the analysis without creating an account meant I actually tried it. The roadmap gave me something to do that week rather than a vague list of skills.",
  },
  {
    initials: "BE",
    role: "Backend developer preparing for interviews",
    quote:
      "The mentor kept asking what I had already tried instead of pasting an answer. Slower, but I could explain the reasoning out loud afterwards.",
  },
];

export function TestimonialsSection() {
  return (
    <Section>
      <SectionHeading
        eyebrow="Illustrative scenarios"
        title="How the platform is meant to be used."
        body="We would rather show you the intended experience than publish testimonials we cannot verify."
      />

      <div className="mx-auto mt-8 flex max-w-2xl items-start gap-3 rounded-xl border border-border bg-muted/40 p-4">
        <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
        <p className="text-small leading-6 text-muted-foreground">
          The three examples below are written illustrations of typical use, not quotes from real
          users. CareerBoost AI does not publish reviews, names or photographs it has not collected
          and verified.
        </p>
      </div>

      <Reveal className="mt-12 grid gap-4 md:grid-cols-3">
        {examples.map((example) => (
          <RevealItem key={example.initials} className="surface-card lift flex h-full flex-col p-6">
            <Quote className="h-6 w-6 shrink-0 text-primary/30" aria-hidden="true" />
            <blockquote className="mt-4 flex-1 text-body leading-7 text-foreground">
              {example.quote}
            </blockquote>
            <div className="mt-6 flex items-center gap-3 border-t pt-5">
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-caption normal-case tracking-normal text-primary"
                aria-hidden="true"
              >
                {example.initials}
              </span>
              <p className="text-small text-muted-foreground">{example.role}</p>
            </div>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
