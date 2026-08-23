import { motion, AnimatePresence } from "framer-motion";
import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearch } from "@tanstack/react-router";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft, KeyRound } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { getSafeAuthDestination, rememberAuthDestination } from "@/lib/auth-navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);
const otpSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Enter the 6-digit code");

type Mode = "signin" | "signup";

function isLovableHost() {
  const host = window.location.hostname;
  return (
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".lovable.app") ||
    host.endsWith(".lovable.dev") ||
    host.endsWith(".lovableproject.com")
  );
}


export function AuthCard({ mode }: { mode: Mode }) {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { redirect?: string };
  const redirectTo = getSafeAuthDestination(search?.redirect);

  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const isSignup = mode === "signup";

  const sendOtp = async (e?: FormEvent) => {
    e?.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    rememberAuthDestination(redirectTo);
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: parsed.data,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Check your email for the 6-digit code");
    setStep("otp");
  };

  const verifyOtp = async (e: FormEvent) => {
    e.preventDefault();
    const parsed = otpSchema.safeParse(otp);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: parsed.data,
      type: "email",
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(isSignup ? "Welcome to ResumeIQ!" : "Welcome back!");
    navigate({ to: redirectTo });
  };

  const resend = async () => {
    setResending(true);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setResending(false);
    if (error) toast.error(error.message);
    else toast.success("New code sent");
  };

  const signInWithGoogle = async () => {
    setGoogleLoading(true);
    rememberAuthDestination(redirectTo);
    const callbackUrl = `${window.location.origin}/auth/callback`;

    try {
      // Lovable's managed Google OAuth broker relies on /~oauth/* paths that only
      // exist behind Lovable hosting. On any other host (Vercel, custom deploys)
      // those paths 404, so go straight to the backend's own Google provider.
      if (!isLovableHost()) {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: callbackUrl, queryParams: { prompt: "select_account" } },
        });
        if (error) {
          setGoogleLoading(false);
          toast.error(
            error.message.includes("provider")
              ? "Google sign-in isn't configured for this domain yet. Add your Google OAuth client in the backend auth settings, or use the email code below."
              : error.message,
          );
        }
        return;
      }

      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: callbackUrl,
        extraParams: { prompt: "select_account" },
      });
      if (result.error) {
        setGoogleLoading(false);
        toast.error(result.error.message ?? "Google sign-in failed");
        return;
      }
      if (result.redirected) return;

      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) {
        setGoogleLoading(false);
        toast.error(error?.message ?? "Google sign-in did not create a valid session");
        return;
      }
      navigate({ to: redirectTo, replace: true });
    } catch (error) {
      setGoogleLoading(false);
      toast.error(error instanceof Error ? error.message : "Google sign-in failed");
    }
  };



  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="glass-strong w-full max-w-md rounded-2xl p-8 shadow-elevated"
    >
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">
          {isSignup ? "Create your account" : "Welcome back"}
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {isSignup
            ? "Sign up in seconds — no password required."
            : "Sign in with a one-time code or Google."}
        </p>
      </div>

      <div className="mt-8">
        <Button
          type="button"
          variant="outline"
          className="w-full h-11"
          onClick={signInWithGoogle}
          disabled={googleLoading || loading}
        >
          {googleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <GoogleIcon className="mr-2 h-4 w-4" />
          )}
          Continue with Google
        </Button>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs uppercase tracking-wider text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <AnimatePresence mode="wait">
          {step === "email" ? (
            <motion.form
              key="email"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.2 }}
              onSubmit={sendOtp}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-11"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
              <Button type="submit" className="w-full h-11 btn-glow" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send login code
              </Button>
            </motion.form>
          ) : (
            <motion.form
              key="otp"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.2 }}
              onSubmit={verifyOtp}
              className="space-y-4"
            >
              <div className="space-y-1.5">
                <Label htmlFor="otp">6-digit code</Label>
                <div className="relative">
                  <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="otp"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    className="pl-9 h-11 tracking-[0.4em] font-mono text-center"
                    placeholder="••••••"
                  />
                </div>
                <p className="text-xs text-muted-foreground pt-1">
                  Sent to <span className="font-medium text-foreground">{email}</span>
                </p>
              </div>
              <Button
                type="submit"
                className="w-full h-11 btn-glow"
                disabled={loading || otp.length !== 6}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify & continue
              </Button>
              <div className="flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setStep("email");
                    setOtp("");
                  }}
                  className="inline-flex items-center text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="mr-1 h-3 w-3" /> Change email
                </button>
                <button
                  type="button"
                  onClick={resend}
                  disabled={resending}
                  className="text-primary hover:underline disabled:opacity-60"
                >
                  {resending ? "Sending…" : "Resend code"}
                </button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        {isSignup ? (
          <>
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </>
        ) : (
          <>
            New here?{" "}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Create an account
            </Link>
          </>
        )}
      </p>
    </motion.div>
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
