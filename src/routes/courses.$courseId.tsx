import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  BookOpenCheck,
  Clock3,
} from "lucide-react";
import { ProductPage } from "@/components/product-page";
import { Button } from "@/components/ui/button";
import {
  findHitavirCourse,
  getCoursesForTargetRole,
} from "@/lib/hitavir-courses";
import { loadTargetRole } from "@/lib/target-role";

export const Route = createFileRoute("/courses/$courseId")({
  component: CoursePage,
  head: () => ({ meta: [{ title: "BrihatLabs Course | CareerBoost AI" }] }),
});

function CoursePage() {
  const { courseId } = useParams({ from: "/courses/$courseId" });
  const course = findHitavirCourse(courseId);
  const [targetRole, setTargetRole] = useState("Data Engineer");

  useEffect(() => {
    setTargetRole(loadTargetRole());
  }, []);

  const roleCourses = useMemo(() => getCoursesForTargetRole(targetRole, 15), [targetRole]);
  const currentStep = course ? roleCourses.findIndex((item) => item.id === course.id) : -1;
  const nextCourses = currentStep >= 0 ? roleCourses.slice(currentStep + 1, currentStep + 4) : [];

  if (!course) {
    return (
      <ProductPage
        eyebrow="BrihatLabs course"
        title="Course not found"
        description="This course is not in the current CareerBoost catalog."
      >
        <Button asChild variant="outline">
          <Link to="/programs">Back to all courses</Link>
        </Button>
      </ProductPage>
    );
  }

  return (
    <ProductPage
      eyebrow="BrihatLabs course"
      title={course.title}
      description={course.summary}
      showIntro={false}
    >
      <div className="mx-auto max-w-7xl">
        <Link
          to="/programs"
          className="mb-4 inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to role courses
        </Link>

        <section className="surface-card p-5 sm:p-8">
          <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.12em] text-warning">
            <span>{course.level ?? "All levels"}</span>
            <span aria-hidden="true">·</span>
            <span>{course.estimatedHours ?? course.duration}</span>
          </div>
          <h1 className="mt-2 font-display text-h2 text-foreground">{course.title}</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">{course.summary}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {course.modules ? <span>🧱 {course.modules} modules</span> : null}
            {course.lessons ? <span>▣ {course.lessons} lessons</span> : null}
            {(course.labels ?? course.categories).map((label) => (
              <span
                key={label}
                className="rounded-full bg-secondary px-2.5 py-1 text-muted-foreground"
              >
                {label}
              </span>
            ))}
          </div>
          <div className="mt-4">
            <Button asChild size="sm" className="min-w-44">
              <Link to="/courses/$courseId" params={{ courseId: course.id }} hash="content">
                Start course <ArrowRight className="ml-2 h-3.5 w-3.5" />
              </Link>
            </Button>
            {course.brihatlabs.units[0]?.lessons[0] ? (
              <Button asChild size="sm" variant="outline" className="ml-2">
                <Link
                  to="/learn/$courseId/$unitId/$lessonId"
                  params={{
                    courseId: course.brihatlabs.slug,
                    unitId: course.brihatlabs.units[0].id,
                    lessonId: course.brihatlabs.units[0].lessons[0].id,
                  }}
                >
                  Open first lesson
                </Link>
              </Button>
            ) : null}
          </div>
        </section>

        <section className="mt-5 surface-card p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary">
            {currentStep >= 0
              ? `${targetRole} roadmap · Step ${currentStep + 1} of ${roleCourses.length}`
              : `${targetRole} roadmap`}
          </p>
          <h2 className="mt-2 font-display text-h3 text-foreground">Recommended next courses</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Review the current course and continue through the catalog in the recommended order.
          </p>
          {nextCourses.length ? (
            <ol className="mt-4 grid gap-4 md:grid-cols-3">
              {nextCourses.map((nextCourse) => (
                <li key={nextCourse.id} className="flex flex-col surface-card p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-warning">
                    {nextCourse.level ?? "All levels"} ·{" "}
                    {nextCourse.estimatedHours ?? nextCourse.duration}
                  </p>
                  <h3 className="mt-2 font-semibold text-foreground">{nextCourse.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                    {nextCourse.summary}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    {nextCourse.modules ? <span>🧱 {nextCourse.modules} modules</span> : null}
                    {nextCourse.lessons ? <span>▣ {nextCourse.lessons} lessons</span> : null}
                    {(nextCourse.labels ?? []).map((label) => (
                      <span key={label} className="rounded-full bg-secondary px-2.5 py-1">
                        {label}
                      </span>
                    ))}
                  </div>
                  <Button asChild size="sm" className="mt-4 w-full">
                    <Link to="/courses/$courseId" params={{ courseId: nextCourse.id }}>
                      View course <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </li>
              ))}
            </ol>
          ) : (
            <p className="mt-4 text-sm font-semibold text-success">
              This is the final roadmap step.
            </p>
          )}
        </section>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="surface-card p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4 text-primary" /> {course.duration}
              </span>
              <span className="inline-flex items-center gap-2">
                <BookOpenCheck className="h-4 w-4 text-primary" /> {course.source}
              </span>
            </div>
            <h2 className="mt-5 font-display text-h3 text-foreground">Course content</h2>
            <p id="content" className="mt-2 text-sm leading-6 text-muted-foreground">
              This course is sourced from the BrihatLabs catalog. Work through the modules and
              lessons below at your own pace.
            </p>
            <div className="mt-4 space-y-4">
              {course.brihatlabs.units.map((unit, unitIndex) => (
                <section key={unit.id} className="rounded-xl border bg-background p-4 sm:p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div><p className="text-xs font-bold uppercase tracking-wide text-primary">Module {unitIndex + 1}</p><h3 className="mt-1 font-semibold text-foreground">{unit.title}</h3></div>
                    <span className="text-xs text-muted-foreground">{unit.lessons.length} lessons</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{unit.description}</p>
                  <ol className="mt-3 grid gap-2 sm:grid-cols-2">
                    {unit.lessons.map((lesson, lessonIndex) => (
                      <li key={lesson.id}><Link to="/learn/$courseId/$unitId/$lessonId" params={{ courseId: course.brihatlabs.slug, unitId: unit.id, lessonId: lesson.id }} className="flex min-h-11 items-center gap-2 rounded-lg border px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"><span className="text-xs font-semibold text-primary">{lessonIndex + 1}</span><span className="min-w-0 flex-1">{lesson.title}</span><span className="text-xs">{lesson.duration}</span></Link></li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          </section>

          <aside className="space-y-4 lg:sticky lg:top-24 lg:h-fit">
            <div className="surface-card p-5">
              <h2 className="font-semibold">Skills covered</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {course.skills.map((skill) => (
                  <span key={skill} className="rounded-md bg-secondary px-2.5 py-1 text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="surface-card p-5">
              <BookOpenCheck className="h-6 w-6 text-primary" />
              <h2 className="mt-3 font-semibold">Course progress</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Progress is presented from the available course outline. Completion tracking is not
                inferred from opening a lesson.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </ProductPage>
  );
}
