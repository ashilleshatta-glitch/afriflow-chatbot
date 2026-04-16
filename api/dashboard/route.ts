import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Enrollment from '@/models/Enrollment'
import Certificate from '@/models/Certificate'
import Activity from '@/models/Activity'
import { getUserFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET — aggregated dashboard data
export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    // Parallel fetch all dashboard data
    const [user, enrollments, certificates, recentActivity] = await Promise.all([
      User.findById(payload.userId).select('-password').lean() as Promise<any>,
      Enrollment.find({ user: payload.userId }).sort({ lastAccessedAt: -1 }).lean() as Promise<any[]>,
      Certificate.find({ user: payload.userId }).sort({ issuedAt: -1 }).lean() as Promise<any[]>,
      Activity.find({ user: payload.userId }).sort({ createdAt: -1 }).limit(20).lean() as Promise<any[]>,
    ])

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    // Calculate XP level (every 500 XP = 1 level)
    const xpLevel = Math.floor(user.xp / 500) + 1
    const xpInCurrentLevel = user.xp % 500
    const xpToNextLevel = 500

    // Stats
    const completedCourses = enrollments.filter((e: any) => e.isCompleted).length
    const inProgressCourses = enrollments.filter((e: any) => !e.isCompleted).length
    const totalXpFromCourses = enrollments.reduce((sum: number, e: any) => sum + (e.xpEarned || 0), 0)

    // Weekly activity (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const weeklyActivity = recentActivity.filter((a: any) => new Date(a.createdAt) > weekAgo)

    // Monthly streak calendar data (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    const monthlyActivities = await Activity.find({
      user: payload.userId,
      createdAt: { $gte: thirtyDaysAgo },
    }).select('createdAt type xpAwarded').lean() as any[]

    // Build daily activity map
    const dailyActivity: Record<string, { count: number; xp: number }> = {}
    monthlyActivities.forEach((a: any) => {
      const dateKey = new Date(a.createdAt).toISOString().split('T')[0]
      if (!dailyActivity[dateKey]) dailyActivity[dateKey] = { count: 0, xp: 0 }
      dailyActivity[dateKey].count++
      dailyActivity[dateKey].xp += a.xpAwarded || 0
    })

    // Current course (most recently accessed)
    const currentCourse = enrollments.find((e: any) => !e.isCompleted) || null

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        country: user.country,
        role: user.role,
        subscriptionTier: user.subscriptionTier,
        bio: user.bio,
      },
      stats: {
        xp: user.xp,
        xpLevel,
        xpInCurrentLevel,
        xpToNextLevel,
        streak: user.streak,
        totalCourses: enrollments.length,
        completedCourses,
        inProgressCourses,
        certificates: certificates.length,
        totalXpFromCourses,
      },
      enrollments,
      certificates,
      currentCourse,
      recentActivity,
      weeklyActivity,
      dailyActivity,
    })
  } catch (err: any) {
    console.error('Dashboard API error:', err)
    return NextResponse.json({ error: 'Failed to load dashboard' }, { status: 500 })
  }
}
