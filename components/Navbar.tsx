'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Menu, X, Zap, ChevronDown, ArrowRight,
  BookOpen, Briefcase, Palette, Wrench,
  Target, Globe, LogOut, User, Bell, Trophy, Award, Shield,
  FlaskConical, Users, BarChart3, CreditCard, Wallet, Send,
  Download, Building2, GraduationCap, Rocket, Flame, Hash,
  Settings, TrendingUp, MapPin, Star, CheckCircle, DollarSign,
  Search, PlayCircle, FileText, Layers, Cpu, HeartHandshake
} from 'lucide-react'
import { SCHOOLS } from '@/lib/data'
import { useAuth } from '@/context/AuthContext'
import { notificationsApi } from '@/lib/api'

/* ─── Mega menu data ─── */
const NAV_GROUPS = [
  {
    key: 'learn',
    label: 'Learn',
    href: '/courses',
    sections: [
      {
        title: 'Schools',
        items: 'schools' as const,
      },
      {
        title: 'Explore',
        items: [
          { href: '/courses', icon: BookOpen,    label: 'All Courses',      desc: 'Browse the full catalogue' },
          { href: '/paths',   icon: MapPin,       label: 'Career Paths',     desc: '4 structured AI tracks' },
          { href: '/lab',     icon: FlaskConical, label: 'Automation Lab',   desc: '12 hands-on AI projects' },
          { href: '/templates', icon: FileText,   label: 'Templates',        desc: '40+ blueprints & prompts' },
          { href: '/challenge', icon: Flame,      label: '30-Day Challenge',  desc: 'Build an AI habit in 30 days' },
          { href: '/certificates', icon: Award,   label: 'Certificates',     desc: 'Verified credentials for your work' },
        ],
      },
    ],
    featured: {
      label: 'New to AI?',
      title: 'AI for Africa — Beginners',
      desc: 'Start from zero in 3 hours. No coding needed.',
      badge: 'FREE',
      href: '/courses?school=ai-fundamentals',
    },
  },
  {
    key: 'work',
    label: 'Work',
    href: '/work',
    sections: [
      {
        title: 'For Talent',
        items: [
          { href: '/work',                  icon: Search,       label: 'Browse Jobs',          desc: 'AI & tech roles across Africa' },
          { href: '/dashboard/my-id',       icon: Shield,       label: 'AfriFlow ID',          desc: 'Your verified work identity' },
          { href: '/dashboard/applications',icon: FileText,     label: 'My Applications',      desc: 'Track where you applied' },
          { href: '/benchmark',             icon: BarChart3,    label: 'AI Skills Benchmark',  desc: 'See where you rank' },
        ],
      },
      {
        title: 'For Employers',
        items: [
          { href: '/work/post',             icon: Briefcase,    label: 'Post a Job',           desc: 'Reach verified AI talent' },
          { href: '/work/employers',        icon: Building2,    label: 'Employer Portal',      desc: 'Manage your listings' },
          { href: '/schools',               icon: GraduationCap,label: 'For Schools & Orgs',   desc: 'Train your team with AfriFlow' },
          { href: '/business',              icon: TrendingUp,   label: 'AI for Business',      desc: 'ROI-driven AI transformation' },
        ],
      },
    ],
    featured: null,
  },
  {
    key: 'pay',
    label: 'Pay',
    href: '/pay',
    sections: [
      {
        title: 'AfriFlow Pay',
        items: [
          { href: '/pay',               icon: Wallet,       label: 'My Wallet',           desc: 'Balances & transaction history' },
          { href: '/pay/send',          icon: Send,         label: 'Send Money',          desc: 'Transfer to anyone instantly' },
          { href: '/pay/receive',       icon: Download,     label: 'Receive Money',       desc: 'Generate a payment link' },
          { href: '/dashboard/earnings',icon: DollarSign,   label: 'Earnings & Payouts',  desc: 'Withdraw your income' },
          { href: '/automate',          icon: Cpu,          label: 'Automate Payments',   desc: 'Set up recurring workflows' },
        ],
      },
    ],
    featured: {
      label: 'Pay across Africa',
      title: 'Mobile Money · Cards · Crypto',
      desc: 'Send & receive in 15+ African currencies with zero cross-border fees.',
      badge: 'LIVE',
      href: '/pay',
    },
  },
  {
    key: 'community',
    label: 'Community',
    href: '/community',
    sections: [
      {
        title: 'Connect',
        items: [
          { href: '/community',         icon: Users,        label: 'Community Hub',       desc: 'Forums, events & chapters' },
          { href: '/leaderboard',       icon: Trophy,       label: 'Leaderboard',         desc: 'Top learners across Africa' },
          { href: '/mentors',           icon: HeartHandshake,label: 'Mentors',            desc: 'Book a 1:1 session' },
          { href: '/blog',              icon: Hash,         label: 'Blog & Insights',     desc: 'AI stories from the continent' },
        ],
      },
      {
        title: 'Platforms',
        items: [
          { href: '/whatsapp-academy',  icon: PlayCircle,   label: 'WhatsApp Academy',    desc: 'Learn AI on WhatsApp — free' },
          { href: '/employers',         icon: Layers,       label: 'Employer Network',    desc: 'Connect with hiring companies' },
        ],
      },
    ],
    featured: null,
  },
  {
    key: 'pricing',
    label: 'Pricing',
    href: '/pricing',
    sections: null,
    featured: null,
  },
]

type GroupKey = 'learn' | 'work' | 'pay' | 'community' | 'pricing'

export default function Navbar() {
  const [isScrolled, setIsScrolled]           = useState(false)
  const [scrollProgress, setScrollProgress]   = useState(0)
  const [isMobileOpen, setIsMobileOpen]       = useState(false)
  const [activeMega, setActiveMega]           = useState<GroupKey | null>(null)
  const [mobileExpanded, setMobileExpanded]   = useState<GroupKey | null>(null)
  const [showUserMenu, setShowUserMenu]       = useState(false)
  const [unreadCount, setUnreadCount]         = useState(0)
  const [showNotifDropdown, setShowNotifDropdown] = useState(false)
  const [notifications, setNotifications]     = useState<any[]>([])

  const pathname  = usePathname()
  const router    = useRouter()
  const leaveTimer = useRef<NodeJS.Timeout | null>(null)
  const { isAuthenticated, user, logout } = useAuth()

  const isLearningPage = ['/courses', '/paths', '/lab'].some(p => pathname.startsWith(p))

  /* Notifications */
  useEffect(() => {
    if (!isAuthenticated) return
    const fetchNotifs = async () => {
      try {
        const res  = await notificationsApi.list(5)
        const data = res.data
        setUnreadCount(data.unreadCount || 0)
        setNotifications(data.notifications || [])
      } catch {}
    }
    fetchNotifs()
    const id = setInterval(fetchNotifs, 30_000)
    return () => clearInterval(id)
  }, [isAuthenticated])

  /* Scroll */
  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 20)
      if (isLearningPage) {
        const docH = document.documentElement.scrollHeight - window.innerHeight
        setScrollProgress(docH > 0 ? (window.scrollY / docH) * 100 : 0)
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [isLearningPage])

  /* Reset on route change */
  useEffect(() => {
    setIsMobileOpen(false)
    setActiveMega(null)
    setShowNotifDropdown(false)
    setShowUserMenu(false)
    setMobileExpanded(null)
  }, [pathname])

  /* Body lock */
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileOpen])

  const openMega  = useCallback((key: GroupKey) => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
    setActiveMega(key)
  }, [])
  const closeMega = useCallback(() => {
    leaveTimer.current = setTimeout(() => setActiveMega(null), 300)
  }, [])
  const keepMega  = useCallback(() => {
    if (leaveTimer.current) clearTimeout(leaveTimer.current)
  }, [])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-earth-950/96 backdrop-blur-xl border-b border-earth-800/80 shadow-xl shadow-earth-950/60'
            : 'bg-transparent'
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group flex-shrink-0" aria-label="AfriFlow AI Home">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-forest-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-brand-500/20">
                <Zap size={16} className="text-white" fill="white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                AfriFlow<span className="text-brand-400"> AI</span>
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-0.5">
              {NAV_GROUPS.map((group) => {
                const isActive = pathname.startsWith(group.href) && group.href !== '/'
                const isOpen   = activeMega === group.key
                const hasMega  = !!group.sections

                return (
                  <div
                    key={group.key}
                    className="relative"
                    onMouseEnter={() => hasMega && openMega(group.key as GroupKey)}
                    onMouseLeave={() => hasMega && closeMega()}
                  >
                    {/* Extend hover area downward to bridge gap to panel */}
                    {hasMega && isOpen && (
                      <div className="absolute bottom-0 left-0 right-0 h-4 -mb-4" onMouseEnter={keepMega} />
                    )}

                    <Link
                      href={group.href}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'text-white bg-earth-800/60'
                          : 'text-earth-400 hover:text-white hover:bg-earth-800/40'
                      }`}
                    >
                      {group.key === 'pricing' && <Star size={13} className="text-amber-400" />}
                      {group.label}
                      {hasMega && (
                        <ChevronDown
                          size={13}
                          className={`transition-transform duration-200 mt-px ${isOpen ? 'rotate-180 text-brand-400' : 'text-earth-600'}`}
                        />
                      )}
                    </Link>

                    {/* Mega panel */}
                    {hasMega && isOpen && group.sections && (
                      <div
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-1 z-50"
                        onMouseEnter={keepMega}
                        onMouseLeave={closeMega}
                      >
                        <div className={`bg-earth-900 border border-earth-700/80 rounded-2xl shadow-2xl shadow-earth-950/90 overflow-hidden ${
                          group.key === 'learn'     ? 'w-[720px]' :
                          group.key === 'work'      ? 'w-[640px]' :
                          group.key === 'pay'       ? 'w-[560px]' :
                          group.key === 'community' ? 'w-[560px]' : 'w-[360px]'
                        }`}>

                          {/* Top stripe */}
                          <div className="h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />

                          <div className="flex">
                            {/* Sections */}
                            <div className={`flex-1 p-5 ${group.featured ? 'border-r border-earth-800/60' : ''}`}>
                              <div className={`grid gap-6 ${group.sections.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                {group.sections.map((section, si) => (
                                  <div key={si}>
                                    <p className="text-earth-600 text-[10px] font-semibold uppercase tracking-widest mb-2.5">{section.title}</p>

                                    {/* Schools special render */}
                                    {section.items === 'schools' ? (
                                      <div className="space-y-0.5">
                                        {SCHOOLS.map((school) => (
                                          <Link
                                            key={school.id}
                                            href={`/courses?school=${school.id}`}
                                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-earth-800/70 transition-colors group/s"
                                          >
                                            <span className="text-xl leading-none w-7 text-center">{school.icon}</span>
                                            <div>
                                              <p className="text-sm text-earth-300 group-hover/s:text-white transition-colors font-medium leading-tight">{school.name}</p>
                                              <p className="text-xs text-earth-600 leading-tight mt-0.5">View courses</p>
                                            </div>
                                          </Link>
                                        ))}
                                      </div>
                                    ) : (
                                      <div className="space-y-0.5">
                                        {(section.items as any[]).map((item: any) => {
                                          const Icon = item.icon
                                          return (
                                            <Link
                                              key={item.href}
                                              href={item.href}
                                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-earth-800/70 transition-colors group/i"
                                            >
                                              <div className="w-8 h-8 rounded-lg bg-earth-800 border border-earth-700/50 flex items-center justify-center flex-shrink-0 group-hover/i:bg-earth-700 group-hover/i:border-earth-600 transition-all">
                                                <Icon size={14} className="text-earth-400 group-hover/i:text-brand-300 transition-colors" />
                                              </div>
                                              <div>
                                                <p className="text-sm text-earth-300 group-hover/i:text-white transition-colors font-medium leading-tight">{item.label}</p>
                                                <p className="text-xs text-earth-600 leading-tight mt-0.5">{item.desc}</p>
                                              </div>
                                              <ArrowRight size={12} className="text-earth-700 ml-auto opacity-0 group-hover/i:opacity-100 group-hover/i:text-brand-400 transition-all -translate-x-1 group-hover/i:translate-x-0" />
                                            </Link>
                                          )
                                        })}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Featured card */}
                            {group.featured && (
                              <div className="w-52 flex-shrink-0 p-5">
                                <p className="text-earth-600 text-[10px] font-semibold uppercase tracking-widest mb-3">{group.featured.label}</p>
                                <Link
                                  href={group.featured.href}
                                  className="block rounded-xl bg-gradient-to-br from-brand-500/10 to-forest-500/8 border border-brand-500/20 p-4 hover:border-brand-500/40 hover:from-brand-500/15 transition-all group/feat"
                                >
                                  <span className={`inline-flex text-[10px] font-bold px-2 py-0.5 rounded-full mb-3 ${
                                    group.featured.badge === 'FREE' ? 'bg-forest-500/20 text-forest-400' : 'bg-brand-500/20 text-brand-400'
                                  }`}>
                                    {group.featured.badge}
                                  </span>
                                  <p className="text-white font-semibold text-sm leading-snug mb-2">{group.featured.title}</p>
                                  <p className="text-earth-500 text-xs leading-relaxed mb-4">{group.featured.desc}</p>
                                  <span className="flex items-center gap-1 text-brand-400 text-xs font-medium group-hover/feat:gap-2 transition-all">
                                    Get started <ArrowRight size={11} />
                                  </span>
                                </Link>

                                <div className="mt-4 pt-4 border-t border-earth-800/60 space-y-2">
                                  <div className="flex items-center gap-2 text-xs text-earth-500">
                                    <CheckCircle size={12} className="text-forest-500" /> 24,000+ members
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-earth-500">
                                    <CheckCircle size={12} className="text-forest-500" /> 15 African countries
                                  </div>
                                  <div className="flex items-center gap-2 text-xs text-earth-500">
                                    <CheckCircle size={12} className="text-forest-500" /> Free to start
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Right — Auth */}
            <div className="hidden lg:flex items-center gap-2 flex-shrink-0">
              {isAuthenticated ? (
                <>
                  {/* Bell */}
                  <div className="relative">
                    <button
                      onClick={() => { setShowNotifDropdown(v => !v); setShowUserMenu(false) }}
                      className="relative w-9 h-9 rounded-lg hover:bg-earth-800/60 flex items-center justify-center text-earth-400 hover:text-white transition-colors"
                      aria-label="Notifications"
                    >
                      <Bell size={17} />
                      {unreadCount > 0 && (
                        <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-brand-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                    </button>
                    {showNotifDropdown && (
                      <div className="absolute right-0 top-full mt-1.5 w-80 bg-earth-900 border border-earth-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-3 border-b border-earth-800">
                          <h4 className="text-white text-sm font-semibold">Notifications</h4>
                          {unreadCount > 0 && (
                            <button
                              onClick={async () => {
                                try { await notificationsApi.markRead(); setUnreadCount(0); setNotifications(p => p.map(n => ({ ...n, isRead: true }))) } catch {}
                              }}
                              className="text-xs text-brand-400 hover:text-brand-300"
                            >Mark all read</button>
                          )}
                        </div>
                        <div className="max-h-72 overflow-y-auto divide-y divide-earth-800/50">
                          {notifications.length > 0 ? notifications.map((n: any) => (
                            <div key={n._id} className={`flex items-start gap-3 px-4 py-3 hover:bg-earth-800/30 transition-colors ${!n.isRead ? 'bg-brand-500/5' : ''}`}>
                              <span className="text-base flex-shrink-0 mt-0.5">{n.icon || '🔔'}</span>
                              <div className="flex-1 min-w-0">
                                <p className="text-earth-200 text-xs font-medium">{n.title}</p>
                                <p className="text-earth-500 text-xs mt-0.5 truncate">{n.message}</p>
                              </div>
                              {!n.isRead && <span className="w-1.5 h-1.5 bg-brand-500 rounded-full flex-shrink-0 mt-1.5" />}
                            </div>
                          )) : (
                            <div className="py-10 text-center">
                              <Bell size={22} className="mx-auto text-earth-700 mb-2" />
                              <p className="text-earth-600 text-xs">No notifications yet</p>
                            </div>
                          )}
                        </div>
                        <Link
                          href="/dashboard"
                          className="block px-4 py-3 text-center text-xs text-brand-400 hover:text-brand-300 border-t border-earth-800 hover:bg-earth-800/30 transition-colors"
                          onClick={() => setShowNotifDropdown(false)}
                        >View all in dashboard →</Link>
                      </div>
                    )}
                  </div>

                  {/* User menu */}
                  <div className="relative">
                    <button
                      onClick={() => { setShowUserMenu(v => !v); setShowNotifDropdown(false) }}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-earth-800/50 transition-colors"
                    >
                      <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-forest-500 rounded-full flex items-center justify-center text-white text-xs font-bold ring-2 ring-brand-500/20">
                        {user?.name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm text-earth-300 max-w-[90px] truncate">{user?.name?.split(' ')[0]}</span>
                      <ChevronDown size={12} className={`text-earth-500 transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                    </button>
                    {showUserMenu && (
                      <div className="absolute right-0 top-full mt-1.5 w-52 bg-earth-900 border border-earth-700 rounded-xl shadow-2xl p-1.5 z-50">
                        <div className="px-3 py-2 mb-1">
                          <p className="text-white text-sm font-semibold truncate">{user?.name}</p>
                          <p className="text-earth-500 text-xs truncate">{user?.email}</p>
                        </div>
                        <div className="border-t border-earth-800 mb-1" />
                        {[
                          { href: '/dashboard',             icon: BarChart3,   label: 'Dashboard' },
                          { href: '/dashboard/my-id',       icon: Shield,      label: 'My AfriFlow ID',  accent: 'text-brand-400' },
                          { href: '/certificates',          icon: Award,       label: 'Certificates' },
                          { href: '/leaderboard',           icon: Trophy,      label: 'Leaderboard' },
                          { href: '/dashboard/settings',    icon: Settings,    label: 'Settings' },
                        ].map(m => {
                          const Icon = m.icon
                          return (
                            <Link key={m.href} href={m.href}
                              className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-earth-300 hover:text-white hover:bg-earth-800 transition-colors"
                              onClick={() => setShowUserMenu(false)}>
                              <Icon size={14} className={m.accent || 'text-earth-500'} />
                              {m.label}
                            </Link>
                          )
                        })}
                        <div className="border-t border-earth-800 my-1" />
                        <button
                          onClick={() => { logout(); setShowUserMenu(false); router.push('/') }}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-400 hover:text-red-300 hover:bg-earth-800 transition-colors w-full"
                        >
                          <LogOut size={14} /> Sign out
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth/login" className="text-sm font-medium text-earth-400 hover:text-white transition-colors px-3 py-2">
                    Sign in
                  </Link>
                  <Link href="/auth/register" className="btn-primary py-2 px-5 text-sm">
                    Start Free <ArrowRight size={14} />
                  </Link>
                </>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              className="lg:hidden text-earth-300 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-earth-800/50"
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileOpen}
            >
              {isMobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Scroll progress bar */}
        {isLearningPage && isScrolled && (
          <div className="scroll-progress-bar w-full" style={{ transform: `scaleX(${scrollProgress / 100})` }} />
        )}
      </nav>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-earth-950/70 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        className={`fixed top-0 right-0 bottom-0 w-[320px] z-50 bg-earth-950 border-l border-earth-800 lg:hidden transform transition-transform duration-300 ease-out flex flex-col ${
          isMobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-earth-800 flex-shrink-0">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileOpen(false)}>
            <div className="w-7 h-7 bg-gradient-to-br from-brand-500 to-forest-500 rounded-lg flex items-center justify-center">
              <Zap size={14} className="text-white" fill="white" />
            </div>
            <span className="font-display font-bold text-lg text-white">
              AfriFlow<span className="text-brand-400"> AI</span>
            </span>
          </Link>
          <button
            onClick={() => setIsMobileOpen(false)}
            className="w-8 h-8 rounded-lg bg-earth-800 flex items-center justify-center text-earth-400 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <X size={17} />
          </button>
        </div>

        {/* Drawer body */}
        <div className="flex-1 overflow-y-auto py-3 px-3">
          {NAV_GROUPS.map((group) => {
            const isGroupActive = pathname.startsWith(group.href) && group.href !== '/'
            const isExpanded    = mobileExpanded === group.key
            const hasSubs       = !!group.sections

            return (
              <div key={group.key} className="mb-0.5">
                {hasSubs ? (
                  <>
                    <button
                      onClick={() => setMobileExpanded(isExpanded ? null : group.key as GroupKey)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        isGroupActive ? 'text-brand-400 bg-brand-500/8' : 'text-earth-300 hover:text-white hover:bg-earth-800/60'
                      }`}
                    >
                      <span>{group.label}</span>
                      <ChevronDown size={15} className={`text-earth-500 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                    {isExpanded && (
                      <div className="mt-1 ml-4 pl-3 border-l border-earth-800 space-y-0.5 pb-2">
                        {group.sections!.map((section, si) => (
                          <div key={si} className="mb-3">
                            <p className="text-earth-600 text-[10px] font-semibold uppercase tracking-widest px-2 py-1.5">{section.title}</p>
                            {section.items === 'schools' ? (
                              SCHOOLS.map(school => (
                                <Link key={school.id} href={`/courses?school=${school.id}`}
                                  className="flex items-center gap-2.5 px-2 py-2 rounded-lg text-sm text-earth-400 hover:text-white hover:bg-earth-800/50 transition-colors"
                                  onClick={() => setIsMobileOpen(false)}>
                                  <span>{school.icon}</span> {school.name}
                                </Link>
                              ))
                            ) : (
                              (section.items as any[]).map((item: any) => {
                                const Icon = item.icon
                                return (
                                  <Link key={item.href} href={item.href}
                                    className="flex items-center gap-2.5 px-2 py-2.5 rounded-lg text-sm text-earth-400 hover:text-white hover:bg-earth-800/50 transition-colors group/mi"
                                    onClick={() => setIsMobileOpen(false)}>
                                    <Icon size={14} className="text-earth-600 group-hover/mi:text-brand-400 flex-shrink-0" />
                                    <div>
                                      <p className="font-medium text-earth-300 group-hover/mi:text-white leading-tight">{item.label}</p>
                                      <p className="text-earth-600 text-xs leading-tight">{item.desc}</p>
                                    </div>
                                  </Link>
                                )
                              })
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={group.href}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      isGroupActive ? 'text-brand-400 bg-brand-500/8' : 'text-earth-300 hover:text-white hover:bg-earth-800/60'
                    }`}
                    onClick={() => setIsMobileOpen(false)}
                  >
                    {group.key === 'pricing' && <Star size={13} className="text-amber-400" />}
                    {group.label}
                  </Link>
                )}
              </div>
            )
          })}

          {/* Divider */}
          <div className="my-4 border-t border-earth-800" />

          {/* Secondary links */}
          {[
            { href: '/challenge', label: '🔥 30-Day Challenge' },
            { href: '/benchmark', label: '📊 AI Benchmark' },
            { href: '/leaderboard', label: '🏆 Leaderboard' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className="flex items-center px-4 py-2.5 rounded-xl text-sm text-earth-500 hover:text-white hover:bg-earth-800/60 transition-colors"
              onClick={() => setIsMobileOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>

        {/* Drawer footer */}
        <div className="flex-shrink-0 p-4 border-t border-earth-800 bg-earth-950">
          {isAuthenticated ? (
            <div className="space-y-2">
              <div className="flex items-center gap-3 px-3 py-2 mb-1">
                <div className="w-9 h-9 bg-gradient-to-br from-brand-500 to-forest-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-white text-sm font-medium truncate">{user?.name}</p>
                  <p className="text-earth-500 text-xs truncate">{user?.email}</p>
                </div>
              </div>
              <Link href="/dashboard" className="btn-primary w-full justify-center py-3 text-sm" onClick={() => setIsMobileOpen(false)}>
                Dashboard
              </Link>
              <button
                onClick={() => { logout(); setIsMobileOpen(false); router.push('/') }}
                className="w-full text-center py-2 text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Sign out
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              <Link href="/auth/register" className="btn-primary w-full justify-center py-3 text-sm" onClick={() => setIsMobileOpen(false)}>
                <Zap size={15} /> Start Free — It&apos;s $0
              </Link>
              <Link href="/auth/login" className="block text-center py-2 text-earth-400 hover:text-white text-sm transition-colors" onClick={() => setIsMobileOpen(false)}>
                Already have an account? Sign in
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
