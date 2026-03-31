
-- Clean up RLS policies
DROP POLICY IF EXISTS "Anyone can submit a lead" ON public.leads;
DROP POLICY IF EXISTS "No public read" ON public.leads;
DROP POLICY IF EXISTS "Allow public insert" ON public.leads;
DROP POLICY IF EXISTS "Allow anon insert" ON public.leads;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.leads;
DROP POLICY IF EXISTS "public_insert_leads" ON public.leads;
DROP POLICY IF EXISTS "service_role_all" ON public.leads;

-- Public insert for audit form (anon + authenticated)
CREATE POLICY "public_insert_leads"
ON public.leads FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Service role full access (edge functions)
CREATE POLICY "service_role_all"
ON public.leads FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Authenticated users can read their own lead
CREATE POLICY "users_read_own_lead"
ON public.leads FOR SELECT
TO authenticated
USING (user_id = auth.uid());
