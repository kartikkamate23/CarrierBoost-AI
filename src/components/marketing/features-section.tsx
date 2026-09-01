import { Link } from "@tanstack/react-router";
import {
  Bot,
  BriefcaseBusiness,
  FileSearch,
  FolderGit2,
  GraduationCap,
  MessageSquareText,
  PenLine,
  Route as RouteIcon,
} from "lucide-react";
import { FeatureCard } from "@/components/patterns/feature-card";
import { Section, SectionHeading, Reveal } from "@/components/marketing/section";
import { landingSections } from "@/lib/site";

/**
 * Each entry maps to a module that exists in the application today. The `to`
 * values are all live routes; the authenticated one is marked so the copy stays
 * honest about where an account is required.
 */
const features = [
  {
    icon: FileSearch,
    title: "ResumeIQ",
    to: "/analyze",
    description:
      "Score a resume against any target role on a versioned rubric. Every dimension exposes the evidence found, what is missing and the expected gain from fixing it.",
  },
  {
    icon: RouteIcon,
    title: "Career Roadmap",
    to: "/roadmap",
    description:
      "Convert your highest-impact gaps into a week-by-week plan shaped by your availability, experience level and preferred way of learning.",
  },
  {
    icon: GraduationCap,
    title: "SkillPath",
    to: "/skillpath",
    description:
      "Follow the BrihatLabs course sequence matched to your role with a clear, self-paced curriculum.",
  },
  {
    icon: Bot,
    title: "AI Mentor",
    to: "/mentor",
    description:
      "Eight coaching modes — teach, explain simply, hint, quiz, review code, review a project, interview prep and mastery checks — grounded in the course outline.",
  },
  {
    icon: FolderGit2,
    title: "ProjectLab",
    to: "/projectlab",
    description:
      "Turn finished coursework into portfolio evidence, because a completed lesson and a demonstrated skill are not the same claim.",
  },
  {
    icon: MessageSquareText,
    title: "InterviewIQ",
    to: "/interviewiq",
    description:
      "Generate technical, HR and coding questions across three difficulty levels, then get your answer evaluated against the evidence it contains.",
  },
  {
    icon: BriefcaseBusiness,
    title: "JobMatch",
    to: "/jobmatch",
    description:
      "Explore role families aligned to demonstrated skills, with an honest match rationale instead of scraped or fabricated vacancies.",
  },
  {
    icon: PenLine,
    title: "Cover Letter",
    to: "/analyze",
    description:
      "Generate a tailored cover letter from a saved resume and target role, in a professional, enthusiastic or concise tone. Requires an account.",
  },
] as const;

export function FeaturesSection() {
  return (
    <Section id={landingSections.features}>
      <SectionHeading
        eyebrow="One connected journey"
        title="Seven modules, one continuous thread of evidence."
        body="Analysis feeds the roadmap. The roadmap feeds learning. Learning produces proof. Proof feeds interview practice — and then you re-run the analysis."
      />

      <Reveal className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <FeatureCard
            key={feature.title}
            icon={feature.icon}
            index={index}
            title={feature.title}
            description={feature.description}
            footer={
              <Link
                to={feature.to}
                className="text-small font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                Open {feature.title}
                <span className="sr-only"> module</span>
              </Link>
            }
          />
        ))}
      </Reveal>
    </Section>
  );
}
