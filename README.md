# CareerBoost AI — Smart Resume Analyzer & Career Guidance Platform

AI-powered resume analysis: upload a PDF resume, get an ATS score out of 100,
missing keywords, grammar/formatting feedback, a career roadmap, skill-gap
analysis, interview questions, recommended courses/videos, a downloadable PDF
report, and an AI cover-letter generator.

## Tech stack

| Layer     | Technology                                                                    |
| --------- | ----------------------------------------------------------------------------- |
| Framework | TanStack Start v1 (React 19 + Vite 7, **SSR** — not a static SPA)             |
| Routing   | TanStack Router (file-based, `src/routes/`)                                   |
| Data      | TanStack Query                                                                |
| Styling   | Tailwind CSS v4 + shadcn/ui + Framer Motion                                   |
| Backend   | TanStack **server functions** (`createServerFn`) — no separate Express server |
| Database  | Supabase Postgres (RLS enforced)                                              |
| Auth      | Supabase Auth — passwordless Email OTP + Google OAuth                         |
| AI        | Lovable AI Gateway (OpenAI-compatible, `google/gemini-2.5-flash`)             |
| PDF       | `pdfjs-dist` (client-side text extraction), `jspdf` (report export)           |
| Deploy    | Nitro (auto-targets Vercel / Cloudflare)                                      |

> This is a **full-stack SSR app**, not a client-only SPA. There is no
> `index.html` and no `dist/` folder — Vite + Nitro produce a server build.

## Project structure

```
.
├── package.json
├── package-lock.json / bun.lock
├── vite.config.ts
├── tsconfig.json
├── wrangler.jsonc          # Cloudflare target (ignored by Vercel)
├── components.json         # shadcn/ui config
├── .env.example
├── .gitignore
├── README.md
├── supabase/               # project config + migrations
└── src/
    ├── routes/             # file-based routes (pages + API routes)
    │   ├── __root.tsx
    │   ├── index.tsx
    │   ├── login.tsx  signup.tsx
    │   ├── _authenticated.tsx        # auth gate
    │   └── _authenticated/           # dashboard, upload, admin, analysis, tools
    ├── components/         # UI + shared components (incl. components/ui)
    ├── hooks/              # use-auth, use-theme, use-mobile
    ├── lib/                # server functions, pdf extraction, utils
    ├── integrations/supabase/  # generated client, admin client, auth middleware
    ├── router.tsx  start.ts  server.ts
    ├── routeTree.gen.ts    # generated — do not edit
    └── styles.css
```

## Local setup

```bash
npm install
cp .env.example .env      # fill in your values
npm run dev               # http://localhost:8080
npm run build             # production build
npm run preview           # preview the production build
```

Node 20+ is required.

## Environment variables

Add all of these in **Vercel → Project → Settings → Environment Variables**
(Production + Preview), and locally in `.env`.

| Variable                        | Required                | Exposed to browser | Purpose                                                                   |
| ------------------------------- | ----------------------- | ------------------ | ------------------------------------------------------------------------- |
| `VITE_SUPABASE_URL`             | yes                     | yes                | Supabase project URL (client)                                             |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | yes                     | yes                | Supabase anon/publishable key (client)                                    |
| `VITE_SUPABASE_PROJECT_ID`      | optional                | yes                | Project ref, informational                                                |
| `SUPABASE_URL`                  | yes                     | no                 | Same URL, used by SSR/server functions                                    |
| `SUPABASE_PUBLISHABLE_KEY`      | yes                     | no                 | Same anon key, used by SSR/server functions                               |
| `SUPABASE_SERVICE_ROLE_KEY`     | only for admin features | no                 | Service-role key used by the admin client. **Never** prefix with `VITE_`. |
| `LOVABLE_API_KEY`               | yes for AI features     | no                 | AI gateway key for resume analysis + cover letters                        |

Without `LOVABLE_API_KEY` the app still builds and runs, but analysis and
cover-letter generation return "AI service is not configured".
Without `SUPABASE_SERVICE_ROLE_KEY` only the admin screens are limited.

Never commit real secret values — `.env` holds them locally, Vercel holds them
in production.

## Upload to GitHub

```bash
git init
git add .
git commit -m "Initial commit: CareerBoost AI"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

## Deploy on Vercel

1. Vercel → **Add New… → Project** → import the GitHub repo.
2. Use these settings:

| Setting              | Value                                                                           |
| -------------------- | ------------------------------------------------------------------------------- |
| **Framework Preset** | `Other`                                                                         |
| **Build Command**    | `npm run build`                                                                 |
| **Output Directory** | _leave empty_ (the build emits the Vercel Build Output API at `.vercel/output`) |
| **Install Command**  | `npm install`                                                                   |
| **Root Directory**   | `./` (repository root)                                                          |
| **Node.js Version**  | 20.x or 22.x                                                                    |

3. Add every environment variable from the table above.
4. Deploy.

### Why there is no `vercel.json`

A previous export shipped a `vercel.json` with an SPA rewrite to
`/index.html`. That is the cause of the 404 / blank page: this app is
server-rendered and has no `index.html`. That file has been **removed**.

The build uses Nitro, which auto-detects Vercel (via the `VERCEL` env var that
Vercel sets during the build) and emits the Vercel Build Output API into
`.vercel/output`. Vercel picks that up automatically — no rewrites, no output
directory, and no extra routing config are needed. Deep links such as
`/dashboard`, `/upload`, and `/analysis/<id>` are handled server-side, so
refreshing or opening a URL directly works.

If you ever need to pin the target explicitly, set the build env var
`NITRO_PRESET=vercel`.

## Supabase / backend setup

The app expects these tables in the `public` schema with RLS enabled
(migrations live in `supabase/`): `profiles`, `resumes`, `reports`,
`cover_letters`, `user_roles` (+ `has_role()` security-definer function).

Auth configuration:

- Enable **Email** provider (OTP / magic link) — no password needed.
- Enable the **Google** provider.
- Set **Site URL** to the primary production origin, for example
  `https://your-app.vercel.app` (no path).
- Add these exact callback patterns to **Allowed Redirect URLs**:
  - `http://localhost:8080/auth/callback` for local development.
  - `https://your-app.vercel.app/auth/callback` for Vercel production.
  - `https://your-preview-domain/auth/callback` for each preview domain you use.
  - `https://your-custom-domain/auth/callback` when a custom domain is connected.

The app derives the callback from `window.location.origin`; it never hardcodes
localhost or a production host. The callback is public, verifies the persisted
session, and only then redirects to the protected dashboard. Do not use a
protected route such as `/dashboard` as the OAuth callback.

To grant yourself admin access, insert a row into `user_roles`:

```sql
insert into public.user_roles (user_id, role)
values ('<your-auth-user-id>', 'admin');
```

## Deployment notes

- `wrangler.jsonc` and `@cloudflare/vite-plugin` remain in the repo so the
  project can also target Cloudflare Workers. They are inert on Vercel.
- `src/routeTree.gen.ts` is generated by the TanStack Router plugin — never
  edit it by hand; add files under `src/routes/` instead.
- All secrets are read via `process.env` **inside** server function handlers,
  so they are never bundled into the client.
