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
          created_at: string
          updated_at: string
          first_name: string | null
          last_name: string | null
          email: string
          phone: string | null
          role: 'landlord' | 'tenant'
          avatar_url: string | null
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          first_name?: string | null
          last_name?: string | null
          email: string
          phone?: string | null
          role?: 'landlord' | 'tenant'
          avatar_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name?: string | null
          last_name?: string | null
          email?: string
          phone?: string | null
          role?: 'landlord' | 'tenant'
          avatar_url?: string | null
        }
      }
      properties: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          landlord_id: string
          name: string
          address: string
          city: string
          state: string
          zip: string
          description: string | null
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          landlord_id: string
          name: string
          address: string
          city: string
          state: string
          zip: string
          description?: string | null
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          landlord_id?: string
          name?: string
          address?: string
          city?: string
          state?: string
          zip?: string
          description?: string | null
          image_url?: string | null
        }
      }
      units: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          property_id: string
          unit_number: string
          bedrooms: number
          bathrooms: number
          square_feet: number | null
          rent_amount: number
          status: 'vacant' | 'occupied' | 'maintenance'
          description: string | null
          image_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          property_id: string
          unit_number: string
          bedrooms: number
          bathrooms: number
          square_feet?: number | null
          rent_amount: number
          status?: 'vacant' | 'occupied' | 'maintenance'
          description?: string | null
          image_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          property_id?: string
          unit_number?: string
          bedrooms?: number
          bathrooms?: number
          square_feet?: number | null
          rent_amount?: number
          status?: 'vacant' | 'occupied' | 'maintenance'
          description?: string | null
          image_url?: string | null
        }
      }
      leases: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          unit_id: string
          tenant_id: string
          start_date: string
          end_date: string
          rent_amount: number
          security_deposit: number
          rent_due_day: number
          late_fee_amount: number | null
          late_fee_days: number | null
          status: 'active' | 'expired' | 'terminated'
          document_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          unit_id: string
          tenant_id: string
          start_date: string
          end_date: string
          rent_amount: number
          security_deposit: number
          rent_due_day: number
          late_fee_amount?: number | null
          late_fee_days?: number | null
          status?: 'active' | 'expired' | 'terminated'
          document_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          unit_id?: string
          tenant_id?: string
          start_date?: string
          end_date?: string
          rent_amount?: number
          security_deposit?: number
          rent_due_day?: number
          late_fee_amount?: number | null
          late_fee_days?: number | null
          status?: 'active' | 'expired' | 'terminated'
          document_url?: string | null
        }
      }
      payments: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          lease_id: string
          tenant_id: string
          amount: number
          payment_date: string
          due_date: string
          payment_method: 'credit_card' | 'paypal' | 'venmo' | 'cash' | 'other'
          status: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id: string | null
          notes: string | null
          late_fee: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          lease_id: string
          tenant_id: string
          amount: number
          payment_date: string
          due_date: string
          payment_method: 'credit_card' | 'paypal' | 'venmo' | 'cash' | 'other'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          notes?: string | null
          late_fee?: number | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          lease_id?: string
          tenant_id?: string
          amount?: number
          payment_date?: string
          due_date?: string
          payment_method?: 'credit_card' | 'paypal' | 'venmo' | 'cash' | 'other'
          status?: 'pending' | 'completed' | 'failed' | 'refunded'
          transaction_id?: string | null
          notes?: string | null
          late_fee?: number | null
        }
      }
      maintenance_requests: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          unit_id: string
          tenant_id: string
          title: string
          description: string
          priority: 'low' | 'medium' | 'high' | 'emergency'
          status: 'open' | 'in_progress' | 'completed' | 'cancelled'
          completed_at: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          unit_id: string
          tenant_id: string
          title: string
          description: string
          priority?: 'low' | 'medium' | 'high' | 'emergency'
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
          completed_at?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          unit_id?: string
          tenant_id?: string
          title?: string
          description?: string
          priority?: 'low' | 'medium' | 'high' | 'emergency'
          status?: 'open' | 'in_progress' | 'completed' | 'cancelled'
          completed_at?: string | null
          notes?: string | null
        }
      }
      maintenance_images: {
        Row: {
          id: string
          created_at: string
          maintenance_request_id: string
          image_url: string
          description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          maintenance_request_id: string
          image_url: string
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          maintenance_request_id?: string
          image_url?: string
          description?: string | null
        }
      }
      maintenance_comments: {
        Row: {
          id: string
          created_at: string
          maintenance_request_id: string
          user_id: string
          comment: string
        }
        Insert: {
          id?: string
          created_at?: string
          maintenance_request_id: string
          user_id: string
          comment: string
        }
        Update: {
          id?: string
          created_at?: string
          maintenance_request_id?: string
          user_id?: string
          comment?: string
        }
      }
      payment_methods: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          landlord_id: string
          method_type: 'stripe' | 'paypal' | 'venmo' | 'bank' | 'cash'
          is_enabled: boolean
          account_email: string | null
          account_username: string | null
          account_details: string | null
          instructions: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          landlord_id: string
          method_type: 'stripe' | 'paypal' | 'venmo' | 'bank' | 'cash'
          is_enabled?: boolean
          account_email?: string | null
          account_username?: string | null
          account_details?: string | null
          instructions?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          landlord_id?: string
          method_type?: 'stripe' | 'paypal' | 'venmo' | 'bank' | 'cash'
          is_enabled?: boolean
          account_email?: string | null
          account_username?: string | null
          account_details?: string | null
          instructions?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          created_at: string
          user_id: string
          title: string
          message: string
          type: 'payment' | 'maintenance' | 'lease' | 'system'
          is_read: boolean
          related_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          title: string
          message: string
          type: 'payment' | 'maintenance' | 'lease' | 'system'
          is_read?: boolean
          related_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'payment' | 'maintenance' | 'lease' | 'system'
          is_read?: boolean
          related_id?: string | null
        }
      }
    }
  }
}
