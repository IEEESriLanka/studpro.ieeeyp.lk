export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      admin_profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          role: 'super_admin' | 'editor';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          role?: 'super_admin' | 'editor';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          role?: 'super_admin' | 'editor';
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "admin_profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      audit_logs: {
        Row: {
          id: string;
          actor_id: string | null;
          actor_email: string | null;
          actor_role: string | null;
          action: string;
          category: 'AUTH' | 'SECURITY' | 'DATA_MUTATION' | 'SYSTEM';
          severity: 'INFO' | 'WARN' | 'CRITICAL';
          details: Json;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          actor_id?: string | null;
          actor_email?: string | null;
          actor_role?: string | null;
          action: string;
          category: 'AUTH' | 'SECURITY' | 'DATA_MUTATION' | 'SYSTEM';
          severity?: 'INFO' | 'WARN' | 'CRITICAL';
          details?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          actor_id?: string | null;
          actor_email?: string | null;
          actor_role?: string | null;
          action?: string;
          category?: 'AUTH' | 'SECURITY' | 'DATA_MUTATION' | 'SYSTEM';
          severity?: 'INFO' | 'WARN' | 'CRITICAL';
          details?: Json;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey";
            columns: ["actor_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      studpro_cycles: {
        Row: {
          id: string;
          version: string;
          year: number;
          description: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          version: string;
          year: number;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          version?: string;
          year?: number;
          description?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      event_series: {
        Row: {
          id: string;
          cycle_id: string;
          title: string;
          description: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          cycle_id: string;
          title: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          cycle_id?: string;
          title?: string;
          description?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_series_cycle_id_fkey";
            columns: ["cycle_id"];
            isOneToOne: false;
            referencedRelation: "studpro_cycles";
            referencedColumns: ["id"];
          }
        ];
      };
      events: {
        Row: {
          id: string;
          cycle_id: string;
          series_id: string | null;
          category: 'career-fairs' | 'cv-clinics' | 'industry-visits' | 'workshops' | 'webinar';
          title: string;
          topic: string | null;
          event_date: string;
          time: string | null;
          venue: string | null;
          description: string | null;
          images: string[];
          is_featured: boolean;
          delivery_mode?: 'physical' | 'online' | 'hybrid';
          meeting_url?: string | null;
          map_url?: string | null;
          series_stage?: string | null;
          series_order?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          cycle_id: string;
          series_id?: string | null;
          category: 'career-fairs' | 'cv-clinics' | 'industry-visits' | 'workshops' | 'webinar';
          title: string;
          topic?: string | null;
          event_date: string;
          time?: string | null;
          venue?: string | null;
          description?: string | null;
          images?: string[];
          is_featured?: boolean;
          delivery_mode?: 'physical' | 'online' | 'hybrid';
          meeting_url?: string | null;
          map_url?: string | null;
          series_stage?: string | null;
          series_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          cycle_id?: string;
          series_id?: string | null;
          category?: 'career-fairs' | 'cv-clinics' | 'industry-visits' | 'workshops' | 'webinar';
          title?: string;
          topic?: string | null;
          event_date?: string;
          time?: string | null;
          venue?: string | null;
          description?: string | null;
          images?: string[];
          is_featured?: boolean;
          delivery_mode?: 'physical' | 'online' | 'hybrid';
          meeting_url?: string | null;
          map_url?: string | null;
          series_stage?: string | null;
          series_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "events_cycle_id_fkey";
            columns: ["cycle_id"];
            isOneToOne: false;
            referencedRelation: "studpro_cycles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "events_series_id_fkey";
            columns: ["series_id"];
            isOneToOne: false;
            referencedRelation: "event_series";
            referencedColumns: ["id"];
          }
        ];
      };
      event_companies: {
        Row: {
          event_id: string;
          company_id: string;
          role: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          event_id: string;
          company_id: string;
          role?: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          event_id?: string;
          company_id?: string;
          role?: string;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "event_companies_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "event_companies_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          }
        ];
      };
      speakers: {
        Row: {
          id: string;
          event_id: string;
          name: string;
          title: string | null;
          company: string | null;
          avatar_url: string | null;
          social_links: string[];
          display_order?: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          name: string;
          title?: string | null;
          company?: string | null;
          avatar_url?: string | null;
          social_links?: string[];
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          name?: string;
          title?: string | null;
          company?: string | null;
          avatar_url?: string | null;
          social_links?: string[];
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "speakers_event_id_fkey";
            columns: ["event_id"];
            isOneToOne: false;
            referencedRelation: "events";
            referencedColumns: ["id"];
          }
        ];
      };
      companies: {
        Row: {
          id: string;
          name: string;
          logo_url: string;
          web_link: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          name: string;
          logo_url: string;
          web_link?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          logo_url?: string;
          web_link?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      cycle_partners: {
        Row: {
          id: string;
          cycle_id: string;
          company_id: string;
          tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Partner';
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          cycle_id: string;
          company_id: string;
          tier: 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Partner';
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          cycle_id?: string;
          company_id?: string;
          tier?: 'Platinum' | 'Gold' | 'Silver' | 'Bronze' | 'Partner';
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cycle_partners_cycle_id_fkey";
            columns: ["cycle_id"];
            isOneToOne: false;
            referencedRelation: "studpro_cycles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "cycle_partners_company_id_fkey";
            columns: ["company_id"];
            isOneToOne: false;
            referencedRelation: "companies";
            referencedColumns: ["id"];
          }
        ];
      };
      team_members: {
        Row: {
          id: string;
          cycle_id: string | null;
          name: string;
          role: string;
          email: string | null;
          contact_no: string | null;
          linkedin_url: string | null;
          image_url: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          cycle_id?: string | null;
          name: string;
          role: string;
          email?: string | null;
          contact_no?: string | null;
          linkedin_url?: string | null;
          image_url?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          cycle_id?: string | null;
          name?: string;
          role?: string;
          email?: string | null;
          contact_no?: string | null;
          linkedin_url?: string | null;
          image_url?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "team_members_cycle_id_fkey";
            columns: ["cycle_id"];
            isOneToOne: false;
            referencedRelation: "studpro_cycles";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      is_admin: {
        Args: Record<PropertyKey, never>;
        Returns: boolean;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
