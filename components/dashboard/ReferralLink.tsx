'use client'

import { useEffect, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Copy, Share2, QrCode } from 'lucide-react'
import toast from 'react-hot-toast'
import QRCode from 'qrcode'

export function ReferralLink() {
  const [referralCode, setReferralCode] = useState('')
  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchReferralCode()
  }, [])

  const fetchReferralCode = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      // Check if user already has a referral code
      let { data: existingCode } = await supabase
        .from('referral_codes')
        .select('code')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .single()

      if (!existingCode) {
        // Generate new referral code
        const code = generateReferralCode()
        const { data: newCode, error } = await supabase
          .from('referral_codes')
          .insert({
            user_id: user.id,
            code,
            is_active: true,
          })
          .select('code')
          .single()

        if (error) throw error
        existingCode = newCode
      }

      setReferralCode(existingCode.code)
      
      // Generate QR code
      const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL}/r/${existingCode.code}`
      const qrCode = await QRCode.toDataURL(referralUrl)
      setQrCodeUrl(qrCode)
    } catch (error) {
      console.error('Error fetching referral code:', error)
      toast.error('Failed to load referral code')
    } finally {
      setLoading(false)
    }
  }

  const generateReferralCode = () => {
    return Math.random().toString(36).substring(2, 8).toUpperCase()
  }

  const referralUrl = `${process.env.NEXT_PUBLIC_APP_URL}/r/${referralCode}`

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralUrl)
      toast.success('Referral link copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy link')
    }
  }

  const shareLink = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my service and get rewarded!',
          text: 'Use my referral link to book a service and I\'ll earn a reward when you complete your job.',
          url: referralUrl,
        })
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      copyToClipboard()
    }
  }

  if (loading) {
    return (
      <div className="card animate-pulse">
        <div className="h-6 bg-gray-200 rounded mb-4"></div>
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
    )
  }

  return (
    <div className="card">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Your Referral Link
          </h3>
          <p className="text-gray-600 mb-4">
            Share this link with friends and family. You'll earn cash when they complete and pay for a job.
          </p>
          
          <div className="flex items-center space-x-2 mb-4">
            <input
              type="text"
              value={referralUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Copy link"
            >
              <Copy className="h-5 w-5" />
            </button>
            <button
              onClick={shareLink}
              className="p-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
              title="Share link"
            >
              <Share2 className="h-5 w-5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={shareLink}
              className="btn-primary text-sm"
            >
              Share Link
            </button>
            <button
              onClick={copyToClipboard}
              className="btn-secondary text-sm"
            >
              Copy Link
            </button>
          </div>
        </div>

        {qrCodeUrl && (
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg border border-gray-200 mb-2">
              <img src={qrCodeUrl} alt="QR Code" className="w-32 h-32" />
            </div>
            <p className="text-sm text-gray-600 text-center">
              <QrCode className="h-4 w-4 inline mr-1" />
              QR Code
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
