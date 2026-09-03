# Auth email confirmations and rate limits

## The problem

Signup failed with:

> Email signup is blocked because Supabase confirmation emails are still
> enabled and the delivery limit was reached.

Two things combined to cause it:

1. **"Confirm email" is enabled** on the hosted project, so every `signUp()`
   triggers a confirmation email.
2. **The built-in Supabase mailer has a hard, low hourly cap** (a handful of
   messages per hour) and is documented as not for production. Once the cap is
   hit, `signUp()` returns `over_email_send_rate_limit` and no account is
   created.

## The fix

Pick **one** of the two options below. Option A is the fastest unblock;
option B is what you want before real users sign up.

### Option A — turn confirmations off (unblocks signup immediately)

Supabase Dashboard → **Authentication → Providers → Email** → turn **Confirm
email** OFF → Save.

`signUp()` then returns a session straight away and sends no email, so the
delivery limit can no longer block signup. This is mirrored in
`supabase/config.toml` as `[auth.email] enable_confirmations = false`.

### Option B — keep confirmations, add custom SMTP

Supabase Dashboard → **Project Settings → Authentication → SMTP Settings** →
enable custom SMTP and fill in a real provider (Resend, SendGrid, Postmark,
SES). Only once this is set does raising `email_sent` have any effect.

The matching block is commented out in `supabase/config.toml` under
`[auth.email.smtp]`.

## Rate limits (set to 10000)

Dashboard → **Authentication → Rate Limits**. These mirror
`[auth.rate_limit]` in `supabase/config.toml`:

| Setting                            | Value | Window            |
| ---------------------------------- | ----- | ----------------- |
| Emails sent (`email_sent`)         | 10000 | per hour, project |
| SMS sent (`sms_sent`)              | 10000 | per hour, project |
| Anonymous sign-ins                 | 10000 | per 5 min, per IP |
| Token refreshes (`token_refresh`)  | 10000 | per 5 min, per IP |
| Sign-ins / sign-ups                | 10000 | per 5 min, per IP |
| Token verifications                | 10000 | per 5 min, per IP |
| Web hooks (`web_hook`)             | 10000 | per hour          |

> **`email_sent = 10000` only takes effect with custom SMTP.** With the
> built-in mailer, Supabase enforces its own low cap regardless of this value.

> **Note:** `supabase/config.toml` configures the **local** stack
> (`supabase start`). The hosted project (`yutzixmjzvfvhpyszbpu`) reads from
> the dashboard, so the settings above must be applied there by hand — the
> file is the source of truth for what they should be, not a live mirror.

Raising the per-IP limits to 10000 effectively disables IP-based brute-force
throttling, so keep a strong password policy and CAPTCHA (Authentication →
Settings → Enable CAPTCHA protection) in mind before shipping.

## What the app does now

`src/components/auth-card.tsx` was hardened so a mail problem degrades
gracefully rather than dead-ending:

- **Confirmation required is no longer an error.** When `signUp()` succeeds but
  returns no session, the card shows a "Confirm your email" panel with a
  resend button, instead of the old hard failure.
- **Confirmation links return to the app** via
  `emailRedirectTo: <origin>/auth/callback`, rather than the project's default
  Site URL.
- **Cooldowns are respected.** Supabase's "try again after N seconds" is parsed
  into a countdown that disables the submit and resend buttons.
- **Errors are user-appropriate.** Messages no longer tell end users to change
  Supabase project settings; the operator-facing cause is logged to the console
  instead.
- **Already-registered emails are detected** via the empty `identities` array
  Supabase returns when it obfuscates an existing account.
