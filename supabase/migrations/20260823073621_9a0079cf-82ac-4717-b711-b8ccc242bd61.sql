CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;

CREATE OR REPLACE FUNCTION private.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

GRANT USAGE ON SCHEMA private TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION private.has_role(uuid, public.app_role) TO authenticated, anon, service_role;

DROP POLICY IF EXISTS "profiles_select_own_or_admin" ON public.profiles;
CREATE POLICY "profiles_select_own_or_admin" ON public.profiles FOR SELECT
USING ((auth.uid() = id) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "roles_select_own_or_admin" ON public.user_roles;
CREATE POLICY "roles_select_own_or_admin" ON public.user_roles FOR SELECT
USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "roles_admin_all" ON public.user_roles;
CREATE POLICY "roles_admin_all" ON public.user_roles FOR ALL
USING (private.has_role(auth.uid(), 'admin'::public.app_role))
WITH CHECK (private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "resumes_select_own_or_admin" ON public.resumes;
CREATE POLICY "resumes_select_own_or_admin" ON public.resumes FOR SELECT
USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "resumes_delete_own_or_admin" ON public.resumes;
CREATE POLICY "resumes_delete_own_or_admin" ON public.resumes FOR DELETE
USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "reports_select_own_or_admin" ON public.analysis_reports;
CREATE POLICY "reports_select_own_or_admin" ON public.analysis_reports FOR SELECT
USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "reports_delete_own_or_admin" ON public.analysis_reports;
CREATE POLICY "reports_delete_own_or_admin" ON public.analysis_reports FOR DELETE
USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "cover_letters_select_own_or_admin" ON public.cover_letters;
CREATE POLICY "cover_letters_select_own_or_admin" ON public.cover_letters FOR SELECT
USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "cover_letters_delete_own_or_admin" ON public.cover_letters;
CREATE POLICY "cover_letters_delete_own_or_admin" ON public.cover_letters FOR DELETE
USING ((auth.uid() = user_id) OR private.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "resumes_storage_select_own_or_admin" ON storage.objects;
CREATE POLICY "resumes_storage_select_own_or_admin" ON storage.objects FOR SELECT
USING (bucket_id = 'resumes' AND (((auth.uid())::text = (storage.foldername(name))[1]) OR private.has_role(auth.uid(), 'admin'::public.app_role)));

DROP POLICY IF EXISTS "resumes_storage_delete_own_or_admin" ON storage.objects;
CREATE POLICY "resumes_storage_delete_own_or_admin" ON storage.objects FOR DELETE
USING (bucket_id = 'resumes' AND (((auth.uid())::text = (storage.foldername(name))[1]) OR private.has_role(auth.uid(), 'admin'::public.app_role)));

DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role);