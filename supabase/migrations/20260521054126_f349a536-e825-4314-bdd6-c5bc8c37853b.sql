
-- Extend analysis_reports with new AI output sections
ALTER TABLE public.analysis_reports
  ADD COLUMN IF NOT EXISTS career_roadmap jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS skill_gap jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS interview_questions jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS recommended_courses jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS reference_videos jsonb NOT NULL DEFAULT '[]'::jsonb;

-- Cover letters
CREATE TABLE IF NOT EXISTS public.cover_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  resume_id uuid,
  target_role text NOT NULL,
  company text,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.cover_letters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "cover_letters_select_own_or_admin"
  ON public.cover_letters FOR SELECT
  USING ((auth.uid() = user_id) OR public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "cover_letters_insert_own"
  ON public.cover_letters FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "cover_letters_delete_own_or_admin"
  ON public.cover_letters FOR DELETE
  USING ((auth.uid() = user_id) OR public.has_role(auth.uid(), 'admin'::app_role));
