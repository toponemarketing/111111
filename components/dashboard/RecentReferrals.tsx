'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format } from 'date-fns'
import { Eye } from 'lucide-react'
import Link from 'next/link'

interface Referral {
  id: string
  referred_email: string
  status: string
  reward_amount: number
  created_at: string
  job_value: number
}

export function RecentReferrals() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchRecentReferrals()
  }, [])

  const fetchRecentReferrals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      if (error) throw error
      setReferrals(data || [])
    } catch (error) {
      console.error('Error fetching referrals:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="badge-success">Completed</span>
      case 'pending':
        return <span className="badge-warning">Pending</span>
      case 'cancelled':
        return <span className="badge-error">Cancelled</span>
      default:
        return <span className="badge-gray">Unknown</span>
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Referrals</h3>
        <Link href="/dashboard/referrals" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
          View all
        </Link>
      </div>

      {referrals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No referrals yet. Start sharing your referral link!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {referrals.map((referral) => (
            <div key={referral.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <p className="font-medium text-gray-900">
                    {referral.referred_email}
                  </p>
                  {getStatusBadge(referral.status)}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{format(new Date(referral.created_at), 'MMM d, yyyy')}</span>
                  {referral.status === 'completed' && (
                    <span className="font-medium text-green-600">
                      +${referral.reward_amount?.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
