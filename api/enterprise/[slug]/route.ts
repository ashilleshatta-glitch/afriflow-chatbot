import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import EnterpriseClient from '@/models/EnterpriseClient'
import { getUserFromRequest } from '@/lib/auth'

interface Params { params: { slug: string } }

// GET: public org portal data (used by /org/[slug] page)
export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const client = await EnterpriseClient.findOne({ slug: params.slug, isActive: true })
      .populate('customCurriculum', 'title slug school level isFree isPremium duration')
      .lean()
    if (!client) return NextResponse.json({ error: 'Organisation not found' }, { status: 404 })
    // Strip sensitive fields before returning
    const { adminUsers: _a, learners: _l, ...safe } = client as Record<string, unknown>
    void _a; void _l
    return NextResponse.json({ data: safe })
  } catch (err) {
    return NextResponse.json({ error: 'Error' }, { status: 500 })
  }
}

// PATCH: update org settings (admin only)
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const client = await EnterpriseClient.findOne({ slug: params.slug })
    if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const isAdmin = client.adminUsers.some((id: unknown) => String(id) === user.userId)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const updates = await req.json()
    const allowed = ['organizationName', 'branding', 'welcomeMessage', 'contactName', 'contactEmail']
    for (const key of allowed) {
      if (updates[key] !== undefined) {
        (client as Record<string, unknown>)[key] = updates[key]
      }
    }
    await client.save()
    return NextResponse.json({ data: client })
  } catch (err) {
    return NextResponse.json({ error: 'Error updating org' }, { status: 500 })
  }
}
