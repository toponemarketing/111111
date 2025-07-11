'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format } from 'date-fns'
import { Search, Filter } from 'lucide-react'

interface Referral {
  id: string
  referred_email: string
  status: string
  reward_amount: number
  created_at: string
  job_value: number
  job_completed_at: string
}

export function ReferralsList() {
  const [referrals, setReferrals] = useState<Referral[]>([])
  const [filteredReferrals, setFilteredReferrals] = useState<Referral[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchReferrals()
  }, [])

  useEffect(() => {
    filterReferrals()
  }, [referrals, searchTerm, statusFilter])

  const fetchReferrals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('referrals')
        .select('*')
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setReferrals(data || [])
    } catch (error) {
      console.error('Error fetching referrals:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterReferrals = () => {
    let filtered = referrals

    if (searchTerm) {
      filtered = filtered.filter(referral =>
        referral.referred_email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(referral => referral.status === statusFilter)
    }

    setFilteredReferrals(filtered)
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
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="card">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 input"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 input"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Referrals Table */}
      {filteredReferrals.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">
            {referrals.length === 0 
              ? "No referrals yet. Start sharing your referral link!"
              : "No referrals match your search criteria."
            }
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Job Value</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Reward</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredReferrals.map((referral) => (
                <tr key={referral.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">{referral.referred_email}</div>
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(referral.status)}
                  </td>
                  <td className="py-3 px-4">
                    {referral.job_value ? `$${referral.job_value.toFixed(2)}` : '-'}
                  </td>
                  <td className="py-3 px-4">
                    {referral.reward_amount ? (
                      <span className="font-medium text-green-600">
                        +${referral.reward_amount.toFixed(2)}
                      </span>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {format(new Date(referral.created_at), 'MMM d, yyyy')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
