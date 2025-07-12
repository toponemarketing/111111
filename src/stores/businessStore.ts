import { create } from 'zustand'

export interface Business {
  id: string
  name: string
  email: string
  phone?: string
  logo_url?: string
  primary_color?: string
  referral_rate: number
  auto_approve_days: number
  minimum_payout: number
  jobber_connected: boolean
  jobber_access_token?: string
  stripe_connected: boolean
  stripe_account_id?: string
  created_at: string
  updated_at: string
}

interface BusinessState {
  business: Business | null
  setBusiness: (business: Business | null) => void
}

export const useBusinessStore = create<BusinessState>((set) => ({
  business: null,
  setBusiness: (business) => set({ business }),
}))
