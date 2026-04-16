import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import {
  generateWeeklyInsightEmail,
  predictDropoffRisk,
} from '@/lib/intelligence'

// Cron secret to prevent unauthorised triggers
const CRON_SECRET = process.env.CRON_SECRET || 'afriflow-cron-2026'

/**
 * GET /api/cron/weekly-insights
 *
 * Triggered every Monday at 8:00 AM UTC by Vercel Cron.
 * Does three things in order:
 *  1. Sends a personalised "Your week in AI" email to every active user.
 *  2. Identifies at-risk users (predictDropoffRisk ≥ 60) and queues re-engagement.
 *  3. Warms the benchmark stats cache.
 *
 * Protected by a bearer token: Authorization: Bearer <CRON_SECRET>
 * Vercel Cron sends this automatically via the `headers` config in vercel.json.
 */
export async function GET(req: NextRequest) {
  // Authorise
  const auth = req.headers.get('authorization')
  if (auth !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startedAt = Date.now()
  const results = {
    usersProcessed: 0,
    insightsGenerated: 0,
    atRiskUsers: 0,
    reEngagementQueued: 0,
    errors: 0,
    durationMs: 0,
  }

  try {
    await connectDB()

    // Pull all users active in the last 90 days (skip totally dormant accounts)
    const ninetyDaysAgo = new Date(Date.now() - 86400000 * 90)
    const activeUsers = await User.find({ lastActive: { $gte: ninetyDaysAgo } })
      .select('_id name email')
      .lean() as Array<{ _id: { toString(): string }; name?: string; email?: string }>

    results.usersProcessed = activeUsers.length

    // Process in batches of 20 to avoid overwhelming the DB
    const BATCH = 20
    for (let i = 0; i < activeUsers.length; i += BATCH) {
      const batch = activeUsers.slice(i, i + BATCH)

      await Promise.allSettled(batch.map(async (user) => {
        const userId = user._id.toString()
        try {
          // 1. Generate weekly insight
          const insight = await generateWeeklyInsightEmail(userId)
          if (insight) {
            results.insightsGenerated++
            // In production: send via your email provider (Resend, SendGrid, etc.)
            // For now: log the insight payload. Replace with real send when ready.
            await sendWeeklyEmail(insight)
          }

          // 2. Check dropoff risk
          const risk = await predictDropoffRisk(userId)
          if (risk.riskLevel === 'high') {
            results.atRiskUsers++
            await sendReEngagementMessage(userId, risk.suggestedMessage, risk.lastCourseSlug)
            results.reEngagementQueued++
          }
        } catch (err) {
          results.errors++
          console.error(`Weekly insight error for user ${userId}:`, err)
        }
      }))

      // Small delay between batches to avoid hammering the DB
      if (i + BATCH < activeUsers.length) {
        await new Promise(resolve => setTimeout(resolve, 200))
      }
    }

    // 3. Warm benchmark stats cache
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
      await fetch(`${baseUrl}/api/benchmark/stats`, { method: 'GET' })
    } catch {
      // Non-critical — cache warming is best-effort
    }

    results.durationMs = Date.now() - startedAt

    console.log('✅ Weekly insights cron complete:', results)
    return NextResponse.json({ success: true, results })
  } catch (err) {
    console.error('Weekly insights cron fatal error:', err)
    results.durationMs = Date.now() - startedAt
    return NextResponse.json({ error: 'Cron failed', results }, { status: 500 })
  }
}

// ─── Email sender (stub — replace with Resend/SendGrid in production) ─────────

interface WeeklyInsight {
  userId: string
  userName: string
  userEmail: string
  lessonsCompleted: number
  xpEarned: number
  currentStreak: number
  skillsProgressed: string[]
  suggestedChallenge: string
  matchingJobs: number
}

async function sendWeeklyEmail(insight: WeeklyInsight): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    // Dev mode: just log
    console.log(`[EMAIL STUB] Weekly email for ${insight.userEmail}:`, {
      subject: `Your week in AI — ${insight.lessonsCompleted} lessons, ${insight.xpEarned} XP 🔥`,
      preview: insight.suggestedChallenge,
    })
    return
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://afriflow.ai'
  const html = buildWeeklyEmailHtml(insight, appUrl)

  try {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'AfriFlow AI <noreply@afriflow.ai>',
        to: [insight.userEmail],
        subject: `Your week in AI — ${insight.lessonsCompleted} lessons completed 🔥`,
        html,
      }),
    })
  } catch (err) {
    console.error('Email send failed:', err)
  }
}

async function sendReEngagementMessage(userId: string, message: string, courseSlug: string): Promise<void> {
  // Check if user has a WhatsApp phone linked
  const user = await User.findById(userId).select('whatsappPhone email name').lean() as {
    whatsappPhone?: string
    email?: string
    name?: string
  } | null

  if (user?.whatsappPhone && process.env.TWILIO_ACCOUNT_SID) {
    // Send via WhatsApp
    const { sendWhatsAppMessage } = await import('@/lib/whatsapp')
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://afriflow.ai'
    await sendWhatsAppMessage(
      user.whatsappPhone,
      `${message}\n\n▶️ Continue now: ${appUrl}/courses/${courseSlug}`
    )
  } else if (user?.email && process.env.RESEND_API_KEY) {
    // Fall back to email
    console.log(`[RE-ENGAGEMENT EMAIL STUB] → ${user.email}: ${message}`)
  }
}

function buildWeeklyEmailHtml(insight: WeeklyInsight, appUrl: string): string {
  const streakEmoji = insight.currentStreak >= 7 ? '🔥' : insight.currentStreak >= 3 ? '⚡' : '💪'
  const skillList = insight.skillsProgressed.length > 0
    ? `<ul style="margin:8px 0;padding-left:20px;">${insight.skillsProgressed.map(s => `<li>${s}</li>`).join('')}</ul>`
    : '<p style="color:#999">Start a course this week to build your first skill!</p>'

  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0C0A09;font-family:system-ui,sans-serif;color:#fff;">
  <div style="max-width:600px;margin:0 auto;padding:32px 24px;">
    
    <div style="text-align:center;margin-bottom:32px;">
      <span style="color:#FF7A00;font-size:24px;font-weight:800;">AfriFlow AI</span>
      <p style="color:#666;margin:4px 0 0;">Your week in AI</p>
    </div>

    <h1 style="font-size:28px;font-weight:700;margin:0 0 8px;">
      ${streakEmoji} Great work, ${insight.userName}!
    </h1>
    <p style="color:#999;margin:0 0 32px;">Here's what you accomplished this week:</p>

    <!-- Stats row -->
    <div style="display:flex;gap:16px;margin-bottom:32px;flex-wrap:wrap;">
      ${statBox(String(insight.lessonsCompleted), 'Lessons completed')}
      ${statBox(`+${insight.xpEarned}`, 'XP earned')}
      ${statBox(`${insight.currentStreak}🔥`, 'Day streak')}
    </div>

    <!-- Skills -->
    <div style="background:#1a1714;border-radius:12px;padding:20px;margin-bottom:24px;">
      <h3 style="margin:0 0 12px;font-size:16px;">Skills you progressed this week:</h3>
      ${skillList}
    </div>

    <!-- Next challenge -->
    <div style="background:#1a1714;border-left:4px solid #FF7A00;border-radius:8px;padding:20px;margin-bottom:24px;">
      <h3 style="margin:0 0 8px;font-size:16px;color:#FF7A00;">Your challenge for next week 🎯</h3>
      <p style="margin:0;color:#ccc;">${insight.suggestedChallenge}</p>
    </div>

    <!-- Job matches -->
    ${insight.matchingJobs > 0 ? `
    <div style="background:#0f2e1f;border-radius:12px;padding:20px;margin-bottom:24px;">
      <h3 style="margin:0 0 8px;font-size:16px;color:#22C55E;">💼 ${insight.matchingJobs} job${insight.matchingJobs !== 1 ? 's' : ''} matching your skills</h3>
      <a href="${appUrl}/work" style="color:#22C55E;text-decoration:none;">View job board →</a>
    </div>` : ''}

    <!-- CTA -->
    <div style="text-align:center;margin-top:32px;">
      <a href="${appUrl}/dashboard" style="background:#FF7A00;color:#fff;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:16px;">
        Continue Learning →
      </a>
    </div>

    <p style="color:#444;font-size:12px;text-align:center;margin-top:32px;">
      AfriFlow AI — Africa's AI Operating System<br>
      <a href="${appUrl}/dashboard/settings" style="color:#666;">Manage email preferences</a>
    </p>
  </div>
</body>
</html>`
}

function statBox(value: string, label: string): string {
  return `
  <div style="flex:1;min-width:120px;background:#1a1714;border-radius:12px;padding:16px;text-align:center;">
    <div style="font-size:24px;font-weight:800;color:#FF7A00;">${value}</div>
    <div style="font-size:12px;color:#666;margin-top:4px;">${label}</div>
  </div>`
}
