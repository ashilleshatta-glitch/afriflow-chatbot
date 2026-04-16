'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import {
  ArrowUpRight, RefreshCw, ChevronLeft, CheckCircle, Shield,
  User, DollarSign, AlertTriangle,
} from 'lucide-react'
import toast from 'react-hot-toast'

const CURRENCIES = ['USD', 'EUR', 'GBP', 'NGN', 'KES', 'GHS', 'ZAR', 'EGP', 'USDC']
const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$', EUR: '€', GBP: '£', NGN: '₦', KES: 'KSh', GHS: '₵', ZAR: 'R', EGP: 'E£', USDC: 'USDC ',
}

interface WalletBalance {
  currency: string
  amount: number
  symbol: string
  flag: string
}

export default function SendPage() {
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()

  const [to, setTo] = useState(searchParams.get('to') ?? '')
  const [amount, setAmount] = useState(searchParams.get('amount') ?? '')
  const [currency, setCurrency] = useState(searchParams.get('currency') ?? 'USD')
  const [note, setNote] = useState(searchParams.get('note') ?? '')
  const [balances, setBalances] = useState<WalletBalance[]>([])
  const [sending, setSending] = useState(false)
  const [done, setDone] = useState<{ txId: string; to: string; amount: number; currency: string; fee: number } | null>(null)

  useEffect(() => {
    if (!user) return
    api.get('/pay/wallet').then(res => setBalances(res.data.data.balances)).catch(() => {})
  }, [user])

  const activeBalance = balances.find(b => b.currency === currency)
  const fee = amount ? parseFloat((parseFloat(amount) * 0.015).toFixed(2)) : 0
  const total = amount ? parseFloat(amount) + fee : 0

  const handleSend = async () => {
    if (!to.trim()) { toast.error('Enter a recipient email'); return }
    if (!amount || parseFloat(amount) <= 0) { toast.error('Enter an amount'); return }
    setSending(true)
    try {
      const res = await api.post('/pay/send', {
        toIdentifier: to.trim(),
        amount: parseFloat(amount),
        currency,
        note,
      })
      setDone({
        txId: res.data.data.txId,
        to: res.data.data.to.name,
        amount: res.data.data.amount,
        currency: res.data.data.currency,
        fee: res.data.data.fee,
      })
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      toast.error(msg ?? 'Transfer failed')
    } finally {
      setSending(false)
    }
  }

  if (authLoading) return null
  if (!user) {
    return (
      <div className="min-h-screen bg-earth-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-40">
          <Shield size={32} className="text-brand-400 mb-4" />
          <Link href="/auth/login?next=/pay/send" className="btn-primary px-8 py-3">Sign in to send money</Link>
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

        {done ? (
          /* Success state */
          <div className="card text-center py-10">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-forest-500/20">
              <CheckCircle size={32} className="text-forest-400" />
            </div>
            <h2 className="font-display text-xl font-bold text-white mb-1">Sent!</h2>
            <p className="text-white/50 text-sm mb-6">
              {CURRENCY_SYMBOLS[done.currency]}{done.amount.toFixed(2)} {done.currency} sent to <span className="text-white">{done.to}</span>
            </p>
            <div className="rounded-xl bg-white/5 p-4 mb-6 text-xs text-white/40 space-y-1.5 text-left">
              <div className="flex justify-between"><span>Amount</span><span className="text-white">{done.currency} {done.amount.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Fee (1.5%)</span><span>{done.currency} {done.fee.toFixed(2)}</span></div>
              <div className="flex justify-between border-t border-white/10 pt-1.5"><span>Total deducted</span><span className="text-white font-medium">{done.currency} {(done.amount + done.fee).toFixed(2)}</span></div>
              <div className="flex justify-between pt-1"><span>Tx ID</span><span className="font-mono text-[10px]">{done.txId}</span></div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setDone(null); setTo(''); setAmount(''); setNote('') }}
                className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-white/60 hover:text-white transition-colors">
                Send another
              </button>
              <Link href="/pay" className="flex-1 btn-primary py-3 justify-center text-sm">
                Back to wallet
              </Link>
            </div>
          </div>
        ) : (
          /* Send form */
          <div className="card">
            <h1 className="font-display text-xl font-bold text-white mb-6 flex items-center gap-2">
              <ArrowUpRight size={20} className="text-brand-400" /> Send Money
            </h1>

            <div className="space-y-5">
              {/* Recipient */}
              <div>
                <label className="label">Recipient <span className="text-white/30 font-normal text-xs">(email)</span></label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                  <input value={to} onChange={e => setTo(e.target.value)} placeholder="name@example.com"
                    className="input w-full pl-9" />
                </div>
              </div>

              {/* Amount + currency */}
              <div>
                <label className="label">Amount</label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
                    <input type="number" min="1" value={amount} onChange={e => setAmount(e.target.value)}
                      placeholder="0.00" className="input w-full pl-9" />
                  </div>
                  <select value={currency} onChange={e => setCurrency(e.target.value)} className="input w-28">
                    {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                {activeBalance && (
                  <p className="mt-1 text-xs text-white/30">
                    Available: {activeBalance.symbol}{activeBalance.amount.toFixed(2)} {currency}
                    {total > activeBalance.amount && (
                      <span className="text-red-400 ml-2 flex items-center gap-1 inline-flex">
                        <AlertTriangle size={10} /> Insufficient balance
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* Note */}
              <div>
                <label className="label">Note <span className="text-white/30 font-normal">(optional)</span></label>
                <input value={note} onChange={e => setNote(e.target.value)} placeholder="What's this for?"
                  className="input w-full" maxLength={120} />
              </div>

              {/* Summary */}
              {amount && parseFloat(amount) > 0 && (
                <div className="rounded-xl bg-white/5 p-4 text-xs text-white/40 space-y-1.5">
                  <div className="flex justify-between"><span>Amount</span><span>{currency} {parseFloat(amount).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Platform fee (1.5%)</span><span>{currency} {fee.toFixed(2)}</span></div>
                  <div className="flex justify-between border-t border-white/10 pt-1.5 font-semibold text-white">
                    <span>Total</span><span>{currency} {total.toFixed(2)}</span>
                  </div>
                </div>
              )}

              <button onClick={handleSend} disabled={sending || !to || !amount}
                className="btn-primary w-full py-3 justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                {sending ? <><RefreshCw size={14} className="animate-spin" /> Sending...</> : <><ArrowUpRight size={14} /> Send {currency} {amount ? parseFloat(amount).toFixed(2) : ''}</>}
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  )
}
