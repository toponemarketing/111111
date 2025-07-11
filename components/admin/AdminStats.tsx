'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Users, DollarSign, TrendingUp, AlertCircle } from 'lucide-react'

interface AdminStats {
  totalUsers: number
  totalReferrals: number
  totalPayouts: number
  pendingApprovals: number
}

export function AdminStats() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalReferrals: 0,
    totalPayouts: 0,
    pendingApprovals: 0,
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      // Fetch total users
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })

      // Fetch total referrals
      const { count: referralCount } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })

      // Fetch total payouts amount
      const { data: payouts } = await supabase
        .from('payouts')
        .select('amount')
        .eq('status', 'completed')

      // Fetch pending approvals
      const { count: pendingCount } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      const totalPayouts = payouts?.reduce((sum, p) => sum + p.amount, 0) || 0

      setStats({
        totalUsers: userCount || 0,
        totalReferrals: referralCount || 0,
        totalPayouts,
        pendingApprovals: pendingCount || 0,
      })
    } catch (error) {
      console.error('Error fetching admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toString(),
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Referrals',
      value: stats.totalReferrals.toString(),
      icon: TrendingUp,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Total Payouts',
      value: `$${stats.totalPayouts.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Pending Approvals',
      value: stats.pendingApprovals.toString(),
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
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
