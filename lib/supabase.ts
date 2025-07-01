import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          email: string
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      quotes: {
        Row: {
          id: string
          client_id: string
          service_description: string
          amount: number
          scheduled_date: string | null
          status: 'draft' | 'pending' | 'approved' | 'declined'
          public_token: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          client_id: string
          service_description: string
          amount: number
          scheduled_date?: string | null
          status?: 'draft' | 'pending' | 'approved' | 'declined'
          public_token?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          service_description?: string
          amount?: number
          scheduled_date?: string | null
          status?: 'draft' | 'pending' | 'approved' | 'declined'
          public_token?: string
          created_at?: