// GET /api/schools — list schools (public, paginated)
// POST /api/schools — create school (auth required)
import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import connectDB from '@/lib/mongodb'
import School from '@/models/School'
import User from '@/models/User'

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const country = searchParams.get('country')
    const type = searchParams.get('type')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = Math.min(parseInt(searchParams.get('limit') || '12'), 50)

    const query: Record<string, unknown> = { isActive: true }
    if (country) query.country = country
    if (type) query.type = type

    const [schools, total] = await Promise.all([
      School.find(query)
        .select('name slug country city type logoUrl primaryColor description plan totalStudentsEnrolled')
        .sort({ totalStudentsEnrolled: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      School.countDocuments(query),
    ])

    return NextResponse.json({ schools, total, page, pages: Math.ceil(total / limit) })
  } catch (err) {
    console.error('GET /api/schools:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const payload = verifyToken(authHeader.slice(7))
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    await connectDB()

    const body = await req.json()
    const { name, country, city, type, website, description, primaryColor, logoUrl } = body

    if (!name || !country || !type) {
      return NextResponse.json({ error: 'name, country, and type are required' }, { status: 400 })
    }

    const validTypes = ['university', 'college', 'bootcamp', 'secondary', 'vocational', 'corporate']
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    // Generate unique slug
    const baseSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    let slug = baseSlug
    let counter = 1
    while (await School.exists({ slug })) {
      slug = `${baseSlug}-${counter++}`
    }

    const user = await User.findById(payload.userId).select('email').lean() as { email: string } | null
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

    const school = await School.create({
      name,
      slug,
      country,
      city,
      type,
      adminEmail: user.email,
      adminUser: payload.userId,
      website,
      description,
      primaryColor: primaryColor || '#FF7A00',
      logoUrl,
    })

    return NextResponse.json({ school }, { status: 201 })
    } catch (err: unknown) {
    console.error('POST /api/schools:', err)
    if (
      err instanceof Error &&
      'code' in err &&
      (err as { code?: number }).code === 11000
    ) {
      return NextResponse.json({ error: 'School already exists' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}