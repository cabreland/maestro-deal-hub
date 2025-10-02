import { CompanyData } from './companies';

// Stub - custom fields and growth opportunities tables don't exist
export interface CompanyWithCustomFields extends CompanyData {
  custom_fields: Record<string, any>;
}

export interface CompanyWithGrowth extends Omit<CompanyData, 'growth_opportunities'> {
  growth_opportunities: GrowthOpportunityView[];
}

export interface GrowthOpportunityView {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  note?: string;
}

export const getCompaniesWithCustomFields = async (): Promise<CompanyWithCustomFields[]> => {
  console.log('Custom fields feature not yet implemented');
  return [];
};

export const getCompaniesWithGrowth = async (): Promise<CompanyWithGrowth[]> => {
  console.log('Growth opportunities feature not yet implemented');
  return [];
};

export const getInvestorCompanyData = async (companyId: string) => {
  console.log('Investor company data feature not yet implemented');
  return null;
};

export const getCompanyWithCustomFields = async (companyId: string): Promise<CompanyWithCustomFields | null> => {
  console.log('Custom fields feature not yet implemented');
  return null;
};

export const getCompanyWithGrowth = async (companyId: string): Promise<CompanyWithGrowth | null> => {
  console.log('Growth opportunities feature not yet implemented');
  return null;
};

export const getPublicCompanyTeasers = async () => {
  console.log('Public teasers feature not yet implemented');
  return [];
};

export const getCompanyGrowthOpportunities = async (companyId: string): Promise<GrowthOpportunityView[]> => {
  console.log('Growth opportunities feature not yet implemented');
  return [];
};
