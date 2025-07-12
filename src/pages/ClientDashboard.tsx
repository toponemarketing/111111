import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { 
  DollarSign, 
  Users, 
  Share2, 
  Copy,
  ExternalLink,
  Gift,
  TrendingUp,
  Calendar
} from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'

const ClientDashboard = () => {
  const { clientId } = useParams()
  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<any>(null)
  const [referrals, setReferrals] = useState<any[]>([])
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Simulate loading client data
    setTimeout(() => {
      setClient({
        id: clientId,
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1 (555) 123-4567',
        totalReferrals: 8,
        totalEarnings: 450.00,
        pendingEarnings: 125.00,
        joinedDate: '2024-01-15',
        referralCode: 'JOHN2024'
      })
      
      setReferrals([
        {
          id: '1',
          referredName: 'Sarah Johnson',
          referredEmail: 'sarah@example.com',
          status: 'completed',
          jobValue: 850,
          rewardAmount: 85,
          createdAt: '2024-01-20',
          jobTitle: 'Kitchen Renovation'
        },
        {
          id: '2',
          referredName: 'Mike Wilson',
          referredEmail: 'mike@example.com',
          status: 'pending',
          jobValue: 1200,
          rewardAmount: 120,
          createdAt: '2024-01-18',
          jobTitle: 'Bathroom Remodel'
        },
        {
          id: '3',
          referredName: 'Lisa Chen',
          referredEmail: 'lisa@example.com',
          status: 'paid',
          jobValue: 650,
          rewardAmount: 65,
          createdAt: '2024-01-15',
          jobTitle: 'Plumbing Repair'
        }
      ])
      
      setLoading(false)
    }, 1000)
  }, [clientId])

  const copyReferralLink = () => {
    const referralLink = `${window.location.origin}/referral/${client.referralCode}`
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (!client) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Client Not Found</h2>
          <p className="text-gray-600 mb-4">The client you're looking for doesn't exist.</p>
          <Link to="/" className="text-primary-600 hover:text-primary-700">
            Return Home
          </Link>
        </div>
      </div>
    )
  }

  const referralLink = `${window.location.origin}/referral/${client.referralCode}`

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, {client.name}!</h1>
              <p className="text-gray-600">Track your referrals and earnings</p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Member since {new Date(client.joinedDate).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <DollarSign className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${client.totalEarnings.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-8 w-8 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Earnings</p>
                <p className="text-2xl font-bold text-gray-900">${client.pendingEarnings.toFixed(2)}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Referrals</p>
                <p className="text-2xl font-bold text-gray-900">{client.totalReferrals}</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-lg shadow-sm p-6 border border-gray-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Gift className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Referral Code</p>
                <p className="text-xl font-bold text-gray-900">{client.referralCode}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Referral Link Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Referral Link</h3>
                <Share2 className="h-5 w-5 text-gray-400" />
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between">
                  <code className="text-sm text-gray-700 break-all">{referralLink}</code>
                  <button
                    onClick={copyReferralLink}
                    className="ml-2 flex-shrink-0 p-2 text-gray-500 hover:text-gray-700 transition-colors"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                </div>
              </div>
              
              {copied && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-green-600 mb-4"
                >
                  ✓ Link copied to clipboard!
                </motion.p>
              )}
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={copyReferralLink}
                  className="flex-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors flex items-center justify-center"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy Link
                </button>
                <a
                  href={`mailto:?subject=Check out this amazing service&body=I thought you might be interested in this service: ${referralLink}`}
                  className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Share via Email
                </a>
              </div>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Share2 className="h-5 w-5 text-primary-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Share Referral</p>
                      <p className="text-sm text-gray-500">Send to friends & family</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <DollarSign className="h-5 w-5 text-green-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">View Earnings</p>
                      <p className="text-sm text-gray-500">Track your rewards</p>
                    </div>
                  </div>
                </button>
                
                <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium text-gray-900">Referral History</p>
                      <p className="text-sm text-gray-500">See all referrals</p>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Recent Referrals */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mt-8"
        >
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Referrals</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Referred Person
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job
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
                  {referrals.map((referral) => (
                    <tr key={referral.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{referral.referredName}</div>
                          <div className="text-sm text-gray-500">{referral.referredEmail}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{referral.jobTitle}</div>
                          <div className="text-sm text-gray-500">${referral.jobValue.toLocaleString()}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={referral.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                        ${referral.rewardAmount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(referral.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ClientDashboard
