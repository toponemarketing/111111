import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  Plus, 
  Search, 
  Filter, 
  Download,
  Copy,
  Share2,
  Eye,
  MoreHorizontal
} from 'lucide-react'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'

const ReferralsPage = () => {
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [referrals, setReferrals] = useState([])
  const [showCreateModal, setShowCreateModal] = useState(false)

  useEffect(() => {
    loadReferrals()
  }, [])

  const loadReferrals = async () => {
    // Mock data for now
    setTimeout(() => {
      setReferrals([
        {
          id: '1',
          referral_code: 'REF-ABC123',
          referrer_name: 'Sarah Johnson',
          referrer_email: 'sarah@email.com',
          referred_name: 'Mike Wilson',
          referred_email: 'mike@email.com',
          status: 'completed',
          job_value: 1500.00,
          reward_amount: 75.00,
          created_at: '2024-01-15T10:30:00Z',
          expires_at: '2024-02-15T10:30:00Z'
        },
        {
          id: '2',
          referral_code: 'REF-DEF456',
          referrer_name: 'David Chen',
          referrer_email: 'david@email.com',
          referred_name: 'Lisa Rodriguez',
          referred_email: 'lisa@email.com',
          status: 'pending',
          job_value: 1000.00,
          reward_amount: 50.00,
          created_at: '2024-01-14T15:45:00Z',
          expires_at: '2024-02-14T15:45:00Z'
        },
        {
          id: '3',
          referral_code: 'REF-GHI789',
          referrer_name: 'Jennifer Smith',
          referrer_email: 'jennifer@email.com',
          referred_name: 'Tom Anderson',
          referred_email: 'tom@email.com',
          status: 'paid',
          job_value: 2000.00,
          reward_amount: 100.00,
          created_at: '2024-01-13T09:15:00Z',
          expires_at: '2024-02-13T09:15:00Z'
        },
        {
          id: '4',
          referral_code: 'REF-JKL012',
          referrer_name: 'Robert Brown',
          referrer_email: 'robert@email.com',
          referred_name: null,
          referred_email: null,
          status: 'pending',
          job_value: null,
          reward_amount: null,
          created_at: '2024-01-12T14:20:00Z',
          expires_at: '2024-02-12T14:20:00Z'
        },
        {
          id: '5',
          referral_code: 'REF-MNO345',
          referrer_name: 'Emily Davis',
          referrer_email: 'emily@email.com',
          referred_name: 'Alex Johnson',
          referred_email: 'alex@email.com',
          status: 'expired',
          job_value: null,
          reward_amount: null,
          created_at: '2023-12-15T11:30:00Z',
          expires_at: '2024-01-15T11:30:00Z'
        }
      ])
      setLoading(false)
    }, 1000)
  }

  const filteredReferrals = referrals.filter((referral: any) => {
    const matchesSearch = referral.referrer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         referral.referral_code.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (referral.referred_name && referral.referred_name.toLowerCase().includes(searchTerm.toLowerCase()))
    
    const matchesStatus = statusFilter === 'all' || referral.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const copyReferralLink = (code: string) => {
    const link = `${window.location.origin}/referral/${code}`
    navigator.clipboard.writeText(link)
    // Show toast notification
  }

  const generateReferralLink = () => {
    setShowCreateModal(true)
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
          <h1 className="text-2xl font-bold text-gray-900">Referrals</h1>
          <p className="text-gray-600">Manage your referral links and track their performance.</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <button className="btn-secondary">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
          <button onClick={generateReferralLink} className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Create Referral Link
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 sm:space-x-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search referrals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input min-w-0"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
                <option value="paid">Paid</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Referrals Table */}
      <motion.div
        className="card overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referrer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referral Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Referred Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Job Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reward
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReferrals.map((referral: any) => (
                <tr key={referral.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {referral.referrer_name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {referral.referrer_email}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-mono text-gray-900">
                        {referral.referral_code}
                      </span>
                      <button
                        onClick={() => copyReferralLink(referral.referral_code)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Copy referral link"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {referral.referred_name ? (
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {referral.referred_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {referral.referred_email}
                        </div>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No referral yet</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={referral.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {referral.job_value ? `$${referral.job_value.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {referral.reward_amount ? `$${referral.reward_amount.toFixed(2)}` : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(referral.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center space-x-2">
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        title="View details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => copyReferralLink(referral.referral_code)}
                        className="text-gray-400 hover:text-gray-600"
                        title="Share"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      <button
                        className="text-gray-400 hover:text-gray-600"
                        title="More options"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredReferrals.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No referrals found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first referral link to get started.'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button onClick={generateReferralLink} className="btn-primary">
                <Plus className="h-4 w-4 mr-2" />
                Create Referral Link
              </button>
            )}
          </div>
        )}
      </motion.div>

      {/* Create Referral Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Create Referral Link
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Name
                </label>
                <input
                  type="text"
                  className="input"
                  placeholder="Enter client name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Client Email
                </label>
                <input
                  type="email"
                  className="input"
                  placeholder="Enter client email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration (Optional)
                </label>
                <select className="input">
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                  <option value="">Never expires</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button className="btn-primary">
                Create Link
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default ReferralsPage
