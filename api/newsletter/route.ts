import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Newsletter from '@/models/Newsletter'

// POST — subscribe to newsletter
export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, name, source } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: email.toLowerCase() })
    if (existing) {
      if (existing.isActive) {
        return NextResponse.json({
          message: 'You\'re already subscribed! 🎉',
          subscribed: true,
        })
      }
      // Reactivate
      existing.isActive = true
      await existing.save()
      return NextResponse.json({
        message: 'Welcome back! Your subscription has been reactivated.',
        subscribed: true,
      })
    }

    await Newsletter.create({
      email: email.toLowerCase(),
      name: name || undefined,
      source: source || 'website',
    })

    return NextResponse.json({
      message: 'Successfully subscribed! Welcome to AfriFlow AI. 🚀',
      subscribed: true,
    }, { status: 201 })
  } catch (err: any) {
    console.error('Newsletter error:', err)
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
