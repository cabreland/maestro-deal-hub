import { supabase } from '@/integrations/supabase/client';

export interface TeaserData {
  id: string;
  name: string;
  industry?: string;
  location?: string;
  summary?: string;
  revenue?: string;
  ebitda?: string;
  asking_price?: string;
  stage?: string;
  priority?: string;
  fit_score?: number;
  is_published: boolean;
  publish_at?: string;
  teaser_payload?: any;
  created_at: string;
  updated_at: string;
}

// Get published teasers for investor view using secure companies table access
export const getPublishedTeasers = async (query?: string): Promise<TeaserData[]> => {
  try {
    let queryBuilder = supabase
      .from('companies')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false });

    // Add published date filter if publish_at exists
    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,industry.ilike.%${query}%`);
    }

    const { data, error } = await queryBuilder;

    if (error) {
      console.error('Error fetching teasers:', error);
      return [];
    }

    return (data || []).map(company => ({
      id: company.id,
      name: company.name,
      industry: company.industry || '',
      location: company.location || '',
      summary: company.description || '',
      revenue: company.revenue || '',
      ebitda: company.ebitda || '',
      asking_price: company.asking_price || '',
      stage: 'teaser' as const,
      priority: 'medium' as const,
      fit_score: 50,
      is_published: company.is_published || false,
      publish_at: company.publish_at || null,
      teaser_payload: null,
      created_at: company.created_at || '',
      updated_at: company.updated_at || ''
    }));
  } catch (error) {
    console.error('Error fetching teasers:', error);
    return [];
  }
};