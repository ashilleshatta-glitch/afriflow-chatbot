import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ChallengeParticipant from '@/models/ChallengeParticipant'
import User from '@/models/User'
import Activity from '@/models/Activity'
import { getUserFromRequest } from '@/lib/auth'
import { CHALLENGE_ID } from '@/lib/challengeData'

// GET — get current user's challenge status
export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const participant = await ChallengeParticipant.findOne({
      user: payload.userId,
      challengeId: CHALLENGE_ID,
    }).lean()

    return NextResponse.json({ participant })
  } catch (err: any) {
    console.error('Challenge GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch challenge status' }, { status: 500 })
  }
}

// POST — join the challenge
export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    // Check if already joined
    const existing = await ChallengeParticipant.findOne({
      user: payload.userId,
      challengeId: CHALLENGE_ID,
    })
    if (existing) {
      return NextResponse.json({ participant: existing, message: 'Already joined' })
    }

    const user = await User.findById(payload.userId).select('name country')

    const participant = await ChallengeParticipant.create({
      user: payload.userId,
      userName: user?.name || 'AfriFlow Learner',
      userCountry: user?.country || 'Africa',
      challengeId: CHALLENGE_ID,
      currentDay: 1,
      completedDays: [],
      streak: 0,
      totalXpEarned: 0,
    })

    // Award join XP
    await User.findByIdAndUpdate(payload.userId, { $inc: { xp: 25 } })

    await Activity.create({
      user: payload.userId,
      type: 'enrollment',
      title: 'Joined the 30-Day AI Challenge',
      description: `Challenge ID: ${CHALLENGE_ID}`,
      xpAwarded: 25,
    })

    return NextResponse.json({ participant, message: 'Joined successfully', xpAwarded: 25 }, { status: 201 })
  } catch (err: any) {
    console.error('Challenge POST error:', err)
    return NextResponse.json({ error: 'Failed to join challenge' }, { status: 500 })
  }
}
