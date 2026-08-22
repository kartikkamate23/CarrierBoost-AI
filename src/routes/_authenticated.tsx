import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { useAuth } from "@/hooks/use-auth";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  component: AuthLayout,
});

function AuthLayout() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const destination = useRouterState({ select: (state) => state.location.href });

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/login", search: { redirect: destination }, replace: true });
    }
  }, [destination, loading, navigate, user]);

  if (loading || !user) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4" aria-live="polite">
        <div className="text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-3 text-sm text-muted-foreground">Checking your session…</p>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>
    </div>
  );
}
