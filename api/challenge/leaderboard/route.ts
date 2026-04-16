import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ChallengeParticipant from '@/models/ChallengeParticipant'
import { CHALLENGE_ID } from '@/lib/challengeData'

// GET — challenge leaderboard
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)
    const country = searchParams.get('country')

    const query: any = { challengeId: CHALLENGE_ID }
    if (country) query.userCountry = { $regex: country, $options: 'i' }

    const participants = await ChallengeParticipant.find(query)
      .sort({ totalXpEarned: -1, completedDays: -1, joinedAt: 1 })
      .limit(limit)
      .lean()

    const total = await ChallengeParticipant.countDocuments({ challengeId: CHALLENGE_ID })
    const completed = await ChallengeParticipant.countDocuments({ challengeId: CHALLENGE_ID, isCompleted: true })

    const ranked = participants.map((p, i) => ({ ...p, rank: i + 1 }))

    return NextResponse.json(
      { participants: ranked, total, completed, challengeId: CHALLENGE_ID },
      { headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' } }
    )
  } catch (err: any) {
    console.error('Challenge leaderboard error:', err)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}
