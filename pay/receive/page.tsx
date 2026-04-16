'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import {
  ArrowDownLeft, ChevronLeft, RefreshCw, Copy, Check, Shield, QrCode,
} from 'lucide-react'
import toast from 'react-hot-toast'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'NGN', 'KES', 'GHS', 'ZAR', 'EGP', 'USDC']

export default function ReceivePage() {
  const { user, isLoading: authLoading } = useAuth()
  const [amount, setAmount] = useState('')
  const [currency, setCurrency] = useState('USD')
  const [note, setNote] = useState('')
  const [link, setLink] = useState<string | null>(null)
  const [qrData, setQrData] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const generate = async () => {
    setGenerating(true)
    try {
      const params = new URLSearchParams({ currency })
      if (amount) params.set('amount', amount)
      if (note) params.set('note', note)
      const res = await api.get(`/pay/receive?${params.toString()}`)
      setLink(res.data.data.link)
      setQrData(res.data.data.qrData)
    } catch {
      toast.error('Failed to generate payment link')
    } finally {
      setGenerating(false)
    }
  }

  const copyLink = () => {
    if (!link) return
    navigator.clipboard.writeText(link).then(() => {
      setCopied(true)
      toast.success('Link copied!')
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // Auto-generate default link on load
  useEffect(() => {
    if (user) generate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  if (authLoading) return null
  if (!user) {
    return (
      <div className="min-h-screen bg-earth-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-40">
          <Shield size={32} className="text-brand-400 mb-4" />
          <Link href="/auth/login?next=/pay/receive" className="btn-primary px-8 py-3">Sign in to receive money</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="mx-auto max-w-md px-4 py-10 sm:px-6 pt-24">
        <Link href="/pay" className="mb-6 inline-flex items-center gap-1.5 text-sm text-white/40 hover:text-white transition-colors">
          <ChevronLeft size={14} /> Back to wallet
        </Link>

        <div className="card">
          <h1 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
            <ArrowDownLeft size={20} className="text-forest-400" /> Receive Money
          </h1>

          <div className="space-y-5">
            {/* Optional amount */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="label">Amount <span className="text-white/30 font-normal">(optional)</span></label>
                <input type="number" min="0" value={amount} onChange={e => setAmount(e.target.value)}
                  placeholder="Any amount" className="input w-full" />
              </div>
              <div>
                <label className="label">Currency</label>
                <select value={currency} onChange={e => setCurrency(e.target.value)} className="input">
                  {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div>
              <label className="label">Note <span className="text-white/30 font-normal">(optional)</span></label>
              <input value={note} onChange={e => setNote(e.target.value)}
                placeholder="e.g. Freelance invoice #42" className="input w-full" maxLength={120} />
            </div>

            <button onClick={generate} disabled={generating}
              className="btn-primary w-full py-2.5 justify-center gap-2 disabled:opacity-50">
              {generating ? <RefreshCw size={14} className="animate-spin" /> : <QrCode size={14} />}
              Generate Payment Link
            </button>
          </div>

          {link && (
            <div className="mt-6 space-y-4">
              {/* QR placeholder */}
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-white text-earth-950">
                  <QrCode size={64} />
                </div>
                <p className="text-xs text-white/30 text-center">Scan with any AfriFlow-compatible wallet</p>
              </div>

              {/* Copy link */}
              <div>
                <label className="label text-xs">Payment Link</label>
                <div className="flex gap-2">
                  <input readOnly value={link} className="input flex-1 text-xs text-white/50 font-mono" />
                  <button onClick={copyLink}
                    className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm transition-all ${copied ? 'border-forest-500/40 bg-forest-500/10 text-forest-400' : 'border-white/10 text-white/50 hover:text-white'}`}>
                    {copied ? <><Check size={13} /> Copied</> : <><Copy size={13} /> Copy</>}
                  </button>
                </div>
              </div>

              {/* Share options */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: 'WhatsApp', emoji: '💬', href: `https://wa.me/?text=${encodeURIComponent(`Pay me on AfriFlow: ${link}`)}` },
                  { label: 'Telegram', emoji: '✈️', href: `https://t.me/share/url?url=${encodeURIComponent(link)}` },
                  { label: 'Email', emoji: '📧', href: `mailto:?subject=AfriFlow%20Payment&body=${encodeURIComponent(`Please send payment here: ${link}`)}` },
                ].map(opt => (
                  <a key={opt.label} href={opt.href} target="_blank" rel="noopener noreferrer"
                    className="flex flex-col items-center gap-1 rounded-xl border border-white/10 py-3 text-xs text-white/50 hover:border-white/20 hover:text-white transition-colors">
                    <span className="text-xl">{opt.emoji}</span>
                    {opt.label}
                  </a>
                ))}
              </div>

              <p className="text-center text-xs text-white/20">
                Anyone with this link can send you money via AfriFlow Pay
              </p>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}
