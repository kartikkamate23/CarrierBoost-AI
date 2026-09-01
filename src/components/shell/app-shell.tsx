import { type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { LayoutDashboard, Shield, Sparkles, Upload } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { SiteHeader } from "@/components/shell/site-header";
import { cn } from "@/lib/utils";

/**
 * Layout chrome for the signed-in area: the shared site header, a persistent
 * sidebar on large screens and a scrollable pill nav on small ones.
 *
 * The sidebar lists only routes that live inside the authenticated area. The
 * public product pages (ResumeIQ, Roadmap, SkillPath, Mentor, ProjectLab,
 * InterviewIQ, JobMatch) are deliberately absent: they render their own public
 * layout, so linking to them from here would drop the user out of this shell.
 * They stay reachable from the site header and the landing page.
 *
 * Presentational only. `isAdmin` comes from the existing useAuth hook and is
 * used purely to decide whether to render the Admin link — the same condition
 * the previous navbar used. This component performs no route guarding; the
 * `_authenticated` route retains sole responsibility for that.
 */

const workspaceItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/upload", label: "New analysis", icon: Upload },
] as const;

const itemClass =
  "flex items-center gap-2.5 rounded-lg px-3 py-2 text-small font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring";

const activeItemClass = "bg-sidebar-accent text-sidebar-accent-foreground";

const pillClass =
  "inline-flex shrink-0 items-center gap-2 rounded-full border border-border px-3.5 py-2 text-small font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const activePillClass = "border-primary/40 bg-primary/10 text-primary";

export function AppShell({ children }: { children: ReactNode }) {
  const { isAdmin } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Compact horizontal nav below the header on small screens. */}
      <div className="border-b bg-card/40 lg:hidden">
        <div
          className="scrollbar-slim container mx-auto max-w-7xl overflow-x-auto px-4"
          role="navigation"
          aria-label="Workspace sections"
        >
          <div className="flex min-w-max gap-2 py-3">
            {workspaceItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={pillClass}
                activeProps={{ className: cn(pillClass, activePillClass) }}
              >
                <item.icon className="h-3.5 w-3.5" aria-hidden="true" />
                {item.label}
              </Link>
            ))}
            <Link
              to="/tools/cover-letter"
              search={{ role: "" }}
              className={pillClass}
              activeProps={{ className: cn(pillClass, activePillClass) }}
            >
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Cover letter
            </Link>
            {isAdmin ? (
              <Link
                to="/admin"
                className={pillClass}
                activeProps={{ className: cn(pillClass, activePillClass) }}
              >
                <Shield className="h-3.5 w-3.5" aria-hidden="true" />
                Admin
              </Link>
            ) : null}
          </div>
        </div>
      </div>

      <div className="container mx-auto flex w-full max-w-7xl flex-1 gap-8 px-4">
        <aside
          className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 border-r border-sidebar-border py-7 pr-5 lg:block"
          aria-label="Workspace navigation"
        >
          <div className="scrollbar-slim h-full overflow-y-auto">
            <SidebarGroup title="Workspace">
              {workspaceItems.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={itemClass}
                  activeProps={{ className: cn(itemClass, activeItemClass) }}
                >
                  <item.icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {item.label}
                </Link>
              ))}
              <Link
                to="/tools/cover-letter"
                search={{ role: "" }}
                className={itemClass}
                activeProps={{ className: cn(itemClass, activeItemClass) }}
              >
                <Sparkles className="h-4 w-4 shrink-0" aria-hidden="true" />
                Cover letter
              </Link>
            </SidebarGroup>

            {isAdmin ? (
              <SidebarGroup title="Administration">
                <Link
                  to="/admin"
                  className={itemClass}
                  activeProps={{ className: cn(itemClass, activeItemClass) }}
                >
                  <Shield className="h-4 w-4 shrink-0" aria-hidden="true" />
                  Admin
                </Link>
              </SidebarGroup>
            ) : null}

            <div className="mt-6 rounded-xl border border-border bg-muted/40 p-4">
              <p className="text-small font-semibold text-foreground">Career tools</p>
              <p className="mt-1 text-small leading-5 text-muted-foreground">
                ResumeIQ, Roadmap, SkillPath, Mentor and InterviewIQ are open to everyone — find
                them under <strong className="font-medium text-foreground">Product</strong> in the
                header.
              </p>
            </div>
          </div>
        </aside>

        <main id="main-content" className="min-w-0 flex-1 py-7 lg:py-9">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarGroup({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="mb-6 last:mb-0">
      <p className="px-3 pb-1.5 text-caption uppercase text-muted-foreground">{title}</p>
      <nav className="grid gap-0.5" aria-label={title}>
        {children}
      </nav>
    </div>
  );
}
