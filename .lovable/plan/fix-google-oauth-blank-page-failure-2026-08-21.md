# Fix Google OAuth blank-page failure

## Implementation
- Correct the protected TanStack route gate so it runs client-side, validates the user with the auth server, and redirects missing sessions without rendering an empty layout.
- Make OAuth return handling session-aware: preserve only a safe same-origin destination, wait for the managed Google flow to establish a verified session, then navigate to the dashboard/analyzer.
- Consolidate auth state initialization and transitions to avoid duplicate listeners, cache refetches after sign-out, and route invalidation races.
- Harden sign-out ordering and navigation so protected cached state is cleared and Back/refresh cannot restore a stale authenticated screen.
- Add visible authentication and protected-route error states rather than a blank page.

## Verification
- Check OAuth provider configuration and environment usage without exposing server credentials.
- Run focused type/lint checks and the production build through the project harness.
- Exercise public login, protected-route redirect, authenticated dashboard refresh, and logout in the browser; verify there are no runtime or console errors.

## Redirect configuration
- Use the runtime application origin, so localhost, Lovable preview/production, and Vercel/custom production origins work without hardcoded hosts.
- Document the exact allowed origins/callback URLs required by the backend authentication URL configuration.
