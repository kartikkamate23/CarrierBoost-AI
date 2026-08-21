import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { consumeAuthDestination } from "@/lib/auth-navigation";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/auth/callback")({
  ssr: false,
  component: OAuthCallbackPage,
  head: () => ({
    meta: [
      { title: "Completing sign in — CareerBoost AI" },
      { name: "description", content: "Completing your secure CareerBoost AI sign-in." },
      { property: "og:title", content: "Completing sign in — CareerBoost AI" },
      { property: "og:description", content: "Completing your secure CareerBoost AI sign-in." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
});

function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const completeSignIn = async () => {
      const { data, error: userError } = await supabase.auth.getUser();
      if (!active) return;

      if (userError || !data.user) {
        setError(userError?.message ?? "Google sign-in completed without a valid session. Please try again.");
        return;
      }

      const destination = consumeAuthDestination();
      navigate({ to: destination, replace: true });
    };

    void completeSignIn();
    return () => { active = false; };
  }, [navigate]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <div className="glass-strong w-full max-w-md rounded-2xl p-8 text-center shadow-elevated">
          <AlertCircle className="mx-auto h-10 w-10 text-destructive" />
          <h1 className="mt-4 text-xl font-semibold">Sign-in could not be completed</h1>
          <p className="mt-2 text-sm text-muted-foreground">{error}</p>
          <Button className="mt-6" onClick={() => navigate({ to: "/login", replace: true })}>
            Return to sign in
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4" aria-live="polite">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <h1 className="mt-4 text-lg font-semibold">Completing your sign-in</h1>
        <p className="mt-1 text-sm text-muted-foreground">Your dashboard will open automatically.</p>
      </div>
    </main>
  );
}