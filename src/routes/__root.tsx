import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { AuthProvider } from "@/hooks/use-auth";
import { ThemeProvider } from "@/hooks/use-theme";
import { Toaster } from "@/components/ui/sonner";
import { PageTransition } from "@/components/page-transition";
import { AmbientBackground } from "@/components/ambient-background";

export function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface-card max-w-md p-10 text-center">
        <p className="text-gradient font-display text-display leading-none">404</p>
        <h1 className="mt-5 font-display text-h2 text-foreground">Page not found</h1>
        <p className="mt-2 text-body text-muted-foreground">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-5 text-small font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Back home
        </Link>
      </div>
    </div>
  );
}

export function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  const message =
    error instanceof Error
      ? error.message
      : typeof error === "string" && error.trim()
        ? error
        : "An unexpected error occurred. Please try again.";
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface-card max-w-md p-10 text-center">
        <h1 className="font-display text-h2 text-foreground">Something went wrong</h1>
        <p className="mt-2 break-words text-body text-muted-foreground">{message}</p>
        <div className="mt-7 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex min-h-11 items-center rounded-lg bg-primary px-4 text-small font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Try again
          </button>
          <a
            href="/"
            className="inline-flex min-h-11 items-center rounded-lg border border-border bg-card px-4 text-small font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Go home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CareerBoost AI | From Resume Gaps to Job-Ready Skills" },
      {
        name: "description",
        content:
          "Analyze your resume, identify career gaps, and follow a personalized path toward your target role.",
      },
      { property: "og:title", content: "CareerBoost AI | From Resume Gaps to Job-Ready Skills" },
      {
        property: "og:description",
        content:
          "From resume gaps to job-ready skills with explainable analysis and personalized learning.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "CareerBoost AI" },
      { property: "og:locale", content: "en_US" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "CareerBoost AI | From Resume Gaps to Job-Ready Skills" },
      {
        name: "twitter:description",
        content:
          "From resume gaps to job-ready skills with explainable analysis and personalized learning.",
      },
      { name: "theme-color", media: "(prefers-color-scheme: light)", content: "#ffffff" },
      { name: "theme-color", media: "(prefers-color-scheme: dark)", content: "#1b1a24" },
    ],
    links: [
      // Plus Jakarta Sans + Inter back the --font-display / --font-sans tokens.
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap",
      },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "stylesheet", href: appCss },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        {/*
          Scroll-reveal fallback. Framer Motion server-renders its hidden state
          as an inline `opacity:0`, which without JavaScript would never be
          animated away. This restores those elements for non-JS readers only —
          it is inert whenever scripting is available, and changes no behavior.
        */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html: '[style*="opacity:0"]{opacity:1!important;transform:none!important}',
            }}
          />
        </noscript>
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <MotionConfig reducedMotion="user">
        <ThemeProvider>
          <AuthProvider>
            <AmbientBackground />
            <PageTransition>
              <Outlet />
            </PageTransition>
            <Toaster richColors position="top-right" />
          </AuthProvider>
        </ThemeProvider>
      </MotionConfig>
    </QueryClientProvider>
  );
}
