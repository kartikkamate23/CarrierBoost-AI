import { Link } from "@tanstack/react-router";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";

const links = [
  ["/dashboard", "Overview"],
  ["/analyze", "ResumeIQ"],
  ["/roadmap", "Career Roadmap"],
  ["/skillpath", "SkillPath"],
  ["/mentor", "AI Mentor"],
  ["/projectlab", "ProjectLab"],
  ["/interviewiq", "InterviewIQ"],
  ["/jobmatch", "JobMatch"],
] as const;
export function ProductPage({
  eyebrow,
  title,
  description,
  children,
  showIntro = true,
}: {
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  children: React.ReactNode;
  showIntro?: boolean;
}) {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="border-b bg-card/60">
        <div className="scrollbar-slim container mx-auto max-w-7xl overflow-x-auto px-4">
          <nav aria-label="Career tools" className="flex min-w-max gap-1 py-2">
            {links.map(([to, label]) => (
              <Link
                key={to}
                to={to}
                className="rounded-lg px-3 py-2 text-small font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      <main
        id="main-content"
        className={`container mx-auto max-w-7xl px-4 ${showIntro ? "py-10" : "py-6 sm:py-8"}`}
      >
        {showIntro ? (
          <>
            {eyebrow ? <p className="text-caption uppercase text-primary">{eyebrow}</p> : null}
            <h1 className="mt-3 font-display text-h1 text-foreground">{title}</h1>
            <p className="mt-4 max-w-3xl text-body-lg text-muted-foreground">{description}</p>
          </>
        ) : null}
        <div className={showIntro ? "mt-9" : undefined}>{children}</div>
      </main>
      <Footer />
    </div>
  );
}
