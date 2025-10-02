import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface EnhancedSetting {
  key: string;
  value: any;
  category: string;
  description?: string;
  setting_type: string;
  is_sensitive: boolean;
  updated_at: string;
}

export interface SettingsHistory {
  id: string;
  setting_key: string;
  old_value: any;
  new_value: any;
  changed_by?: string;
  changed_at: string;
  change_reason?: string;
  profiles?: {
    email: string;
    first_name?: string;
    last_name?: string;
  } | null;
}

export const useEnhancedSettings = (category?: string) => {
  const [settings, setSettings] = useState<EnhancedSetting[]>([]);
  const [history, setHistory] = useState<SettingsHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    // Stub - settings table doesn't exist
    setSettings([]);
  };

  const fetchSettingsHistory = async (settingKey?: string) => {
    // Stub - settings_history table doesn't exist
    setHistory([]);
  };

  const updateSetting = async (
    key: string, 
    value: any, 
    category: string = 'general',
    description?: string,
    settingType: string = 'string'
  ) => {
    // Stub
    console.log('Setting update:', { key, value, category });
  };
          value,
          category,
          description,
          setting_type: settingType,
          updated_at: new Date().toISOString()
        });

      if (error) throw error;
      
      // Refresh settings
      await fetchSettings();
    } catch (error) {
      console.error('Error updating setting:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const bulkUpdateSettings = async (updates: Array<{
    key: string;
    value: any;
    category?: string;
    description?: string;
    setting_type?: string;
  }>) => {
    setSaving(true);
    try {
      const upsertData = updates.map(update => ({
        key: update.key,
        value: update.value,
        category: update.category || 'general',
        description: update.description,
        setting_type: update.setting_type || 'string',
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('settings')
        .upsert(upsertData);

      if (error) throw error;
      
      // Refresh settings
      await fetchSettings();
    } catch (error) {
      console.error('Error bulk updating settings:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  const getSetting = (key: string, defaultValue?: any) => {
    const setting = settings.find(s => s.key === key);
    return setting?.value ?? defaultValue;
  };

  const getSettingsByCategory = (categoryName: string) => {
    return settings.filter(s => s.category === categoryName);
  };

  const exportSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error exporting settings:', error);
      return [];
    }
  };

  const importSettings = async (settingsData: Array<{
    key: string;
    value: any;
    category?: string;
    description?: string;
    setting_type?: string;
  }>) => {
    setSaving(true);
    try {
      const upsertData = settingsData.map(setting => ({
        key: setting.key,
        value: setting.value,
        category: setting.category || 'general',
        description: setting.description,
        setting_type: setting.setting_type || 'string',
        updated_at: new Date().toISOString()
      }));

      const { error } = await supabase
        .from('settings')
        .upsert(upsertData);

      if (error) throw error;
      
      // Refresh settings
      await fetchSettings();
    } catch (error) {
      console.error('Error importing settings:', error);
      throw error;
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, [category]);

  return {
    settings,
    history,
    loading,
    saving,
    fetchSettings,
    fetchSettingsHistory,
    updateSetting,
    bulkUpdateSettings,
    getSetting,
    getSettingsByCategory,
    exportSettings,
    importSettings
  };
};