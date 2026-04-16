import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Review from '@/models/Review'
import Enrollment from '@/models/Enrollment'
import Activity from '@/models/Activity'
import User from '@/models/User'
import { getUserFromRequest } from '@/lib/auth'

// GET — get reviews for a course (public)
export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const courseSlug = searchParams.get('courseSlug')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!courseSlug) {
      return NextResponse.json({ error: 'courseSlug query param is required' }, { status: 400 })
    }

    const skip = (page - 1) * limit
    const [reviews, total] = await Promise.all([
      Review.find({ courseSlug })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments({ courseSlug }),
    ])

    // Calculate average rating
    const avgResult = await Review.aggregate([
      { $match: { courseSlug } },
      { $group: { _id: null, avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
    ])

    const avgRating = avgResult.length > 0 ? Math.round(avgResult[0].avgRating * 10) / 10 : 0

    return NextResponse.json({
      reviews,
      total,
      avgRating,
      page,
      totalPages: Math.ceil(total / limit),
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=300' },
    })
  } catch (err: any) {
    console.error('Reviews GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
  }
}

// POST — add a review
export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const { courseSlug, rating, title, content } = await req.json()

    if (!courseSlug || !rating || !title || !content) {
      return NextResponse.json({
        error: 'courseSlug, rating, title, and content are required',
      }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 })
    }

    // Check if enrolled
    const enrollment = await Enrollment.findOne({ user: payload.userId, courseSlug })
    if (!enrollment) {
      return NextResponse.json({ error: 'You must be enrolled to review a course' }, { status: 403 })
    }

    // Check if already reviewed
    const existing = await Review.findOne({ user: payload.userId, courseSlug })
    if (existing) {
      return NextResponse.json({ error: 'You already reviewed this course' }, { status: 409 })
    }

    // Get user info
    const user = await User.findById(payload.userId).select('name avatar country')

    const review = await Review.create({
      user: payload.userId,
      userName: user?.name || 'Anonymous',
      userAvatar: user?.avatar,
      userCountry: user?.country || 'Ghana',
      courseSlug,
      rating,
      title,
      content,
    })

    // Award XP for reviewing
    const reviewXp = 30
    await User.findByIdAndUpdate(payload.userId, { $inc: { xp: reviewXp } })

    // Log activity
    await Activity.create({
      user: payload.userId,
      type: 'review',
      title: `Reviewed a course`,
      description: `Gave ${rating} stars to ${enrollment.courseTitle}`,
      metadata: { courseSlug, rating },
      xpAwarded: reviewXp,
    })

    return NextResponse.json({ review, xpAwarded: reviewXp }, { status: 201 })
  } catch (err: any) {
    console.error('Review POST error:', err)
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 })
  }
}
