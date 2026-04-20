// scripts/test-webhook.js
require('dotenv').config()
const crypto = require('crypto')

const WEBHOOK_SECRET = process.env.STRIMZ_WEBHOOK_SECRET || 'test-secret'
const BASE_URL = `http://localhost:${process.env.PORT || 5000}`

const signPayload = (payload, secret) => {
  return crypto.createHmac('sha256', secret).update(payload).digest('hex')
}

const sendWebhook = async (name, event) => {
  const body = JSON.stringify(event)
  const signature = signPayload(body, WEBHOOK_SECRET)

  console.log(`\n─────────────────────────────────`)
  console.log(`Test: ${name}`)

  const res = await fetch(`${BASE_URL}/api/v1/webhooks/strimz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'strimz-signature': signature,
    },
    body,
  })

  const result = await res.json()
  console.log(`Status: ${res.status}`)
  console.log(`Response:`, result)
}

const run = async () => {
  console.log(`🧪 Strimz Webhook Tests`)
  console.log(`Target: ${BASE_URL}/api/v1/webhooks/strimz`)

  // Test 1: Bad signature
  console.log(`\n─────────────────────────────────`)
  console.log(`Test: BAD SIGNATURE`)
  const badRes = await fetch(`${BASE_URL}/api/v1/webhooks/strimz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'strimz-signature': 'bad-signature',
    },
    body: JSON.stringify({ type: 'payment.success', data: {} }),
  })
  console.log(`Status: ${badRes.status} (expected 400 or 401)`)

  // Test 2: Nigerian airtime
  await sendWebhook('Nigerian Airtime (VTPass)', {
    type: 'payment.success',
    data: {
      payment: {
        id: 'test-ng-airtime-001',
        amount: 5.00,
        customerEmail: 'test@strimz.xyz',
        metadata: {},
        preference: JSON.stringify({
          type: 'airtime',
          provider: 'MTN',
          phone: '08030224350',
          email: 'test@strimz.xyz',
          amount: '100',
        }),
      },
    },
  })

  // Test 3: Nigerian electricity
  await sendWebhook('Nigerian Electricity (VTPass)', {
    type: 'payment.success',
    data: {
      payment: {
        id: 'test-ng-electricity-001',
        amount: 10.00,
        customerEmail: 'test@strimz.xyz',
        metadata: {},
        preference: JSON.stringify({
          type: 'electricity',
          provider: 'AEDC',
          meter: '1234567890',
          phone: '08030224350',
          email: 'test@strimz.xyz',
          amount: '1000',
        }),
      },
    },
  })

  // Test 4: Kenyan airtime
  await sendWebhook('Kenyan Airtime (Reloadly)', {
    type: 'payment.success',
    data: {
      payment: {
        id: 'test-ke-airtime-001',
        amount: 5.00,
        customerEmail: 'test@strimz.xyz',
        metadata: {},
        preference: JSON.stringify({
          type: 'airtime',
          provider: 'Safaricom',
          phone: '0712345678',
          email: 'test@strimz.xyz',
          amount: '100',
        }),
      },
    },
  })

  // Test 5: Regular payment (no preference)
  await sendWebhook('Regular merchant payment', {
    type: 'payment.success',
    data: {
      payment: {
        id: 'test-regular-001',
        amount: 20.00,
        customerEmail: 'merchant@example.com',
        metadata: { userId: 'user-123' },
      },
    },
  })

  // Test 6: Payment failed
  await sendWebhook('Payment failed', {
    type: 'payment.failed',
    data: {
      payment: {
        id: 'test-failed-001',
        customerEmail: 'test@strimz.xyz',
      },
    },
  })

  console.log('\n✅ All tests sent')
}

run().catch(console.error)