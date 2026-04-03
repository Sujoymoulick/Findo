-- 1. Create a temporary column to trigger a schema change notification
ALTER TABLE public.expenses ADD COLUMN IF NOT EXISTS _force_reload_0403 BOOLEAN;

-- 2. Drop it immediately to clean up
ALTER TABLE public.expenses DROP COLUMN IF EXISTS _force_reload_0403;

-- 3. Notify PostgREST directly (works on most Supabase instances)
NOTIFY pgrst, 'reload schema';
