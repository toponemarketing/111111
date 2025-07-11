import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'transfer.created':
        const transfer = event.data.object as Stripe.Transfer
        await handleTransferCreated(transfer)
        break
      
      case 'transfer.paid':
        const paidTransfer = event.data.object as Stripe.Transfer
        await handleTransferPaid(paidTransfer)
        break
      
      case 'transfer.failed':
        const failedTransfer = event.data.object as Stripe.Transfer
        await handleTransferFailed(failedTransfer)
        break
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler failed:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleTransferCreated(transfer: Stripe.Transfer) {
  const { error } = await supabase
    .from('payouts')
    .update({
      status: 'processing',
      stripe_transfer_id: transfer.id,
    })
    .eq('stripe_transfer_id', transfer.id)
}

async function handleTransferPaid(transfer: Stripe.Transfer) {
  const { error } = await supabase
    .from('payouts')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('stripe_transfer_id', transfer.id)
}

async function handleTransferFailed(transfer: Stripe.Transfer) {
  const { error } = await supabase
    .from('payouts')
    .update({
      status: 'failed',
      failure_reason: transfer.failure_message || 'Transfer failed',
    })
    .eq('stripe_transfer_id', transfer.id)
}
