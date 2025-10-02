
import { supabase } from '@/integrations/supabase/client';

export interface CompanyData {
  id?: string;
  name: string;
  description?: string;
  industry?: string;
  location?: string;
  revenue?: string;
  ebitda?: string;
  asking_price?: string;
  is_published?: boolean;
  publish_at?: string;
  created_by?: string;
  created_at?: string;
  updated_at?: string;

  // Extended fields not yet in DB - for UI compatibility
  stage?: 'teaser' | 'discovery' | 'dd' | 'closing';
  priority?: 'low' | 'medium' | 'high';
  fit_score?: number;
  highlights?: string[];
  risks?: string[];
  summary?: string;
}

export const upsertCompanyDraft = async (data: Partial<CompanyData>, id?: string): Promise<string> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('User not authenticated');

    // Only use fields that exist in the database
    const companyData: any = {
      name: data.name || 'Untitled Company',
      description: data.description || data.summary || '',
      industry: data.industry || null,
      location: data.location || null,
      revenue: data.revenue || null,
      ebitda: data.ebitda || null,
      asking_price: data.asking_price || null,
      is_published: false,
      created_by: user.id
    };

    if (id) {
      // Update existing
      const { data: updated, error } = await supabase
        .from('companies')
        .update(companyData)
        .eq('id', id)
        .select('id')
        .single();

      if (error) throw error;
      return updated.id;
    } else {
      // Create new
      const { data: created, error } = await supabase
        .from('companies')
        .insert(companyData)
        .select('id')
        .single();

      if (error) throw error;
      return created.id;
    }
  } catch (error) {
    console.error('Error upserting company:', error);
    throw error;
  }
};

export const finalizeCompany = async (id: string, data: Partial<CompanyData>): Promise<string> => {
  try {
    const companyData: any = {
      name: data.name || 'Untitled Company',
      description: data.description || data.summary || '',
      industry: data.industry || null,
      location: data.location || null,
      revenue: data.revenue || null,
      ebitda: data.ebitda || null,
      asking_price: data.asking_price || null,
      is_published: data.is_published || false
    };

    const { data: finalized, error } = await supabase
      .from('companies')
      .update(companyData)
      .eq('id', id)
      .select('id')
      .single();

    if (error) throw error;
    return finalized.id;
  } catch (error) {
    console.error('Error finalizing company:', error);
    throw error;
  }
};

export const getCompany = async (id: string): Promise<CompanyData | null> => {
  try {
    const { data, error } = await supabase
      .from('companies')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching company:', error);
      return null;
    }

    return {
      ...data,
      summary: data.description,
      highlights: [],
      risks: []
    } as CompanyData;
  } catch (error) {
    console.error('Error fetching company:', error);
    return null;
  }
};

export const getCompanies = async (query?: string): Promise<CompanyData[]> => {
  try {
    let queryBuilder = supabase
      .from('companies')
      .select('*')
      .order('created_at', { ascending: false });

    if (query) {
      queryBuilder = queryBuilder.ilike('name', `%${query}%`);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching companies:', error);
      return [];
    }

    return (data || []).map(company => ({
      ...company,
      summary: company.description,
      highlights: [],
      risks: []
    } as CompanyData));
  } catch (error) {
    console.error('Error fetching companies:', error);
    return [];
  }
};

// Convert company data to deal format for investor view
export const convertCompanyToDeal = (company: CompanyData) => {
  return {
    id: company.id || '',
    companyName: company.name || 'Unnamed Company',
    industry: company.industry || 'Not specified',
    revenue: company.revenue || 'Not disclosed',
    ebitda: company.ebitda || 'Not disclosed',
    stage: 'Initial Review',
    progress: 25,
    priority: 'Medium',
    location: company.location || 'Not specified',
    fitScore: 50,
    lastUpdated: formatDate(company.updated_at),
    description: company.description || 'No description available',
    foundedYear: 'Not specified',
    teamSize: 'Not specified',
    reasonForSale: 'Not specified',
    growthOpportunities: [],
    foundersMessage: '',
    founderName: 'Not specified',
    idealBuyerProfile: '',
    rollupPotential: '',
    marketTrends: '',
    profitMargin: 'Not disclosed',
    customerCount: 'Not disclosed',
    recurringRevenue: 'Not disclosed',
    cacLtvRatio: 'Not disclosed',
    highlights: company.highlights || [],
    risks: company.risks || [],
    documents: []
  };
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'Recently';
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1 day ago';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
  return `${Math.ceil(diffDays / 30)} months ago`;
};
