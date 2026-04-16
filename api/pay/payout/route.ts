import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Wallet from '@/models/Wallet'
import Payout from '@/models/Payout'
import Transaction from '@/models/Transaction'
import { getUserFromRequest } from '@/lib/auth'

const PAYOUT_FEE_RATE = 0.02   // 2% payout fee
const MIN_PAYOUT = 10
const RATES_TO_USD: Record<string, number> = {
  USD: 1, EUR: 1.08, GBP: 1.27,
  NGN: 0.00063, KES: 0.0077, GHS: 0.068,
  ZAR: 0.054, EGP: 0.021, USDC: 1,
}

// GET /api/pay/payout — list user's payout history
export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const payouts = await Payout.find({ userId: payload.userId })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean()

    return NextResponse.json({ data: payouts })
  } catch (err) {
    console.error('[GET /api/pay/payout]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/pay/payout — request a withdrawal
export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { amount, currency = 'USD', method, provider, destination, destinationLabel } = body

    if (!amount || amount < MIN_PAYOUT)
      return NextResponse.json({ error: `Minimum payout is ${MIN_PAYOUT} ${currency}` }, { status: 400 })
    if (!method || !provider || !destination)
      return NextResponse.json({ error: 'method, provider and destination are required' }, { status: 400 })

    await connectDB()

    const wallet = await Wallet.findOne({ userId: payload.userId })
    if (!wallet) return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    if (wallet.isSuspended)
      return NextResponse.json({ error: 'Your wallet is suspended' }, { status: 403 })
    if (wallet.kycLevel < 1)
      return NextResponse.json({ error: 'Please verify your account before requesting a payout' }, { status: 403 })

    const balance = (wallet.balances as Map<string, number>).get(currency) ?? 0
    const fee = parseFloat((amount * PAYOUT_FEE_RATE).toFixed(2))
    const total = amount + fee

    if (balance < total)
      return NextResponse.json({
        error: `Insufficient balance. Available: ${currency} ${balance.toFixed(2)}, required: ${currency} ${total.toFixed(2)} (inc. fee)`,
      }, { status: 400 })

    const amountUSD = amount * (RATES_TO_USD[currency] ?? 1)

    // Debit wallet immediately (hold)
    ;(wallet.balances as Map<string, number>).set(currency, balance - total)
    wallet.totalPaidOut += amountUSD
    wallet.markModified('balances')

    // Create payout record
    const payout = await Payout.create({
      userId: payload.userId,
      amount,
      currency,
      amountUSD,
      fee,
      netAmount: amount - fee,
      method,
      provider,
      destination,
      destinationLabel,
      status: 'requested',
      requestedAt: new Date(),
    })

    // Log transaction
    await Transaction.create({
      fromUserId: payload.userId,
      amount,
      currency,
      amountUSD,
      fee,
      netAmount: amount - fee,
      type: 'payout',
      status: 'pending',
      payoutId: payout._id,
      description: `Payout via ${provider} (${method})`,
    })

    await wallet.save()

    return NextResponse.json({
      data: {
        payoutId: payout._id.toString(),
        amount,
        currency,
        fee,
        netAmount: amount - fee,
        method,
        provider,
        status: 'requested',
        message: 'Payout requested. Processing typically takes 1–3 business days.',
      },
    }, { status: 201 })
  } catch (err) {
    console.error('[POST /api/pay/payout]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
