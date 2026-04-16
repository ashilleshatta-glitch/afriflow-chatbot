import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'

/**
 * POST /api/seed/admin
 * Creates (or promotes) the default admin account.
 * Hit this endpoint ONCE, then login with the credentials below.
 */
export async function POST(_req: NextRequest) {
  try {
    await connectDB()

    const ADMIN_EMAIL = 'admin@afriflowai.com'
    const ADMIN_PASSWORD = 'Admin@2026'

    let admin = await User.findOne({ email: ADMIN_EMAIL })

    if (admin) {
      // Already exists — just ensure role is admin
      admin.role = 'admin'
      admin.subscriptionTier = 'enterprise'
      await admin.save()

      return NextResponse.json({
        message: 'Admin already exists — role confirmed as admin.',
        credentials: { email: ADMIN_EMAIL, password: '(your existing password)' },
      })
    }

    admin = await User.create({
      name: 'AfriFlow Admin',
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD,
      country: 'Ghana',
      role: 'admin',
      subscriptionTier: 'enterprise',
      xp: 10000,
      streak: 365,
      bio: 'Platform administrator',
    })

    return NextResponse.json({
      message: 'Admin account created successfully!',
      credentials: {
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      },
      note: 'Change this password after first login.',
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('Admin seed error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
