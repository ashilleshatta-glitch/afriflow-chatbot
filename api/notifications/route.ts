import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Notification from '@/models/Notification'
import { getUserFromRequest } from '@/lib/auth'

export const dynamic = 'force-dynamic'

// GET — list user notifications
export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const { searchParams } = new URL(req.url)
    const limit = parseInt(searchParams.get('limit') || '20')
    const unreadOnly = searchParams.get('unread') === 'true'

    const query: any = { user: payload.userId }
    if (unreadOnly) query.isRead = false

    const [notifications, unreadCount] = await Promise.all([
      Notification.find(query)
        .sort({ createdAt: -1 })
        .limit(limit)
        .lean(),
      Notification.countDocuments({ user: payload.userId, isRead: false }),
    ])

    return NextResponse.json({
      notifications,
      unreadCount,
    })
  } catch (err: any) {
    console.error('Notifications GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

// PATCH — mark notifications as read
export async function PATCH(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const { notificationIds, markAll } = await req.json()

    if (markAll) {
      await Notification.updateMany(
        { user: payload.userId, isRead: false },
        { isRead: true }
      )
    } else if (notificationIds?.length) {
      await Notification.updateMany(
        { _id: { $in: notificationIds }, user: payload.userId },
        { isRead: true }
      )
    }

    const unreadCount = await Notification.countDocuments({
      user: payload.userId,
      isRead: false,
    })

    return NextResponse.json({ success: true, unreadCount })
  } catch (err: any) {
    console.error('Notifications PATCH error:', err)
    return NextResponse.json({ error: 'Failed to update notifications' }, { status: 500 })
  }
}
