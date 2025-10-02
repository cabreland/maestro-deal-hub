-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can view companies" ON public.companies;

-- Create a company_access table for fine-grained access control
CREATE TABLE IF NOT EXISTS public.company_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  access_type TEXT NOT NULL DEFAULT 'view', -- 'view', 'edit', 'full'
  granted_by UUID REFERENCES auth.users(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(company_id, user_id)
);

-- Enable RLS on company_access
ALTER TABLE public.company_access ENABLE ROW LEVEL SECURITY;

-- RLS policies for company_access table
CREATE POLICY "Admins can manage all company access"
ON public.company_access
FOR ALL
USING (is_admin_or_higher(auth.uid()));

CREATE POLICY "Users can view their own access grants"
ON public.company_access
FOR SELECT
USING (auth.uid() = user_id);

-- Create new restrictive RLS policy for companies
-- Users can only see companies if:
-- 1. They are admin/broker
-- 2. They have been granted explicit access via company_access table
-- 3. They have accepted an invitation to a deal linked to that company
CREATE POLICY "Restricted company access"
ON public.companies
FOR SELECT
USING (
  is_admin_or_higher(auth.uid())
  OR
  EXISTS (
    SELECT 1 FROM public.company_access
    WHERE company_access.company_id = companies.id
    AND company_access.user_id = auth.uid()
    AND (company_access.expires_at IS NULL OR company_access.expires_at > now())
  )
  OR
  EXISTS (
    SELECT 1 FROM public.deals
    JOIN public.investor_invitations ON investor_invitations.deal_id = deals.id
    WHERE deals.company_id = companies.id
    AND investor_invitations.investor_email = (
      SELECT email FROM auth.users WHERE id = auth.uid()
    )
    AND investor_invitations.status = 'accepted'
  )
);

-- Create indices for performance
CREATE INDEX IF NOT EXISTS idx_company_access_company_id ON public.company_access(company_id);
CREATE INDEX IF NOT EXISTS idx_company_access_user_id ON public.company_access(user_id);
CREATE INDEX IF NOT EXISTS idx_company_access_expires_at ON public.company_access(expires_at) WHERE expires_at IS NOT NULL;

-- Grant admins/brokers automatic access to all existing companies
INSERT INTO public.company_access (company_id, user_id, access_type, granted_by)
SELECT 
  companies.id,
  profiles.user_id,
  'full',
  profiles.user_id
FROM public.companies
CROSS JOIN public.profiles
WHERE profiles.role IN ('admin', 'broker', 'super_admin')
ON CONFLICT (company_id, user_id) DO NOTHING;