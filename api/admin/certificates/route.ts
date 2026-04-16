import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import Certificate from '@/models/Certificate'

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { searchParams } = new URL(req.url)
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'))
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '20'))
  const search = searchParams.get('search') ?? ''

  await connectDB()

  const filter = search
    ? { $or: [{ userName: { $regex: search, $options: 'i' } }, { courseTitle: { $regex: search, $options: 'i' } }] }
    : {}

  const [certs, total] = await Promise.all([
    Certificate.find(filter)
      .sort({ issuedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Certificate.countDocuments(filter),
  ])

  return NextResponse.json({
    data: certs,
    total,
    page,
    pages: Math.ceil(total / limit),
    hasMore: page * limit < total,
  })
}

// PATCH — revoke a certificate
export async function PATCH(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const payload = verifyToken(token)
  if (!payload || payload.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const { certificateId, isRevoked } = await req.json()
  if (!certificateId) return NextResponse.json({ error: 'certificateId required' }, { status: 400 })

  await connectDB()
  const cert = await Certificate.findOneAndUpdate(
    { certificateId },
    { isRevoked: !!isRevoked },
    { new: true }
  )

  if (!cert) return NextResponse.json({ error: 'Certificate not found' }, { status: 404 })
  return NextResponse.json({ success: true, isRevoked: cert.isRevoked })
}
