import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Bookmark from '@/models/Bookmark'
import { getUserFromRequest } from '@/lib/auth'
import { SAMPLE_COURSES } from '@/lib/data'

// GET — list user bookmarks
export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const bookmarks = await Bookmark.find({ user: payload.userId })
      .sort({ createdAt: -1 })
      .lean()

    return NextResponse.json({ bookmarks, total: bookmarks.length })
  } catch (err: any) {
    console.error('Bookmarks GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch bookmarks' }, { status: 500 })
  }
}

// POST — toggle bookmark (add if not exists, remove if exists)
export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const { courseSlug } = await req.json()

    if (!courseSlug) {
      return NextResponse.json({ error: 'courseSlug is required' }, { status: 400 })
    }

    // Check if bookmark exists
    const existing = await Bookmark.findOne({ user: payload.userId, courseSlug })

    if (existing) {
      // Remove bookmark
      await Bookmark.findByIdAndDelete(existing._id)
      return NextResponse.json({ bookmarked: false, message: 'Bookmark removed' })
    }

    // Find course data
    const course = SAMPLE_COURSES.find(c => c.slug === courseSlug)

    // Add bookmark
    const bookmark = await Bookmark.create({
      user: payload.userId,
      courseSlug,
      courseTitle: course?.title || courseSlug,
      courseSchool: course?.school || 'unknown',
      courseDescription: course?.description || '',
    })

    return NextResponse.json({ bookmarked: true, bookmark }, { status: 201 })
  } catch (err: any) {
    console.error('Bookmark POST error:', err)
    return NextResponse.json({ error: 'Bookmark failed' }, { status: 500 })
  }
}
