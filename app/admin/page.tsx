import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { AdminStats } from '@/components/admin/AdminStats'
import { RecentActivity } from '@/components/admin/RecentActivity'
import { AdminLayout } from '@/components/layout/AdminLayout'

export default async function AdminPage() {
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
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage referrals and payouts</p>
        </div>
        
        <AdminStats />
        <RecentActivity />
      </div>
    </AdminLayout>
  )
}
