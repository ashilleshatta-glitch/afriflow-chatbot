import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import LearningEvent from '@/models/LearningEvent'
import { getUserFromRequest } from '@/lib/auth'
import { generateWeeklyInsightEmail } from '@/lib/intelligence'
import { categorizeCoachQuery } from '@/lib/intelligence'

// POST /api/intelligence/insights
// Two purposes:
//  1. body: { action: 'track', ...event }  — record a learning event
//  2. body: { action: 'insights', userId? } — get weekly insight for a user (admin or self)

export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { action } = body

    // ── Track a learning event ──────────────────────────────────────────────
    if (action === 'track') {
      const {
        eventType,
        courseId,
        lessonId,
        metadata = {},
        deviceType = 'desktop',
        sessionId,
      } = body

      if (!eventType) {
        return NextResponse.json({ error: 'eventType required' }, { status: 400 })
      }

      // Auto-categorise coach queries
      if (eventType === 'coach_query' && metadata.coachQuery) {
        metadata.coachQueryCategory = categorizeCoachQuery(metadata.coachQuery)
      }

      await connectDB()

      const country = payload.email ? 'Unknown' : 'Unknown' // real impl: look up from user doc
      const sid = sessionId || `session_${Date.now()}_${payload.userId.slice(-6)}`

      await LearningEvent.create({
        userId: payload.userId,
        eventType,
        courseId: courseId || undefined,
        lessonId: lessonId || undefined,
        metadata,
        deviceType,
        country,
        sessionId: sid,
      })

      return NextResponse.json({ success: true })
    }

    // ── Generate weekly insight ─────────────────────────────────────────────
    if (action === 'insights') {
      const targetId = body.userId ?? payload.userId
      if (payload.role !== 'admin' && payload.userId !== targetId) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
      }

      const insight = await generateWeeklyInsightEmail(targetId)
      if (!insight) {
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }
      return NextResponse.json({ data: insight })
    }

    return NextResponse.json({ error: 'Invalid action. Use "track" or "insights".' }, { status: 400 })
  } catch (err) {
    console.error('Intelligence insights error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// GET /api/intelligence/insights — for admin: get platform-wide event counts
export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload || payload.role !== 'admin') {
      return NextResponse.json({ error: 'Admin only' }, { status: 403 })
    }

    await connectDB()

    const since = new Date(Date.now() - 86400000 * 30)

    const [
      totalEvents,
      completions,
      abandons,
      quizPassed,
      quizFailed,
      coachQueries,
    ] = await Promise.all([
      LearningEvent.countDocuments({ createdAt: { $gte: since } }),
      LearningEvent.countDocuments({ eventType: 'lesson_completed', createdAt: { $gte: since } }),
      LearningEvent.countDocuments({ eventType: 'lesson_abandoned', createdAt: { $gte: since } }),
      LearningEvent.countDocuments({ eventType: 'quiz_passed', createdAt: { $gte: since } }),
      LearningEvent.countDocuments({ eventType: 'quiz_failed', createdAt: { $gte: since } }),
      LearningEvent.countDocuments({ eventType: 'coach_query', createdAt: { $gte: since } }),
    ])

    // Top coach query categories in last 30 days
    const categoryAgg = await LearningEvent.aggregate([
      { $match: { eventType: 'coach_query', createdAt: { $gte: since }, 'metadata.coachQueryCategory': { $exists: true } } },
      { $group: { _id: '$metadata.coachQueryCategory', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ])

    return NextResponse.json({
      data: {
        period: '30d',
        totalEvents,
        completions,
        abandons,
        completionRate: completions + abandons > 0 ? Math.round(completions / (completions + abandons) * 100) : 0,
        quizPassRate: quizPassed + quizFailed > 0 ? Math.round(quizPassed / (quizPassed + quizFailed) * 100) : 0,
        coachQueries,
        topQueryCategories: categoryAgg.map(c => ({ category: c._id, count: c.count })),
      },
    })
  } catch (err) {
    console.error('Intelligence GET error:', err)
    return NextResponse.json({ error: 'Failed to load intelligence stats' }, { status: 500 })
  }
}
