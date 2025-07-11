import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { ReferralsList } from '@/components/referrals/ReferralsList'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default async function ReferralsPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">My Referrals</h1>
          <p className="text-gray-600">Track all your referral activity</p>
        </div>
        
        <ReferralsList />
      </div>
    </DashboardLayout>
  )
}
