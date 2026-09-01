import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { AuthLayout } from "@/components/shell/auth-layout";
import { AuthCard } from "@/components/auth-card";
import { useAuth } from "@/hooks/use-auth";
import { getSafeAuthDestination } from "@/lib/auth-navigation";

export const Route = createFileRoute("/signup")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === "string" ? search.redirect : undefined,
  }),
  component: SignupPage,
  head: () => ({ meta: [{ title: "Create account | CareerBoost AI" }] }),
});

function SignupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { redirect } = Route.useSearch();
  const target = getSafeAuthDestination(redirect);

  useEffect(() => {
    if (user) navigate({ to: target, replace: true });
  }, [user, target, navigate]);

  return (
    <AuthLayout>
      <AuthCard mode="signup" />
    </AuthLayout>
  );
}
