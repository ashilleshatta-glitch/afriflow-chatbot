import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import EnterpriseClient from '@/models/EnterpriseClient'
import User from '@/models/User'
import { getUserFromRequest } from '@/lib/auth'

interface Params { params: { slug: string } }

async function requireOrgAdmin(req: NextRequest, slug: string) {
  const user = await getUserFromRequest(req)
  if (!user) return { error: 'Unauthorized', status: 401, client: null }
  const client = await EnterpriseClient.findOne({ slug })
  if (!client) return { error: 'Org not found', status: 404, client: null }
  const isAdmin = client.adminUsers.some((id: unknown) => String(id) === user.userId)
  if (!isAdmin) return { error: 'Forbidden', status: 403, client: null }
  return { error: null, status: 200, client }
}

// GET: list learners with basic profile
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { error, status, client } = await requireOrgAdmin(req, params.slug)
    if (error || !client) return NextResponse.json({ error }, { status })

    const learners = await User.find({ _id: { $in: client.learners } })
      .select('name email country createdAt')
      .lean()

    return NextResponse.json({
      data: {
        learners,
        usedSeats: client.usedSeats,
        seatLimit: client.seatLimit,
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

// POST: add a learner by email (invite flow)
export async function POST(req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { error, status, client } = await requireOrgAdmin(req, params.slug)
    if (error || !client) return NextResponse.json({ error }, { status })

    const { email } = await req.json()
    if (!email) return NextResponse.json({ error: 'email required' }, { status: 400 })

    if (client.usedSeats >= client.seatLimit) {
      return NextResponse.json({ error: 'Seat limit reached. Upgrade your plan.' }, { status: 402 })
    }

    const learnerUser = await User.findOne({ email: email.toLowerCase() })
    if (!learnerUser) return NextResponse.json({ error: 'User not found — they must register first' }, { status: 404 })

    const alreadyAdded = client.learners.some((id: unknown) => String(id) === String(learnerUser._id))
    if (alreadyAdded) return NextResponse.json({ error: 'Learner already in org' }, { status: 409 })

    client.learners.push(learnerUser._id)
    client.usedSeats = client.learners.length
    await client.save()

    return NextResponse.json({ data: { message: 'Learner added', usedSeats: client.usedSeats } })
  } catch (err) {
    return NextResponse.json({ error: 'Error adding learner' }, { status: 500 })
  }
}

// DELETE: remove a learner
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const { error, status, client } = await requireOrgAdmin(req, params.slug)
    if (error || !client) return NextResponse.json({ error }, { status })

    const { userId } = await req.json()
    client.learners = client.learners.filter((id: unknown) => String(id) !== userId)
    client.usedSeats = client.learners.length
    await client.save()

    return NextResponse.json({ data: { message: 'Learner removed', usedSeats: client.usedSeats } })
  } catch (err) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}
