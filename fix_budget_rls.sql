-- 1. DROP the old restrictive policies that were blocking UPSERT operations
DROP POLICY IF EXISTS "policy_budget_plans" ON public.budget_plans;
DROP POLICY IF EXISTS "policy_budget_categories" ON public.budget_categories;
DROP POLICY IF EXISTS "policy_budget_insights" ON public.budget_insights;

-- 2. CREATE robust policies that explicitly allow ALL operations for the authenticated user.
-- Use both USING (for select/update/delete) and WITH CHECK (for insert/update) clauses.

CREATE POLICY "enable_all_budget_plans" ON public.budget_plans 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "enable_all_budget_categories" ON public.budget_categories 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

CREATE POLICY "enable_all_budget_insights" ON public.budget_insights 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
