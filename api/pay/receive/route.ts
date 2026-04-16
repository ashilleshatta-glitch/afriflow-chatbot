import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Wallet from '@/models/Wallet'
import { getUserFromRequest } from '@/lib/auth'

// GET /api/pay/receive — generate a payment request link/QR payload
export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const amount = parseFloat(searchParams.get('amount') ?? '0')
    const currency = searchParams.get('currency') ?? 'USD'
    const note = searchParams.get('note') ?? ''

    await connectDB()
    const wallet = await Wallet.findOne({ userId: payload.userId }).lean() as unknown as {
      defaultCurrency: string
    } | null

    const defaultCurrency = wallet?.defaultCurrency ?? 'USD'

    // Build a payment request payload that the sender can use
    const paymentRequest = {
      recipientUserId: payload.userId,
      amount: amount || null,
      currency: currency || defaultCurrency,
      note: note || null,
      // This link is handled by /pay/send?to=userId&amount=X&currency=Y
      link: `${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/pay/send?to=${payload.userId}${amount ? `&amount=${amount}` : ''}${currency ? `&currency=${currency}` : ''}${note ? `&note=${encodeURIComponent(note)}` : ''}`,
      qrData: JSON.stringify({ recipientUserId: payload.userId, amount, currency, note }),
      createdAt: new Date().toISOString(),
    }

    return NextResponse.json({ data: paymentRequest })
  } catch (err) {
    console.error('[GET /api/pay/receive]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
