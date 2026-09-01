import { ArrowRight, CircleHelp, Compass, FileX2, ShieldQuestion, Shuffle } from "lucide-react";
import { Section, SectionHeading, Reveal, RevealItem } from "@/components/marketing/section";
import { cn } from "@/lib/utils";

const problems = [
  {
    icon: ShieldQuestion,
    problem: "A score with no reasoning",
    solution: "Every dimension shows its evidence, calculation, missing signal and next action.",
  },
  {
    icon: FileX2,
    problem: "Advice that ignores your actual resume",
    solution:
      "Recommendations are derived from text found in your document — never invented experience.",
  },
  {
    icon: Shuffle,
    problem: "Courses unrelated to the gap",
    solution: "Detected gaps map directly onto the verified Hitavir Tech catalogue.",
  },
  {
    icon: CircleHelp,
    problem: "No way to prove you learned it",
    solution: "Mastery needs assessment or project evidence — watching a lesson is not enough.",
  },
  {
    icon: Compass,
    problem: "Interview prep disconnected from your profile",
    solution: "InterviewIQ generates role and technology questions, then evaluates your answer.",
  },
];

export function ProblemSection() {
  return (
    <Section tone="muted">
      <SectionHeading
        eyebrow="Why most resume tools fall short"
        title="A number on its own has never fixed a resume."
        body="Scoring is the easy part. What changes an outcome is knowing precisely which evidence is missing, and what to do about it this week."
      />

      {/*
        Five cards over a six-column track. Each card spans two columns, so the
        first row fills 1-2 / 3-4 / 5-6, and the fourth card starts at column 2 —
        which centres the trailing pair (2-3 and 4-5) with a symmetric half-column
        gutter either side instead of leaving a lone hole on the right.
      */}
      <Reveal className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-6">
        {problems.map((item, index) => (
          <RevealItem
            key={item.problem}
            className={cn(
              "surface-card lift flex h-full flex-col p-6 lg:col-span-2",
              index === 3 && "lg:col-start-2",
              // At the two-column breakpoint the fifth card is alone on its row.
              index === problems.length - 1 && "md:col-span-2",
            )}
          >
            <span
              className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-destructive/10 text-destructive"
              aria-hidden="true"
            >
              <item.icon className="h-5 w-5" />
            </span>
            <h3 className="mt-5 font-display text-h3 text-foreground">{item.problem}</h3>
            <div className="mt-4 flex flex-1 gap-2.5 rounded-lg bg-success/5 p-3.5">
              <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
              <p className="text-small leading-6 text-muted-foreground">{item.solution}</p>
            </div>
          </RevealItem>
        ))}
      </Reveal>
    </Section>
  );
}
