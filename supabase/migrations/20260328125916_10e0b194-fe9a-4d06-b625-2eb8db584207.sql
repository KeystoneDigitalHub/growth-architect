CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  business_type TEXT NOT NULL,
  ad_budget NUMERIC,
  website_url TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead" ON public.leads
  FOR INSERT WITH CHECK (true);

CREATE POLICY "No public read" ON public.leads
  FOR SELECT USING (false);