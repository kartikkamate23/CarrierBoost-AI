import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck, Clock3, GraduationCap } from "lucide-react";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hitavirCourses } from "@/lib/hitavir-courses";
import { loadTargetRole, saveTargetRole } from "@/lib/target-role";

export const Route = createFileRoute("/programs")({
  component: Programs,
  head: () => ({ meta: [{ title: "BrihatLabs Courses | CareerBoost AI" }] }),
});

export function Programs() {
  const [targetRole, setTargetRole] = useState("Data Engineer");
  useEffect(() => setTargetRole(loadTargetRole()), []);
  useEffect(() => saveTargetRole(targetRole), [targetRole]);
  const courses = useMemo(() => hitavirCourses, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <main id="main-content">
        <section className="bg-mesh border-b">
          <div className="container mx-auto max-w-7xl px-4 py-14">
            <p className="text-caption uppercase text-primary">BrihatLabs Courses</p>
            <h1 className="mt-3 max-w-3xl font-display text-h1 text-foreground sm:text-display">
              Learn from the BrihatLabs catalog
            </h1>
            <p className="mt-5 max-w-3xl text-body-lg text-muted-foreground">
              Explore the complete BrihatLabs course catalog within CareerBoost AI.
            </p>
            <div className="mt-8 max-w-2xl">
              <div className="flex-1">
                <Label htmlFor="course-target-role">Target role</Label>
                <Input
                  id="course-target-role"
                  value={targetRole}
                  onChange={(event) => setTargetRole(event.target.value)}
                  className="mt-2 h-11 bg-background"
                  placeholder="For example, Data Analyst"
                  maxLength={120}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto max-w-7xl px-4 py-12">
          <div className="mb-7">
            <h2 className="font-display text-h2 text-foreground">
              Courses for {targetRole || "your target role"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {courses.length} role-matched learning resources from BrihatLabs. Change the target
              role above to refresh this list.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <article key={course.id} className="surface-card lift flex flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <BookOpenCheck className="h-6 w-6 shrink-0 text-primary" />
                  <span className="rounded-full bg-secondary px-2.5 py-1 text-caption normal-case tracking-normal text-secondary-foreground">
                    BrihatLabs course
                  </span>
                </div>
                <h3 className="mt-5 font-display text-h3 text-foreground">{course.title}</h3>
                <p className="mt-2 flex-1 text-small leading-6 text-muted-foreground">
                  {course.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {course.categories.map((category) => (
                    <span
                      key={category}
                      className="rounded-md bg-primary/10 px-2 py-1 text-caption normal-case tracking-normal text-primary"
                    >
                      {category}
                    </span>
                  ))}
                </div>
                <p className="mt-5 inline-flex items-center gap-2 text-small text-muted-foreground">
                  {course.duration === "Self-paced" ? (
                    <GraduationCap className="h-4 w-4 text-primary" />
                  ) : (
                    <Clock3 className="h-4 w-4 text-primary" />
                  )}
                  {course.duration}
                </p>
                <Button asChild variant="outline" className="mt-5 w-full">
                  <Link to="/courses/$courseId" params={{ courseId: course.id }}>
                    View course content
                  </Link>
                </Button>
              </article>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
