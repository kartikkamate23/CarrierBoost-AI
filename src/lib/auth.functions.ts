import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const inputSchema = z.object({
  origin: z.string().url().max(500),
});

export const checkGoogleAuth = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => inputSchema.parse(input))
  .handler(async ({ data }) => {
    const supabaseUrl = process.env.SUPABASE_URL;
    const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;
    if (!supabaseUrl || !publishableKey) {
      return {
        available: false,
        message: "Google sign-in is unavailable because Supabase is not configured.",
      };
    }

    const origin = new URL(data.origin);
    if (origin.protocol !== "http:" && origin.protocol !== "https:") {
      return { available: false, message: "Invalid sign-in origin." };
    }

    const authorizeUrl = new URL("/auth/v1/authorize", supabaseUrl);
    authorizeUrl.searchParams.set("provider", "google");
    authorizeUrl.searchParams.set("redirect_to", `${origin.origin}/auth/callback`);
    authorizeUrl.searchParams.set("prompt", "select_account");

    try {
      const response = await fetch(authorizeUrl, {
        headers: { apikey: publishableKey },
        redirect: "manual",
      });
      if (response.status >= 300 && response.status < 400) return { available: true };

      const body = await response.text();
      const missingCredentials = /missing oauth secret|unsupported provider/i.test(body);
      return {
        available: false,
        message: missingCredentials
          ? "Google sign-in needs a Google OAuth client ID and secret in Supabase Auth settings."
          : "Google sign-in is temporarily unavailable. Please use email and password.",
      };
    } catch {
      return {
        available: false,
        message: "Google sign-in could not be reached. Please use email and password.",
      };
    }
  });
