import { NextRequest, NextResponse } from 'next/server'
import { constructEvent } from '@strimz/sdk/server'

/**
 * Webhook handler for Strimz payment events
 * POST /api/webhooks/strimz
 * 
 * This handler verifies the webhook signature and logs events.
 * Business logic (bill fulfillment, emails, access grants) is handled
 * by the Strimz backend service.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.text()
    const signature = req.headers.get('strimz-signature')

    if (!signature) {
      return NextResponse.json(
        { error: 'Missing signature' },
        { status: 401 }
      )
    }

    const webhookSecret = process.env.STRIMZ_WEBHOOK_SECRET!
    const event = constructEvent(body, signature, webhookSecret)

    console.log(`[Webhook] Received event: ${event.type}`, event.data)

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('[Webhook] Error:', error)
    return NextResponse.json(
      { error: 'Webhook verification failed' },
      { status: 400 }
    )
  }
}
