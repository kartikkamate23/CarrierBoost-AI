CREATE POLICY "resumes_storage_update_own"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'resumes' AND (auth.uid())::text = (storage.foldername(name))[1])
WITH CHECK (bucket_id = 'resumes' AND (auth.uid())::text = (storage.foldername(name))[1]);

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, authenticated, PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO service_role;