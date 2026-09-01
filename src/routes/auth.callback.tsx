import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { consumeAuthDestination } from "@/lib/auth-navigation";
import { Button } from "@/components/ui/button";
import { BrandMark, BrandWordmark } from "@/components/shell/brand-mark";

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
        setError(
          userError?.message ??
            "Google sign-in completed without a valid session. Please try again.",
        );
        return;
      }

      const destination = consumeAuthDestination();
      navigate({ to: destination, replace: true });
    };

    void completeSignIn();
    return () => {
      active = false;
    };
  }, [navigate]);

  if (error) {
    return (
      <main className="flex min-h-screen items-center justify-center px-5 py-12">
        <div className="w-full max-w-[26rem] text-center">
          <span
            className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-destructive/10 text-destructive"
            aria-hidden="true"
          >
            <AlertCircle className="h-5 w-5" />
          </span>
          <h1 className="mt-5 font-display text-h2 text-foreground">
            Sign-in could not be completed
          </h1>
          <p className="mt-2 text-body text-muted-foreground">{error}</p>
          <Button
            className="mt-7 h-11 w-full text-body"
            onClick={() => navigate({ to: "/login", replace: true })}
          >
            Return to sign in
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center px-5 py-12"
      aria-live="polite"
    >
      <div className="flex items-center gap-2.5">
        <BrandMark />
        <BrandWordmark />
      </div>
      <span
        className="mt-10 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"
        aria-hidden="true"
      >
        <Loader2 className="h-5 w-5 animate-spin" />
      </span>
      <h1 className="mt-5 font-display text-h3 text-foreground">Completing your sign-in</h1>
      <p className="mt-1.5 text-small text-muted-foreground">
        Your workspace will open automatically.
      </p>
    </main>
  );
}
