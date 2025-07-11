import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { EarningsOverview } from '@/components/earnings/EarningsOverview'
import { PayoutHistory } from '@/components/earnings/PayoutHistory'
import { DashboardLayout } from '@/components/layout/DashboardLayout'

export default async function EarningsPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
          <p className="text-gray-600">View your earnings and payout history</p>
        </div>
        
        <EarningsOverview />
        <PayoutHistory />
      </div>
    </DashboardLayout>
  )
}
