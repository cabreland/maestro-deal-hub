-- Create role enum
CREATE TYPE public.user_role AS ENUM ('super_admin', 'admin', 'broker', 'investor');

-- Create profiles table (linked to auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'investor',
  full_name TEXT,
  company_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create companies table
CREATE TABLE public.companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  industry TEXT,
  description TEXT,
  revenue NUMERIC,
  ebitda NUMERIC,
  asking_price NUMERIC,
  location TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create deals table
CREATE TABLE public.deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  stage TEXT,
  priority TEXT,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  tag TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create investor invitations table
CREATE TABLE public.investor_invitations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deal_id UUID NOT NULL REFERENCES public.deals(id) ON DELETE CASCADE,
  investor_email TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  invited_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  access_granted_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(deal_id, investor_email)
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investor_invitations ENABLE ROW LEVEL SECURITY;

-- Create function to check user role
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Create function to check if user has admin-level access
CREATE OR REPLACE FUNCTION public.is_admin_or_higher(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role IN ('super_admin', 'admin', 'broker')
  )
$$;

-- Profiles RLS Policies
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin_or_higher(auth.uid()));

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = user_id);

-- Companies RLS Policies
CREATE POLICY "Authenticated users can view companies"
  ON public.companies FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can create companies"
  ON public.companies FOR INSERT
  WITH CHECK (public.is_admin_or_higher(auth.uid()));

CREATE POLICY "Admins can update companies"
  ON public.companies FOR UPDATE
  USING (public.is_admin_or_higher(auth.uid()));

CREATE POLICY "Admins can delete companies"
  ON public.companies FOR DELETE
  USING (public.is_admin_or_higher(auth.uid()));

-- Deals RLS Policies
CREATE POLICY "Authenticated users can view deals"
  ON public.deals FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can create deals"
  ON public.deals FOR INSERT
  WITH CHECK (public.is_admin_or_higher(auth.uid()));

CREATE POLICY "Admins can update deals"
  ON public.deals FOR UPDATE
  USING (public.is_admin_or_higher(auth.uid()));

CREATE POLICY "Admins can delete deals"
  ON public.deals FOR DELETE
  USING (public.is_admin_or_higher(auth.uid()));

-- Documents RLS Policies
CREATE POLICY "Users can view documents for accessible deals"
  ON public.documents FOR SELECT
  USING (
    public.is_admin_or_higher(auth.uid()) OR
    EXISTS (
      SELECT 1 FROM public.investor_invitations
      WHERE deal_id = documents.deal_id
        AND investor_email = (SELECT email FROM auth.users WHERE id = auth.uid())
        AND status = 'accepted'
    )
  );

CREATE POLICY "Admins can upload documents"
  ON public.documents FOR INSERT
  WITH CHECK (public.is_admin_or_higher(auth.uid()));

CREATE POLICY "Admins can update documents"
  ON public.documents FOR UPDATE
  USING (public.is_admin_or_higher(auth.uid()));

CREATE POLICY "Admins can delete documents"
  ON public.documents FOR DELETE
  USING (public.is_admin_or_higher(auth.uid()));

-- Investor Invitations RLS Policies
CREATE POLICY "Users can view their own invitations"
  ON public.investor_invitations FOR SELECT
  USING (
    public.is_admin_or_higher(auth.uid()) OR
    investor_email = (SELECT email FROM auth.users WHERE id = auth.uid())
  );

CREATE POLICY "Admins can create invitations"
  ON public.investor_invitations FOR INSERT
  WITH CHECK (public.is_admin_or_higher(auth.uid()));

CREATE POLICY "Admins can update invitations"
  ON public.investor_invitations FOR UPDATE
  USING (public.is_admin_or_higher(auth.uid()));

CREATE POLICY "Investors can accept their invitations"
  ON public.investor_invitations FOR UPDATE
  USING (investor_email = (SELECT email FROM auth.users WHERE id = auth.uid()));

-- Create storage bucket for documents
INSERT INTO storage.buckets (id, name, public)
VALUES ('deal-documents', 'deal-documents', false);

-- Storage RLS Policies
CREATE POLICY "Admins can upload documents"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'deal-documents' AND
    public.is_admin_or_higher(auth.uid())
  );

CREATE POLICY "Users can view documents for accessible deals"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'deal-documents' AND (
      public.is_admin_or_higher(auth.uid()) OR
      EXISTS (
        SELECT 1 FROM public.documents d
        INNER JOIN public.investor_invitations i ON i.deal_id = d.deal_id
        WHERE d.file_path = storage.objects.name
          AND i.investor_email = (SELECT email FROM auth.users WHERE id = auth.uid())
          AND i.status = 'accepted'
      )
    )
  );

CREATE POLICY "Admins can delete documents"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'deal-documents' AND
    public.is_admin_or_higher(auth.uid())
  );

-- Create trigger function for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Add triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_deals_updated_at
  BEFORE UPDATE ON public.deals
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create trigger to auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, role, full_name)
  VALUES (
    NEW.id,
    'investor',
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();