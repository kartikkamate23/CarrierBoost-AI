create table if not exists public.hitavir_course_progress (
  id uuid primary key default gen_random_uuid(),
  learner_email text not null,
  course_slug text not null,
  status text not null default 'in_progress' check (status in ('in_progress', 'completed')),
  progress_percent smallint not null default 0 check (progress_percent between 0 and 100),
  completed_at timestamptz,
  source_event_id text not null unique,
  last_event_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (learner_email, course_slug)
);

create index if not exists idx_hitavir_progress_learner
  on public.hitavir_course_progress (lower(learner_email), updated_at desc);

alter table public.hitavir_course_progress enable row level security;

drop policy if exists "hitavir_progress_owner_read" on public.hitavir_course_progress;
create policy "hitavir_progress_owner_read"
  on public.hitavir_course_progress
  for select
  using (lower(learner_email) = lower(coalesce(auth.jwt() ->> 'email', '')));

-- Inserts and updates are intentionally excluded from client RLS policies.
-- Only the service-role webhook can record verified Hitavir progress.
