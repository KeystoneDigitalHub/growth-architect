
ALTER TABLE public.leads 
  ADD COLUMN IF NOT EXISTS whatsapp text,
  ADD COLUMN IF NOT EXISTS lead_score numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS audit_report text,
  ADD COLUMN IF NOT EXISTS geo_strategy text,
  ADD COLUMN IF NOT EXISTS report_pdf_url text;
