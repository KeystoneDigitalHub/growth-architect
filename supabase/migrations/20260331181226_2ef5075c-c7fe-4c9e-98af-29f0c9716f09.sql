
ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS referral_id text UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  ADD COLUMN IF NOT EXISTS referred_by text,
  ADD COLUMN IF NOT EXISTS referral_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION public.increment_referral_count(ref_id text)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE public.leads
  SET referral_count = referral_count + 1
  WHERE referral_id = ref_id;
$$;
