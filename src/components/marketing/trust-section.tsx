import { BarChart3, GraduationCap, MessageSquareText, Sparkles } from "lucide-react";
import { Stat, StatGroup } from "@/components/patterns/stat";
import { Reveal } from "@/components/marketing/section";
import { sampleAnalysis } from "@/components/marketing/sample-analysis";
import { hitavirCourses } from "@/lib/hitavir-courses";
import { interviewRoles } from "@/lib/interview-questions";
import { mentorModes } from "@/lib/program-data";
import { trustNotice } from "@/lib/site";

/**
 * Credibility row.
 *
 * Every figure is counted at render time from the real catalogue and rubric —
 * there are no invented user counts, outcome claims or partner logos.
 */
export function TrustSection() {
  const analysis = sampleAnalysis;

  return (
    <section className="border-b bg-card/40">
      <div className="container mx-auto max-w-7xl px-4 py-14">
        <Reveal className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_2fr] lg:items-center">
          <div>
            <p className="text-caption uppercase text-primary">Built on verifiable structure</p>
            <p className="mt-3 text-body text-muted-foreground">{trustNotice}</p>
          </div>

          <StatGroup>
            <Stat
              icon={BarChart3}
              value={analysis.scores.length}
              label="Explainable scores"
              detail="Each with evidence and a next action"
            />
            <Stat
              icon={GraduationCap}
              value={hitavirCourses.length}
              label="Hitavir Tech courses"
              detail="Mapped to detected skill gaps"
            />
            <Stat
              icon={Sparkles}
              value={mentorModes.length}
              label="AI mentor modes"
              detail="From hints to mastery checks"
            />
            <Stat
              icon={MessageSquareText}
              value={interviewRoles.length}
              label="Interview role tracks"
              detail="Technical, HR and coding"
            />
          </StatGroup>
        </Reveal>
      </div>
    </section>
  );
}
