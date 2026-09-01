import { createFileRoute } from "@tanstack/react-router";
import { ExternalLink, MapPin } from "lucide-react";
import { ProductPage } from "@/components/product-page";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
const matches = [
  {
    role: "Junior Data Engineer",
    match: 82,
    location: "Remote / India",
    reason: "Strong Python and SQL evidence; add orchestration proof.",
  },
  {
    role: "Analytics Engineer",
    match: 78,
    location: "Hybrid",
    reason: "Warehouse modeling aligns well; demonstrate data testing.",
  },
  {
    role: "ETL Developer",
    match: 74,
    location: "Remote",
    reason: "Pipeline experience matches; production monitoring remains a gap.",
  },
];
export const Route = createFileRoute("/jobmatch")({
  component: JobMatch,
  head: () => ({ meta: [{ title: "JobMatch | CareerBoost AI" }] }),
});
function JobMatch() {
  return (
    <ProductPage
      eyebrow="JobMatch · Sample recommendations"
      title="Discover roles aligned to verified evidence."
      description="These are role-family recommendations, not live vacancies or placement promises. Match strength uses resume evidence and demonstrated mastery."
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {matches.map((job) => (
          <article key={job.role} className="surface-card lift flex h-full flex-col p-6">
            <div className="flex items-start justify-between">
              <h2 className="font-display text-h3 text-foreground">{job.role}</h2>
              <strong className="shrink-0 font-display text-h3 tabular-nums text-primary">
                {job.match}%
              </strong>
            </div>
            <Progress
              value={job.match}
              className="mt-4"
              aria-label={`${job.role} match: ${job.match} percent`}
            />
            <p className="mt-4 flex items-center gap-2 text-small text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </p>
            <p className="mt-3 flex-1 text-small leading-6 text-muted-foreground">{job.reason}</p>
            <Button asChild variant="outline" className="mt-5 w-full">
              <a
                href={`https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(job.role)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Search live roles <ExternalLink className="ml-2 h-4 w-4" />
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </Button>
          </article>
        ))}
      </div>
      <div className="mt-8 rounded-xl border border-warning/30 bg-warning/5 p-4 text-small leading-6 text-muted-foreground">
        CareerBoost does not scrape or fabricate job listings. External searches open current
        results from the selected provider; review employer authenticity before applying.
      </div>
    </ProductPage>
  );
}
