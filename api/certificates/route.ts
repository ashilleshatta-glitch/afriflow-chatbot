import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Certificate from '@/models/Certificate'
import Enrollment from '@/models/Enrollment'
import Activity from '@/models/Activity'
import User from '@/models/User'
import { getUserFromRequest } from '@/lib/auth'
import crypto from 'crypto'
import { SAMPLE_COURSES } from '@/lib/data'

// Skills mapping per school
const SCHOOL_SKILLS: Record<string, string[]> = {
  foundations: ['AI fundamentals', 'Prompt engineering', 'ChatGPT', 'Claude AI', 'Critical thinking with AI'],
  automation: ['Zapier', 'Make', 'n8n', 'API integrations', 'WhatsApp automation', 'Workflow design'],
  business: ['Business AI strategy', 'Customer service AI', 'AI marketing', 'ROI measurement', 'Process optimization'],
  creator: ['AI freelancing', 'Service packaging', 'Client acquisition', 'Pricing strategy', 'Portfolio building'],
  builder: ['Python', 'OpenAI API', 'LangChain', 'FastAPI', 'Chatbot development'],
  career: ['AI-enhanced CV', 'Portfolio building', 'Interview skills', 'LinkedIn optimization'],
  data: ['Data analysis', 'Visualization', 'Business intelligence', 'Reporting', 'Excel + AI'],
}

// GET — list user's certificates
export async function GET(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()

    const certificates = await Certificate.find({ user: payload.userId })
      .sort({ issuedAt: -1 })
      .lean()

    return NextResponse.json({ certificates, total: certificates.length })
  } catch (err: any) {
    console.error('Certificates GET error:', err)
    return NextResponse.json({ error: 'Failed to fetch certificates' }, { status: 500 })
  }
}

// POST — generate certificate for completed course
export async function POST(req: NextRequest) {
  try {
    const payload = await getUserFromRequest(req)
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    const { courseSlug } = await req.json()

    if (!courseSlug) {
      return NextResponse.json({ error: 'courseSlug is required' }, { status: 400 })
    }

    // Check enrollment is complete
    const enrollment = await Enrollment.findOne({
      user: payload.userId,
      courseSlug,
      isCompleted: true,
    })

    if (!enrollment) {
      return NextResponse.json({
        error: 'You must complete the course before earning a certificate',
      }, { status: 400 })
    }

    // Check if certificate already exists
    const existing = await Certificate.findOne({
      user: payload.userId,
      courseSlug,
    })

    if (existing) {
      return NextResponse.json({ certificate: existing, message: 'Certificate already issued' })
    }

    // Get user info
    const user = await User.findById(payload.userId).select('name')

    // Generate unique certificate ID
    const certificateId = `AF-${Date.now().toString(36).toUpperCase()}-${crypto.randomBytes(3).toString('hex').toUpperCase()}`

    // Calculate grade based on progress speed (simplified)
    const enrolledDate = new Date(enrollment.enrolledAt)
    const completedDate = new Date(enrollment.completedAt!)
    const daysToComplete = Math.ceil((completedDate.getTime() - enrolledDate.getTime()) / (1000 * 60 * 60 * 24))
    const grade = daysToComplete <= 7 ? 'distinction' : daysToComplete <= 21 ? 'merit' : 'pass'

    // Resolve skills from school
    const course = SAMPLE_COURSES.find((c) => c.slug === courseSlug)
    const schoolKey = (course?.school || enrollment.courseSchool || '').toLowerCase().split(' ')[0]
    const skills = SCHOOL_SKILLS[schoolKey] || ['AI proficiency']

    // Calculate projects / automations from course metadata
    const projectsCompleted = course ? Math.max(1, Math.floor((course.duration || 60) / 60)) : 1
    const automationsBuilt = schoolKey === 'automation' ? Math.max(1, Math.floor((course?.duration || 60) / 40)) : 0

    // Generate verification hash (SHA-256 of certificateId + userId + issuedAt)
    const issuedAt = new Date()
    const expiryDate = new Date(issuedAt.getTime() + 2 * 365 * 24 * 60 * 60 * 1000) // 2 years
    const verificationHash = crypto
      .createHash('sha256')
      .update(`${certificateId}:${payload.userId}:${issuedAt.toISOString()}`)
      .digest('hex')

    const certificate = await Certificate.create({
      user: payload.userId,
      userName: user?.name || 'AfriFlow Learner',
      courseSlug,
      courseTitle: enrollment.courseTitle,
      courseSchool: enrollment.courseSchool,
      certificateId,
      issuedAt,
      expiryDate,
      grade,
      score: grade === 'distinction' ? 95 : grade === 'merit' ? 85 : 75,
      skills,
      projectsCompleted,
      automationsBuilt,
      verificationHash,
    })

    // Award XP for certificate
    const certXp = 150
    await User.findByIdAndUpdate(payload.userId, {
      $inc: { xp: certXp },
      $addToSet: { certificates: certificate._id },
    })

    // Log activity
    await Activity.create({
      user: payload.userId,
      type: 'certificate_earned',
      title: `Earned certificate for ${enrollment.courseTitle}`,
      description: `Grade: ${grade} | Certificate ID: ${certificateId}`,
      metadata: { courseSlug, certificateId, grade },
      xpAwarded: certXp,
    })

    return NextResponse.json({ certificate, xpAwarded: certXp }, { status: 201 })
  } catch (err: any) {
    console.error('Certificate POST error:', err)
    return NextResponse.json({ error: 'Certificate generation failed' }, { status: 500 })
  }
}
