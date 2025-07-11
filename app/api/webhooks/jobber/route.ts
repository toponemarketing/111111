import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { processJobberWebhook } from '@/lib/jobber'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json()
    
    // Verify webhook signature (implement based on Jobber's webhook security)
    // const signature = request.headers.get('x-jobber-signature')
    
    await processJobberWebhook(payload)
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Jobber webhook error:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
