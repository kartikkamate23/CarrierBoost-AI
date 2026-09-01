import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Clock3, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getCoursesForTargetRole } from "@/lib/hitavir-courses";

const stages = [
  "Foundation",
  "Developer tools",
  "Core skill",
  "Applied skill",
  "Advanced",
  "Capstone",
];

export function RoleCoursePath({ targetRole }: { targetRole: string }) {
  const courses = useMemo(() => getCoursesForTargetRole(targetRole, 6), [targetRole]);

  return (
    <section aria-labelledby="role-skillpath-heading">
      <div className="rounded-2xl border bg-card p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-primary">BrihatLabs SkillPath</p>
            <h3 id="role-skillpath-heading" className="mt-1 text-xl font-bold">
              Sequential path to become a {targetRole}
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              Learn in this order. Start with foundations, complete the applied courses, and finish
              with role-ready project work before re-running ResumeIQ.
            </p>
          </div>
          <div className="max-w-56 rounded-xl bg-secondary/70 p-3">
            <p className="flex items-center gap-2 text-xs font-semibold">
              <GraduationCap className="h-4 w-4 text-primary" /> Course sequence
            </p>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Progress is self-paced; completion is not inferred from opening a course.
            </p>
          </div>
        </div>
      </div>

      <ol className="mt-5 space-y-4">
        {courses.map((course, index) => {
          return (
            <li key={course.id} className="relative rounded-2xl border bg-card p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {index + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-primary">
                        {stages[index] ?? `Step ${index + 1}`}
                      </p>
                      <h4 className="mt-1 text-lg font-semibold">{course.title}</h4>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-medium text-muted-foreground">
                      Self-paced
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{course.summary}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="inline-flex items-center gap-1 rounded-md bg-secondary px-2 py-1">
                      <Clock3 className="h-3.5 w-3.5" /> {course.duration}
                    </span>
                    {course.categories.slice(0, 3).map((category) => (
                      <span
                        key={category}
                        className="rounded-md bg-primary/10 px-2 py-1 text-primary"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link to="/courses/$courseId" params={{ courseId: course.id }}>
                      <GraduationCap className="mr-2 h-4 w-4" /> Learn this course
                    </Link>
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
