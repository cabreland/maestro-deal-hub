-- Add missing columns to investor_invitations table
ALTER TABLE public.investor_invitations
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS invitation_code TEXT,
ADD COLUMN IF NOT EXISTS invited_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN IF NOT EXISTS expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS investor_name TEXT,
ADD COLUMN IF NOT EXISTS company_name TEXT,
ADD COLUMN IF NOT EXISTS notes TEXT,
ADD COLUMN IF NOT EXISTS access_type TEXT,
ADD COLUMN IF NOT EXISTS portfolio_access BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS master_nda_signed BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS deal_ids TEXT;

-- Add missing columns to companies table
ALTER TABLE public.companies
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS publish_at TIMESTAMP WITH TIME ZONE;

-- Add missing columns to profiles table
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS email TEXT,
ADD COLUMN IF NOT EXISTS first_name TEXT,
ADD COLUMN IF NOT EXISTS last_name TEXT,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT false;

-- Update user_role enum to include editor and viewer
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'editor';
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'viewer';

-- Create security_audit_log table
CREATE TABLE IF NOT EXISTS public.security_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on security_audit_log
ALTER TABLE public.security_audit_log ENABLE ROW LEVEL SECURITY;

-- RLS policy for security_audit_log - only admins can view
CREATE POLICY "Admins can view audit logs"
ON public.security_audit_log
FOR SELECT
USING (is_admin_or_higher(auth.uid()));

-- RLS policy for security_audit_log - system can insert
CREATE POLICY "System can insert audit logs"
ON public.security_audit_log
FOR INSERT
WITH CHECK (true);

-- Create index on security_audit_log for better performance
CREATE INDEX IF NOT EXISTS idx_security_audit_log_user_id ON public.security_audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_security_audit_log_created_at ON public.security_audit_log(created_at DESC);