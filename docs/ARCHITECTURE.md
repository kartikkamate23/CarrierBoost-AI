# CareerBoost AI architecture

## Current system

CareerBoost AI remains on the existing TanStack Start SSR stack: React 19, TypeScript, Vite/Nitro, TanStack Router and Query, Tailwind, Supabase Auth/Postgres/private storage, and server functions. This avoids an unnecessary migration while preserving server-only secrets and row-level authorization.

The platform modules are CareerBoost AI (shell), ResumeIQ (analysis), SkillPath (learning), ProjectLab (evidence), InterviewIQ (practice), and JobMatch (role discovery).

## Analysis pipeline

Guest analysis runs locally and retains input only in browser session storage. It uses deterministic parsing, a versioned role competency map, rule-based evidence extraction, and ten explainable scores. Signed-in AI analysis remains a server function and sends explicitly delimited, untrusted resume data to the configured provider. AI output explains recommendations; numerical scoring should migrate fully to the deterministic rubric before persisted reports are recalculated.

`careerboost-2026.1` is the initial deterministic rubric. Every dimension exposes detected evidence, missing signals, calculation, next action, and expected improvement. Rubric versions are persisted for traceability.

## Agent/service boundaries

The intended service boundaries are Career Profile, Target Role, Skill Gap, Roadmap, Tutor, Project Recommendation, Project Review, Resume Improvement, Interview, Validation, and Final Report. Shared data contracts should use Zod-validated JSON. The current vertical slice implements deterministic profile/gap/roadmap services and guarded user experiences; provider-backed services remain behind server-only credentials.

## Data and authorization

Supabase stores user-owned resumes, reports, roadmaps, progress, assessments, project submissions, evaluations, mastery, conversations, and interviews. Public role maps, courses, lessons, and project briefs are read-only to anonymous users. User-owned entities use `auth.uid() = user_id` RLS policies. Administrative verification uses the existing `has_role` security-definer function.

Resume files are private, user-scoped, expiry-aware, and deletable. Guest files are never uploaded. Production should add an asynchronous malware-scanning quarantine before a new file becomes available for analysis.

## Known infrastructure boundaries

Long-running AI analysis, malware scanning, and project evaluation need a durable queue before high-volume production. Redis/queue infrastructure was not added because no managed service is configured. Payment processing is deliberately disabled.
