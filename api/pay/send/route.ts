import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Wallet from '@/models/Wallet'
import Transaction from '@/models/Transaction'
import User from '@/models/User'
import { getUserFromRequest } from '@/lib/auth'

const PLATFORM_FEE_RATE = 0.015  // 1.5%
const MIN_SEND = 1
const MAX_SEND = 10000

// Stub exchange rates relative to USD (production: fetch from fixer.io / ExchangeRate-API)
const RATES_TO_USD: Record<string, number> = {
  USD: 1, EUR: 1.08, GBP: 1.27,
  NGN: 0.00063, KES: 0.0077, GHS: 0.068,
  ZAR: 0.054, EGP: 0.021, USDC: 1,
}

function toUSD(amount: number, currency: string): number {
  return amount * (RATES_TO_USD[currency] ?? 1)
}

// POST /api/pay/send — peer-to-peer transfer
export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { toIdentifier, amount, currency = 'USD', note } = body

    if (!toIdentifier) return NextResponse.json({ error: 'Recipient required' }, { status: 400 })
    if (!amount || amount < MIN_SEND || amount > MAX_SEND)
      return NextResponse.json({ error: `Amount must be between ${MIN_SEND} and ${MAX_SEND}` }, { status: 400 })

    await connectDB()

    // Resolve recipient — by email or AfriFlow publicId via user lookup
    const recipient = await User.findOne({
      $or: [
        { email: toIdentifier.toLowerCase() },
        { name: toIdentifier },
      ],
    }).select('_id name email').lean() as unknown as { _id: { toString(): string }; name: string; email: string } | null

    if (!recipient) return NextResponse.json({ error: 'Recipient not found' }, { status: 404 })
    if (recipient._id.toString() === payload.userId)
      return NextResponse.json({ error: 'Cannot send to yourself' }, { status: 400 })

    // Get / create wallets
    let senderWallet = await Wallet.findOne({ userId: payload.userId })
    if (!senderWallet) senderWallet = await Wallet.create({ userId: payload.userId, balances: new Map([['USD', 0]]) })

    let recipientWallet = await Wallet.findOne({ userId: recipient._id.toString() })
    if (!recipientWallet)
      recipientWallet = await Wallet.create({ userId: recipient._id.toString(), balances: new Map([['USD', 0]]) })

    if (senderWallet.isSuspended)
      return NextResponse.json({ error: 'Your wallet is suspended' }, { status: 403 })

    // Check sender balance in requested currency
    const senderBalance = (senderWallet.balances as Map<string, number>).get(currency) ?? 0
    const fee = parseFloat((amount * PLATFORM_FEE_RATE).toFixed(2))
    const total = amount + fee

    if (senderBalance < total)
      return NextResponse.json({
        error: `Insufficient balance. You have ${currency} ${senderBalance.toFixed(2)}, need ${currency} ${total.toFixed(2)} (inc. fee)`,
      }, { status: 400 })

    const amountUSD = toUSD(amount, currency)

    // Debit sender
    ;(senderWallet.balances as Map<string, number>).set(currency, senderBalance - total)
    senderWallet.totalSpent += amountUSD
    senderWallet.markModified('balances')

    // Credit recipient (same currency)
    const recipientBalance = (recipientWallet.balances as Map<string, number>).get(currency) ?? 0
    ;(recipientWallet.balances as Map<string, number>).set(currency, recipientBalance + amount)
    recipientWallet.totalEarned += amountUSD
    recipientWallet.markModified('balances')

    // Create transaction record
    const tx = await Transaction.create({
      fromUserId: payload.userId,
      toUserId: recipient._id.toString(),
      amount,
      currency,
      amountUSD,
      fee,
      netAmount: amount,
      type: 'peer_transfer',
      status: 'completed',
      description: `Transfer to ${recipient.name}`,
      note,
    })

    await Promise.all([senderWallet.save(), recipientWallet.save()])

    return NextResponse.json({
      data: {
        txId: tx._id.toString(),
        amount,
        currency,
        fee,
        total,
        to: { name: recipient.name, email: recipient.email },
        status: 'completed',
      },
    })
  } catch (err) {
    console.error('[POST /api/pay/send]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
