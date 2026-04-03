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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      books: {
        Row: {
          author: string
          available: boolean
          copies_available: number
          cover_image: string
          created_at: string
          description: string
          genre: string
          grade_band: string
          id: string
          series: string | null
          title: string
          total_copies: number
          updated_at: string
        }
        Insert: {
          author: string
          available?: boolean
          copies_available?: number
          cover_image?: string
          created_at?: string
          description?: string
          genre?: string
          grade_band?: string
          id?: string
          series?: string | null
          title: string
          total_copies?: number
          updated_at?: string
        }
        Update: {
          author?: string
          available?: boolean
          copies_available?: number
          cover_image?: string
          created_at?: string
          description?: string
          genre?: string
          grade_band?: string
          id?: string
          series?: string | null
          title?: string
          total_copies?: number
          updated_at?: string
        }
        Relationships: []
      }
      librarian_actions: {
        Row: {
          action: Database["public"]["Enums"]["librarian_action_type"]
          created_at: string
          id: string
          librarian_name: string
          note: string | null
          recommendation_id: string
          student_id: string
        }
        Insert: {
          action: Database["public"]["Enums"]["librarian_action_type"]
          created_at?: string
          id?: string
          librarian_name: string
          note?: string | null
          recommendation_id: string
          student_id: string
        }
        Update: {
          action?: Database["public"]["Enums"]["librarian_action_type"]
          created_at?: string
          id?: string
          librarian_name?: string
          note?: string | null
          recommendation_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "librarian_actions_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "recommendations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "librarian_actions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendations: {
        Row: {
          because_you_liked: string[]
          book_id: string
          confidence: number
          created_at: string
          explanation: string
          id: string
          position: number
          signals: Database["public"]["Enums"]["recommendation_signal"][]
          status: Database["public"]["Enums"]["recommendation_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          because_you_liked?: string[]
          book_id: string
          confidence?: number
          created_at?: string
          explanation?: string
          id?: string
          position?: number
          signals?: Database["public"]["Enums"]["recommendation_signal"][]
          status?: Database["public"]["Enums"]["recommendation_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          because_you_liked?: string[]
          book_id?: string
          confidence?: number
          created_at?: string
          explanation?: string
          id?: string
          position?: number
          signals?: Database["public"]["Enums"]["recommendation_signal"][]
          status?: Database["public"]["Enums"]["recommendation_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_book_id_fkey"
            columns: ["book_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recommendations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      school_metrics: {
        Row: {
          approval_rate: number
          created_at: string
          current_checkouts: number
          id: string
          lift_percent: number
          override_rate: number
          pre_baseline_checkouts: number
          school: string
          students_reached: number
          total_students: number
          updated_at: string
        }
        Insert: {
          approval_rate?: number
          created_at?: string
          current_checkouts?: number
          id?: string
          lift_percent?: number
          override_rate?: number
          pre_baseline_checkouts?: number
          school: string
          students_reached?: number
          total_students?: number
          updated_at?: string
        }
        Update: {
          approval_rate?: number
          created_at?: string
          current_checkouts?: number
          id?: string
          lift_percent?: number
          override_rate?: number
          pre_baseline_checkouts?: number
          school?: string
          students_reached?: number
          total_students?: number
          updated_at?: string
        }
        Relationships: []
      }
      students: {
        Row: {
          checkout_count: number
          created_at: string
          grade: number
          homeroom: string
          id: string
          name: string
          school: string
          updated_at: string
        }
        Insert: {
          checkout_count?: number
          created_at?: string
          grade: number
          homeroom?: string
          id?: string
          name: string
          school?: string
          updated_at?: string
        }
        Update: {
          checkout_count?: number
          created_at?: string
          grade?: number
          homeroom?: string
          id?: string
          name?: string
          school?: string
          updated_at?: string
        }
        Relationships: []
      }
      weekly_trends: {
        Row: {
          baseline: number
          checkouts_per_student: number
          created_at: string
          id: string
          recommendations_exposed: number
          recommendations_generated: number
          week: string
        }
        Insert: {
          baseline?: number
          checkouts_per_student?: number
          created_at?: string
          id?: string
          recommendations_exposed?: number
          recommendations_generated?: number
          week: string
        }
        Update: {
          baseline?: number
          checkouts_per_student?: number
          created_at?: string
          id?: string
          recommendations_exposed?: number
          recommendations_generated?: number
          week?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      librarian_action_type: "approved" | "replaced" | "pinned" | "suppressed"
      recommendation_signal:
        | "collaborative"
        | "content"
        | "popularity"
        | "series"
      recommendation_status:
        | "approved"
        | "pinned"
        | "suppressed"
        | "pending"
        | "auto-published"
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
      librarian_action_type: ["approved", "replaced", "pinned", "suppressed"],
      recommendation_signal: [
        "collaborative",
        "content",
        "popularity",
        "series",
      ],
      recommendation_status: [
        "approved",
        "pinned",
        "suppressed",
        "pending",
        "auto-published",
      ],
    },
  },
} as const
