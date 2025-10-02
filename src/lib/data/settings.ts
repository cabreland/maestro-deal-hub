
import { supabase } from '@/integrations/supabase/client';

export interface Setting {
  key: string;
  value: any;
  updated_at: string;
}

export interface GrowthOpportunity {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  is_active: boolean;
  created_at: string;
}

export interface CustomField {
  id: string;
  key: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'currency' | 'date' | 'boolean';
  is_required: boolean;
  is_active: boolean;
  created_at: string;
}

export interface CustomValue {
  field_id: string;
  company_id: string;
  value: any;
}

// Settings functions
export const getSettings = async (): Promise<Setting[]> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .order('key');

  if (error) {
    // Handle RLS permission errors gracefully
    if (error.code === '42501' || error.message?.includes('permission denied')) {
      throw new Error('Access denied. Admin privileges required to view settings.');
    }
    throw error;
  }
  return data || [];
};

export const getSetting = async (key: string): Promise<Setting | null> => {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('key', key)
    .single();

  if (error && error.code !== 'PGRST116') {
    if (error.code === '42501' || error.message?.includes('permission denied')) {
      throw new Error('Access denied. Admin privileges required to view settings.');
    }
    throw error;
  }
  return data;
};

export const upsertSetting = async (key: string, value: any): Promise<void> => {
  const { error } = await supabase
    .from('settings')
    .upsert({ key, value }, { onConflict: 'key' });

  if (error) {
    if (error.code === '42501' || error.message?.includes('permission denied')) {
      throw new Error('Access denied. Admin privileges required to modify settings.');
    }
    throw error;
  }
};

// Growth opportunities functions - STUB (table doesn't exist)
export const getGrowthOpportunities = async (activeOnly = false): Promise<GrowthOpportunity[]> => {
  console.log('Growth opportunities table does not exist yet');
  return [];
};

export const createGrowthOpportunity = async (data: Omit<GrowthOpportunity, 'id' | 'created_at'>): Promise<string> => {
  console.log('Growth opportunities table does not exist yet');
  return '';
};

export const updateGrowthOpportunity = async (id: string, data: Partial<GrowthOpportunity>): Promise<void> => {
  console.log('Growth opportunities table does not exist yet');
};

// Custom fields functions - STUB (table doesn't exist)
export const getCustomFields = async (activeOnly = false): Promise<CustomField[]> => {
  console.log('Custom fields table does not exist yet');
  return [];
};

export const createCustomField = async (data: Omit<CustomField, 'id' | 'created_at'>): Promise<string> => {
  console.log('Custom fields table does not exist yet');
  return '';
};

export const updateCustomField = async (id: string, data: Partial<CustomField>): Promise<void> => {
  console.log('Custom fields table does not exist yet');
};

// Custom values functions - STUB (table doesn't exist)
export const getCompanyCustomValues = async (companyId: string): Promise<CustomValue[]> => {
  console.log('Custom values table does not exist yet');
  return [];
};

export const upsertCustomValue = async (fieldId: string, companyId: string, value: any): Promise<void> => {
  console.log('Custom values table does not exist yet');
};

// Company growth opportunities functions - STUB (table doesn't exist)
export const getCompanyGrowthOpportunities = async (companyId: string) => {
  console.log('Company growth opportunities table does not exist yet');
  return [];
};

export const addCompanyGrowthOpportunity = async (companyId: string, growthId: string, note?: string): Promise<void> => {
  console.log('Company growth opportunities table does not exist yet');
};

export const removeCompanyGrowthOpportunity = async (companyId: string, growthId: string): Promise<void> => {
  console.log('Company growth opportunities table does not exist yet');
};
