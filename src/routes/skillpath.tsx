import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { Award, CheckCircle2, GraduationCap, RefreshCw } from "lucide-react";
import { ProductPage } from "@/components/product-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useHitavirProgress } from "@/hooks/use-hitavir-progress";
import { getCoursesForTargetRole } from "@/lib/hitavir-courses";
import { loadTargetRole, saveTargetRole } from "@/lib/target-role";

export const Route = createFileRoute("/skillpath")({
  component: SkillPath,
  head: () => ({ meta: [{ title: "Hitavir Tech SkillPath | CareerBoost AI" }] }),
});

function SkillPath() {
  const [targetRole, setTargetRole] = useState("Data Engineer");
  const courses = useMemo(() => getCoursesForTargetRole(targetRole, 6), [targetRole]);
  const { items, syncState } = useHitavirProgress(courses.map((course) => course.id));
  useEffect(() => {
    setTargetRole(loadTargetRole());
  }, []);
  useEffect(() => saveTargetRole(targetRole), [targetRole]);
  const completedRelevant = courses.filter(
    (course) => items[course.id]?.status === "completed",
  ).length;
  const progress = Math.round((completedRelevant / courses.length) * 100);
  const nextCourse = courses.find((course) => items[course.id]?.status !== "completed");

  return (
    <ProductPage
      eyebrow="SkillPath · Hitavir Tech"
      title="Follow the Hitavir Tech learning sequence."
      description="Open each real course in the Hitavir Tech portal, then track your progress here. Portal access may require enrollment."
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
          Showing only the Hitavir Tech courses matched to this role.
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
                      {items[course.id]?.status === "completed" ? (
                        <CheckCircle2 className="h-4 w-4 text-success" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
                      {items[course.id]?.status === "completed"
                        ? "Completed on Hitavir"
                        : items[course.id]
                          ? `${items[course.id].progressPercent}% on Hitavir`
                          : "Awaiting Hitavir"}
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
                  <Button asChild variant="outline" size="sm" className="mt-4">
                    <Link to="/courses/$courseId" params={{ courseId: course.id }}>
                      View course content
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
        <aside className="space-y-4 lg:sticky lg:top-20 lg:h-fit">
          <div className="surface-card lift p-5">
            <p className="flex items-center gap-2 text-small font-semibold text-foreground">
              <RefreshCw className="h-4 w-4 text-primary" /> Automatic course progress
            </p>
            <p className="mt-3 text-small leading-6 text-muted-foreground">
              {syncState === "signed_out"
                ? "Sign in with the same email used on Hitavir. Learners cannot change completion here."
                : syncState === "unavailable"
                  ? "The secure Hitavir webhook must be configured before completion can synchronize."
                  : `${completedRelevant}/${courses.length} courses verified by Hitavir Tech.`}
            </p>
            <Progress value={progress} className="mt-3" />
          </div>
          <div className="surface-card lift p-5">
            <GraduationCap className="h-6 w-6 text-primary" />
            <p className="mt-3 font-display text-h3 text-foreground">
              Learning happens on Hitavir Tech
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Continue with the first incomplete course in your role roadmap. The official deep link
              appears only on that course page.
            </p>
            {nextCourse ? (
              <Button asChild className="mt-4 w-full">
                <Link to="/courses/$courseId" params={{ courseId: nextCourse.id }}>
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
              Add a project repository after completing relevant Hitavir Tech coursework.
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
