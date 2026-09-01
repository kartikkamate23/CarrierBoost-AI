# Existing application audit

## Baseline discovered

- TanStack Start SSR application with file-based routes and no separate Express backend.
- Supabase email/Google authentication, RLS-protected Postgres records, and a private resume storage bucket.
- Authenticated PDF upload, client text extraction, AI analysis, report history, PDF export, cover-letter generation, and admin reporting.
- Lovable AI Gateway integration using a server-only key.

## Gaps addressed

- Standardized platform/module branding and metadata around CareerBoost AI.
- Removed animation-gated navigation and landing content.
- Removed the Lovable-hosted social preview asset and visible competing branding.
- Added account-free PDF/DOCX/text analysis, privacy disclosures, versioned deterministic scoring, evidence, calculation details, and actionable gaps.
- Added connected roadmap, learning, tutor, project, interview, and job-role experiences.
- Added the first complete Data Engineering syllabus and persistence-ready relational schema.
- Added deterministic and prompt-injection tests, CI, health endpoint, privacy/terms pages, and production documentation.

## Preserved functionality

Existing Supabase authentication, private storage, authenticated report history, AI analysis, PDF export, cover-letter generation, admin controls, dark mode, and SSR deployment remain intact.

## Remaining production work

- Provision a durable queue, malware scanner, rate-limit store, observability provider, and scheduled retention worker.
- Apply the new migration in testing/staging and regenerate Supabase TypeScript types.
- Connect authenticated module pages to the new persistence tables; guest progress currently uses browser storage.
- Validate full email/OAuth, AI, admin, and deletion flows with staging credentials.
