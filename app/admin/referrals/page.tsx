import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { AdminReferralsList } from '@/components/admin/AdminReferralsList'
import { AdminLayout } from '@/components/layout/AdminLayout'

export default async function AdminReferralsPage() {
  const supabase = createServerComponentClient({ cookies })
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Check if user is admin
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') {
    redirect('/dashboard')
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Referrals</h1>
          <p className="text-gray-600">Review and manage all referral activity</p>
        </div>
        
        <AdminReferralsList />
      </div>
    </AdminLayout>
  )
}
