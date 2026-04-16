import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import AfriflowID from '@/models/AfriflowID'
import { getUserFromRequest } from '@/lib/auth'
import { randomUUID } from 'crypto'

/**
 * POST /api/id/endorse
 *
 * Two flows:
 *
 * Flow A — Learner requests endorsement (authenticated):
 *   body: { action: 'request', companyName, contactName, contactEmail, skillsEndorsed[] }
 *   → Creates a pending endorsement with a verifyToken
 *   → Sends verification email to employer (stub if no RESEND_API_KEY)
 *
 * Flow B — Employer submits endorsement directly (no auth, comes from email link):
 *   body: { action: 'submit', publicId, companyName, contactName, contactEmail,
 *           endorsementText, skillsEndorsed[], jobTitle? }
 *   → Adds endorsement (unverified) + sends verify email to employer
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const { action } = body

    // ── Flow A: authenticated learner requests endorsement ──────────────────
    if (action === 'request') {
      const payload = await getUserFromRequest(req)
      if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

      const { companyName, contactName, contactEmail, skillsEndorsed } = body
      if (!companyName || !contactName || !contactEmail) {
        return NextResponse.json({ error: 'companyName, contactName, contactEmail required' }, { status: 400 })
      }

      const record = await AfriflowID.findOne({ userId: payload.userId })
      if (!record) return NextResponse.json({ error: 'AfriflowID not found' }, { status: 404 })

      const verifyToken = randomUUID()
      record.employerEndorsements.push({
        companyName,
        contactName,
        contactEmail: contactEmail.toLowerCase(),
        endorsementText: '',
        skillsEndorsed: Array.isArray(skillsEndorsed) ? skillsEndorsed : [],
        endorsedAt: new Date(),
        isVerified: false,
        verifyToken,
      })
      await record.save()

      // Send email to employer
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://afriflow.ai'
      const verifyUrl = `${appUrl}/api/id/endorse/verify/${verifyToken}`
      await sendEndorseRequestEmail({ contactEmail, contactName, learnerName: record.displayName, verifyUrl, skillsEndorsed, publicId: record.publicId, appUrl })

      return NextResponse.json({ success: true, message: `Endorsement request sent to ${contactEmail}` })
    }

    // ── Flow B: employer submits endorsement (from email link / form) ────────
    if (action === 'submit') {
      const { publicId, companyName, contactName, contactEmail, endorsementText, skillsEndorsed } = body
      if (!publicId || !companyName || !contactName || !contactEmail || !endorsementText) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
      }

      const record = await AfriflowID.findOne({ publicId })
      if (!record) return NextResponse.json({ error: 'AfriflowID not found' }, { status: 404 })

      const verifyToken = randomUUID()
      record.employerEndorsements.push({
        companyName,
        contactName,
        contactEmail: contactEmail.toLowerCase(),
        endorsementText,
        skillsEndorsed: Array.isArray(skillsEndorsed) ? skillsEndorsed : [],
        endorsedAt: new Date(),
        isVerified: false,
        verifyToken,
      })
      await record.save()

      // Send verification link to employer
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://afriflow.ai'
      const confirmUrl = `${appUrl}/api/id/endorse/verify/${verifyToken}`
      await sendEndorseConfirmEmail({ contactEmail, contactName, confirmUrl, learnerName: record.displayName })

      return NextResponse.json({ success: true, message: 'Endorsement submitted. Please check your email to verify.' })
    }

    return NextResponse.json({ error: 'Invalid action. Use "request" or "submit".' }, { status: 400 })
  } catch (err) {
    console.error('POST /api/id/endorse error:', err)
    return NextResponse.json({ error: 'Failed to process endorsement' }, { status: 500 })
  }
}

// ─── Email stubs ──────────────────────────────────────────────────────────────

async function sendEndorseRequestEmail(p: {
  contactEmail: string; contactName: string; learnerName: string
  verifyUrl: string; skillsEndorsed: string[]; publicId: string; appUrl: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL STUB] Endorsement request → ${p.contactEmail}`, p)
    return
  }
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'AfriFlow AI <noreply@afriflow.ai>',
      to: [p.contactEmail],
      subject: `${p.learnerName} has requested your endorsement on AfriFlow AI`,
      html: `
        <p>Hi ${p.contactName},</p>
        <p><strong>${p.learnerName}</strong> has requested your professional endorsement on AfriFlow AI — 
        Africa's AI credential platform.</p>
        <p>Skills they'd like endorsed: <strong>${p.skillsEndorsed.join(', ') || 'General AI skills'}</strong></p>
        <p>View their profile: <a href="${p.appUrl}/id/${p.publicId}">${p.appUrl}/id/${p.publicId}</a></p>
        <p><a href="${p.verifyUrl}" style="background:#FF7A00;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">
          Write an Endorsement
        </a></p>
        <p style="color:#999;font-size:12px;">AfriFlow AI · Africa's AI Operating System</p>
      `,
    }),
  })
}

async function sendEndorseConfirmEmail(p: {
  contactEmail: string; contactName: string; confirmUrl: string; learnerName: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log(`[EMAIL STUB] Endorse confirm → ${p.contactEmail}`, p)
    return
  }
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'AfriFlow AI <noreply@afriflow.ai>',
      to: [p.contactEmail],
      subject: `Confirm your endorsement for ${p.learnerName}`,
      html: `
        <p>Hi ${p.contactName},</p>
        <p>Thank you for endorsing <strong>${p.learnerName}</strong> on AfriFlow AI.</p>
        <p>Please click the button below to verify your endorsement:</p>
        <p><a href="${p.confirmUrl}" style="background:#22C55E;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;">
          Verify My Endorsement
        </a></p>
        <p style="color:#999;font-size:12px;">AfriFlow AI · Africa's AI Operating System</p>
      `,
    }),
  })
}
