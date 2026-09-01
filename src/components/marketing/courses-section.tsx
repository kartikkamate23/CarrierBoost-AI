import { Link } from "@tanstack/react-router";
import { ArrowRight, Clock3, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Section, SectionHeading, Reveal, RevealItem } from "@/components/marketing/section";
import { featuredHitavirCourses, hitavirCourses } from "@/lib/hitavir-courses";

/**
 * Featured courses, read straight from the real Hitavir Tech catalogue in
 * src/lib/hitavir-courses.ts. Nothing is hard-coded here.
 */
export function CoursesSection() {
  return (
    <Section tone="muted">
      <SectionHeading
        eyebrow="Hitavir Tech partnership"
        title="Gaps map onto a real course catalogue."
        body={`CareerBoost connects detected skill gaps to ${hitavirCourses.length} verified Hitavir Tech courses. Course content is hosted in the Hitavir learning portal and may require enrolment.`}
      />

      <Reveal className="mt-14 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {featuredHitavirCourses.map((course) => (
          <RevealItem key={course.id} className="surface-card lift flex h-full flex-col p-6">
            <div className="flex items-start justify-between gap-3">
              <span
                className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary"
                aria-hidden="true"
              >
                <GraduationCap className="h-5 w-5" />
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-caption normal-case tracking-normal text-secondary-foreground">
                <Clock3 className="h-3 w-3" aria-hidden="true" />
                {course.duration}
              </span>
            </div>

            <h3 className="mt-5 font-display text-h3 text-foreground">{course.title}</h3>
            <p className="mt-2 flex-1 text-small leading-6 text-muted-foreground">
              {course.summary}
            </p>

            <div className="mt-4 flex flex-wrap gap-1.5">
              {course.categories.slice(0, 3).map((category) => (
                <span
                  key={category}
                  className="rounded-md bg-primary/10 px-2 py-1 text-caption normal-case tracking-normal text-primary"
                >
                  {category}
                </span>
              ))}
            </div>

            <Button asChild variant="outline" className="mt-5 w-full">
              <Link to="/courses/$courseId" params={{ courseId: course.id }}>
                View course content
              </Link>
            </Button>
          </RevealItem>
        ))}
      </Reveal>

      <div className="mt-10 text-center">
        <Button asChild size="lg" variant="ghost" className="h-12">
          <Link to="/programs">
            Browse all {hitavirCourses.length} courses
            <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </Section>
  );
}
