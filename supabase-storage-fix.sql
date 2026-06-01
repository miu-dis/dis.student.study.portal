-- ==============================================================================
-- Supabase Storage RLS Policies (FIXED)
-- Fixes the CRITICAL security vulnerability where all policies were TO public.
-- ALL operations now require authentication.
-- ==============================================================================

-- Step 1: Drop old, dangerous policies
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Public insert access" ON storage.objects;
DROP POLICY IF EXISTS "Public update access" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access" ON storage.objects;

-- Step 2: Create proper authenticated-only policies for the 'resources' bucket

-- SELECT: Only authenticated users can read files from the resources bucket
CREATE POLICY "Auth users can read resources"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resources');

-- INSERT: Only authenticated users can upload to the resources bucket
-- Files are organized as: {userId}/{timestamp}_{filename}
CREATE POLICY "Auth users can upload to resources"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'resources'
    AND auth.uid()::text IS NOT NULL
);

-- UPDATE: Only authenticated users can update their own files
CREATE POLICY "Auth users can update own resources"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'resources'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- DELETE: Only authenticated users can delete their own files
CREATE POLICY "Auth users can delete own resources"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'resources'
    AND (storage.foldername(name))[1] = auth.uid()::text
);

-- ==============================================================================
-- IMPORTANT: After running this SQL, verify in Supabase Dashboard:
--   1. Go to Storage → resources bucket → Policies
--   2. Confirm exactly 4 policies exist (SELECT, INSERT, UPDATE, DELETE)
--   3. All should show "TO authenticated"
--   4. Test: Try accessing a file URL without logging in — should get 403
-- ==============================================================================
