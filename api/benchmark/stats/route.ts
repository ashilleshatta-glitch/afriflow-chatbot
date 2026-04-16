// GET /api/benchmark/stats — live platform aggregate stats (cached 24h)
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import Certificate from '@/models/Certificate'
import AutomationRequest from '@/models/AutomationRequest'
import Enrollment from '@/models/Enrollment'

export const revalidate = 86400 // 24h ISR cache

export async function GET(_req: NextRequest) {
  try {
    await connectDB()

    const [
      totalLearners,
      totalCertificates,
      totalAutomations,
      countryAgg,
      certCountryAgg,
    ] = await Promise.all([
      User.countDocuments(),
      Certificate.countDocuments({ isRevoked: { $ne: true } }),
      AutomationRequest.countDocuments({ status: 'delivered' }),
      User.aggregate([
        { $match: { country: { $exists: true, $ne: '' } } },
        { $group: { _id: '$country', learners: { $sum: 1 } } },
        { $sort: { learners: -1 } },
        { $limit: 30 },
      ]),
      Certificate.aggregate([
        { $match: { isRevoked: { $ne: true } } },
        { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'u' } },
        { $unwind: { path: '$u', preserveNullAndEmptyArrays: true } },
        { $group: { _id: '$u.country', certs: { $sum: 1 } } },
        { $sort: { certs: -1 } },
        { $limit: 20 },
      ]),
    ])

    // Enrollment count (total across all users)
    const enrollAgg = await User.aggregate([
      { $group: { _id: null, total: { $sum: { $size: { $ifNull: ['$enrollments', []] } } } } },
    ])
    const totalEnrollments = enrollAgg[0]?.total ?? 0

    // Hours of education: avg lesson ~20 min, estimate
    const hoursDelivered = Math.round(totalEnrollments * 0.4)  // ~24 min avg

    return NextResponse.json({
      totalLearners,
      totalCertificates,
      totalAutomations,
      totalEnrollments,
      hoursDelivered,
      countriesRepresented: countryAgg.length,
      topCountries: countryAgg.slice(0, 10).map((c: any) => ({
        country: c._id,
        learners: c.learners,
      })),
      certsByCountry: certCountryAgg.slice(0, 10).map((c: any) => ({
        country: c._id,
        certificates: c.certs,
      })),
      generatedAt: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
      },
    })
  } catch (err) {
    console.error('GET /api/benchmark/stats:', err)
    return NextResponse.json({ error: 'Stats unavailable' }, { status: 500 })
  }
}
