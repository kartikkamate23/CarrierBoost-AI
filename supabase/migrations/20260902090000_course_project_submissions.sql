-- Store the single end-of-course project submission together with the
-- authenticated learner identity.  This is intentionally separate from
-- project_submissions, whose project_id references the legacy seeded catalog.
-- A server-side Google Sheets sync can consume this table without exposing a
-- Sheets credential to the browser.

create table if not exists public.course_project_submissions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_slug text not null,
  project_title text not null,
  github_url text not null,
  learner_name text not null default '',
  learner_email text not null default '',
  final_assessment_score smallint not null default 0 check (final_assessment_score between 0 and 100),
  certificate_eligible boolean not null default false,
  status text not null default 'submitted' check (status in ('submitted','reviewing','approved','changes_requested')),
  submitted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, course_slug)
);

create index if not exists idx_course_project_submissions_course
  on public.course_project_submissions(course_slug, submitted_at desc);
create index if not exists idx_course_project_submissions_email
  on public.course_project_submissions(lower(learner_email), submitted_at desc);

alter table public.course_project_submissions enable row level security;

drop policy if exists "course_project_submissions_owner" on public.course_project_submissions;
create policy "course_project_submissions_owner"
  on public.course_project_submissions
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "course_project_submissions_admin_read" on public.course_project_submissions;
create policy "course_project_submissions_admin_read"
  on public.course_project_submissions
  for select
  using (public.has_role(auth.uid(), 'admin'));

-- Keep identity fields trustworthy when the browser submits a row. The
-- authenticated email is always taken from the JWT when available; callers
-- can still provide a display name from user_metadata.
create or replace function public.set_course_submission_identity()
returns trigger
language plpgsql
security invoker
set search_path = public
as $$
begin
  new.learner_email := coalesce(nullif(auth.jwt() ->> 'email', ''), new.learner_email, '');
  new.learner_name := coalesce(
    nullif(auth.jwt() -> 'user_metadata' ->> 'full_name', ''),
    nullif(auth.jwt() -> 'user_metadata' ->> 'name', ''),
    new.learner_name,
    ''
  );
  return new;
end;
$$;

drop trigger if exists set_course_submission_identity on public.course_project_submissions;
create trigger set_course_submission_identity
before insert or update on public.course_project_submissions
for each row execute function public.set_course_submission_identity();
for each row execute function public.set_course_submission_identity();
