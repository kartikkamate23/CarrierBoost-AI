import { Link } from "@tanstack/react-router";
import { BrandMark, BrandWordmark } from "@/components/shell/brand-mark";
import { footerNav, site } from "@/lib/site";

/**
 * The public site footer.
 *
 * Every destination already exists in src/routes; the groups come from
 * src/lib/site.ts. Presentational only.
 */
export function SiteFooter() {
  return (
    <footer className="mt-24 border-t bg-card/40">
      <div className="container mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_repeat(3,minmax(0,1fr))]">
          <div className="max-w-sm">
            <Link
              to="/"
              className="inline-flex items-center gap-2.5 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="CareerBoost AI home"
            >
              <BrandMark />
              <BrandWordmark />
            </Link>
            <p className="mt-4 text-small leading-6 text-muted-foreground">{site.description}</p>
            <a
              href={`mailto:${site.email}`}
              className="mt-4 inline-block text-small font-medium text-primary underline-offset-4 hover:underline"
            >
              {site.email}
            </a>
          </div>

          {footerNav.map((group) => (
            <div key={group.heading}>
              <p className="text-caption uppercase text-foreground">{group.heading}</p>
              <nav className="mt-4 grid gap-2.5" aria-label={group.heading}>
                {group.links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-small text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-small text-muted-foreground">
            © {new Date().getFullYear()} {site.name}. {site.tagline}.
          </p>
          <p className="text-small text-muted-foreground">
            Scores are rubric-based estimates, not outcome guarantees.
          </p>
        </div>
      </div>
    </footer>
  );
}
