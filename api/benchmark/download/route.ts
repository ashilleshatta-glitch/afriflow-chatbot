import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import BenchmarkDownload from '@/models/BenchmarkDownload'

const REPORT_URL = process.env.BENCHMARK_REPORT_URL ||
  'https://afriflowai.com/assets/AfriFlow-African-AI-Report-2025.pdf'

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const { name, email, organization, organizationType, country } = body

    if (!name || !email) {
      return NextResponse.json({ error: 'Name and email are required' }, { status: 400 })
    }

    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown'

    // Upsert — don't create duplicate if same email re-downloads
    await BenchmarkDownload.findOneAndUpdate(
      { email: email.toLowerCase() },
      {
        name: name.trim(),
        email: email.toLowerCase().trim(),
        organization: organization || '',
        organizationType: organizationType || 'other',
        country: country || '',
        downloadedAt: new Date(),
        ipAddress: ip,
      },
      { upsert: true }
    )

    // TODO: Send email with PDF link (Resend / SendGrid / Nodemailer)

    return NextResponse.json({
      data: {
        downloadUrl: REPORT_URL,
        message: 'Report link sent to your email.',
      },
    })
  } catch (err) {
    console.error('[benchmark/download]', err)
    return NextResponse.json({ error: 'Failed to process download' }, { status: 500 })
  }
}
