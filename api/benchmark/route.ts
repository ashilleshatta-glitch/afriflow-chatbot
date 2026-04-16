// GET /api/benchmark — public index data
// POST /api/benchmark/download — gated PDF (requires email)
import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import BenchmarkDownload from '@/models/BenchmarkDownload'
import {
  COUNTRY_DATA,
  ADDITIONAL_COUNTRIES,
  REPORT_INSIGHTS,
  INDEX_YEAR,
  INDEX_QUARTER,
} from '@/lib/benchmarkData'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const region = searchParams.get('region')
  const sort = searchParams.get('sort') || 'rank'

  let countries = [...COUNTRY_DATA]

  if (region) {
    countries = countries.filter((c) => c.region === region)
  }

  if (sort === 'talent') countries.sort((a, b) => b.talentScore - a.talentScore)
  else if (sort === 'policy') countries.sort((a, b) => b.policyScore - a.policyScore)
  else if (sort === 'startup') countries.sort((a, b) => b.startupScore - a.startupScore)
  else if (sort === 'adoption') countries.sort((a, b) => b.adoptionScore - a.adoptionScore)
  else countries.sort((a, b) => a.rank - b.rank)

  return NextResponse.json(
    {
      indexYear: INDEX_YEAR,
      indexQuarter: INDEX_QUARTER,
      countries,
      additionalCountries: ADDITIONAL_COUNTRIES,
      insights: REPORT_INSIGHTS,
      totalCountries: COUNTRY_DATA.length + ADDITIONAL_COUNTRIES.length,
    },
    {
      headers: { 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' },
    }
  )
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, name, company } = body

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    await connectDB()

    // Persist to DB (dedupe — upsert by email+year+quarter)
    await BenchmarkDownload.findOneAndUpdate(
      { email: email.toLowerCase(), reportYear: INDEX_YEAR, reportQuarter: INDEX_QUARTER },
      { name: name || '', organization: company || '', downloadedAt: new Date(), source: 'web' },
      { upsert: true, new: true }
    )

    // In production: trigger Resend email with signed S3 PDF link
    const downloadUrl = `/api/benchmark/report?token=${Buffer.from(email).toString('base64url')}`

    return NextResponse.json({
      message: 'Report access granted! Check your email.',
      downloadUrl,
    })
  } catch (err) {
    console.error('POST /api/benchmark:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
