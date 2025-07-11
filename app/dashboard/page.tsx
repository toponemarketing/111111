import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { DashboardStats } from '@/components/dashboard/DashboardStats'
import { RecentReferrals } from '@/components/dashboard/RecentReferrals'
import { ReferralLink } from '@/components/dashboard/ReferralLink'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">Track your referrals and earnings</p>
        </div>
        
        <DashboardStats />
        <ReferralLink />
        <RecentReferrals />
      </div>
    </DashboardLayout>
  )
}
