import { motion } from "framer-motion";
import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, LockKeyhole, Mail, MailCheck, UserRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { checkGoogleAuth } from "@/lib/auth.functions";
import { getSafeAuthDestination, rememberAuthDestination } from "@/lib/auth-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emailSchema = z.string().trim().email("Enter a valid email address").max(255);
const passwordSchema = z
  .string()
  .min(8, "Password must contain at least 8 characters")
  .max(72, "Password must contain no more than 72 characters");

type Mode = "signin" | "signup";

function isLovableHostedOrigin(hostname: string) {
  const host = hostname.toLowerCase();
  return (
    host.endsWith(".lovable.app") ||
    host.endsWith(".lovable.dev") ||
    host.endsWith(".lovableproject.com")
  );
}

type AuthErrorLike = { message: string; code?: string; status?: number };

/** Supabase reports its per-email cooldown as "…after 47 seconds". */
function parseRetryAfter(message: string): number | null {
  const match = /after (\d+)\s*seconds?/i.exec(message);
  return match ? Number(match[1]) : null;
}

/**
 * Maps a Supabase auth error to a message that is actionable for the person
 * using the app. The operator-facing cause (e.g. "confirmations are still on")
 * goes to the console instead, so end users never see project configuration
 * instructions they cannot act on.
 */
function friendlyError(error: AuthErrorLike, mode: Mode): string {
  const message = error.message ?? "";
  const code = error.code ?? "";

  const retryAfter = parseRetryAfter(message);
  if (retryAfter !== null) {
    return `Too many attempts. Please wait ${retryAfter} second${retryAfter === 1 ? "" : "s"} and try again.`;
  }

  if (code === "over_email_send_rate_limit" || /email rate limit exceeded/i.test(message)) {
    console.error(
      "[auth] Supabase email delivery limit reached. Turn off Authentication → " +
        "Providers → Email → “Confirm email”, or configure custom SMTP to raise the cap. " +
        "See docs/AUTH-EMAIL-LIMITS.md.",
    );
    return mode === "signup"
      ? "We could not send your confirmation email right now. Please try again in a little while."
      : "We could not send that email right now. Please try again in a little while.";
  }

  if (code === "over_request_rate_limit" || error.status === 429) {
    return "Too many attempts from this device. Please wait a moment and try again.";
  }

  if (/invalid login credentials/i.test(message)) {
    return "Incorrect email or password. Check your details or reset your password.";
  }
  if (/email not confirmed/i.test(message)) {
    return "Please confirm your email address first — check your inbox for the link.";
  }
  if (/user already registered/i.test(message)) {
    return "An account already exists for this email. Sign in or reset your password.";
  }
  if (/weak.?password|password.*(short|least)/i.test(message)) {
    return "Choose a stronger password with at least 8 characters.";
  }
  if (/signups? not allowed|signup is disabled/i.test(message)) {
    return "New sign-ups are currently disabled. Please contact support.";
  }
  return message;
}

export function AuthCard({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { redirect?: string };
  const redirectTo = getSafeAuthDestination(search?.redirect);
  const preflightGoogle = useServerFn(checkGoogleAuth);
  const isSignup = mode === "signup";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  // Set when signup succeeded but Supabase is still requiring email
  // confirmation. This is a normal outcome, not an error.
  const [awaitingConfirmation, setAwaitingConfirmation] = useState<string | null>(null);
  // Seconds left on Supabase's per-email send cooldown; blocks resubmission
  // instead of letting the user burn through the delivery quota.
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((seconds) => seconds - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const reportError = (error: AuthErrorLike) => {
    const retryAfter = parseRetryAfter(error.message ?? "");
    if (retryAfter !== null) setCooldown(retryAfter);
    toast.error(friendlyError(error, mode));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    const parsedEmail = emailSchema.safeParse(email);
    const parsedPassword = passwordSchema.safeParse(password);
    if (!parsedEmail.success) return toast.error(parsedEmail.error.issues[0].message);
    if (!parsedPassword.success) return toast.error(parsedPassword.error.issues[0].message);
    if (isSignup && fullName.trim().length < 2) return toast.error("Enter your full name");
    if (isSignup && password !== confirmPassword) return toast.error("Passwords do not match");

    if (cooldown > 0) {
      return toast.error(`Please wait ${cooldown}s before trying again.`);
    }

    rememberAuthDestination(redirectTo);
    setLoading(true);
    if (isSignup) {
      const { data, error } = await supabase.auth.signUp({
        email: parsedEmail.data,
        password: parsedPassword.data,
        options: {
          data: { full_name: fullName.trim() },
          // Send confirmation links back into the app rather than the
          // project's default Site URL, so the callback route completes them.
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      setLoading(false);
      if (error) return reportError(error);

      // Supabase hides whether an email is already registered by returning a
      // user with no linked identities. Treat that as "already exists".
      if (data.user && data.user.identities?.length === 0) {
        return toast.error("An account already exists for this email. Sign in instead.");
      }

      if (data.session) {
        toast.success("Account created successfully");
        return navigate({ to: redirectTo, replace: true });
      }

      // No session means the project still requires email confirmation. The
      // account was created, so guide the user instead of failing.
      return setAwaitingConfirmation(parsedEmail.data);
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: parsedEmail.data,
      password: parsedPassword.data,
    });
    setLoading(false);
    if (error) return reportError(error);
    toast.success("Welcome back!");
    navigate({ to: redirectTo, replace: true });
  };

  const resendConfirmation = async () => {
    if (!awaitingConfirmation || cooldown > 0) return;
    setLoading(true);
    const { error } = await supabase.auth.resend({
      type: "signup",
      email: awaitingConfirmation,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    setLoading(false);
    if (error) return reportError(error);
    setCooldown(60);
    toast.success("Confirmation email sent again.");
  };

  const sendPasswordReset = async () => {
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) return toast.error("Enter your email first");
    setResetLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(parsed.data, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setResetLoading(false);
    if (error) return reportError(error);
    toast.success("If an account exists, a password-reset email has been sent.");
  };

  const signInWithGoogle = async () => {
    setGoogleLoading(true);
    rememberAuthDestination(redirectTo);
    try {
      if (!isLovableHostedOrigin(window.location.hostname)) {
        const readiness = await preflightGoogle({ data: { origin: window.location.origin } });
        if (!readiness.available) {
          toast.error(readiness.message);
          return;
        }
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: { prompt: "select_account" },
          },
        });
        if (error) reportError(error);
        return;
      }

      const { lovable } = await import("@/integrations/lovable");
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: `${window.location.origin}/auth/callback`,
        extraParams: { prompt: "select_account" },
      });
      if (result.error) toast.error(result.error.message ?? "Google sign-in failed");
    } catch (error) {
      toast.error(error instanceof Error ? friendlyError(error, mode) : "Google sign-in failed");
    } finally {
      setGoogleLoading(false);
    }
  };

  if (awaitingConfirmation) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[26rem]"
      >
        <span
          className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"
          aria-hidden="true"
        >
          <MailCheck className="h-5 w-5" />
        </span>
        <h1 className="mt-5 font-display text-h2 text-foreground">Confirm your email</h1>
        <p className="mt-2 text-body text-muted-foreground">
          Your account was created. We sent a confirmation link to{" "}
          <span className="font-medium text-foreground">{awaitingConfirmation}</span>. Open it to
          finish signing in.
        </p>
        <Button
          type="button"
          variant="outline"
          className="mt-7 h-11 w-full text-body"
          onClick={resendConfirmation}
          disabled={loading || cooldown > 0}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
          {cooldown > 0 ? `Resend available in ${cooldown}s` : "Resend confirmation email"}
        </Button>
        <p className="mt-8 border-t pt-6 text-center text-small text-muted-foreground">
          Wrong address?{" "}
          <button
            type="button"
            onClick={() => setAwaitingConfirmation(null)}
            className="rounded-md font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Go back
          </button>
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="w-full max-w-[26rem]"
    >
      <div>
        <h1 className="font-display text-h2 text-foreground">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-2 text-body text-muted-foreground">
          {isSignup
            ? "Save your reports, track progress and generate cover letters."
            : "Sign in to continue your career workspace."}
        </p>
      </div>

      <Button
        type="button"
        variant="outline"
        className="mt-8 h-11 w-full text-body font-medium"
        onClick={signInWithGoogle}
        disabled={googleLoading || loading}
      >
        {googleLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
        ) : (
          <GoogleIcon className="mr-2 h-4 w-4" />
        )}
        Continue with Google
      </Button>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-border" />
        <span className="text-caption uppercase text-muted-foreground">or use email</span>
        <div className="h-px flex-1 bg-border" />
      </div>

      <form onSubmit={submit} className="space-y-4">
        {isSignup && (
          <Field label="Full name" id="full-name" icon={<UserRound className="h-4 w-4" />}>
            <Input
              id="full-name"
              autoComplete="name"
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              className="h-11 pl-10"
              required
            />
          </Field>
        )}
        <Field label="Email" id="email" icon={<Mail className="h-4 w-4" />}>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="h-11 pl-10"
            placeholder="you@example.com"
            required
          />
        </Field>
        <Field
          label="Password"
          id="password"
          icon={<LockKeyhole className="h-4 w-4" />}
          action={
            !isSignup ? (
              <button
                type="button"
                onClick={sendPasswordReset}
                disabled={resetLoading}
                className="rounded-md text-small font-medium text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
              >
                {resetLoading ? "Sending reset email…" : "Forgot password?"}
              </button>
            ) : null
          }
        >
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            autoComplete={isSignup ? "new-password" : "current-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 px-10"
            minLength={8}
            maxLength={72}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((shown) => !shown)}
            className="absolute right-1 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </Field>
        {isSignup && (
          <Field
            label="Confirm password"
            id="confirm-password"
            icon={<LockKeyhole className="h-4 w-4" />}
          >
            <Input
              id="confirm-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              className="h-11 pl-10"
              minLength={8}
              maxLength={72}
              required
            />
          </Field>
        )}
        <Button
          type="submit"
          className="btn-glow mt-2 h-11 w-full text-body"
          disabled={loading || googleLoading || cooldown > 0}
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
          {cooldown > 0 ? `Try again in ${cooldown}s` : isSignup ? "Create account" : "Sign in"}
        </Button>
        <p className="sr-only" role="status" aria-live="polite">
          {loading
            ? isSignup
              ? "Creating your account."
              : "Signing you in."
            : googleLoading
              ? "Opening Google sign-in."
              : ""}
        </p>
      </form>

      {isSignup ? (
        <p className="mt-5 text-small leading-6 text-muted-foreground">
          By creating an account you agree to our{" "}
          <Link
            to="/terms"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            terms
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
          >
            privacy notice
          </Link>
          .
        </p>
      ) : null}

      <p className="mt-8 border-t pt-6 text-center text-small text-muted-foreground">
        {isSignup ? "Already have an account? " : "New here? "}
        <Link
          to={isSignup ? "/login" : "/signup"}
          className="rounded-md font-semibold text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isSignup ? "Sign in" : "Create an account"}
        </Link>
      </p>
    </motion.div>
  );
}

function Field({
  label,
  id,
  icon,
  action,
  children,
}: {
  label: string;
  id: string;
  icon: ReactNode;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between gap-3">
        <Label htmlFor={id} className="text-small font-medium">
          {label}
        </Label>
        {action}
      </div>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          {icon}
        </span>
        {children}
      </div>
    </div>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.26 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.1A6.5 6.5 0 0 1 5.5 12c0-.73.13-1.44.34-2.1V7.06H2.18A11 11 0 0 0 1 12c0 1.77.42 3.45 1.18 4.94l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"
      />
    </svg>
  );
}
