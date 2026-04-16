// POST /api/schools/[slug]/invite — add student by invite code or email
// GET  /api/schools/[slug]/invite — get invite link info
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import School from '@/models/School'
import User from '@/models/User'

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    await connectDB()
    const school = await School.findOne({ slug: params.slug, isActive: true })
      .select('name slug inviteCode plan planSeats students')
      .lean() as {
        name: string; slug: string; inviteCode: string;
        plan: string; planSeats: number;
        students: unknown[]
      } | null

    if (!school) return NextResponse.json({ error: 'School not found' }, { status: 404 })

    return NextResponse.json({
      name: school.name,
      slug: school.slug,
      inviteCode: school.inviteCode,
      currentStudents: school.students.length,
      planSeats: school.planSeats,
      spotsLeft: school.planSeats - school.students.length,
    })
  } catch (err) {
    console.error('GET /api/schools/[slug]/invite:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const payload = verifyToken(authHeader.slice(7))
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    await connectDB()

    const body = await req.json()
    const { inviteCode } = body

    // Find school by slug + validate invite code
    const school = await School.findOne({ slug: params.slug, isActive: true })
    if (!school) return NextResponse.json({ error: 'School not found' }, { status: 404 })

    if (inviteCode && school.inviteCode !== inviteCode.toUpperCase()) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 400 })
    }

    // Check seats
    if (school.students.length >= school.planSeats) {
      return NextResponse.json({ error: 'School has reached its seat limit' }, { status: 403 })
    }

    const userId = payload.userId as unknown as import('mongoose').Types.ObjectId

    // Already a member?
    if (school.students.some((s: unknown) => (s as { toString(): string }).toString() === payload.userId)) {
      return NextResponse.json({ error: 'Already a member of this school' }, { status: 409 })
    }

    school.students.push(userId)
    school.totalStudentsEnrolled = school.students.length
    await school.save()

    // Tag the user with their school
    await User.findByIdAndUpdate(payload.userId, { school: school._id })

    return NextResponse.json({ message: 'Joined school successfully', school: school.slug })
  } catch (err) {
    console.error('POST /api/schools/[slug]/invite:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
