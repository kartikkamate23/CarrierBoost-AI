import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Github,
  ListChecks,
  Package,
  Route as RouteIcon,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { ProductPage } from "@/components/product-page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { InlineError } from "@/components/patterns/error-state";
import { brihatlabsCourses } from "@/lib/brihatlabs-courses";

export const Route = createFileRoute("/projectlab")({
  component: ProjectLab,
  head: () => ({ meta: [{ title: "ProjectLab | CareerBoost AI" }] }),
});

function ProjectLab() {
  const project = brihatlabsCourses.find((course) => course.id === "data-engineering-on-aws")!;
  const [repo, setRepo] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("careerboost-project-submission");
      if (saved) {
        setRepo(saved);
        setSubmitted(true);
      }
    } catch {
      // Local persistence is optional.
    }
  }, []);

  const submit = () => {
    setError("");
    if (!/^https:\/\/github\.com\/[\w.-]+\/[\w.-]+\/?$/.test(repo)) {
      const message = "Enter a valid public GitHub repository URL.";
      setError(message);
      toast.error(message);
      return;
    }
    setSubmitted(true);
    try {
      localStorage.setItem("careerboost-project-submission", repo);
    } catch {
      // The current-page submission still works when local storage is unavailable.
    }
    toast.success("Submission saved for rubric review preparation.");
  };

  return (
    <ProductPage
      eyebrow="ProjectLab · BrihatLabs course proof"
      title="HitaVir Retail AWS Data Pipeline"
      description={`Portfolio proof aligned to “${project.title}”: ${project.summary}`}
      showIntro={false}
    >
      <header className="mb-7">
        <p className="text-caption uppercase text-primary">
          ProjectLab · BrihatLabs course proof
        </p>
        <h1 className="mt-2 font-display text-h2 text-foreground">
          HitaVir Retail AWS Data Pipeline
        </h1>
        <p className="mt-2 max-w-3xl text-body text-muted-foreground">
          Portfolio proof aligned to “{project.title}”: {project.summary}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="min-w-0 space-y-4">
          <Card icon={RouteIcon} title="Problem statement">
            Build an end-to-end HitaVir Retail data pipeline using the AWS services covered by the
            BrihatLabs course, from S3 ingestion through transformation and analytics.
          </Card>

          <Card icon={RouteIcon} title="Architecture guidance">
            <div className="flex flex-wrap items-center gap-2">
              {["Source data", "S3 + Medallion", "Glue ETL (PySpark)", "Athena / Redshift"].map(
                (stage, index, all) => (
                  <span key={stage} className="inline-flex items-center gap-2">
                    <span className="rounded-lg border border-border bg-muted/60 px-3 py-1.5 text-small font-medium text-foreground">
                      {stage}
                    </span>
                    {index < all.length - 1 ? (
                      <span className="text-muted-foreground" aria-hidden="true">
                        →
                      </span>
                    ) : null}
                  </span>
                ),
              )}
            </div>
            <p className="mt-4">Include orchestration, security, and monitoring decisions.</p>
          </Card>

          <Card icon={ListChecks} title="Milestones">
            <List
              items={[
                "Create the S3 data-lake structure and load source data",
                "Build Medallion layers for raw, refined, and serving data",
                "Implement an AWS Glue ETL job with PySpark",
                "Query outputs using Athena and document the Redshift serving design",
                "Add orchestration, security, and monitoring notes",
                "Document teardown steps to control cloud resources and costs",
              ]}
              numbered
            />
          </Card>

          <Card icon={ListChecks} title="Evaluation rubric">
            <div className="space-y-4">
              {[
                ["Correctness", 30],
                ["Reliability and tests", 25],
                ["Architecture", 20],
                ["Documentation", 15],
                ["Communication", 10],
              ].map(([label, value]) => (
                <div key={String(label)}>
                  <div className="mb-1.5 flex justify-between text-small">
                    <span className="font-medium text-foreground">{label}</span>
                    <span className="tabular-nums text-muted-foreground">{value}%</span>
                  </div>
                  <Progress
                    value={Number(value)}
                    className="h-1.5"
                    aria-label={`${label}: ${value} percent of the evaluation rubric`}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card icon={Package} title="Expected deliverables">
            <List
              items={[
                "Public or reviewer-accessible GitHub repository",
                "README with setup, architecture, assumptions, and runbook",
                "Source and transformation code",
                "Automated tests and sample evidence",
                "Architecture diagram",
                "Short demo or screenshots with anonymized data",
              ]}
            />
          </Card>
        </div>

        <aside className="h-fit lg:sticky lg:top-20">
          <div className="surface-card p-6">
            <span
              className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"
              aria-hidden="true"
            >
              <Github className="h-5 w-5" />
            </span>
            <h2 className="mt-4 font-display text-h3 text-foreground">Submit for evaluation</h2>
            <p className="mt-2 text-small leading-6 text-muted-foreground">
              Automated checks verify repository structure first. A structured rubric review is
              required before any skill is marked mastered.
            </p>

            <div className="mt-5 space-y-2">
              <Label htmlFor="repo" className="text-small font-medium">
                GitHub repository URL
              </Label>
              <Input
                id="repo"
                value={repo}
                onChange={(e) => {
                  setRepo(e.target.value);
                  setError("");
                  setSubmitted(false);
                }}
                placeholder="https://github.com/user/project"
                className="h-11"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? "repo-error" : undefined}
              />
            </div>

            {error && (
              <div id="repo-error" className="mt-3">
                <InlineError message={error} />
              </div>
            )}

            <Button onClick={submit} className="btn-glow mt-4 h-11 w-full">
              <Upload className="h-4 w-4" aria-hidden="true" />
              Submit project
            </Button>

            {submitted && (
              <div
                className="mt-5 rounded-xl border border-success/30 bg-success/5 p-4"
                role="status"
              >
                <p className="flex items-center gap-2 text-small font-semibold text-success">
                  <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Submission received
                </p>
                <p className="mt-2 text-small leading-6 text-muted-foreground">
                  Saved on this device. Connect a reviewer or backend before an evaluation can
                  begin; no mastery has been awarded.
                </p>
              </div>
            )}

            <p className="mt-5 border-t pt-5 text-small leading-6 text-muted-foreground">
              After verification, CareerBoost can draft a README, architecture explanation, resume
              bullets, LinkedIn description, portfolio summary, and related interview questions.
              Generated claims require your approval.
            </p>
          </div>
        </aside>
      </div>
    </ProductPage>
  );
}

function Card({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <section className="surface-card p-6">
      <div className="flex items-center gap-2.5">
        {Icon ? (
          <span
            className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary"
            aria-hidden="true"
          >
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
        <h2 className="font-display text-h3 text-foreground">{title}</h2>
      </div>
      <div className="mt-4 text-small leading-7 text-muted-foreground">{children}</div>
    </section>
  );
}

function List({ items, numbered = false }: { items: string[]; numbered?: boolean }) {
  return (
    <ol className="space-y-2.5">
      {items.map((item, index) => (
        <li key={item} className="flex gap-3">
          {numbered ? (
            <span
              className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/10 text-caption normal-case tracking-normal tabular-nums text-primary"
              aria-hidden="true"
            >
              {index + 1}
            </span>
          ) : (
            <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-success" aria-hidden="true" />
          )}
          <span className="min-w-0">{item}</span>
        </li>
      ))}
    </ol>
  );
}
