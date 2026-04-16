import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

// GET — leaderboard rankings
export async function GET(req: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(req.url)
    const country = searchParams.get('country')
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100)

    const query: any = { xp: { $gt: 0 } }
    if (country && country !== 'all') {
      query.country = country
    }

    const users = await User.find(query)
      .select('name avatar country xp streak subscriptionTier createdAt')
      .sort({ xp: -1 })
      .limit(limit)
      .lean()

    const leaderboard = users.map((u: any, i: number) => ({
      rank: i + 1,
      name: u.name,
      avatar: u.avatar,
      country: u.country,
      xp: u.xp,
      streak: u.streak,
      tier: u.subscriptionTier,
      level: getLevel(u.xp),
    }))

    // Get unique countries for filter
    const countries = await User.distinct('country', { xp: { $gt: 0 } })

    return NextResponse.json({
      leaderboard,
      countries: countries.sort(),
      total: await User.countDocuments(query),
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300' },
    })
  } catch (err: any) {
    console.error('Leaderboard error:', err)
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 })
  }
}

function getLevel(xp: number) {
  const LEVELS = [
    { level: 1, title: 'AI Curious' },
    { level: 2, title: 'AI Aware' },
    { level: 3, title: 'AI Explorer' },
    { level: 4, title: 'AI Learner' },
    { level: 5, title: 'AI Practitioner' },
    { level: 6, title: 'AI Specialist' },
    { level: 7, title: 'AI Builder' },
    { level: 8, title: 'AI Expert' },
    { level: 9, title: 'AI Leader' },
    { level: 10, title: 'AI Master' },
  ]
  const thresholds = [0, 100, 300, 600, 1000, 1600, 2500, 3500, 4500, 5000]
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (xp >= thresholds[i]) return LEVELS[i]
  }
  return LEVELS[0]
}
