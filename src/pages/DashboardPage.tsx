import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  Users, 
  TrendingUp, 
  Clock,
  Plus,
  ExternalLink,
  AlertCircle,
  CheckCircle
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { supabase } from '../lib/supabase'
import { useAuthStore } from '../stores/authStore'
import { useBusinessStore } from '../stores/businessStore'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'

const DashboardPage = () => {
  const { user } = useAuthStore()
  const { business, setBusiness } = useBusinessStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalReferrals: 0,
    pendingPayouts: 0,
    totalEarnings: 0,
    activeClients: 0
  })
  const [recentReferrals, setRecentReferrals] = useState([])
  const [chartData, setChartData] = useState([])

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      // Load business profile
      const { data: businessData } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', user?.id)
        .single()

      if (businessData) {
        setBusiness(businessData)
      }

      // Load dashboard stats (using mock data for now)
      setStats({
        totalReferrals: 24,
        pendingPayouts: 3,
        totalEarnings: 1250.00,
        activeClients: 18
      })

      // Mock recent referrals
      setRecentReferrals([
        {
          id: '1',
          referrer_name: 'Sarah Johnson',
          referred_name: 'Mike Wilson',
          status: 'completed',
          reward_amount: 75.00,
          created_at: '2024-01-15T10:30:00Z'
        },
        {
          id: '2',
          referrer_name: 'David Chen',
          referred_name: 'Lisa Rodriguez',
          status: 'pending',
          reward_amount: 50.00,
          created_at: '2024-01-14T15:45:00Z'
        },
        {
          id: '3',
          referrer_name: 'Jennifer Smith',
          referred_name: 'Tom Anderson',
          status: 'paid',
          reward_amount: 100.00,
          created_at: '2024-01-13T09:15:00Z'
        }
      ])

      // Mock chart data
      setChartData([
        { month: 'Jan', referrals: 4, earnings: 200 },
        { month: 'Feb', referrals: 6, earnings: 350 },
        { month: 'Mar', referrals: 8, earnings: 480 },
        { month: 'Apr', referrals: 5, earnings: 275 },
        { month: 'May', referrals: 9, earnings: 625 },
        { month: 'Jun', referrals: 12, earnings: 850 }
      ])

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleConnectJobber = () => {
    // This would redirect to Jobber OAuth
    const clientId = import.meta.env.VITE_JOBBER_CLIENT_ID
    const redirectUri = `${import.meta.env.VITE_APP_URL}/auth/jobber/callback`
    const state = user?.id || ''
    
    const authUrl = `https://api.getjobber.com/api/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=clients:read jobs:read invoices:read&state=${state}`
    
    window.location.href = authUrl
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your referrals.</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Referral Link
          </button>
        </div>
      </div>

      {/* Connection Status */}
      {!business?.jobber_connected && (
        <motion.div
          className="bg-warning-50 border border-warning-200 rounded-lg p-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-warning-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-medium text-warning-800">
                Connect your Jobber account
              </h3>
              <p className="text-sm text-warning-700 mt-1">
                Connect your Jobber account to automatically track referrals and calculate rewards.
              </p>
              <button
                onClick={handleConnectJobber}
                className="mt-3 inline-flex items-center text-sm font-medium text-warning-800 hover:text-warning-900"
              >
                Connect Jobber
                <ExternalLink className="ml-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {business?.jobber_connected && (
        <motion.div
          className="bg-success-50 border border-success-200 rounded-lg p-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-5 w-5 text-success-600" />
            <div>
              <h3 className="text-sm font-medium text-success-800">
                Jobber Connected
              </h3>
              <p className="text-sm text-success-700">
                Your Jobber account is connected and syncing data.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            title: 'Total Referrals',
            value: stats.totalReferrals,
            icon: Users,
            color: 'text-primary-600',
            bgColor: 'bg-primary-50'
          },
          {
            title: 'Pending Payouts',
            value: stats.pendingPayouts,
            icon: Clock,
            color: 'text-warning-600',
            bgColor: 'bg-warning-50'
          },
          {
            title: 'Total Earnings',
            value: `$${stats.totalEarnings.toFixed(2)}`,
            icon: DollarSign,
            color: 'text-success-600',
            bgColor: 'bg-success-50'
          },
          {
            title: 'Active Clients',
            value: stats.activeClients,
            icon: TrendingUp,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
          }
        ].map((stat, index) => (
          <motion.div
            key={stat.title}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Referrals Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="referrals" 
                stroke="#0ea5e9" 
                strokeWidth={2}
                dot={{ fill: '#0ea5e9' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Earnings</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(value) => [`$${value}`, 'Earnings']} />
              <Bar dataKey="earnings" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Referrals */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Recent Referrals</h3>
          <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
            View all
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referrer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referred Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reward
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentReferrals.map((referral: any) => (
                <tr key={referral.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {referral.referrer_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {referral.referred_name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={referral.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${referral.reward_amount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(referral.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}

export default DashboardPage
