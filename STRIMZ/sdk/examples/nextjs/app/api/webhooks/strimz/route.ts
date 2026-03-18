import { NextRequest, NextResponse } from 'next/server'
import { constructEvent } from '@strimz/sdk/server'

/**
 * Webhook handler for Strimz payment events
 * POST /api/webhooks/strimz
 */
export async function POST(req: NextRequest) {
  try {
    // Get raw body and signature
    const body = await req.text()
    const signature = req.headers.get('strimz-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      )
    }

    // Verify webhook signature and construct event
    const webhookSecret = process.env.STRIMZ_WEBHOOK_SECRET!
    const event = constructEvent(body, signature, webhookSecret)

    console.log(`[Webhook] Received event: ${event.type}`)

    // Handle different event types
    switch (event.type) {
      case 'payment.success':
        await handlePaymentSuccess(event.data)
        break

      case 'payment.failed':
        await handlePaymentFailed(event.data)
        break

      case 'subscription.created':
        await handleSubscriptionCreated(event.data)
        break

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event.data)
        break

      case 'subscription.renewed':
        await handleSubscriptionRenewed(event.data)
        break

      default:
        console.log(`[Webhook] Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Webhook] Error:', error)
    return NextResponse.json(
      { error: 'Webhook verification failed' },
      { status: 400 }
    )
  }
}

// ============================================================================
// Event Handlers
// ============================================================================

async function handlePaymentSuccess(data: any) {
  const payment = data.payment

  console.log('[Webhook] Payment successful:', {
    id: payment.id,
    amount: payment.amount,
    customerEmail: payment.customerEmail,
    metadata: payment.metadata
  })

  // TODO: Grant access to user
  // Example:
  // await db.user.update({
  //   where: { id: payment.metadata.userId },
  //   data: { isPremium: true }
  // })

  // TODO: Send confirmation email
  // await sendEmail({
  //   to: payment.customerEmail,
  //   subject: 'Payment Confirmed',
  //   body: `Your payment of $${payment.amount / 100} was successful!`
  // })
}

async function handlePaymentFailed(data: any) {
  const payment = data.payment

  console.log('[Webhook] Payment failed:', {
    id: payment.id,
    customerEmail: payment.customerEmail
  })

  // TODO: Notify user of failed payment
}

async function handleSubscriptionCreated(data: any) {
  const subscription = data.subscription

  console.log('[Webhook] Subscription created:', {
    id: subscription.id,
    interval: subscription.interval,
    amount: subscription.amount,
    customerEmail: subscription.customerEmail
  })

  // TODO: Grant subscription access
  // TODO: Send welcome email
}

async function handleSubscriptionCancelled(data: any) {
  const subscription = data.subscription

  console.log('[Webhook] Subscription cancelled:', {
    id: subscription.id,
    customerEmail: subscription.customerEmail
  })

  // TODO: Revoke subscription access
  // TODO: Send cancellation confirmation
}

async function handleSubscriptionRenewed(data: any) {
  const subscription = data.subscription

  console.log('[Webhook] Subscription renewed:', {
    id: subscription.id,
    nextBillingDate: subscription.nextBillingDate
  })

  // TODO: Extend subscription access
  // TODO: Send renewal confirmation
}
