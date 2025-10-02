-- Fix data type mismatches in companies table (numeric -> text for financial fields)
ALTER TABLE public.companies
ALTER COLUMN asking_price TYPE TEXT,
ALTER COLUMN revenue TYPE TEXT,
ALTER COLUMN ebitda TYPE TEXT;

-- Fix data type mismatches in deals table
ALTER TABLE public.deals
ALTER COLUMN asking_price TYPE TEXT,
ALTER COLUMN revenue TYPE TEXT,
ALTER COLUMN ebitda TYPE TEXT;

-- Create settings_history table for audit trail
CREATE TABLE IF NOT EXISTS public.settings_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL,
  old_value JSONB,
  new_value JSONB,
  changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  changed_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  change_reason TEXT
);

-- Enable RLS on settings_history
ALTER TABLE public.settings_history ENABLE ROW LEVEL SECURITY;

-- Admins can view settings history
CREATE POLICY "Admins can view settings history"
ON public.settings_history
FOR SELECT
TO authenticated
USING (is_admin_or_higher(auth.uid()));

-- System can insert into settings history
CREATE POLICY "System can insert settings history"
ON public.settings_history
FOR INSERT
TO authenticated
WITH CHECK (true);

-- Create registration_settings table
CREATE TABLE IF NOT EXISTS public.registration_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB NOT NULL,
  setting_type TEXT NOT NULL DEFAULT 'text',
  category TEXT NOT NULL DEFAULT 'general',
  display_name TEXT NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on registration_settings
ALTER TABLE public.registration_settings ENABLE ROW LEVEL SECURITY;

-- Admins can manage registration settings
CREATE POLICY "Admins can view registration settings"
ON public.registration_settings
FOR SELECT
TO authenticated
USING (is_admin_or_higher(auth.uid()));

CREATE POLICY "Admins can update registration settings"
ON public.registration_settings
FOR ALL
TO authenticated
USING (is_admin_or_higher(auth.uid()))
WITH CHECK (is_admin_or_higher(auth.uid()));

-- Add updated_at column to companies if not exists
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Create trigger to auto-update updated_at on companies
DROP TRIGGER IF EXISTS update_companies_updated_at ON public.companies;
CREATE TRIGGER update_companies_updated_at
BEFORE UPDATE ON public.companies
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-update updated_at on deals
DROP TRIGGER IF EXISTS update_deals_updated_at ON public.deals;
CREATE TRIGGER update_deals_updated_at
BEFORE UPDATE ON public.deals
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();