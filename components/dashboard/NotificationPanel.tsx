'use client'

import { useState } from 'react'
import { X, Bell, CheckCircle, BookOpen, Award, Users } from 'lucide-react'

interface Notification {
  id: string
  type: 'course' | 'badge' | 'community' | 'system'
  title: string
  message: string
  time: string
  read: boolean
}

const SAMPLE_NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'course', title: 'New lesson available', message: 'WhatsApp Automation — Lesson 5 just dropped.', time: '2h ago', read: false },
  { id: '2', type: 'badge', title: 'Badge earned! 🏆', message: 'You unlocked "7-Day Streak" — keep going!', time: '1d ago', read: false },
  { id: '3', type: 'community', title: 'Forum reply', message: 'Kwame replied to your question about Zapier.', time: '2d ago', read: true },
  { id: '4', type: 'system', title: 'Welcome to AfriFlow AI', message: 'Start your first lesson and earn 10 XP.', time: '3d ago', read: true },
]

const iconMap = {
  course: <BookOpen size={14} className="text-brand-400" />,
  badge: <Award size={14} className="text-amber-400" />,
  community: <Users size={14} className="text-forest-400" />,
  system: <Bell size={14} className="text-earth-400" />,
}

export default function NotificationPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [notifications, setNotifications] = useState(SAMPLE_NOTIFICATIONS)

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 z-40 bg-earth-950/40" onClick={onClose} />
      )}

      {/* Panel */}
      <div className={`fixed top-0 right-0 bottom-0 w-[360px] max-w-[90vw] z-50 bg-earth-900 border-l border-earth-800 shadow-2xl shadow-earth-950/80 transform transition-transform duration-300 ease-out ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-earth-800">
          <div className="flex items-center gap-2">
            <Bell size={18} className="text-brand-400" />
            <h2 className="text-white font-semibold text-sm">Notifications</h2>
            {unreadCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.5 bg-brand-500 text-white rounded-full font-bold">{unreadCount}</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs text-brand-400 hover:text-brand-300 transition-colors">
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-earth-800 flex items-center justify-center text-earth-500 hover:text-white transition-all">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="overflow-y-auto h-[calc(100%-60px)] p-2">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 p-3 rounded-xl mb-1 transition-colors ${
                n.read ? 'hover:bg-earth-800/50' : 'bg-brand-500/5 hover:bg-brand-500/10'
              }`}
            >
              <div className="w-8 h-8 rounded-lg bg-earth-800 flex items-center justify-center flex-shrink-0 mt-0.5">
                {iconMap[n.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={`text-xs font-medium ${n.read ? 'text-earth-400' : 'text-white'}`}>{n.title}</p>
                  {!n.read && <div className="w-1.5 h-1.5 bg-brand-500 rounded-full flex-shrink-0" />}
                </div>
                <p className="text-earth-500 text-xs leading-relaxed mt-0.5">{n.message}</p>
                <p className="text-earth-700 text-[10px] mt-1">{n.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
