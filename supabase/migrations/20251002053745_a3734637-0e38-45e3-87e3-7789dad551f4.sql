-- Add missing critical columns to deals table
ALTER TABLE public.deals
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS asking_price TEXT,
ADD COLUMN IF NOT EXISTS revenue TEXT,
ADD COLUMN IF NOT EXISTS ebitda TEXT,
ADD COLUMN IF NOT EXISTS location TEXT,
ADD COLUMN IF NOT EXISTS industry TEXT;

-- Create company_nda_acceptances table for tracking NDAs
CREATE TABLE IF NOT EXISTS public.company_nda_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  accepted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  signature_data TEXT,
  ip_address TEXT,
  UNIQUE(user_id, company_id)
);

-- Enable RLS on company_nda_acceptances
ALTER TABLE public.company_nda_acceptances ENABLE ROW LEVEL SECURITY;

-- Users can view their own NDA acceptances
CREATE POLICY "Users can view their own NDA acceptances"
ON public.company_nda_acceptances
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can create their own NDA acceptances
CREATE POLICY "Users can create their own NDA acceptances"
ON public.company_nda_acceptances
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admins can view all NDA acceptances
CREATE POLICY "Admins can view all NDA acceptances"
ON public.company_nda_acceptances
FOR SELECT
TO authenticated
USING (is_admin_or_higher(auth.uid()));

-- Create simple settings table for configuration
CREATE TABLE IF NOT EXISTS public.settings (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on settings
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Admins can manage settings
CREATE POLICY "Admins can view settings"
ON public.settings
FOR SELECT
TO authenticated
USING (is_admin_or_higher(auth.uid()));

CREATE POLICY "Admins can update settings"
ON public.settings
FOR ALL
TO authenticated
USING (is_admin_or_higher(auth.uid()))
WITH CHECK (is_admin_or_higher(auth.uid()));

-- Insert default NDA requirement setting
INSERT INTO public.settings (key, value)
VALUES ('legal_nda.require_nda', 'true'::jsonb)
ON CONFLICT (key) DO NOTHING;