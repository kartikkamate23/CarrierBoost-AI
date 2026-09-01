import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthLayout } from "@/components/shell/auth-layout";
import { AuthCard } from "@/components/auth-card";
import { useAuth } from "@/hooks/use-auth";
import { getSafeAuthDestination } from "@/lib/auth-navigation";

export const Route = createFileRoute("/login")({
  ssr: false,
  validateSearch: (s: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof s.redirect === "string" ? s.redirect : undefined,
  }),

  component: LoginPage,
  head: () => ({ meta: [{ title: "Sign in | CareerBoost AI" }] }),
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
    <AuthLayout>
      <AuthCard mode="signin" />
    </AuthLayout>
  );
}
