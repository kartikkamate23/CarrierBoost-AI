import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { AuthCard } from "@/components/auth-card";
import { useAuth } from "@/hooks/use-auth";
import { getSafeAuthDestination } from "@/lib/auth-navigation";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),

  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in — ResumeIQ" }] }),
});

function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { redirect } = Route.useSearch();
  const target = getSafeAuthDestination(redirect);

  useEffect(() => {
    if (user) navigate({ to: target, replace: true });
  }, [user, target, navigate]);


  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <AuthCard mode="signin" />
      </main>
    </div>
  );
}
