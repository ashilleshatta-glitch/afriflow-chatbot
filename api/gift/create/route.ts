import { NextRequest, NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import connectDB from '@/lib/mongodb'
import GiftSubscription from '@/models/GiftSubscription'

const PLANS = {
  '1month':    { usd: 20,  months: 1  },
  '6months':   { usd: 99,  months: 6  },
  '12months':  { usd: 179, months: 12 },
  'scholarship': { usd: 20, months: 1 },
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const {
      gifterEmail, gifterName, gifterCountry,
      recipientEmail, recipientName, recipientCountry,
      message, plan, currency = 'USD', paymentProvider = 'stripe',
    } = body

    if (!gifterEmail || !gifterName || !recipientEmail || !recipientName || !plan) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const planData = PLANS[plan as keyof typeof PLANS]
    if (!planData) {
      return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
    }

    const claimToken = randomUUID()

    const gift = await GiftSubscription.create({
      gifterEmail, gifterName, gifterCountry: gifterCountry || '',
      recipientEmail, recipientName, recipientCountry: recipientCountry || '',
      message: message || '',
      plan,
      amountChargedUSD: planData.usd,
      currency,
      amountChargedLocal: planData.usd,
      paymentProvider,
      paymentReference: `GIFT-${Date.now()}`,
      paymentStatus: 'pending',
      claimToken,
    })

    // In production: initiate payment with Stripe/Paystack here
    // and return a payment_url for the frontend to redirect to

    return NextResponse.json({
      data: {
        giftId: gift._id,
        claimToken,
        amountUSD: planData.usd,
        plan,
        // paymentUrl: '...' — from payment provider
      },
    })
  } catch (err) {
    console.error('[gift/create]', err)
    return NextResponse.json({ error: 'Failed to create gift' }, { status: 500 })
  }
}
