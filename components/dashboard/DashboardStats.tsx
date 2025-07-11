'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { DollarSign, Users, TrendingUp, Clock } from 'lucide-react'

interface Stats {
  totalEarnings: number
  totalReferrals: number
  pendingReferrals: number
  conversionRate: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalEarnings: 0,
    totalReferrals: 0,
    pendingReferrals: 0,
    conversionRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch referrals data
      const { data: referrals } = await supabase
        .from('referrals')
        .select('status, reward_amount')
        .eq('referrer_id', user.id)

      if (referrals) {
        const totalReferrals = referrals.length
        const completedReferrals = referrals.filter(r => r.status === 'completed')
        const pendingReferrals = referrals.filter(r => r.status === 'pending').length
        const totalEarnings = completedReferrals.reduce((sum, r) => sum + (r.reward_amount || 0), 0)
        const conversionRate = totalReferrals > 0 ? (completedReferrals.length / totalReferrals) * 100 : 0

        setStats({
          totalEarnings,
          totalReferrals,
          pendingReferrals,
          conversionRate,
        })
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Earnings',
      value: `$${stats.totalEarnings.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Referrals',
      value: stats.totalReferrals.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending Referrals',
      value: stats.pendingReferrals.toString(),
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Conversion Rate',
      value: `${stats.conversionRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <div key={index} className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
