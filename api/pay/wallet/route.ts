import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Wallet from '@/models/Wallet'
import { getUserFromRequest } from '@/lib/auth'

// Supported currencies with display metadata
const SUPPORTED_CURRENCIES: Record<string, { name: string; symbol: string; flag: string }> = {
  USD: { name: 'US Dollar',        symbol: '$',  flag: '🇺🇸' },
  NGN: { name: 'Nigerian Naira',   symbol: '₦',  flag: '🇳🇬' },
  KES: { name: 'Kenyan Shilling',  symbol: 'KSh',flag: '🇰🇪' },
  GHS: { name: 'Ghanaian Cedi',    symbol: '₵',  flag: '🇬🇭' },
  ZAR: { name: 'South African Rand',symbol: 'R', flag: '🇿🇦' },
  EGP: { name: 'Egyptian Pound',   symbol: 'E£', flag: '🇪🇬' },
  EUR: { name: 'Euro',             symbol: '€',  flag: '🇪🇺' },
  GBP: { name: 'British Pound',    symbol: '£',  flag: '🇬🇧' },
  USDC: { name: 'USD Coin',        symbol: 'USDC',flag: '🔵' },
}

async function getOrCreateWallet(userId: string) {
  let wallet = await Wallet.findOne({ userId })
  if (!wallet) {
    wallet = await Wallet.create({
      userId,
      balances: new Map([['USD', 0]]),
      defaultCurrency: 'USD',
    })
  }
  return wallet
}

// GET /api/pay/wallet — get wallet details
export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const wallet = await getOrCreateWallet(payload.userId)

    // Build balances array with metadata
    const balances = Array.from((wallet.balances as Map<string, number>).entries()).map(
      ([currency, amount]) => ({
        currency,
        amount,
        ...SUPPORTED_CURRENCIES[currency],
      })
    )

    return NextResponse.json({
      data: {
        id: wallet._id.toString(),
        balances,
        defaultCurrency: wallet.defaultCurrency,
        linkedAccounts: wallet.linkedAccounts,
        totalEarned: wallet.totalEarned,
        totalSpent: wallet.totalSpent,
        totalPaidOut: wallet.totalPaidOut,
        kycLevel: wallet.kycLevel,
        isSuspended: wallet.isSuspended,
        supportedCurrencies: SUPPORTED_CURRENCIES,
      },
    })
  } catch (err) {
    console.error('[GET /api/pay/wallet]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH /api/pay/wallet — update default currency or linked accounts
export async function PATCH(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const { defaultCurrency, addAccount, removeAccountId } = body

    await connectDB()
    const wallet = await getOrCreateWallet(payload.userId)

    if (defaultCurrency) {
      if (!SUPPORTED_CURRENCIES[defaultCurrency])
        return NextResponse.json({ error: 'Unsupported currency' }, { status: 400 })
      wallet.defaultCurrency = defaultCurrency
      // Ensure the currency has a balance entry
      if (!(wallet.balances as Map<string, number>).has(defaultCurrency)) {
        (wallet.balances as Map<string, number>).set(defaultCurrency, 0)
      }
    }

    if (addAccount) {
      const { type, provider, identifier, label } = addAccount
      if (!type || !provider || !identifier)
        return NextResponse.json({ error: 'type, provider and identifier are required' }, { status: 400 })
      wallet.linkedAccounts.push({ type, provider, identifier, label, isVerified: false, isDefault: false, addedAt: new Date() })
    }

    if (removeAccountId) {
      wallet.linkedAccounts = wallet.linkedAccounts.filter(
        (a: { _id?: { toString(): string } }) => a._id?.toString() !== removeAccountId
      )
    }

    await wallet.save()
    return NextResponse.json({ data: { success: true } })
  } catch (err) {
    console.error('[PATCH /api/pay/wallet]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
