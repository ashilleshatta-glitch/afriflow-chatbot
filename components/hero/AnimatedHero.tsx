'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'
import {
  ArrowRight, Play, CheckCircle, Flame,
} from 'lucide-react'
import LiveCounter from '@/components/hero/LiveCounter'
import TypewriterText from '@/components/hero/TypewriterText'

const ParticleGrid = dynamic(() => import('@/components/hero/ParticleGrid'), { ssr: false })
const FloatingCards = dynamic(() => import('@/components/hero/FloatingCards'), { ssr: false })

export default function AnimatedHero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Interactive particle background */}
      <ParticleGrid />

      {/* Floating course cards */}
      <FloatingCards />

      {/* Glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 glow-orb bg-brand-500/15 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 glow-orb bg-forest-500/10 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Live counter */}
          <div className="mb-6 animate-fade-in">
            <LiveCounter />
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 text-brand-400 text-sm font-medium px-4 py-2 rounded-full mb-8 animate-fade-in">
            <Flame size={14} />
            Africa&apos;s #1 AI Automation Platform
            <span className="w-1.5 h-1.5 bg-forest-400 rounded-full animate-pulse" />
          </div>

          {/* Headline with typewriter */}
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6 animate-slide-up">
            <TypewriterText />
            <br />
            <span className="text-earth-200">Starts Here.</span>
          </h1>

          <p className="text-xl text-earth-400 leading-relaxed mb-10 max-w-2xl mx-auto animate-slide-up">
            The only platform built for Africans to go from AI-curious to AI-earning.
            Practical skills, real business cases, and a community that gets you.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14 animate-slide-up">
            <Link href="/auth/register" className="btn-primary text-base px-8 py-4 w-full sm:w-auto justify-center">
              Start Free Today <ArrowRight size={18} />
            </Link>
            <Link href="/courses" className="btn-secondary text-base px-8 py-4 w-full sm:w-auto justify-center">
              <Play size={16} className="text-brand-400" />
              Watch demo
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-earth-500 animate-fade-in">
            {[
              'Free to start',
              'No credit card needed',
              'Mobile-friendly',
              '24K+ learners',
            ].map((item) => (
              <span key={item} className="flex items-center gap-1.5">
                <CheckCircle size={14} className="text-forest-400" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-earth-600 text-xs animate-float z-10">
        <span>Scroll to explore</span>
        <div className="w-0.5 h-8 bg-gradient-to-b from-earth-700 to-transparent rounded-full" />
      </div>
    </section>
  )
}
