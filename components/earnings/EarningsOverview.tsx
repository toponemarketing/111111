'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { DollarSign, TrendingUp, Clock, CheckCircle } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface EarningsData {
  totalEarnings: number
  pendingEarnings: number
  thisMonthEarnings: number
  growthRate: number
  chartData: Array<{ month: string; earnings: number }>
}

export function EarningsOverview() {
  const [data, setData] = useState<EarningsData>({
    totalEarnings: 0,
    pendingEarnings: 0,
    thisMonthEarnings: 0,
    growthRate: 0,
    chartData: [],
  })
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchEarningsData()
  }, [])

  const fetchEarningsData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Fetch completed referrals for earnings
      const { data: completedReferrals } = await supabase
        .from('referrals')
        .select('reward_amount, created_at')
        .eq('referrer_id', user.id)
        .eq('status', 'completed')

      // Fetch pending referrals
      const { data: pendingReferrals } = await supabase
        .from('referrals')
        .select('reward_amount')
        .eq('referrer_id', user.id)
        .eq('status', 'pending')

      if (completedReferrals) {
        const totalEarnings = completedReferrals.reduce((sum, r) => sum + (r.reward_amount || 0), 0)
        const pendingEarnings = pendingReferrals?.reduce((sum, r) => sum + (r.reward_amount || 0), 0) || 0
        
        // Calculate this month's earnings
        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()
        const thisMonthEarnings = completedReferrals
          .filter(r => {
            const date = new Date(r.created_at)
            return date.getMonth() === currentMonth && date.getFullYear() === currentYear
          })
          .reduce((sum, r) => sum + (r.reward_amount || 0), 0)

        // Generate chart data (last 6 months)
        const chartData = generateChartData(completedReferrals)

        setData({
          totalEarnings,
          pendingEarnings,
          thisMonthEarnings,
          growthRate: 12.5, // Mock growth rate
          chartData,
        })
      }
    } catch (error) {
      console.error('Error fetching earnings data:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateChartData = (referrals: any[]) => {
    const months = []
    const now = new Date()
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const monthName = date.toLocaleDateString('en-US', { month: 'short' })
      
      const monthEarnings = referrals
        .filter(r => {
          const refDate = new Date(r.created_at)
          return refDate.getMonth() === date.getMonth() && refDate.getFullYear() === date.getFullYear()
        })
        .reduce((sum, r) => sum + (r.reward_amount || 0), 0)

      months.push({
        month: monthName,
        earnings: monthEarnings,
      })
    }
    
    return months
  }

  const stats = [
    {
      title: 'Total Earnings',
      value: `$${data.totalEarnings.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'This Month',
      value: `$${data.thisMonthEarnings.toFixed(2)}`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Pending',
      value: `$${data.pendingEarnings.toFixed(2)}`,
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Growth Rate',
      value: `+${data.growthRate}%`,
      icon: CheckCircle,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
        <div className="card animate-pulse">
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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

      {/* Earnings Chart */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Earnings Trend</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Earnings']} />
              <Line 
                type="monotone" 
                dataKey="earnings" 
                stroke="#0ea5e9" 
                strokeWidth={2}
                dot={{ fill: '#0ea5e9' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
