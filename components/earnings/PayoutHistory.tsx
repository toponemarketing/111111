'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format } from 'date-fns'
import { Download, ExternalLink } from 'lucide-react'

interface Payout {
  id: string
  amount: number
  status: string
  created_at: string
  completed_at: string
  stripe_transfer_id: string
  failure_reason: string
}

export function PayoutHistory() {
  const [payouts, setPayouts] = useState<Payout[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchPayouts()
  }, [])

  const fetchPayouts = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data, error } = await supabase
        .from('payouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      setPayouts(data || [])
    } catch (error) {
      console.error('Error fetching payouts:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <span className="badge-success">Completed</span>
      case 'processing':
        return <span className="badge-warning">Processing</span>
      case 'failed':
        return <span className="badge-error">Failed</span>
      case 'pending':
        return <span className="badge-gray">Pending</span>
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
        <h3 className="text-lg font-semibold text-gray-900">Payout History</h3>
        <button className="btn-secondary text-sm inline-flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Export
        </button>
      </div>

      {payouts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No payouts yet. Complete referrals to start earning!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-900">Amount</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Date</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Completed</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout) => (
                <tr key={payout.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">
                      ${payout.amount.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {getStatusBadge(payout.status)}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {format(new Date(payout.created_at), 'MMM d, yyyy')}
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {payout.completed_at 
                      ? format(new Date(payout.completed_at), 'MMM d, yyyy')
                      : '-'
                    }
                  </td>
                  <td className="py-3 px-4">
                    {payout.stripe_transfer_id && (
                      <button className="text-primary-600 hover:text-primary-700 text-sm">
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    )}
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
