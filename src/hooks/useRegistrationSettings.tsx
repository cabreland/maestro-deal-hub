import { useState } from 'react';

export interface RegistrationSetting {
  id: string;
  setting_key: string;
  setting_value: any;
  setting_type: string;
  category: string;
  display_name: string;
  description?: string;
  updated_at: string;
}

// Stub - registration_settings table doesn't exist
export const useRegistrationSettings = (category?: string) => {
  const [settings] = useState<RegistrationSetting[]>([]);
  const [loading] = useState(false);
  const [saving] = useState(false);

  return {
    settings,
    loading,
    saving,
    fetchSettings: async () => {},
    updateSetting: async () => {},
    getSetting: (key: string, defaultValue?: any) => defaultValue,
    getSettingsByCategory: () => [],
    createSetting: async () => null,
    deleteSetting: async () => {},
  };
};
