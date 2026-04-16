'use client'

import { useState } from 'react'
import { Share2, Twitter, Linkedin, Copy, CheckCircle, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface ShareProgressProps {
  type: 'certificate' | 'course' | 'achievement'
  title: string
  subtitle?: string
  stats?: { label: string; value: string }[]
  userName?: string
}

export default function ShareProgress({ type, title, subtitle, stats, userName }: ShareProgressProps) {
  const [showModal, setShowModal] = useState(false)

  const shareText = type === 'certificate'
    ? `🏆 I just earned my "${title}" certificate from @AfriFlowAI! Africa's #1 AI learning platform. #AIAfrica #AfriFlowAI`
    : type === 'achievement'
    ? `🎖️ Achievement unlocked: "${title}" on @AfriFlowAI! Building AI skills for Africa. #AIAfrica #AfriFlowAI`
    : `📚 Making progress on "${title}" at @AfriFlowAI! Learning AI skills to build income in Africa. #AIAfrica #AfriFlowAI`

  const shareUrl = 'https://afriflowai.com'

  const shareToTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank')
  }

  const shareToLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`)
    toast.success('Copied to clipboard!')
  }

  const typeConfig = {
    certificate: { emoji: '🏆', gradient: 'from-amber-500 to-yellow-600', label: 'Certificate Earned' },
    course: { emoji: '📚', gradient: 'from-brand-500 to-forest-500', label: 'Course Progress' },
    achievement: { emoji: '🎖️', gradient: 'from-purple-500 to-pink-500', label: 'Achievement Unlocked' },
  }

  const config = typeConfig[type]

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 px-3 py-1.5 bg-earth-800 hover:bg-earth-700 border border-earth-700 rounded-lg text-earth-300 hover:text-white text-sm transition-all"
        aria-label="Share progress"
      >
        <Share2 size={14} /> Share
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-earth-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowModal(false)}>
          <div className="bg-earth-900 border border-earth-700 rounded-2xl max-w-md w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            {/* Card preview */}
            <div className={`relative bg-gradient-to-br ${config.gradient} rounded-t-2xl p-8 text-center overflow-hidden`}>
              <div className="absolute inset-0 bg-grid opacity-20" />
              <div className="relative">
                <span className="text-5xl mb-4 block">{config.emoji}</span>
                <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-2">{config.label}</p>
                <h3 className="text-white text-xl font-bold mb-1">{title}</h3>
                {subtitle && <p className="text-white/70 text-sm">{subtitle}</p>}
                {userName && <p className="text-white/60 text-xs mt-3">Earned by {userName}</p>}
                {stats && stats.length > 0 && (
                  <div className="flex items-center justify-center gap-6 mt-4">
                    {stats.map(s => (
                      <div key={s.label} className="text-center">
                        <div className="text-white text-lg font-bold">{s.value}</div>
                        <div className="text-white/60 text-xs">{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mt-4 text-white/50 text-xs">afriflowai.com</div>
              </div>
            </div>

            {/* Share options */}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-white font-semibold">Share your achievement</h4>
                <button onClick={() => setShowModal(false)} className="text-earth-500 hover:text-white transition-colors">
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={shareToTwitter}
                  className="flex flex-col items-center gap-2 p-4 bg-earth-800 hover:bg-[#1DA1F2]/10 border border-earth-700 hover:border-[#1DA1F2]/30 rounded-xl transition-all group"
                >
                  <Twitter size={20} className="text-earth-400 group-hover:text-[#1DA1F2]" />
                  <span className="text-earth-400 group-hover:text-white text-xs">Twitter/X</span>
                </button>
                <button
                  onClick={shareToLinkedIn}
                  className="flex flex-col items-center gap-2 p-4 bg-earth-800 hover:bg-[#0A66C2]/10 border border-earth-700 hover:border-[#0A66C2]/30 rounded-xl transition-all group"
                >
                  <Linkedin size={20} className="text-earth-400 group-hover:text-[#0A66C2]" />
                  <span className="text-earth-400 group-hover:text-white text-xs">LinkedIn</span>
                </button>
                <button
                  onClick={copyLink}
                  className="flex flex-col items-center gap-2 p-4 bg-earth-800 hover:bg-earth-700 border border-earth-700 rounded-xl transition-all group"
                >
                  <Copy size={20} className="text-earth-400 group-hover:text-brand-400" />
                  <span className="text-earth-400 group-hover:text-white text-xs">Copy</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
