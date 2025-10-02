import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';

export interface NDAStats {
  pending: number;
  approved: number;
  expired: number;
}

export interface NDAActivity {
  id: string;
  company_name: string;
  status: 'pending' | 'approved' | 'expired';
  accepted_at: string;
  user_name: string;
}

export const useNDAStats = () => {
  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [stats, setStats] = useState<NDAStats>({
    pending: 0,
    approved: 0,
    expired: 0
  });
  const [recentActivity, setRecentActivity] = useState<NDAActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && profile) {
      fetchNDAStats();
    }
  }, [user, profile]);

  const fetchNDAStats = async () => {
    try {
      setLoading(true);

      let query = supabase
        .from('company_nda_acceptances')
        .select(`
          id,
          accepted_at,
          company_id
        `)
        .order('accepted_at', { ascending: false });

      // If not admin, only show user's NDAs
      if (profile?.role !== 'admin' && profile?.role !== 'super_admin') {
        query = query.eq('user_id', user?.id);
      }

      const { data: ndaData, error } = await query;
      if (error) throw error;

      // Calculate stats (for now, all accepted NDAs are "approved")
      // You would implement proper expiration logic here
      const currentDate = new Date();
      const thirtyDaysAgo = new Date(currentDate.getTime() - (30 * 24 * 60 * 60 * 1000));

      const approved = ndaData?.length || 0;
      const pending = 0; // Would come from pending invitations or requests
      const expired = 0; // Would come from NDAs past expiration date

      setStats({
        pending,
        approved,
        expired
      });

      // Format recent activity
      const activity: NDAActivity[] = (ndaData || []).slice(0, 5).map(nda => ({
        id: nda.id,
        company_name: 'Company',
        status: 'approved' as const,
        accepted_at: nda.accepted_at,
        user_name: 'User'
      }));

      setRecentActivity(activity);

    } catch (error) {
      console.error('Error fetching NDA stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    recentActivity,
    loading,
    refresh: fetchNDAStats
  };
};