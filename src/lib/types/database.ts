export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          role: 'student' | 'faculty' | 'admin'
          avatar_url: string | null
          student_id: string | null
          department: string | null
          year_of_study: number | null
          phone: string | null
          address: string | null
          date_of_birth: string | null
          emergency_contact: string | null
          emergency_phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          role?: 'student' | 'faculty' | 'admin'
          avatar_url?: string | null
          student_id?: string | null
          department?: string | null
          year_of_study?: number | null
          phone?: string | null
          address?: string | null
          date_of_birth?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
        }
        Update: {
          email?: string
          first_name?: string
          last_name?: string
          role?: 'student' | 'faculty' | 'admin'
          avatar_url?: string | null
          student_id?: string | null
          department?: string | null
          year_of_study?: number | null
          phone?: string | null
          address?: string | null
          date_of_birth?: string | null
          emergency_contact?: string | null
          emergency_phone?: string | null
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          title: string
          message: string
          type: 'info' | 'warning' | 'success' | 'error'
          read: boolean
          action_url: string | null
          metadata: Json | null
          created_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          message: string
          type?: 'info' | 'warning' | 'success' | 'error'
          read?: boolean
          action_url?: string | null
          metadata?: Json | null
          expires_at?: string | null
        }
        Update: {
          title?: string
          message?: string
          type?: 'info' | 'warning' | 'success' | 'error'
          read?: boolean
          action_url?: string | null
          metadata?: Json | null
          expires_at?: string | null
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          content: string | null
          file_url: string | null
          file_type: string | null
          file_size: number | null
          status: 'draft' | 'published' | 'archived'
          created_by: string | null
          department: string | null
          tags: string[] | null
          is_collaborative: boolean
          version: number
          parent_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          content?: string | null
          file_url?: string | null
          file_type?: string | null
          file_size?: number | null
          status?: 'draft' | 'published' | 'archived'
          created_by?: string | null
          department?: string | null
          tags?: string[] | null
          is_collaborative?: boolean
          version?: number
          parent_id?: string | null
        }
        Update: {
          title?: string
          content?: string | null
          file_url?: string | null
          file_type?: string | null
          file_size?: number | null
          status?: 'draft' | 'published' | 'archived'
          department?: string | null
          tags?: string[] | null
          is_collaborative?: boolean
          version?: number
          parent_id?: string | null
          updated_at?: string
        }
      }
      exams: {
        Row: {
          id: string
          title: string
          description: string | null
          course_code: string | null
          department: string | null
          duration: number | null
          total_marks: number
          status: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled'
          scheduled_at: string | null
          created_by: string | null
          questions: Json | null
          ai_generated: boolean
          source_documents: string[] | null
          settings: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          course_code?: string | null
          department?: string | null
          duration?: number | null
          total_marks?: number
          status?: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled'
          scheduled_at?: string | null
          created_by?: string | null
          questions?: Json | null
          ai_generated?: boolean
          source_documents?: string[] | null
          settings?: Json | null
        }
        Update: {
          title?: string
          description?: string | null
          course_code?: string | null
          department?: string | null
          duration?: number | null
          total_marks?: number
          status?: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled'
          scheduled_at?: string | null
          questions?: Json | null
          ai_generated?: boolean
          source_documents?: string[] | null
          settings?: Json | null
          updated_at?: string
        }
      }
      content: {
        Row: {
          id: string
          title: string
          description: string | null
          content_type: 'announcement' | 'resource' | 'assignment' | 'material'
          content_data: Json | null
          file_urls: string[] | null
          department: string | null
          course_code: string | null
          target_audience: string[] | null
          created_by: string | null
          is_featured: boolean
          is_pinned: boolean
          publish_date: string
          expiry_date: string | null
          view_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          content_type: 'announcement' | 'resource' | 'assignment' | 'material'
          content_data?: Json | null
          file_urls?: string[] | null
          department?: string | null
          course_code?: string | null
          target_audience?: string[] | null
          created_by?: string | null
          is_featured?: boolean
          is_pinned?: boolean
          publish_date?: string
          expiry_date?: string | null
          view_count?: number
        }
        Update: {
          title?: string
          description?: string | null
          content_type?: 'announcement' | 'resource' | 'assignment' | 'material'
          content_data?: Json | null
          file_urls?: string[] | null
          department?: string | null
          course_code?: string | null
          target_audience?: string[] | null
          is_featured?: boolean
          is_pinned?: boolean
          publish_date?: string
          expiry_date?: string | null
          view_count?: number
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          theme: 'light' | 'dark' | 'system'
          font_size: 'small' | 'medium' | 'large' | 'extra-large'
          notifications_enabled: boolean
          email_notifications: boolean
          push_notifications: boolean
          sound_notifications: boolean
          language: string
          timezone: string
          dashboard_layout: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          theme?: 'light' | 'dark' | 'system'
          font_size?: 'small' | 'medium' | 'large' | 'extra-large'
          notifications_enabled?: boolean
          email_notifications?: boolean
          push_notifications?: boolean
          sound_notifications?: boolean
          language?: string
          timezone?: string
          dashboard_layout?: Json | null
        }
        Update: {
          theme?: 'light' | 'dark' | 'system'
          font_size?: 'small' | 'medium' | 'large' | 'extra-large'
          notifications_enabled?: boolean
          email_notifications?: boolean
          push_notifications?: boolean
          sound_notifications?: boolean
          language?: string
          timezone?: string
          dashboard_layout?: Json | null
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          title: string
          description: string | null
          event_type: string | null
          location: string | null
          start_time: string
          end_time: string
          organizer_id: string | null
          department: string | null
          is_public: boolean
          max_attendees: number | null
          registration_required: boolean
          registration_deadline: string | null
          tags: string[] | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          event_type?: string | null
          location?: string | null
          start_time: string
          end_time: string
          organizer_id?: string | null
          department?: string | null
          is_public?: boolean
          max_attendees?: number | null
          registration_required?: boolean
          registration_deadline?: string | null
          tags?: string[] | null
          image_url?: string | null
        }
        Update: {
          title?: string
          description?: string | null
          event_type?: string | null
          location?: string | null
          start_time?: string
          end_time?: string
          department?: string | null
          is_public?: boolean
          max_attendees?: number | null
          registration_required?: boolean
          registration_deadline?: string | null
          tags?: string[] | null
          image_url?: string | null
          updated_at?: string
        }
      }
      analytics: {
        Row: {
          id: string
          user_id: string | null
          event_type: string
          event_data: Json | null
          page_url: string | null
          user_agent: string | null
          ip_address: string | null
          session_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          event_type: string
          event_data?: Json | null
          page_url?: string | null
          user_agent?: string | null
          ip_address?: string | null
          session_id?: string | null
        }
        Update: {
          event_type?: string
          event_data?: Json | null
          page_url?: string | null
          user_agent?: string | null
          ip_address?: string | null
          session_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_dashboard_stats: {
        Args: {
          user_uuid: string
        }
        Returns: Json
      }
      create_notification: {
        Args: {
          target_user_id: string
          notification_title: string
          notification_message: string
          notification_type?: string
          action_url?: string | null
          expires_in_hours?: number
        }
        Returns: string
      }
      broadcast_notification: {
        Args: {
          user_ids: string[]
          notification_title: string
          notification_message: string
          notification_type?: string
          action_url?: string | null
        }
        Returns: number
      }
    }
    Enums: {
      user_role: 'student' | 'faculty' | 'admin'
      notification_type: 'info' | 'warning' | 'success' | 'error'
      exam_status: 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled'
      document_status: 'draft' | 'published' | 'archived'
    }
  }
}