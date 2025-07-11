import { redirect } from 'next/navigation'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { ReferralLanding } from '@/components/referral/ReferralLanding'

interface ReferralPageProps {
  params: {
    code: string
  }
}

export default async function ReferralPage({ params }: ReferralPageProps) {
  const supabase = createServerComponentClient({ cookies })
  
  // Find the referral code
  const { data: referral } = await supabase
    .from('referral_codes')
    .select(`
      *,
      profiles (
        full_name,
        avatar_url
      )
    `)
    .eq('code', params.code)
    .eq('is_active', true)
    .single()

  if (!referral) {
    redirect('/')
  }

  return <ReferralLanding referral={referral} />
}
