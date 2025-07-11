'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { format } from 'date-fns'
import { Search, Filter, Check, X, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

interface Referral {
  id: string
  referred_email: string
  status: string
  reward_amount: number
  created_at: string
  job_value: number
  profiles: {
    full_name: string
    email: string
  }
}

export function AdminReferralsList() {
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
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          profiles!referrals_referrer_id_fkey(full_name, email)
        `)
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
        referral.referred_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        referral.profiles?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(referral => referral.status === statusFilter)
    }

    setFilteredReferrals(filtered)
  }

  const updateReferralStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('referrals')
        .update({ status })
        .eq('id', id)

      if (error) throw error

      setReferrals(prev => 
        prev.map(r => r.id === id ? { ...r, status } : r)
      )

      toast.success(`Referral ${status}`)
    } catch (error) {
      console.error('Error updating referral:', error)
      toast.error('Failed to update referral')
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