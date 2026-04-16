import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getPersonalizedLearningPath } from '@/lib/intelligence'

// GET /api/intelligence/path/[userId]
// Returns personalised learning path for a user.
// Admin can query any userId; regular users can only query their own.
export async function GET(
  req: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const targetId = params.userId
    if (payload.role !== 'admin' && payload.userId !== targetId) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const path = await getPersonalizedLearningPath(targetId)
    return NextResponse.json({ data: path })
  } catch (err) {
    console.error('Intelligence path error:', err)
    return NextResponse.json({ error: 'Failed to generate learning path' }, { status: 500 })
  }
}
