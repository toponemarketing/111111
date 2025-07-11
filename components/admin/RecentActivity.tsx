'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format } from 'date-fns'
import { Activity, DollarSign, Users, AlertTriangle } from 'lucide-react'

interface ActivityItem {
  id: string
  type: 'referral' | 'payout' | 'signup'
  description: string
  timestamp: string
  amount?: number
  status?: string
}

export function RecentActivity() {
  const [activities, setActivities] = useState<ActivityItem[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchRecentActivity()
  }, [])

  const fetchRecentActivity = async () => {
    try {
      // Fetch recent referrals
      const { data: referrals } = await supabase
        .from('referrals')
        .select(`
          id,
          status,
          reward_amount,
          created_at,
          referred_email,
          profiles!referrals_referrer_id_fkey(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(10)

      // Fetch recent payouts
      const { data: payouts } = await supabase
        .from('payouts')
        .select(`
          id,
          amount,
          status,
          created_at,
          profiles(full_name)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      // Combine and format activities
      const activities: ActivityItem[] = []

      referrals?.forEach(referral => {
        activities.push({
          id: referral.id,
          type: 'referral',
          description: `${referral.profiles?.full_name || 'User'} referred ${referral.referred_email}`,
          timestamp: referral.created_at,
          amount: referral.reward_amount,
          status: referral.status,
        })
      })

      payouts?.forEach(payout => {
        activities.push({
          id: payout.id,
          type: 'payout',
          description: `Payout to ${payout.profiles?.full_name || 'User'}`,
          timestamp: payout.created_at,
          amount: payout.amount,
          status: payout.status,
        })
      })

      // Sort by timestamp
      activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())

      setActivities(activities.slice(0, 10))
    } catch (error) {
      console.error('Error fetching recent activity:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'referral':
        return <Users className="h-5 w-5 text-blue-600" />
      case 'payout':
        return <DollarSign className="h-5 w-5 text-green-600" />
      case 'signup':
        return <Activity className="h-5 w-5 text-purple-600" />
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-600" />
    }
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600'
      case 'pending':
        return 'text-yellow-600'
      case 'failed':
        return 'text-red-600'
      default:
        return 'text-gray-600'
    }
  }

  if (loading) {
    return (
      <div className="card">
        <div className="h-6 bg-gray-200 rounded mb-4 animate-pulse"></div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-3">
              <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded mb-1 animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>

      {activities.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No recent activity</p>
        </div>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex-shrink-0">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {activity.description}
                </p>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-500">
                    {format(new Date(activity.timestamp), 'MMM d, yyyy h:mm a')}
                  </p>
                  {activity.amount && (
                    <span className={`text-sm font-medium ${getStatusColor(activity.status)}`}>
                      ${activity.amount.toFixed(2)}
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
