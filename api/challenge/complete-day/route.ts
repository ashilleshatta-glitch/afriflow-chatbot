import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import ChallengeParticipant from '@/models/ChallengeParticipant'
import User from '@/models/User'
import Activity from '@/models/Activity'
import { getUserFromRequest } from '@/lib/auth'
import { CHALLENGE_ID, CHALLENGE_DAYS } from '@/lib/challengeData'

// POST — mark a day as complete
export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const { day, note } = await req.json()

    if (!day || day < 1 || day > 30) {
      return NextResponse.json({ error: 'day must be between 1 and 30' }, { status: 400 })
    }

    const participant = await ChallengeParticipant.findOne({
      user: payload.userId,
      challengeId: CHALLENGE_ID,
    })

    if (!participant) {
      return NextResponse.json({ error: 'You must join the challenge first' }, { status: 400 })
    }

    // Already completed this day
    if (participant.completedDays.includes(day)) {
      return NextResponse.json({ message: 'Day already completed', participant })
    }

    const challengeDay = CHALLENGE_DAYS.find((d) => d.day === day)
    const xpAwarded = challengeDay?.xp || 50

    // Update participant
    participant.completedDays.push(day)

    // Store optional note (array indexed by day-1)
    if (note) {
      while (participant.notes.length < day) participant.notes.push('')
      participant.notes[day - 1] = note
    }

    // Calculate streak (consecutive days from start)
    const sortedDays = [...participant.completedDays].sort((a, b) => a - b)
    let streak = 0
    for (let i = 0; i < sortedDays.length; i++) {
      if (sortedDays[i] === i + 1) streak = i + 1
      else break
    }
    participant.streak = streak
    participant.lastCompletedAt = new Date()
    participant.totalXpEarned += xpAwarded
    participant.currentDay = Math.max(participant.currentDay, day + 1)

    // Check completion
    if (participant.completedDays.length === 30) {
      participant.isCompleted = true
      participant.completedAt = new Date()
    }

    await participant.save()

    // Award XP to user
    await User.findByIdAndUpdate(payload.userId, { $inc: { xp: xpAwarded } })

    // Log activity
    await Activity.create({
      user: payload.userId,
      type: 'lesson_complete',
      title: `Completed Challenge Day ${day}: ${challengeDay?.title || ''}`,
      description: challengeDay?.task || '',
      xpAwarded,
    })

    return NextResponse.json({
      participant,
      xpAwarded,
      isCompleted: participant.isCompleted,
      streak: participant.streak,
      message: participant.isCompleted
        ? '🏆 Challenge complete! Apply for your certificate.'
        : `Day ${day} complete! +${xpAwarded} XP`,
    })
  } catch (err: any) {
    console.error('Challenge complete-day error:', err)
    return NextResponse.json({ error: 'Failed to mark day complete' }, { status: 500 })
  }
}
