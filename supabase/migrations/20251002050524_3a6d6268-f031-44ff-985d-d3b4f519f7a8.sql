-- Add company_name to deals table for backward compatibility
ALTER TABLE public.deals
ADD COLUMN IF NOT EXISTS company_name TEXT;

-- Create nda_signatures table
CREATE TABLE IF NOT EXISTS public.nda_signatures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  company_id UUID REFERENCES public.companies(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES public.deals(id) ON DELETE CASCADE,
  signature_data TEXT NOT NULL,
  ip_address TEXT,
  signed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on nda_signatures
ALTER TABLE public.nda_signatures ENABLE ROW LEVEL SECURITY;

-- RLS policies for nda_signatures
CREATE POLICY "Users can view their own NDA signatures"
ON public.nda_signatures
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own NDA signatures"
ON public.nda_signatures
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all NDA signatures"
ON public.nda_signatures
FOR SELECT
USING (is_admin_or_higher(auth.uid()));

-- Create onboarding_responses table
CREATE TABLE IF NOT EXISTS public.onboarding_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  step_name TEXT NOT NULL,
  response_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on onboarding_responses
ALTER TABLE public.onboarding_responses ENABLE ROW LEVEL SECURITY;

-- RLS policies for onboarding_responses
CREATE POLICY "Users can view their own onboarding responses"
ON public.onboarding_responses
FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own onboarding responses"
ON public.onboarding_responses
FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own onboarding responses"
ON public.onboarding_responses
FOR UPDATE
USING (auth.uid() = user_id);

-- Create helper function for accepting company NDA
CREATE OR REPLACE FUNCTION public.accept_company_nda(
  _company_id UUID,
  _signature_data TEXT,
  _ip_address TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _signature_id UUID;
BEGIN
  INSERT INTO public.nda_signatures (user_id, company_id, signature_data, ip_address)
  VALUES (auth.uid(), _company_id, _signature_data, _ip_address)
  RETURNING id INTO _signature_id;
  
  RETURN _signature_id;
END;
$$;

-- Create helper function for logging security events
CREATE OR REPLACE FUNCTION public.log_security_event(
  _event_type TEXT,
  _event_data JSONB DEFAULT NULL,
  _ip_address TEXT DEFAULT NULL,
  _user_agent TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _log_id UUID;
BEGIN
  INSERT INTO public.security_audit_log (user_id, event_type, event_data, ip_address, user_agent)
  VALUES (auth.uid(), _event_type, _event_data, _ip_address, _user_agent)
  RETURNING id INTO _log_id;
  
  RETURN _log_id;
END;
$$;

-- Create trigger to update onboarding_responses updated_at
CREATE TRIGGER update_onboarding_responses_updated_at
BEFORE UPDATE ON public.onboarding_responses
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indices for better performance
CREATE INDEX IF NOT EXISTS idx_nda_signatures_user_id ON public.nda_signatures(user_id);
CREATE INDEX IF NOT EXISTS idx_nda_signatures_company_id ON public.nda_signatures(company_id);
CREATE INDEX IF NOT EXISTS idx_nda_signatures_deal_id ON public.nda_signatures(deal_id);
CREATE INDEX IF NOT EXISTS idx_onboarding_responses_user_id ON public.onboarding_responses(user_id);