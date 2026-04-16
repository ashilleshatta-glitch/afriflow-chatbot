'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/AfriAICoach'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import {
  Wallet, ArrowUpRight, ArrowDownLeft, RefreshCw, Clock,
  CheckCircle, XCircle, AlertTriangle, Plus, ChevronRight,
  DollarSign, Shield, Zap, CreditCard, Smartphone, Globe,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface Balance {
  currency: string
  amount: number
  name: string
  symbol: string
  flag: string
}

interface WalletData {
  id: string
  balances: Balance[]
  defaultCurrency: string
  totalEarned: number
  totalSpent: number
  totalPaidOut: number
  kycLevel: number
  isSuspended: boolean
  linkedAccounts: { _id: string; type: string; provider: string; identifier: string; label?: string; isVerified: boolean }[]
}

interface Tx {
  _id: string
  direction: 'credit' | 'debit'
  amount: number
  currency: string
  netAmount: number
  fee: number
  type: string
  status: string
  description: string
  note?: string
  createdAt: string
  fromUserId?: { name: string; email: string }
  toUserId?: { name: string; email: string }
}

const TX_ICON: Record<string, string> = {
  course_purchase: '📚', instructor_earning: '💰', payout: '🏦',
  peer_transfer: '↔️', freelance_payment: '💼', subscription: '🔄',
  reward: '⭐', bonus: '🎁', topup: '➕', adjustment: '⚙️', fee: '💸', course_refund: '↩️',
}

const STATUS_BADGE: Record<string, string> = {
  completed: 'bg-forest-500/15 text-forest-400',
  pending:   'bg-amber-500/15 text-amber-400',
  failed:    'bg-red-500/15 text-red-400',
  reversed:  'bg-white/10 text-white/40',
}

function timeAgo(d: string) {
  const diff = Math.floor((Date.now() - new Date(d).getTime()) / 60000)
  if (diff < 1) return 'just now'
  if (diff < 60) return `${diff}m ago`
  if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
  return new Date(d).toLocaleDateString()
}

export default function PayPage() {
  const { user, isLoading: authLoading } = useAuth()
  const [wallet, setWallet] = useState<WalletData | null>(null)
  const [txs, setTxs] = useState<Tx[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCurrency, setActiveCurrency] = useState<string>('')
  const [txPage, setTxPage] = useState(1)
  const [txHasMore, setTxHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const load = useCallback(async () => {
    try {
      const [wRes, tRes] = await Promise.all([
        api.get('/pay/wallet'),
        api.get('/pay/transactions?limit=10&page=1'),
      ])
      setWallet(wRes.data.data)
      setActiveCurrency(wRes.data.data.defaultCurrency)
      setTxs(tRes.data.data)
      setTxHasMore(tRes.data.hasMore)
      setTxPage(1)
    } catch {
      toast.error('Failed to load wallet')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading && user) load()
  }, [user, authLoading, load])

  const loadMore = async () => {
    setLoadingMore(true)
    try {
      const res = await api.get(`/pay/transactions?limit=10&page=${txPage + 1}`)
      setTxs(p => [...p, ...res.data.data])
      setTxHasMore(res.data.hasMore)
      setTxPage(p => p + 1)
    } catch {
      toast.error('Failed to load more')
    } finally {
      setLoadingMore(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-earth-950">
        <Navbar />
        <div className="flex justify-center pt-40"><RefreshCw className="h-7 w-7 animate-spin text-brand-500" /></div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-earth-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-40 text-center">
          <Wallet size={36} className="text-brand-400 mb-4" />
          <p className="text-white/60 mb-4">Sign in to access your AfriFlow wallet</p>
          <Link href="/auth/login?next=/pay" className="btn-primary px-8 py-3">Sign in</Link>
        </div>
      </div>
    )
  }

  const activeBalance = wallet?.balances.find(b => b.currency === activeCurrency)
  const totalUSD = wallet?.balances.reduce((s, b) => {
    const rates: Record<string, number> = {
      USD: 1, EUR: 1.08, GBP: 1.27, NGN: 0.00063, KES: 0.0077,
      GHS: 0.068, ZAR: 0.054, EGP: 0.021, USDC: 1,
    }
    return s + b.amount * (rates[b.currency] ?? 1)
  }, 0) ?? 0

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8 pt-24">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="font-display text-2xl font-bold text-white">AfriFlow Pay</h1>
            <p className="text-white/40 text-sm mt-1">Your Africa-native payment wallet</p>
          </div>
          {wallet?.isSuspended && (
            <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm text-red-400">
              <AlertTriangle size={14} /> Wallet suspended — contact support
            </div>
          )}
        </div>

        <div className="flex flex-col gap-6 lg:flex-row">

          {/* ─── Left column ─── */}
          <div className="flex-1 min-w-0 space-y-5">

            {/* Balance card */}
            <div className="rounded-2xl border border-brand-500/20 bg-gradient-to-br from-brand-900/40 to-earth-900 p-6">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm text-white/40">Total balance</p>
                <button onClick={load} className="text-white/20 hover:text-white/60 transition-colors">
                  <RefreshCw size={14} />
                </button>
              </div>
              <p className="font-display text-4xl font-bold text-white">
                ${totalUSD.toFixed(2)} <span className="text-base font-normal text-white/30">USD equiv.</span>
              </p>

              {/* Currency tabs */}
              <div className="mt-5 flex flex-wrap gap-2">
                {wallet?.balances.map(b => (
                  <button key={b.currency} onClick={() => setActiveCurrency(b.currency)}
                    className={`rounded-xl border px-3 py-1.5 text-sm font-medium transition-colors ${activeCurrency === b.currency ? 'border-brand-500 bg-brand-500/20 text-brand-300' : 'border-white/10 text-white/40 hover:border-white/20 hover:text-white/70'}`}>
                    {b.flag} {b.currency} {b.symbol}{b.amount.toFixed(2)}
                  </button>
                ))}
              </div>

              {activeBalance && (
                <div className="mt-4 rounded-xl bg-white/5 px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-white/30">{activeBalance.name} balance</p>
                    <p className="text-xl font-bold text-white mt-0.5">{activeBalance.symbol}{activeBalance.amount.toFixed(2)}</p>
                  </div>
                  <span className="text-2xl">{activeBalance.flag}</span>
                </div>
              )}

              {/* Action buttons */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Link href="/pay/send" className="flex items-center justify-center gap-2 rounded-xl bg-white text-earth-950 font-semibold py-3 text-sm hover:bg-white/90 transition-colors">
                  <ArrowUpRight size={16} /> Send
                </Link>
                <Link href="/pay/receive" className="flex items-center justify-center gap-2 rounded-xl border border-white/15 text-white font-semibold py-3 text-sm hover:border-white/25 transition-colors">
                  <ArrowDownLeft size={16} /> Receive
                </Link>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Total Earned', value: `$${wallet?.totalEarned.toFixed(2) ?? '0.00'}`, icon: ArrowDownLeft, color: 'text-forest-400' },
                { label: 'Total Spent', value: `$${wallet?.totalSpent.toFixed(2) ?? '0.00'}`, icon: ArrowUpRight, color: 'text-white/60' },
                { label: 'Total Paid Out', value: `$${wallet?.totalPaidOut.toFixed(2) ?? '0.00'}`, icon: DollarSign, color: 'text-amber-400' },
              ].map(({ label, value, icon: Icon, color }) => (
                <div key={label} className="card text-center">
                  <Icon size={16} className={`mx-auto mb-1.5 ${color}`} />
                  <p className="font-bold text-white text-base">{value}</p>
                  <p className="text-[11px] text-white/30 mt-0.5">{label}</p>
                </div>
              ))}
            </div>

            {/* Transaction history */}
            <div className="card">
              <div className="flex items-center justify-between mb-5">
                <h2 className="font-semibold text-white">Transaction History</h2>
                <Link href="/dashboard/earnings" className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                  Earnings →
                </Link>
              </div>

              {txs.length === 0 ? (
                <div className="py-10 text-center">
                  <Clock size={28} className="mx-auto mb-3 text-white/10" />
                  <p className="text-white/30 text-sm">No transactions yet</p>
                  <Link href="/pay/send" className="mt-3 inline-block text-xs text-brand-400 hover:text-brand-300">
                    Send your first payment →
                  </Link>
                </div>
              ) : (
                <div className="space-y-1">
                  {txs.map(tx => (
                    <div key={tx._id} className="flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-white/5 transition-colors">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-base">
                        {TX_ICON[tx.type] ?? '💳'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">{tx.description}</p>
                        <p className="text-xs text-white/30 mt-0.5">{timeAgo(tx.createdAt)}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-semibold ${tx.direction === 'credit' ? 'text-forest-400' : 'text-white/70'}`}>
                          {tx.direction === 'credit' ? '+' : '−'}{tx.currency} {tx.amount.toFixed(2)}
                        </p>
                        <span className={`text-[10px] rounded-full px-1.5 py-0.5 ${STATUS_BADGE[tx.status] ?? STATUS_BADGE.pending}`}>
                          {tx.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {txHasMore && (
                <button onClick={loadMore} disabled={loadingMore}
                  className="mt-4 w-full rounded-xl border border-white/10 py-2.5 text-sm text-white/50 hover:text-white transition-colors disabled:opacity-50">
                  {loadingMore ? <RefreshCw size={13} className="animate-spin mx-auto" /> : 'Load more'}
                </button>
              )}
            </div>
          </div>

          {/* ─── Right sidebar ─── */}
          <aside className="lg:w-64 shrink-0 space-y-4">

            {/* KYC status */}
            <div className="card">
              <h3 className="mb-3 text-sm font-semibold text-white/70 uppercase tracking-wider">Verification</h3>
              <div className="flex items-center gap-2 mb-2">
                {[0, 1, 2, 3].map(level => (
                  <div key={level} className={`flex-1 h-1.5 rounded-full transition-colors ${(wallet?.kycLevel ?? 0) >= level ? 'bg-forest-500' : 'bg-white/10'}`} />
                ))}
              </div>
              <p className="text-xs text-white/40">
                {['Unverified', 'Email verified', 'ID verified', 'Fully verified'][wallet?.kycLevel ?? 0]}
              </p>
              {(wallet?.kycLevel ?? 0) < 2 && (
                <Link href="/dashboard/settings" className="mt-3 block rounded-xl border border-amber-500/20 bg-amber-500/5 px-3 py-2 text-xs text-amber-400 hover:bg-amber-500/10 transition-colors">
                  <Shield size={11} className="inline mr-1.5" /> Verify to enable payouts →
                </Link>
              )}
            </div>

            {/* Linked accounts */}
            <div className="card">
              <h3 className="mb-3 text-sm font-semibold text-white/70 uppercase tracking-wider">Payment Methods</h3>
              {wallet?.linkedAccounts.length === 0 ? (
                <p className="text-xs text-white/30 mb-3">No payment methods linked.</p>
              ) : (
                <div className="space-y-2 mb-3">
                  {wallet?.linkedAccounts.map(a => (
                    <div key={a._id} className="flex items-center gap-2 text-xs text-white/60">
                      {a.type === 'mobilemoney' ? <Smartphone size={12} className="text-brand-400" /> :
                       a.type === 'crypto' ? <Globe size={12} className="text-amber-400" /> :
                       <CreditCard size={12} className="text-white/30" />}
                      <span className="flex-1 truncate">{a.provider} · {a.identifier}</span>
                      {a.isVerified && <CheckCircle size={10} className="text-forest-400 shrink-0" />}
                    </div>
                  ))}
                </div>
              )}
              <button className="w-full rounded-xl border border-dashed border-white/15 py-2 text-xs text-white/30 hover:border-white/30 hover:text-white/60 transition-colors flex items-center justify-center gap-1">
                <Plus size={11} /> Link account
              </button>
            </div>

            {/* Quick links */}
            <div className="card">
              <h3 className="mb-3 text-sm font-semibold text-white/70 uppercase tracking-wider">Quick Links</h3>
              <div className="space-y-1">
                {[
                  { href: '/pay/send', icon: ArrowUpRight, label: 'Send Money' },
                  { href: '/pay/receive', icon: ArrowDownLeft, label: 'Receive Money' },
                  { href: '/dashboard/earnings', icon: DollarSign, label: 'Earnings & Payouts' },
                  { href: '/courses', icon: Zap, label: 'Earn as Instructor' },
                ].map(({ href, icon: Icon, label }) => (
                  <Link key={href} href={href} className="flex items-center gap-2.5 rounded-xl px-2 py-2 text-sm text-white/50 hover:bg-white/5 hover:text-white transition-colors group">
                    <Icon size={13} className="group-hover:text-brand-400 transition-colors" />
                    {label}
                    <ChevronRight size={11} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            </div>

          </aside>
        </div>
      </div>
      <Footer />
      <AfriAICoach />
    </div>
  )
}
