import { NextRequest, NextResponse } from 'next/server'
import { SAMPLE_COURSES } from '@/lib/data'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const school = searchParams.get('school')
    const level = searchParams.get('level')
    const free = searchParams.get('free')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const slug = searchParams.get('slug')

    // Single course by slug
    if (slug) {
      const course = SAMPLE_COURSES.find(c => c.slug === slug)
      if (!course) {
        return NextResponse.json({ error: 'Course not found' }, { status: 404 })
      }
      return NextResponse.json({ course }, {
        headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
      })
    }

    let courses = [...SAMPLE_COURSES]

    if (school) courses = courses.filter(c => c.school === school)
    if (level) courses = courses.filter(c => c.level === level)
    if (free === 'true') courses = courses.filter(c => c.isFree)
    if (search) {
      const q = search.toLowerCase()
      courses = courses.filter(c =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.tags.some(t => t.toLowerCase().includes(q))
      )
    }

    const total = courses.length
    const start = (page - 1) * limit
    const paginatedCourses = courses.slice(start, start + limit)

    return NextResponse.json({
      courses: paginatedCourses,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    }, {
      headers: { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=3600' },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 })
  }
}
