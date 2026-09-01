import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { Loader2, LockKeyhole } from "lucide-react";
import { toast } from "sonner";
import { AuthLayout } from "@/components/shell/auth-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/reset-password")({
  ssr: false,
  component: ResetPasswordPage,
  head: () => ({ meta: [{ title: "Reset password | CareerBoost AI" }] }),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (password.length < 8) {
      toast.error("Password must contain at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSaving(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Password updated successfully");
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-[26rem]">
        {authLoading ? (
          <div className="flex flex-col items-center text-center" aria-live="polite">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
            </span>
            <p className="mt-4 text-body font-medium text-foreground">
              Validating your reset link…
            </p>
            <p className="mt-1 text-small text-muted-foreground">This only takes a moment.</p>
          </div>
        ) : !user ? (
          <div className="text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-warning/10 text-warning">
              <LockKeyhole className="h-5 w-5" aria-hidden="true" />
            </span>
            <h1 className="mt-5 font-display text-h2 text-foreground">Reset link expired</h1>
            <p className="mt-2 text-body text-muted-foreground">
              Password-reset links are single-use and time-limited. Request a new one from the
              sign-in page.
            </p>
            <Button asChild className="mt-7 h-11 w-full text-body">
              <Link to="/login">Return to sign in</Link>
            </Button>
          </div>
        ) : (
          <>
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <LockKeyhole className="h-5 w-5" aria-hidden="true" />
            </span>
            <h1 className="mt-5 font-display text-h2 text-foreground">Choose a new password</h1>
            <p className="mt-2 text-body text-muted-foreground">
              Use at least 8 characters. You will be signed in once it is saved.
            </p>

            <form onSubmit={submit} className="mt-8 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-small font-medium">
                  New password
                </Label>
                <Input
                  id="new-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="h-11"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-new-password" className="text-small font-medium">
                  Confirm new password
                </Label>
                <Input
                  id="confirm-new-password"
                  type="password"
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={72}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  className="h-11"
                  required
                />
              </div>
              <Button
                type="submit"
                className="btn-glow mt-2 h-11 w-full text-body"
                disabled={saving}
              >
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
                Update password
              </Button>
              <p className="sr-only" role="status" aria-live="polite">
                {saving ? "Updating your password." : ""}
              </p>
            </form>
          </>
        )}
      </div>
    </AuthLayout>
  );
}
