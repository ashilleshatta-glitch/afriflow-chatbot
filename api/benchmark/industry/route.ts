import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

const INDUSTRY_FIELDS = [
  'Fintech', 'SME / Retail', 'Education', 'Healthcare',
  'Media & Creative', 'Agriculture', 'Government', 'NGO',
  'Real Estate', 'Other',
]

// Static weights for demo — in production pull from User.businessType or LearningEvent metadata
const STATIC_DISTRIBUTION: Record<string, number> = {
  'Fintech': 0.22,
  'SME / Retail': 0.19,
  'Education': 0.14,
  'Healthcare': 0.09,
  'Media & Creative': 0.11,
  'Agriculture': 0.06,
  'Government': 0.05,
  'NGO': 0.06,
  'Real Estate': 0.04,
  'Other': 0.04,
}

export async function GET(_req: NextRequest) {
  try {
    await connectDB()
    const totalUsers = await User.countDocuments()

    const industries = INDUSTRY_FIELDS.map(name => ({
      name,
      learnerCount: Math.round(totalUsers * (STATIC_DISTRIBUTION[name] || 0.04)),
      growthRate: +(Math.random() * 40 + 5).toFixed(1), // % YoY — replace with real data
    })).sort((a, b) => b.learnerCount - a.learnerCount)

    return NextResponse.json({ data: { industries, totalUsers } })
  } catch (err) {
    console.error('[benchmark/industry]', err)
    return NextResponse.json({ error: 'Failed to fetch industry data' }, { status: 500 })
  }
}
