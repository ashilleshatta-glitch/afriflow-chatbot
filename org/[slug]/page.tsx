'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface OrgData {
  organizationName: string
  plan: string
  branding: {
    logoUrl?: string
    primaryColor?: string
    customDomain?: string
  }
  welcomeMessage?: string
  customCurriculum: Array<{ title: string; slug: string; description?: string; level?: string }>
  seatLimit: number
  usedSeats: number
}

export default function OrgPortalPage() {
  const { slug } = useParams<{ slug: string }>()
  const [org, setOrg] = useState<OrgData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`/api/enterprise/${slug}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.error) setError(json.error)
        else setOrg(json.data)
      })
      .catch(() => setError('Could not load organisation'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-earth-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading portal…</p>
        </div>
      </div>
    )
  }

  if (error || !org) {
    return (
      <div className="min-h-screen bg-earth-950 flex items-center justify-center text-center px-6">
        <div>
          <p className="text-5xl mb-4">🔒</p>
          <h1 className="text-2xl font-bold mb-2">Organisation not found</h1>
          <p className="text-gray-400">{error || 'This portal does not exist or is not active.'}</p>
          <Link href="/" className="btn-primary mt-6 inline-block px-6 py-3">Go to AfriFlow AI</Link>
        </div>
      </div>
    )
  }

  const primaryColor = org.branding?.primaryColor ?? '#FF7A00'
  const seatsLeft = org.seatLimit - org.usedSeats

  return (
    <div className="min-h-screen bg-earth-950 text-white">
      {/* Branded header */}
      <header
        className="py-5 px-8 flex items-center justify-between"
        style={{ borderBottom: `2px solid ${primaryColor}20` }}
      >
        <div className="flex items-center gap-4">
          {org.branding?.logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={org.branding.logoUrl} alt={org.organizationName} className="h-10 object-contain" />
          ) : (
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-white"
              style={{ background: primaryColor }}
            >
              {org.organizationName.charAt(0)}
            </div>
          )}
          <div>
            <p className="font-bold text-lg">{org.organizationName}</p>
            <p className="text-xs text-gray-500">Powered by AfriFlow AI</p>
          </div>
        </div>
        <Link href={`/org/${slug}/dashboard`} className="text-sm btn-secondary px-4 py-2">
          Admin Dashboard →
        </Link>
      </header>

      {/* Hero */}
      <section className="py-20 px-6 max-w-4xl mx-auto text-center">
        <span
          className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
          style={{ background: `${primaryColor}20`, color: primaryColor }}
        >
          {org.plan.charAt(0).toUpperCase() + org.plan.slice(1)} Plan · {org.usedSeats}/{org.seatLimit} seats
        </span>
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to <span style={{ color: primaryColor }}>{org.organizationName}</span>&apos;s
          <br />Learning Hub
        </h1>
        {org.welcomeMessage && (
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-8">{org.welcomeMessage}</p>
        )}
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/auth/register" className="btn-primary px-8 py-4">
            Join as a Learner
          </Link>
          <Link href="/auth/login" className="btn-secondary px-8 py-4">
            Sign In
          </Link>
        </div>
        {seatsLeft < 20 && seatsLeft > 0 && (
          <p className="mt-4 text-sm text-amber-400">⚡ Only {seatsLeft} seats remaining</p>
        )}
      </section>

      {/* Curriculum */}
      {org.customCurriculum.length > 0 && (
        <section className="py-16 max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold mb-2">Your Learning Path</h2>
          <p className="text-gray-400 mb-8 text-sm">
            Courses curated exclusively for {org.organizationName} employees
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {org.customCurriculum.map((course, i) => (
              <div
                key={course.slug}
                className="card p-6 hover:border-brand-500/50 transition-colors cursor-pointer"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold mb-4 text-white"
                  style={{ background: primaryColor }}
                >
                  {i + 1}
                </div>
                <h3 className="font-semibold mb-2">{course.title}</h3>
                {course.description && (
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{course.description}</p>
                )}
                {course.level && (
                  <span className="text-xs text-gray-500 uppercase tracking-wide">{course.level}</span>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Features */}
      <section className="py-16 bg-earth-900/40">
        <div className="max-w-4xl mx-auto px-6 grid md:grid-cols-3 gap-6 text-center">
          {[
            { icon: '🤖', label: 'AfriFlow AI Coach', desc: 'Personal AI tutor in your language' },
            { icon: '📜', label: 'Verified Certificates', desc: 'Blockchain-linked proof of completion' },
            { icon: '📊', label: 'Team Analytics', desc: 'Track progress across your whole team' },
          ].map((f) => (
            <div key={f.label} className="card p-6">
              <span className="text-3xl">{f.icon}</span>
              <h3 className="font-bold mt-3 mb-1">{f.label}</h3>
              <p className="text-sm text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-sm text-gray-600 border-t border-earth-800">
        <p>
          Powered by{' '}
          <Link href="/" className="text-brand-500 hover:underline">AfriFlow AI</Link>
          {' '}· Africa&apos;s AI Operating System
        </p>
      </footer>
    </div>
  )
}
