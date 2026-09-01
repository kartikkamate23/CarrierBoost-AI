# Deployment and operations

## Environments

Use separate Supabase projects and secrets for testing, staging, and production. Never promote production resume data into lower environments. Copy `.env.example` and supply only environment-specific values through the hosting secret manager.

## Release

1. Run `npm ci`, `npm test`, and `npm run build`.
2. Back up the target database and record the currently deployed commit.
3. Apply Supabase migrations to testing, then staging.
4. Run authentication, RLS, upload, analysis, roadmap, assessment, project, interview, and deletion smoke tests.
5. Deploy the same commit to production and verify `/api/health`.
6. Monitor error rate, latency, AI cost, queue depth, storage growth, and database saturation.

## Rollback

Redeploy the previous known-good commit. Database migrations are additive; avoid destructive down-migrations during an incident. Disable newly introduced UI paths with deployment configuration if a dependent service is unhealthy, then restore from the pre-release backup only when data integrity requires it.

## Backups and retention

Enable daily database backups and point-in-time recovery where available. Test restore procedures quarterly. Run a scheduled job that permanently deletes expired resume objects and their database records, records only non-sensitive audit metadata, and never logs extracted resume text.

## Required secrets

Supabase URL/publishable settings are required for auth. `SUPABASE_SERVICE_ROLE_KEY` is required only by privileged admin/server workflows. `LOVABLE_API_KEY` enables provider-backed analysis and tutor capabilities. Missing AI configuration must produce a clear unavailable state; it must never activate fabricated production results.
