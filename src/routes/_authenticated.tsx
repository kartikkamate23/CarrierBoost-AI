import {
  createFileRoute,
  Outlet,
  useHydrated,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthLayout,
});

function AuthLayout() {
  const { user, loading } = useAuth();
  const hydrated = useHydrated();
  const navigate = useNavigate();
  const destination = useRouterState({ select: (state) => state.location.href });

  useEffect(() => {
    if (hydrated && !loading && !user) {
      navigate({ to: "/login", search: { redirect: destination }, replace: true });
    }
  }, [destination, hydrated, loading, navigate, user]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4" aria-live="polite">
        <div className="flex flex-col items-center text-center">
          <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
          </span>
          <p className="mt-4 text-body font-medium text-foreground">Checking your session…</p>
          <p className="mt-1 text-small text-muted-foreground">This only takes a moment.</p>
        </div>
      </main>
    );
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
