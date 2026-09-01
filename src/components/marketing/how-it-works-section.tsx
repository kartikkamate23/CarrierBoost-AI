import { FileSearch, GraduationCap, MessageSquareText, ScanSearch } from "lucide-react";
import { StepCard } from "@/components/patterns/feature-card";
import { Section, SectionHeading, Reveal } from "@/components/marketing/section";
import { landingSections } from "@/lib/site";

const steps = [
  {
    icon: FileSearch,
    title: "Analyze",
    description:
      "Upload a PDF or DOCX, or paste your resume text, and name the role you are aiming at. As a guest this runs entirely in your browser — no file leaves the device.",
  },
  {
    icon: ScanSearch,
    title: "Understand every gap",
    description:
      "Read each score alongside the evidence detected, the signal that is missing, the recommended action and the improvement you can expect from it.",
  },
  {
    icon: GraduationCap,
    title: "Close the gap",
    description:
      "Work through BrihatLabs courses matched to your weakest areas, then turn the result into a portfolio project in ProjectLab.",
  },
  {
    icon: MessageSquareText,
    title: "Prove it",
    description:
      "Practise role-specific interview questions, get your answers evaluated, and re-run the analysis to see the change reflected in the score.",
  },
];

export function HowItWorksSection() {
  return (
    <Section id={landingSections.howItWorks} tone="muted">
      <SectionHeading
        eyebrow="How it works"
        title="Four steps, and you can start without signing up."
        body="Guest analysis is complete enough to be useful on its own. An account adds saved reports, progress tracking and AI-written cover letters."
      />

      <Reveal
        as="ol"
        className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        staggerChildren={0.08}
      >
        {steps.map((step, index) => (
          <StepCard
            key={step.title}
            index={index}
            icon={step.icon}
            title={step.title}
            description={step.description}
          />
        ))}
      </Reveal>
    </Section>
  );
}
