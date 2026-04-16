import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import EnterpriseClient from '@/models/EnterpriseClient'
import { getUserFromRequest } from '@/lib/auth'

interface Params { params: { slug: string } }

// GET: org analytics (admin only)
export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectDB()
    const user = await getUserFromRequest(req)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const client = await EnterpriseClient.findOne({ slug: params.slug })
      .populate('learners', 'name email country createdAt lastLoginAt')
      .populate('customCurriculum', 'title slug enrollmentCount')
    if (!client) return NextResponse.json({ error: 'Org not found' }, { status: 404 })

    const isAdmin = client.adminUsers.some((id: unknown) => String(id) === user.userId)
    if (!isAdmin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    // seat utilisation
    const totalLearners: number = client.usedSeats
    const seatUtilisationPct: number = client.seatLimit > 0
      ? Math.round((totalLearners / client.seatLimit) * 100)
      : 0

    // active in last 7 days (use lastLoginAt if available, otherwise estimate)
    const cutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const learnerDocs = client.learners as Array<{ lastLoginAt?: Date }>
    const activeLearners = learnerDocs.filter(
      (l) => l.lastLoginAt && l.lastLoginAt > cutoff
    ).length

    // country distribution
    const countryMap: Record<string, number> = {}
    for (const l of learnerDocs as Array<{ country?: string }>) {
      if (l.country) countryMap[l.country] = (countryMap[l.country] || 0) + 1
    }
    const topCountries = Object.entries(countryMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([country, count]) => ({ country, count }))

    // curriculum summary
    const curriculumSummary = (client.customCurriculum as Array<{ title: string; slug: string; enrollmentCount?: number }>)
      .map((c) => ({
        title: c.title,
        slug: c.slug,
        enrollments: c.enrollmentCount ?? 0,
      }))

    // contract health
    const today = new Date()
    const daysToExpiry = client.contractEndDate
      ? Math.max(0, Math.ceil((new Date(client.contractEndDate).getTime() - today.getTime()) / 86400000))
      : null

    return NextResponse.json({
      data: {
        orgName: client.organizationName,
        plan: client.plan,
        seatLimit: client.seatLimit,
        usedSeats: client.usedSeats,
        seatUtilisationPct,
        totalLearners,
        activeLearners,
        topCountries,
        curriculumSummary,
        annualFeeUSD: client.annualFeeUSD,
        paymentStatus: client.paymentStatus,
        contractEndDate: client.contractEndDate,
        daysToExpiry,
        isActive: client.isActive,
      },
    })
  } catch (err) {
    return NextResponse.json({ error: 'Error loading analytics' }, { status: 500 })
  }
}
