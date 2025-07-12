export interface Referral {
  id: string
  business_id: string
  referrer_client_id: string
  referred_client_id?: string
  referral_code: string
  status: 'pending' | 'completed' | 'paid' | 'expired'
  job_id?: string
  job_value?: number
  reward_amount?: number
  created_at: string
  updated_at: string
  expires_at: string
  referrer_name: string
  referrer_email: string
  referred_name?: string
  referred_email?: string
}

export interface Client {
  id: string
  business_id: string
  jobber_client_id?: string
  name: string
  email: string
  phone?: string
  total_referrals: number
  total_earnings: number
  created_at: string
  updated_at: string
}

export interface Job {
  id: string
  jobber_job_id: string
  business_id: string
  client_id: string
  title: string
  description?: string
  status: string
  total_amount: number
  completed_at?: string
  paid_at?: string
  created_at: string
}

export interface Payout {
  id: string
  business_id: string
  client_id: string
  referral_id: string
  amount: number
  status: 'pending' | 'processing' | 'completed' | 'failed'
  stripe_transfer_id?: string
  created_at: string
  updated_at: string
}
