-- CareerBoost AI career operating system schema.
-- All user-owned tables enforce ownership through RLS. Resume text remains untrusted content.

alter table public.resumes
  add column if not exists mime_type text,
  add column if not exists expires_at timestamptz default (now() + interval '30 days'),
  add column if not exists training_consent boolean not null default false,
  add column if not exists deleted_at timestamptz;

alter table public.analysis_reports
  add column if not exists rubric_version text not null default 'careerboost-2026.1',
  add column if not exists score_breakdown jsonb not null default '{}'::jsonb,
  add column if not exists disclaimer text not null default 'Estimated from a transparent rubric; results are not guaranteed across every ATS.';

create table if not exists public.target_roles (
  id uuid primary key default gen_random_uuid(), slug text unique not null,
  title text not null, description text, active boolean not null default true,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.competency_maps (
  id uuid primary key default gen_random_uuid(), target_role_id uuid not null references public.target_roles(id) on delete cascade,
  version text not null, competencies jsonb not null, verified_at timestamptz, created_at timestamptz not null default now(),
  unique(target_role_id, version)
);
create table if not exists public.roadmaps (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  target_role_id uuid references public.target_roles(id), title text not null, preferences jsonb not null default '{}'::jsonb,
  status text not null default 'active' check(status in ('draft','active','complete','archived')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.roadmap_milestones (
  id uuid primary key default gen_random_uuid(), roadmap_id uuid not null references public.roadmaps(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, position integer not null,
  title text not null, milestone_type text not null, scheduled_for date, estimated_minutes integer,
  status text not null default 'planned' check(status in ('planned','active','complete','skipped')),
  evidence jsonb not null default '{}'::jsonb, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.courses (
  id uuid primary key default gen_random_uuid(), slug text unique not null, title text not null,
  description text, published boolean not null default false, metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.course_modules (
  id uuid primary key default gen_random_uuid(), course_id uuid not null references public.courses(id) on delete cascade,
  position integer not null, title text not null, description text, unique(course_id, position)
);
create table if not exists public.lessons (
  id uuid primary key default gen_random_uuid(), module_id uuid not null references public.course_modules(id) on delete cascade,
  position integer not null, title text not null, content jsonb not null default '{}'::jsonb,
  estimated_minutes integer not null default 20, unique(module_id, position)
);
create table if not exists public.lesson_progress (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid not null references public.lessons(id) on delete cascade, status text not null default 'started',
  confidence smallint check(confidence between 0 and 100), completed_at timestamptz, updated_at timestamptz not null default now(),
  unique(user_id, lesson_id)
);
create table if not exists public.assessment_attempts (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id uuid references public.lessons(id), score smallint not null check(score between 0 and 100),
  answers jsonb not null default '{}'::jsonb, feedback jsonb not null default '{}'::jsonb,
  passed boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(), slug text unique not null, title text not null,
  brief jsonb not null, rubric jsonb not null, published boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.project_submissions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id), repository_url text not null,
  status text not null default 'submitted' check(status in ('draft','submitted','reviewing','verified','changes_requested')),
  submitted_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.project_evaluations (
  id uuid primary key default gen_random_uuid(), submission_id uuid not null references public.project_submissions(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, rubric_version text not null,
  scores jsonb not null, feedback jsonb not null, verified boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.mastery_records (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  skill text not null, level text not null, source_type text not null check(source_type in ('assessment','project','interview')),
  source_id uuid not null, score smallint check(score between 0 and 100), verified_at timestamptz not null default now(),
  unique(user_id, skill, source_type, source_id)
);
create table if not exists public.ai_conversations (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  mode text not null, context jsonb not null default '{}'::jsonb, messages jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table if not exists public.interview_sessions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  target_role text not null, questions jsonb not null, answers jsonb not null default '[]'::jsonb,
  score_breakdown jsonb not null default '{}'::jsonb, status text not null default 'active',
  created_at timestamptz not null default now(), completed_at timestamptz
);
create table if not exists public.audit_logs (
  id bigint generated always as identity primary key, user_id uuid references auth.users(id) on delete set null,
  event_type text not null, entity_type text, entity_id text, metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_roadmaps_user on public.roadmaps(user_id, status);
create index if not exists idx_milestones_user on public.roadmap_milestones(user_id, scheduled_for);
create index if not exists idx_progress_user on public.lesson_progress(user_id, updated_at desc);
create index if not exists idx_submissions_user on public.project_submissions(user_id, submitted_at desc);
create index if not exists idx_mastery_user on public.mastery_records(user_id, verified_at desc);
create index if not exists idx_interviews_user on public.interview_sessions(user_id, created_at desc);
create index if not exists idx_resume_expiry on public.resumes(expires_at) where deleted_at is null;

alter table public.target_roles enable row level security;
alter table public.competency_maps enable row level security;
alter table public.roadmaps enable row level security;
alter table public.roadmap_milestones enable row level security;
alter table public.courses enable row level security;
alter table public.course_modules enable row level security;
alter table public.lessons enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.assessment_attempts enable row level security;
alter table public.projects enable row level security;
alter table public.project_submissions enable row level security;
alter table public.project_evaluations enable row level security;
alter table public.mastery_records enable row level security;
alter table public.ai_conversations enable row level security;
alter table public.interview_sessions enable row level security;
alter table public.audit_logs enable row level security;

create policy "public_read_active_roles" on public.target_roles for select using (active or public.has_role(auth.uid(),'admin'));
create policy "public_read_verified_maps" on public.competency_maps for select using (verified_at is not null or public.has_role(auth.uid(),'admin'));
create policy "public_read_courses" on public.courses for select using (published or public.has_role(auth.uid(),'admin'));
create policy "public_read_modules" on public.course_modules for select using (exists(select 1 from public.courses c where c.id=course_id and (c.published or public.has_role(auth.uid(),'admin'))));
create policy "public_read_lessons" on public.lessons for select using (exists(select 1 from public.course_modules m join public.courses c on c.id=m.course_id where m.id=module_id and (c.published or public.has_role(auth.uid(),'admin'))));
create policy "public_read_projects" on public.projects for select using (published or public.has_role(auth.uid(),'admin'));

create policy "roadmaps_owner" on public.roadmaps for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "milestones_owner" on public.roadmap_milestones for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "progress_owner" on public.lesson_progress for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "attempts_owner" on public.assessment_attempts for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "submissions_owner" on public.project_submissions for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "evaluations_owner_read" on public.project_evaluations for select using (auth.uid()=user_id or public.has_role(auth.uid(),'admin'));
create policy "mastery_owner_read" on public.mastery_records for select using (auth.uid()=user_id or public.has_role(auth.uid(),'admin'));
create policy "conversations_owner" on public.ai_conversations for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "interviews_owner" on public.interview_sessions for all using (auth.uid()=user_id) with check (auth.uid()=user_id);
create policy "audit_owner_read" on public.audit_logs for select using (auth.uid()=user_id or public.has_role(auth.uid(),'admin'));

insert into public.target_roles(slug,title,description) values
('data-engineer','Data Engineer','Builds reliable, secure, observable data platforms.'),
('data-analyst','Data Analyst','Turns trustworthy data into decisions.'),
('agentic-ai-engineer','Agentic AI Engineer','Builds evaluated, production-grade AI agent systems.')
on conflict(slug) do update set title=excluded.title, description=excluded.description;

insert into public.courses(slug,title,description,published,metadata) values
('data-engineering','Data Engineering','A 16-week evidence-based pathway from foundations to a defended data-platform capstone.',true,'{"duration_weeks":16,"weekly_hours":"6-8","projects":3}'::jsonb)
on conflict(slug) do update set published=true, metadata=excluded.metadata;
