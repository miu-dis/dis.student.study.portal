-- ==============================================================================
-- Supabase Storage RLS Policies (FIXED — Firebase Auth Compatible)
-- The portal uses Firebase Auth, NOT Supabase Auth. Supabase client is created
-- with anon key only, so auth.uid() is always NULL and TO authenticated blocks
-- everything. Policies use TO anon since real auth lives in Firebase/Firestore.
-- The 'resources' bucket is public for reads; upload paths are scoped by userId
-- in application code (Firestore metadata controls who can edit/delete).
-- ==============================================================================

-- Step 1: Drop all existing policies (both old "Public" and broken "authenticated")
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
DROP POLICY IF EXISTS "Public insert access" ON storage.objects;
DROP POLICY IF EXISTS "Public update access" ON storage.objects;
DROP POLICY IF EXISTS "Public delete access" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can read resources" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can upload to resources" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can update own resources" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can delete own resources" ON storage.objects;

-- Step 2: Create anon (public) policies — real auth is in Firebase/Firestore, not Supabase

-- SELECT: Anyone can read files from the resources bucket (bucket is public)
CREATE POLICY "Anyone can read resources"
ON storage.objects FOR SELECT
TO anon
USING (bucket_id = 'resources');

-- INSERT: Anyone with the anon key can upload to resources bucket
-- Application code (Firestore metadata) controls which user owns which file
CREATE POLICY "Anyone can upload to resources"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'resources');

-- UPDATE: Anyone with the anon key can update files in resources bucket
CREATE POLICY "Anyone can update resources"
ON storage.objects FOR UPDATE
TO anon
USING (bucket_id = 'resources');

-- DELETE: Anyone with the anon key can delete files from resources bucket
CREATE POLICY "Anyone can delete resources"
ON storage.objects FOR DELETE
TO anon
USING (bucket_id = 'resources');

-- ==============================================================================
-- IMPORTANT: After running this SQL, verify in Supabase Dashboard:
--   1. Go to Storage → resources bucket → Policies
--   2. Confirm exactly 4 policies exist (SELECT, INSERT, UPDATE, DELETE)
--   3. All should show "TO anon"
--   4. Bucket must be PUBLIC (Storage → resources → ⋮ → "Make public")
--   5. Test: Student upload via the portal should now work
-- ==============================================================================
