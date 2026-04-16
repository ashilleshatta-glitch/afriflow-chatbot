import { NextRequest, NextResponse } from 'next/server'
import { getUserFromRequest } from '@/lib/auth'
import { getAdaptiveQuiz } from '@/lib/intelligence'

// GET /api/intelligence/quiz/[courseId]
// Returns an adaptive quiz tailored to the authenticated user's history.
export async function GET(
  req: NextRequest,
  { params }: { params: { courseId: string } }
) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const quiz = await getAdaptiveQuiz(params.courseId, payload.userId)
    return NextResponse.json({ data: quiz })
  } catch (err) {
    console.error('Adaptive quiz error:', err)
    return NextResponse.json({ error: 'Failed to generate quiz' }, { status: 500 })
  }
}
