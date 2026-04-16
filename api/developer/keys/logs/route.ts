import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import APIClient from '@/models/APIClient'
import APILog from '@/models/APILog'
import { getUserFromRequest } from '@/lib/auth'

// GET: recent API logs for the authenticated user's key
export async function GET(req: NextRequest) {
  const user = await getUserFromRequest(req)
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()

  const client = await APIClient.findOne({ contactEmail: user.email })
  if (!client) return NextResponse.json({ data: [] })

  const logs = await APILog.find({ clientId: client._id })
    .sort({ createdAt: -1 })
    .limit(50)
    .select('endpoint method responseStatus responseTimeMs createdAt')
    .lean()

  return NextResponse.json({ data: logs })
}
