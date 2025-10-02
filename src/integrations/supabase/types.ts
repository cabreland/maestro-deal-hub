export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      companies: {
        Row: {
          asking_price: number | null
          created_at: string
          created_by: string | null
          description: string | null
          ebitda: number | null
          id: string
          industry: string | null
          is_published: boolean | null
          location: string | null
          name: string
          publish_at: string | null
          revenue: number | null
        }
        Insert: {
          asking_price?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          ebitda?: number | null
          id?: string
          industry?: string | null
          is_published?: boolean | null
          location?: string | null
          name: string
          publish_at?: string | null
          revenue?: number | null
        }
        Update: {
          asking_price?: number | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          ebitda?: number | null
          id?: string
          industry?: string | null
          is_published?: boolean | null
          location?: string | null
          name?: string
          publish_at?: string | null
          revenue?: number | null
        }
        Relationships: []
      }
      company_access: {
        Row: {
          access_type: string
          company_id: string
          expires_at: string | null
          granted_at: string | null
          granted_by: string | null
          id: string
          user_id: string
        }
        Insert: {
          access_type?: string
          company_id: string
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          user_id: string
        }
        Update: {
          access_type?: string
          company_id?: string
          expires_at?: string | null
          granted_at?: string | null
          granted_by?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_access_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      company_nda_acceptances: {
        Row: {
          accepted_at: string
          company_id: string
          id: string
          ip_address: string | null
          signature_data: string | null
          user_id: string
        }
        Insert: {
          accepted_at?: string
          company_id: string
          id?: string
          ip_address?: string | null
          signature_data?: string | null
          user_id: string
        }
        Update: {
          accepted_at?: string
          company_id?: string
          id?: string
          ip_address?: string | null
          signature_data?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "company_nda_acceptances_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      deals: {
        Row: {
          asking_price: string | null
          company_id: string
          company_name: string | null
          created_at: string
          created_by: string | null
          description: string | null
          ebitda: string | null
          id: string
          industry: string | null
          location: string | null
          priority: string | null
          revenue: string | null
          stage: string | null
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          asking_price?: string | null
          company_id: string
          company_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          ebitda?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          priority?: string | null
          revenue?: string | null
          stage?: string | null
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          asking_price?: string | null
          company_id?: string
          company_name?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          ebitda?: string | null
          id?: string
          industry?: string | null
          location?: string | null
          priority?: string | null
          revenue?: string | null
          stage?: string | null
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deals_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          created_at: string
          deal_id: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          name: string
          tag: string | null
          uploaded_by: string | null
          version: number
        }
        Insert: {
          created_at?: string
          deal_id: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          name: string
          tag?: string | null
          uploaded_by?: string | null
          version?: number
        }
        Update: {
          created_at?: string
          deal_id?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          name?: string
          tag?: string | null
          uploaded_by?: string | null
          version?: number
        }
        Relationships: [
          {
            foreignKeyName: "documents_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      investor_invitations: {
        Row: {
          access_granted_at: string | null
          access_type: string | null
          company_name: string | null
          created_at: string
          deal_id: string
          deal_ids: string | null
          email: string | null
          expires_at: string | null
          id: string
          investor_email: string
          investor_name: string | null
          invitation_code: string | null
          invited_at: string | null
          invited_by: string | null
          master_nda_signed: boolean | null
          notes: string | null
          portfolio_access: boolean | null
          status: string
        }
        Insert: {
          access_granted_at?: string | null
          access_type?: string | null
          company_name?: string | null
          created_at?: string
          deal_id: string
          deal_ids?: string | null
          email?: string | null
          expires_at?: string | null
          id?: string
          investor_email: string
          investor_name?: string | null
          invitation_code?: string | null
          invited_at?: string | null
          invited_by?: string | null
          master_nda_signed?: boolean | null
          notes?: string | null
          portfolio_access?: boolean | null
          status?: string
        }
        Update: {
          access_granted_at?: string | null
          access_type?: string | null
          company_name?: string | null
          created_at?: string
          deal_id?: string
          deal_ids?: string | null
          email?: string | null
          expires_at?: string | null
          id?: string
          investor_email?: string
          investor_name?: string | null
          invitation_code?: string | null
          invited_at?: string | null
          invited_by?: string | null
          master_nda_signed?: boolean | null
          notes?: string | null
          portfolio_access?: boolean | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "investor_invitations_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      nda_signatures: {
        Row: {
          company_id: string | null
          created_at: string | null
          deal_id: string | null
          id: string
          ip_address: string | null
          signature_data: string
          signed_at: string | null
          user_id: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          id?: string
          ip_address?: string | null
          signature_data: string
          signed_at?: string | null
          user_id: string
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          deal_id?: string | null
          id?: string
          ip_address?: string | null
          signature_data?: string
          signed_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "nda_signatures_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "nda_signatures_deal_id_fkey"
            columns: ["deal_id"]
            isOneToOne: false
            referencedRelation: "deals"
            referencedColumns: ["id"]
          },
        ]
      }
      onboarding_responses: {
        Row: {
          created_at: string | null
          id: string
          response_data: Json
          step_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          response_data: Json
          step_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          response_data?: Json
          step_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          company_name: string | null
          created_at: string
          email: string | null
          first_name: string | null
          full_name: string | null
          id: string
          last_name: string | null
          onboarding_completed: boolean | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          company_name?: string | null
          created_at?: string
          email?: string | null
          first_name?: string | null
          full_name?: string | null
          id?: string
          last_name?: string | null
          onboarding_completed?: boolean | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      security_audit_log: {
        Row: {
          created_at: string | null
          event_data: Json | null
          event_type: string
          id: string
          ip_address: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          event_data?: Json | null
          event_type: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          event_data?: Json | null
          event_type?: string
          id?: string
          ip_address?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          action: string
          created_at: string | null
          id: string
          ip_address: string | null
          metadata: Json | null
          resource_id: string | null
          resource_type: string
          user_agent: string | null
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type: string
          user_agent?: string | null
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string | null
          id?: string
          ip_address?: string | null
          metadata?: Json | null
          resource_id?: string | null
          resource_type?: string
          user_agent?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      accept_company_nda: {
        Args: {
          _company_id: string
          _ip_address?: string
          _signature_data: string
        }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin_or_higher: {
        Args: { _user_id: string }
        Returns: boolean
      }
      log_security_event: {
        Args: {
          _event_data?: Json
          _event_type: string
          _ip_address?: string
          _user_agent?: string
        }
        Returns: string
      }
    }
    Enums: {
      user_role:
        | "super_admin"
        | "admin"
        | "broker"
        | "investor"
        | "editor"
        | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      user_role: [
        "super_admin",
        "admin",
        "broker",
        "investor",
        "editor",
        "viewer",
      ],
    },
  },
} as const
