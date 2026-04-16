import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import GiftSubscription from '@/models/GiftSubscription'
import User from '@/models/User'

// Handles Stripe/Paystack/Flutterwave webhooks
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    // Detect provider from header or body shape
    const stripeSignature = req.headers.get('stripe-signature')
    const paystackEvent = body?.event // paystack sends event field

    let reference: string | undefined
    let status: 'paid' | 'failed' = 'paid'

    if (stripeSignature) {
      // Stripe webhook
      reference = body?.data?.object?.metadata?.paymentReference || body?.data?.object?.id
      status = body?.data?.object?.status === 'succeeded' ? 'paid' : 'failed'
    } else if (paystackEvent) {
      // Paystack webhook
      reference = body?.data?.reference
      status = body?.data?.status === 'success' ? 'paid' : 'failed'
    } else {
      // Flutterwave webhook
      reference = body?.data?.tx_ref
      status = body?.data?.status === 'successful' ? 'paid' : 'failed'
    }

    if (!reference) {
      return NextResponse.json({ error: 'No reference found' }, { status: 400 })
    }

    const gift = await GiftSubscription.findOne({ paymentReference: reference })
    if (!gift) {
      return NextResponse.json({ error: 'Gift not found' }, { status: 404 })
    }

    gift.paymentStatus = status

    if (status === 'paid') {
      // Activate: try to find recipient user and activate subscription
      const recipientUser = await User.findOne({ email: gift.recipientEmail })
      if (recipientUser) {
        gift.recipientUserId = recipientUser._id
        const now = new Date()
        const months = gift.plan === '1month' ? 1 : gift.plan === '6months' ? 6 : 12
        const end = new Date(now)
        end.setMonth(end.getMonth() + months)
        gift.subscriptionStartDate = now
        gift.subscriptionEndDate = end
        gift.isClaimed = true
        gift.claimedAt = now
        // In production: set user.isPremium = true, user.premiumUntil = end
      }
      // TODO: send confirmation emails (gifter + recipient)
    }

    await gift.save()
    return NextResponse.json({ data: { status } })
  } catch (err) {
    console.error('[gift/verify]', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}

// GET: manually verify a payment reference (for testing)
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const ref = req.nextUrl.searchParams.get('reference')
    if (!ref) return NextResponse.json({ error: 'reference required' }, { status: 400 })
    const gift = await GiftSubscription.findOne({ paymentReference: ref })
    if (!gift) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json({ data: gift })
  } catch (err) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
