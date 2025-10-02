import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useNDA = (companyId?: string) => {
  const [hasAcceptedNDA, setHasAcceptedNDA] = useState(false);
  const [loading, setLoading] = useState(false);
  const [accepting, setAccepting] = useState(false);
  const [requireNDA, setRequireNDA] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (companyId) {
      checkNdaStatus();
      fetchNdaRequirement();
    }
  }, [companyId]);

  const fetchNdaRequirement = async () => {
    try {
      const { data, error } = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'legal_nda.require_nda')
        .maybeSingle();
      
      if (error) throw error;
      
      // Value is stored as JSONB, could be boolean or string
      if (data?.value !== undefined && data?.value !== null) {
        const value = data.value;
        if (typeof value === 'boolean') {
          setRequireNDA(value);
        } else if (typeof value === 'string') {
          setRequireNDA(value === 'true');
        } else {
          setRequireNDA(true);
        }
      } else {
        setRequireNDA(true);
      }
    } catch (error) {
      console.error('Error fetching NDA requirement:', error);
      setRequireNDA(true);
    }
  };

  const checkNdaStatus = async () => {
    if (!companyId) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('company_nda_acceptances')
        .select('id')
        .eq('company_id', companyId)
        .eq('user_id', (await supabase.auth.getUser()).data.user?.id)
        .maybeSingle();
      
      if (error) throw error;
      setHasAcceptedNDA(!!data);
    } catch (error) {
      console.error('Error checking NDA status:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptNDA = async (): Promise<boolean> => {
    if (!companyId || accepting) return false;
    
    setAccepting(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      // Insert NDA acceptance directly
      const { error } = await supabase
        .from('company_nda_acceptances')
        .insert({
          user_id: user.user.id,
          company_id: companyId,
          signature_data: 'accepted',
          ip_address: null
        });
      
      if (error) throw error;
      
      setHasAcceptedNDA(true);
      toast({
        title: "Success",
        description: "NDA accepted successfully",
      });
      return true;
    } catch (error) {
      console.error('Error accepting NDA:', error);
      toast({
        title: "Error",
        description: "Failed to accept NDA. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setAccepting(false);
    }
  };

  return {
    hasAcceptedNDA,
    requireNDA,
    loading,
    accepting,
    acceptNDA,
    refetch: checkNdaStatus
  };
};