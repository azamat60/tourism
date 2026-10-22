export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18";
  };
  public: {
    Tables: {
      tourism_activity: {
        Row: {
          action: string;
          actor: string | null;
          created_at: string;
          entity: string;
          id: number;
          record_id: string;
        };
        Insert: {
          action: string;
          actor?: string | null;
          created_at?: string;
          entity: string;
          id?: never;
          record_id: string;
        };
        Update: {
          action?: string;
          actor?: string | null;
          created_at?: string;
          entity?: string;
          id?: never;
          record_id?: string;
        };
        Relationships: [];
      };
      tourism_bookings: {
        Row: {
          created_at: string;
          departure_id: string;
          form: Json;
          id: string;
          notes: string;
          payment_status: string;
          policy_snapshot: Json;
          receipt: Json;
          status: string;
          token_hash: string;
          travelers: number;
          updated_at: string;
          version: number;
          waiver_version: string;
        };
        Insert: {
          created_at?: string;
          departure_id: string;
          form: Json;
          id: string;
          notes?: string;
          payment_status?: string;
          policy_snapshot: Json;
          receipt: Json;
          status?: string;
          token_hash: string;
          travelers: number;
          updated_at?: string;
          version?: number;
          waiver_version: string;
        };
        Update: {
          created_at?: string;
          departure_id?: string;
          form?: Json;
          id?: string;
          notes?: string;
          payment_status?: string;
          policy_snapshot?: Json;
          receipt?: Json;
          status?: string;
          token_hash?: string;
          travelers?: number;
          updated_at?: string;
          version?: number;
          waiver_version?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tourism_bookings_departure_id_fkey";
            columns: ["departure_id"];
            isOneToOne: false;
            referencedRelation: "tourism_content";
            referencedColumns: ["id"];
          },
        ];
      };
      tourism_content: {
        Row: {
          created_at: string;
          data: Json;
          id: string;
          kind: string;
          published: boolean;
          slug: string;
          translations: Json;
          updated_at: string;
          version: number;
        };
        Insert: {
          created_at?: string;
          data: Json;
          id: string;
          kind: string;
          published?: boolean;
          slug: string;
          translations?: Json;
          updated_at?: string;
          version?: number;
        };
        Update: {
          created_at?: string;
          data?: Json;
          id?: string;
          kind?: string;
          published?: boolean;
          slug?: string;
          translations?: Json;
          updated_at?: string;
          version?: number;
        };
        Relationships: [];
      };
      tourism_inquiries: {
        Row: {
          created_at: string;
          data: Json;
          id: string;
          notes: string;
          status: string;
          updated_at: string;
          version: number;
        };
        Insert: {
          created_at?: string;
          data: Json;
          id?: string;
          notes?: string;
          status?: string;
          updated_at?: string;
          version?: number;
        };
        Update: {
          created_at?: string;
          data?: Json;
          id?: string;
          notes?: string;
          status?: string;
          updated_at?: string;
          version?: number;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      tourism_receipt: {
        Args: { p_id: string; p_token: string };
        Returns: Json;
      };
      tourism_reserve: {
        Args: {
          p_departure: string;
          p_expected_total: number;
          p_extras: Json;
          p_form: Json;
          p_id: string;
          p_policies: Json;
          p_token: string;
        };
        Returns: Json;
      };
      tourism_staff_role: { Args: never; Returns: string };
      tourism_submit_inquiry: { Args: { p_data: Json }; Returns: string };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
