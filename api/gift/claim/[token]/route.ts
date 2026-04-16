import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import GiftSubscription from '@/models/GiftSubscription'
import User from '@/models/User'

interface Params { params: { token: string } }

// GET: validate a claim token — returns gift metadata for the claim page
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const gift = await GiftSubscription.findOne({ claimToken: params.token })
    if (!gift) return NextResponse.json({ error: 'Invalid or expired claim link' }, { status: 404 })
    if (gift.isClaimed) return NextResponse.json({ error: 'This gift has already been claimed' }, { status: 409 })
    if (gift.paymentStatus !== 'paid') return NextResponse.json({ error: 'Payment not confirmed yet' }, { status: 402 })

    return NextResponse.json({
      data: {
        gifterName: gift.gifterName,
        recipientName: gift.recipientName,
        recipientEmail: gift.recipientEmail,
        plan: gift.plan,
        message: gift.message,
        amountChargedUSD: gift.amountChargedUSD,
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Error fetching gift' }, { status: 500 })
  }
}

// POST: claim the gift (user registers or logs in, then calls this)
export async function POST(req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { userId } = await req.json()
    if (!userId) return NextResponse.json({ error: 'userId required' }, { status: 400 })

    const gift = await GiftSubscription.findOne({ claimToken: params.token })
    if (!gift) return NextResponse.json({ error: 'Invalid claim token' }, { status: 404 })
    if (gift.isClaimed) return NextResponse.json({ error: 'Already claimed' }, { status: 409 })
    if (gift.paymentStatus !== 'paid') return NextResponse.json({ error: 'Payment not confirmed' }, { status: 402 })

    const user = await User.findById(userId)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const now = new Date()
    const months = gift.plan === '1month' ? 1 : gift.plan === '6months' ? 6 : 12
    const end = new Date(now)
    end.setMonth(end.getMonth() + months)

    gift.recipientUserId = user._id
    gift.isClaimed = true
    gift.claimedAt = now
    gift.subscriptionStartDate = now
    gift.subscriptionEndDate = end
    await gift.save()

    // Activate premium on the user (User model must have isPremium / premiumUntil)
    // @ts-ignore — dynamic user field
    user.isPremium = true
    // @ts-ignore
    user.premiumUntil = end
    await user.save()

    return NextResponse.json({
      data: {
        message: 'Gift claimed successfully! Your Premium access is now active.',
        premiumUntil: end,
      },
    })
  } catch (err) {
    console.error('[gift/claim]', err)
    return NextResponse.json({ error: 'Failed to claim gift' }, { status: 500 })
  }
}
