import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Award, GraduationCap } from "lucide-react";
import { ProductPage } from "@/components/product-page";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCoursesForTargetRole } from "@/lib/brihatlabs-courses";
import { loadTargetRole, saveTargetRole } from "@/lib/target-role";

export const Route = createFileRoute("/skillpath")({
  component: SkillPath,
  head: () => ({ meta: [{ title: "BrihatLabs SkillPath | CareerBoost AI" }] }),
});

function SkillPath() {
  const [targetRole, setTargetRole] = useState("Data Engineer");
  // SkillPath is intentionally focused: show the best BrihatLabs course for
  // the selected role instead of exposing the entire catalog at once.
  const courses = useMemo(() => getCoursesForTargetRole(targetRole, 1), [targetRole]);
  useEffect(() => {
    setTargetRole(loadTargetRole());
  }, []);
  useEffect(() => saveTargetRole(targetRole), [targetRole]);
  const nextCourse = courses[0];

  return (
    <ProductPage
      eyebrow="SkillPath · BrihatLabs Courses"
      title="Follow the BrihatLabs learning sequence."
      description="Explore the BrihatLabs catalog in a CareerBoost learning sequence, then open each course to review its modules and lessons."
    >
      <div className="surface-card mb-6 p-5">
        <Label htmlFor="skillpath-target-role">Target role</Label>
        <Input
          id="skillpath-target-role"
          value={targetRole}
          onChange={(event) => setTargetRole(event.target.value)}
          className="mt-2 h-11 max-w-xl"
          placeholder="For example, Cloud Engineer"
          maxLength={120}
        />
        <p className="mt-2 text-sm text-muted-foreground">
          Showing BrihatLabs courses matched to this role.
        </p>
      </div>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,.34fr)]">
        <div className="space-y-4">
          {courses.map((course, index) => (
            <article key={course.id} className="surface-card lift p-5">
              <div className="flex items-start gap-4">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                  {index + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-caption uppercase text-primary">{course.duration}</p>
                      <h2 className="mt-1 font-display text-h3 text-foreground">{course.title}</h2>
                    </div>
                    <span className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-caption normal-case tracking-normal text-muted-foreground">
                      Self-paced
                    </span>
                  </div>
                  <p className="mt-3 text-small leading-6 text-muted-foreground">
                    {course.summary}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {course.categories.map((category) => (
                      <span
                        key={category}
                        className="rounded-md bg-secondary px-2 py-1 text-caption normal-case tracking-normal text-secondary-foreground"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                  <Link
                    to="/courses/$courseId"
                    params={{ courseId: course.id }}
                    className={buttonVariants({ variant: "outline", size: "sm", className: "mt-4" })}
                  >
                    View course content
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
        <aside className="space-y-4 lg:sticky lg:top-20 lg:h-fit">
          <div className="surface-card lift p-5">
            <p className="flex items-center gap-2 text-small font-semibold text-foreground">
              <GraduationCap className="h-4 w-4 text-primary" /> Course sequence
            </p>
            <p className="mt-3 text-small leading-6 text-muted-foreground">
              Course completion is not inferred from opening a course. Use each course's module and
              lesson content to guide your own progress.
            </p>
          </div>
          <div className="surface-card lift p-5">
            <GraduationCap className="h-6 w-6 text-primary" />
            <p className="mt-3 font-display text-h3 text-foreground">
              Learning happens in CareerBoost
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Continue with the first course in your role roadmap and review its full curriculum.
            </p>
            {nextCourse ? (
              <Button asChild className="mt-4 h-auto min-w-0 w-full whitespace-normal px-3 py-2 text-center leading-5">
                <Link
                  to="/learn/$courseId/$unitId/$lessonId"
                  params={{
                    courseId: nextCourse.brihatlabs.slug,
                    unitId: nextCourse.brihatlabs.units[0].id,
                    lessonId: nextCourse.brihatlabs.units[0].lessons[0].id,
                  }}
                >
                  Continue: {nextCourse.title}
                </Link>
              </Button>
            ) : (
              <p className="mt-3 text-sm font-semibold text-success">Role path completed</p>
            )}
          </div>
          <div className="surface-card lift p-5">
            <Award className="h-6 w-6 text-primary" />
            <p className="mt-3 font-display text-h3 text-foreground">Build career proof</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add a project repository after completing relevant coursework.
            </p>
            <Button asChild variant="outline" className="mt-4 w-full">
              <Link to="/projectlab">Open ProjectLab</Link>
            </Button>
          </div>
        </aside>
      </div>
    </ProductPage>
  );
}
