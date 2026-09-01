import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Info, ListChecks, Target } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { analyzeCareerReadiness } from "@/lib/career-engine";

const sample = analyzeCareerReadiness(
  `Summary Data analyst transitioning to data engineering. Skills Python SQL PostgreSQL Docker AWS. Experience Built ETL workflows for reporting and improved refresh time by 35%. Projects Designed a warehouse model for 500K sales records. Education Bachelor of Engineering.`,
  "Data Engineer",
);

export const Route = createFileRoute("/sample-report")({
  component: SampleReport,
  head: () => ({ meta: [{ title: "Sample Career Report | CareerBoost AI" }] }),
});

function SampleReport() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main id="main-content">
        <section className="bg-mesh border-b">
          <div className="container mx-auto max-w-6xl px-4 py-14">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-warning/40 bg-warning/10 px-3 py-1.5 text-caption normal-case tracking-normal text-warning">
                  <Info className="h-3.5 w-3.5" aria-hidden="true" />
                  Sample report · not a real person
                </span>
                <h1 className="mt-5 font-display text-h1 text-foreground sm:text-display">
                  Data Engineer career report
                </h1>
                <p className="mt-4 max-w-2xl text-body-lg text-muted-foreground">
                  A transparent example—not a learner claim or outcome guarantee.
                </p>
              </div>
              <Button asChild size="lg" className="btn-glow h-12 shrink-0 px-6">
                <Link to="/analyze">
                  Analyze my resume
                  <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        <div className="container mx-auto max-w-6xl px-4 py-12">
          {/* Provenance: states exactly where these figures come from. */}
          <div className="flex gap-3 rounded-xl border border-border bg-muted/40 p-4">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
            <p className="text-small leading-6 text-muted-foreground">
              Every figure below is generated live by rubric{" "}
              <strong className="font-medium text-foreground">{sample.rubricVersion}</strong> from a
              short fictional resume written for this demonstration. It does not describe a real
              candidate, and no real user data appears on this page.
            </p>
          </div>

          {/* 1 — Headline result */}
          <section className="mt-10" aria-labelledby="overall-heading">
            <div className="surface-card flex flex-wrap items-center gap-8 p-6 sm:p-8">
              <div className="min-w-0">
                <p className="text-caption uppercase text-muted-foreground">
                  Overall job readiness
                </p>
                <p className="mt-2 font-display text-display tabular-nums text-primary">
                  {sample.overall}
                  <span className="ml-1 text-h3 font-medium text-muted-foreground">/100</span>
                </p>
              </div>
              <div className="min-w-0 flex-1">
                <h2 id="overall-heading" className="font-display text-h3 text-foreground">
                  Target role: {sample.role}
                </h2>
                <p className="mt-2 text-small leading-6 text-muted-foreground">
                  Readiness is the weighted result of the {sample.scores.length} dimensions below.
                  Each one carries its own evidence and next action, so the number is always
                  traceable back to something specific in the resume.
                </p>
              </div>
            </div>
          </section>

          {/* 2 — Score breakdown */}
          <section className="mt-10" aria-labelledby="breakdown-heading">
            <h2 id="breakdown-heading" className="font-display text-h2 text-foreground">
              Score breakdown
            </h2>
            <p className="mt-2 text-body text-muted-foreground">
              The components that produce the readiness figure above.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {sample.scores.map((score) => (
                <article key={score.key} className="surface-card p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="min-w-0 truncate text-small font-medium text-foreground">
                      {score.label}
                    </h3>
                    <strong className="shrink-0 font-display text-h3 tabular-nums text-foreground">
                      {score.score}
                    </strong>
                  </div>
                  <Progress
                    value={score.score}
                    className="mt-3 h-1.5"
                    aria-label={`${score.label}: ${score.score} percent`}
                  />
                </article>
              ))}
            </div>
          </section>

          {/* 3 — Recommendations */}
          <section className="mt-14" aria-labelledby="actions-heading">
            <div className="flex items-center gap-2.5">
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
                aria-hidden="true"
              >
                <Target className="h-4 w-4" />
              </span>
              <h2 id="actions-heading" className="font-display text-h2 text-foreground">
                Highest-impact actions
              </h2>
            </div>
            <p className="mt-2 text-body text-muted-foreground">
              The three weakest dimensions, with the gain each fix is expected to produce.
            </p>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {sample.topProblems.map((score) => (
                <article key={score.key} className="surface-card lift flex h-full flex-col p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-h3 text-foreground">{score.label}</h3>
                    <span className="rounded-full bg-success/10 px-2.5 py-1 text-caption normal-case tracking-normal text-success">
                      +{score.expectedGain}
                    </span>
                  </div>
                  <p className="mt-3 text-small leading-6 text-muted-foreground">{score.missing}</p>
                  <p className="mt-4 flex flex-1 gap-2.5 text-small leading-6 text-foreground">
                    <ArrowRight
                      className="mt-1 h-3.5 w-3.5 shrink-0 text-primary"
                      aria-hidden="true"
                    />
                    {score.action}
                  </p>
                </article>
              ))}
            </div>
          </section>

          {/* 4 — Detailed evidence */}
          <section className="mt-14" aria-labelledby="gaps-heading">
            <div className="flex items-center gap-2.5">
              <span
                className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
                aria-hidden="true"
              >
                <ListChecks className="h-4 w-4" />
              </span>
              <h2 id="gaps-heading" className="font-display text-h2 text-foreground">
                Evidence-to-action skill gaps
              </h2>
            </div>
            <p className="mt-2 text-body text-muted-foreground">
              What the resume demonstrates for each priority skill, and the proof needed to close
              it.
            </p>
            <div className="mt-6 space-y-3">
              {sample.gaps.map((gap) => (
                <article key={gap.skill} className="surface-card p-5 sm:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-display text-h3 capitalize text-foreground">{gap.skill}</h3>
                    <span className="rounded-full bg-warning/10 px-2.5 py-1 text-caption normal-case tracking-normal text-warning">
                      {gap.importance}
                    </span>
                  </div>
                  <dl className="mt-4 grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-caption uppercase text-muted-foreground">
                        Current evidence
                      </dt>
                      <dd className="mt-1.5 text-small leading-6 text-muted-foreground">
                        {gap.evidence}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-caption uppercase text-primary">Proof required</dt>
                      <dd className="mt-1.5 text-small leading-6 text-foreground">{gap.proof}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </section>

          <div className="mt-12 flex gap-3 rounded-2xl border border-success/30 bg-success/5 p-5">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" aria-hidden="true" />
            <p className="text-small leading-6 text-muted-foreground">
              Every recommendation is tied to detected evidence and a versioned rubric. Completing
              verified roadmap work can update the report; merely watching content cannot.
            </p>
          </div>

          <div className="mt-10 text-center">
            <Button asChild size="lg" className="btn-glow h-12 px-6">
              <Link to="/analyze">
                Run this on my own resume
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
