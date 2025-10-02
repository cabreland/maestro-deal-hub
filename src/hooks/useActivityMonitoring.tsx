import { useState } from 'react';

export interface UserActivity {
  id: string;
  user_id: string;
  action: string;
  resource_type?: string;
  resource_id?: string;
  ip_address?: string | null;
  user_agent?: string | null;
  metadata: any;
  created_at: string;
  profiles?: {
    email: string;
    first_name?: string;
    last_name?: string;
  } | null;
}

export interface UserSession {
  id: string;
  user_id: string;
  session_token: string;
  ip_address?: string | null;
  user_agent?: string | null;
  location_data?: any;
  is_active: boolean;
  last_activity: string;
  created_at: string;
  expires_at: string;
  profiles?: {
    email: string;
    first_name?: string;
    last_name?: string;
  } | null;
}

export interface SecurityEvent {
  id: string;
  event_type: string;
  user_id?: string;
  ip_address?: string | null;
  user_agent?: string | null;
  event_data: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  created_at: string;
  profiles?: {
    email: string;
    first_name?: string;
    last_name?: string;
  } | null;
}

// Stub implementation - tables don't exist yet
export const useActivityMonitoring = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [sessions, setSessions] = useState<UserSession[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchActivities = async (limit = 50) => {
    // Stub - user_activity table query would go here
    setActivities([]);
  };

  const fetchActiveSessions = async () => {
    // Stub - user_sessions table doesn't exist
    setSessions([]);
  };

  const fetchSecurityEvents = async (limit = 50) => {
    // Stub - security_events table doesn't exist (use security_audit_log instead)
    setSecurityEvents([]);
  };

  const logActivity = async (
    action: string,
    resourceType?: string,
    resourceId?: string,
    metadata?: any
  ) => {
    // Stub - RPC function doesn't exist
    console.log('Activity logged:', { action, resourceType, resourceId, metadata });
  };

  const recordSecurityEvent = async (
    eventType: string,
    eventData?: any,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'low'
  ) => {
    // Stub - RPC function doesn't exist
    console.log('Security event:', { eventType, eventData, severity });
  };

  const forceLogoutSession = async (sessionId: string) => {
    // Stub - user_sessions table doesn't exist
    console.log('Force logout:', sessionId);
  };

  const exportActivityData = async (startDate?: string, endDate?: string) => {
    // Stub - return empty array
    return [];
  };

  return {
    activities,
    sessions,
    securityEvents,
    loading,
    fetchActivities,
    fetchActiveSessions,
    fetchSecurityEvents,
    logActivity,
    recordSecurityEvent,
    forceLogoutSession,
    exportActivityData
  };
};
