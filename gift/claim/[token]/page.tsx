'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { Gift, CheckCircle, Zap, ArrowRight, AlertCircle, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface GiftData {
  gifterName: string
  recipientName: string
  recipientEmail: string
  plan: string
  message: string
  amountChargedUSD: number
}

const PLAN_LABELS: Record<string, string> = {
  '1month': '1 Month Premium',
  '6months': '6 Months Premium',
  '12months': '1 Year Premium',
  'scholarship': '1 Month Premium (Scholarship)',
}

export default function ClaimPage({ params }: { params: { token: string } }) {
  const [giftData, setGiftData]   = useState<GiftData | null>(null)
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState('')
  const [claiming, setClaiming]   = useState(false)
  const [claimed, setClaimed]     = useState(false)
  const [userId, setUserId]       = useState('')
  const router = useRouter()

  useEffect(() => {
    async function fetchGift() {
      try {
        const res = await fetch(`/api/gift/claim/${params.token}`)
        const json = await res.json()
        if (!res.ok) {
          setError(json.error || 'Invalid claim link')
        } else {
          setGiftData(json.data)
        }
      } catch {
        setError('Failed to load gift details')
      } finally {
        setLoading(false)
      }
    }
    fetchGift()
  }, [params.token])

  const handleClaim = async () => {
    if (!userId.trim()) {
      setError('Enter your AfriFlow user ID to claim.')
      return
    }
    setClaiming(true)
    setError('')
    try {
      const res = await fetch(`/api/gift/claim/${params.token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Claim failed')
      setClaimed(true)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
    } finally {
      setClaiming(false)
    }
  }

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="pt-16 min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-lg w-full">

          {loading && (
            <div className="text-center">
              <Loader2 size={40} className="text-brand-400 animate-spin mx-auto mb-4" />
              <p className="text-earth-400">Loading your gift...</p>
            </div>
          )}

          {!loading && error && !giftData && (
            <div className="card text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={32} className="text-red-400" />
              </div>
              <h2 className="text-white font-bold text-xl mb-2">Something went wrong</h2>
              <p className="text-earth-400 mb-6">{error}</p>
              <Link href="/gift" className="btn-secondary">Send a gift instead</Link>
            </div>
          )}

          {!loading && giftData && !claimed && (
            <div className="space-y-6">
              {/* Gift header */}
              <div className="card text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-500/5 to-forest-500/5" />
                <div className="relative">
                  <div className="text-5xl mb-3">🎁</div>
                  <p className="text-earth-400 text-sm mb-2">You&apos;ve received a gift from</p>
                  <h1 className="font-display text-2xl font-bold text-white mb-1">{giftData.gifterName}</h1>
                  <span className="inline-flex text-xs font-bold px-3 py-1 bg-brand-500/20 text-brand-300 rounded-full">
                    {PLAN_LABELS[giftData.plan] || giftData.plan}
                  </span>
                </div>
              </div>

              {/* Personal message */}
              {giftData.message && (
                <div className="card-glow">
                  <p className="text-earth-500 text-xs uppercase tracking-widest mb-2">Their message to you</p>
                  <blockquote className="text-earth-200 leading-relaxed italic">&ldquo;{giftData.message}&rdquo;</blockquote>
                </div>
              )}

              {/* What they get */}
              <div className="card">
                <p className="text-white font-semibold mb-3">What you now have access to:</p>
                <div className="grid grid-cols-2 gap-2">
                  {['50+ AI courses', 'Unlimited AI Coach', 'All templates', 'Verified certificates', 'Automation Lab', 'Mentor sessions'].map(f => (
                    <div key={f} className="flex items-center gap-2 text-sm text-earth-300">
                      <CheckCircle size={12} className="text-forest-400 flex-shrink-0" /> {f}
                    </div>
                  ))}
                </div>
              </div>

              {/* Claim form */}
              <div className="card">
                <h3 className="text-white font-bold mb-4">Activate your gift</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-earth-400 text-sm mb-3">
                      Already have an account? Sign in first, then enter your user ID below.
                      New here? <Link href="/auth/register" className="text-brand-400 hover:text-brand-300">Create a free account</Link> — it takes 60 seconds.
                    </p>
                    <label className="text-earth-400 text-xs font-medium mb-1.5 block">Your AfriFlow User ID</label>
                    <input className="input-field" placeholder="Paste your user ID from dashboard/settings"
                      value={userId} onChange={e => setUserId(e.target.value)} />
                    <p className="text-earth-600 text-xs mt-1">Find this in Dashboard → Settings → Account</p>
                  </div>
                  {error && <p className="text-red-400 text-sm">{error}</p>}
                  <button onClick={handleClaim} disabled={claiming}
                    className="btn-primary w-full justify-center py-4 disabled:opacity-60">
                    {claiming ? <><Loader2 size={16} className="animate-spin" /> Activating...</> : <><Zap size={16} /> Activate my Premium access</>}
                  </button>
                </div>
              </div>
            </div>
          )}

          {claimed && (
            <div className="card text-center">
              <div className="w-20 h-20 bg-forest-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-forest-400" />
              </div>
              <h2 className="font-display text-3xl font-bold text-white mb-2">You&apos;re in!</h2>
              <p className="text-earth-300 text-lg mb-6">
                Premium access is now active on your account. Time to build something amazing.
              </p>
              <div className="flex flex-col gap-3">
                <Link href="/courses" className="btn-primary justify-center py-4">
                  <Zap size={16} /> Start learning now <ArrowRight size={16} />
                </Link>
                <Link href="/dashboard" className="btn-secondary justify-center py-3">
                  Go to my dashboard
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  )
}
