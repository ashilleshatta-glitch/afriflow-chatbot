import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Transaction from '@/models/Transaction'
import { getUserFromRequest } from '@/lib/auth'

// GET /api/pay/transactions — paginated transaction history
export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
    const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'))
    const type = searchParams.get('type') ?? ''
    const status = searchParams.get('status') ?? ''

    await connectDB()

    const uid = payload.userId
    const baseQuery: Record<string, unknown> = {
      $or: [{ fromUserId: uid }, { toUserId: uid }],
    }
    if (type) baseQuery.type = type
    if (status) baseQuery.status = status

    const [txs, total] = await Promise.all([
      Transaction.find(baseQuery)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate('fromUserId', 'name email')
        .populate('toUserId', 'name email')
        .lean(),
      Transaction.countDocuments(baseQuery),
    ])

    // Tag each tx as credit or debit from this user's perspective
    const tagged = (txs as unknown as {
      _id: { toString(): string }
      fromUserId?: { _id: string; name: string; email: string }
      toUserId?: { _id: string; name: string; email: string }
      amount: number
      currency: string
      netAmount: number
      fee: number
      type: string
      status: string
      description: string
      note?: string
      createdAt: string
    }[]).map((tx) => ({
      ...tx,
      _id: tx._id.toString(),
      direction: tx.toUserId?._id?.toString() === uid ? 'credit' : 'debit',
    }))

    return NextResponse.json({
      data: tagged,
      total,
      page,
      pages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    })
  } catch (err) {
    console.error('[GET /api/pay/transactions]', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
