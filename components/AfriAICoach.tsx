'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send, X, Minimize2, Maximize2, Zap, Mic, MicOff,
  ThumbsUp, ThumbsDown, Download, RotateCcw, Sparkles
} from 'lucide-react'

/* ─── Types ─── */
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  rating?: 'up' | 'down'
  followUps?: string[]
}

const LS_KEY = 'africoach-chat-history'

const INITIAL_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: "👋 Hi! I'm **AfriAI Coach** — your personal AI guide on AfriFlow AI.\n\nI can help you:\n- Find the right **learning path**\n- Recommend **tools** for your business\n- Answer questions about **AI**\n- Guide your journey from *AI-curious* to *AI-earning*\n\nWhat would you like to learn or build today?",
  timestamp: Date.now(),
  followUps: [
    'Which learning path is best for me?',
    'How can I earn with AI in Ghana?',
    'What tools should I learn first?',
    'How do I automate my business?',
  ],
}

/* ─── Markdown-lite renderer ─── */
function renderMarkdown(text: string) {
  const lines = text.split('\n')
  const elements: React.ReactNode[] = []

  lines.forEach((line, li) => {
    // Headings (### or ##)
    if (/^#{2,3}\s/.test(line)) {
      const heading = line.replace(/^#+\s/, '')
      elements.push(<p key={li} className="font-semibold text-white mt-1.5 mb-0.5">{heading}</p>)
      return
    }

    // Bullet list
    if (/^[-*]\s/.test(line.trim())) {
      const bullet = line.replace(/^[-*]\s/, '').trim()
      elements.push(
        <div key={li} className="flex gap-1.5 ml-0.5 my-0.5">
          <span className="text-brand-400 mt-0.5 text-[10px]">●</span>
          <span>{inlineFormat(bullet)}</span>
        </div>
      )
      return
    }

    // Code block (` ``` `)
    if (line.trim().startsWith('```')) {
      // Skip code fence lines — content between is handled as regular lines with monospace
      return
    }

    // Inline code line detection
    if (line.trim().startsWith('`') && line.trim().endsWith('`') && line.trim().length > 2) {
      elements.push(
        <code key={li} className="block bg-earth-950 text-forest-400 px-2 py-1 rounded text-xs font-mono my-1">
          {line.trim().slice(1, -1)}
        </code>
      )
      return
    }

    // Empty line
    if (line.trim() === '') {
      elements.push(<br key={li} />)
      return
    }

    // Normal paragraph
    elements.push(<p key={li} className="my-0.5">{inlineFormat(line)}</p>)
  })

  return elements
}

function inlineFormat(text: string): React.ReactNode {
  // Bold, italic, inline code
  const parts: React.ReactNode[] = []
  const regex = /(\*\*[^*]+\*\*)|(\*[^*]+\*)|(`[^`]+`)/g
  let lastIdx = 0
  let match: RegExpExecArray | null

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIdx) {
      parts.push(text.slice(lastIdx, match.index))
    }
    const m = match[0]
    if (m.startsWith('**')) {
      parts.push(<strong key={match.index} className="text-white font-semibold">{m.slice(2, -2)}</strong>)
    } else if (m.startsWith('*')) {
      parts.push(<em key={match.index} className="italic text-brand-300">{m.slice(1, -1)}</em>)
    } else if (m.startsWith('`')) {
      parts.push(<code key={match.index} className="bg-earth-950 text-forest-400 px-1 py-0.5 rounded text-xs font-mono">{m.slice(1, -1)}</code>)
    }
    lastIdx = match.index + m.length
  }
  if (lastIdx < text.length) parts.push(text.slice(lastIdx))
  return parts.length === 1 ? parts[0] : <>{parts}</>
}

/* ─── Typing dots animation ─── */
function TypingDots() {
  return (
    <div className="flex items-center gap-1 h-5">
      {[0, 1, 2].map(i => (
        <span
          key={i}
          className="w-1.5 h-1.5 bg-brand-400 rounded-full"
          style={{ animation: `typingBounce 1.2s ease-in-out ${i * 0.15}s infinite` }}
        />
      ))}
    </div>
  )
}

/* ─── Main Component ─── */
export default function AfriAICoach() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const recognitionRef = useRef<any>(null)
  const idCounter = useRef(1)

  /* Load history from localStorage */
  useEffect(() => {
    try {
      const stored = localStorage.getItem(LS_KEY)
      if (stored) {
        const parsed = JSON.parse(stored) as Message[]
        if (parsed.length > 1) setMessages(parsed)
      }
    } catch { /* ignore */ }
  }, [])

  /* Persist to localStorage on change */
  useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(messages))
    } catch { /* ignore */ }
  }, [messages])

  /* Auto-scroll */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  /* Focus input when opening */
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [isOpen, isMinimized])

  const makeId = () => `msg-${Date.now()}-${idCounter.current++}`

  /* ─── Send message ─── */
  const sendMessage = useCallback(async (text?: string) => {
    const messageText = text || input.trim()
    if (!messageText || isLoading) return

    const userMsg: Message = {
      id: makeId(),
      role: 'user',
      content: messageText,
      timestamp: Date.now(),
    }

    setMessages(prev => [...prev, userMsg])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      })

      const data = await response.json()
      const content = data.message || "I'm here to help! Could you rephrase that?"

      // Generate contextual follow-ups
      const followUps = generateFollowUps(content)

      setMessages(prev => [...prev, {
        id: makeId(),
        role: 'assistant',
        content,
        timestamp: Date.now(),
        followUps,
      }])
    } catch {
      setMessages(prev => [...prev, {
        id: makeId(),
        role: 'assistant',
        content: "Sorry, I'm having a connectivity issue. Please try again in a moment!",
        timestamp: Date.now(),
      }])
    } finally {
      setIsLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input, isLoading, messages])

  /* Follow-up generator */
  function generateFollowUps(content: string): string[] {
    const lower = content.toLowerCase()
    const followUps: string[] = []
    if (lower.includes('automat')) followUps.push('Show me automation examples')
    if (lower.includes('business') || lower.includes('earn')) followUps.push('How much can I earn?')
    if (lower.includes('course') || lower.includes('learn')) followUps.push('Which course should I start?')
    if (lower.includes('tool')) followUps.push('Compare the top AI tools')
    if (lower.includes('path')) followUps.push('What are the learning paths?')
    if (followUps.length === 0) {
      followUps.push('Tell me more', 'Give me examples')
    }
    return followUps.slice(0, 3)
  }

  /* Rate message */
  const rateMessage = (id: string, rating: 'up' | 'down') => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, rating } : m))
  }

  /* Voice input */
  const toggleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      return
    }

    if (isListening) {
      recognitionRef.current?.stop()
      setIsListening(false)
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(prev => prev + transcript)
      setIsListening(false)
    }

    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    recognition.start()
    setIsListening(true)
  }

  /* Export conversation */
  const exportChat = () => {
    const text = messages
      .map(m => `[${m.role === 'user' ? 'You' : 'AfriAI Coach'}] ${m.content}`)
      .join('\n\n---\n\n')

    const blob = new Blob([`AfriAI Coach — Conversation Export\n${'='.repeat(40)}\n\n${text}`], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `africoach-chat-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  /* Clear history */
  const clearHistory = () => {
    setMessages([INITIAL_MESSAGE])
    localStorage.removeItem(LS_KEY)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  /* ─── Closed: fab button ─── */
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gradient-to-br from-brand-500 to-forest-500 rounded-2xl shadow-2xl shadow-brand-500/30 flex items-center justify-center hover:scale-110 transition-transform group"
        title="Chat with AfriAI Coach"
        aria-label="Open AfriAI Coach"
      >
        <Zap size={22} className="text-white" fill="white" />
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-forest-400 rounded-full animate-pulse" />
      </button>
    )
  }

  /* ─── Open: chat panel ─── */
  return (
    <div
      className={`fixed bottom-6 right-6 z-50 w-[90vw] sm:w-[380px] rounded-2xl shadow-2xl shadow-earth-950 border border-earth-700 bg-earth-900 flex flex-col origin-bottom-right ${
        isMinimized ? 'h-14' : 'h-[540px]'
      }`}
      style={{ animation: 'springIn 0.4s ease-out' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 p-3.5 border-b border-earth-800">
        <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-forest-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <Zap size={14} className="text-white" fill="white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold">AfriAI Coach</p>
          <p className="text-forest-400 text-xs flex items-center gap-1">
            <span className="w-1.5 h-1.5 bg-forest-400 rounded-full" />
            Online
          </p>
        </div>
        <div className="flex items-center gap-0.5">
          <button onClick={exportChat} className="w-7 h-7 rounded-lg hover:bg-earth-800 flex items-center justify-center text-earth-600 hover:text-earth-300 transition-all" title="Export chat" aria-label="Export chat">
            <Download size={13} />
          </button>
          <button onClick={clearHistory} className="w-7 h-7 rounded-lg hover:bg-earth-800 flex items-center justify-center text-earth-600 hover:text-earth-300 transition-all" title="Clear history" aria-label="Clear history">
            <RotateCcw size={13} />
          </button>
          <button onClick={() => setIsMinimized(!isMinimized)} className="w-7 h-7 rounded-lg hover:bg-earth-800 flex items-center justify-center text-earth-500 hover:text-white transition-all" aria-label={isMinimized ? 'Expand' : 'Minimize'}>
            {isMinimized ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="w-7 h-7 rounded-lg hover:bg-earth-800 flex items-center justify-center text-earth-500 hover:text-white transition-all"
            aria-label="Close"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
            {messages.map((msg) => (
              <div key={msg.id}>
                <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-forest-500 rounded-lg flex items-center justify-center flex-shrink-0 mr-2 mt-0.5">
                      <Zap size={10} className="text-white" fill="white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] rounded-xl px-3.5 py-2.5 text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-brand-500 text-white rounded-tr-sm'
                      : 'bg-earth-800 text-earth-200 rounded-tl-sm'
                  }`}>
                    {msg.role === 'assistant' ? renderMarkdown(msg.content) : msg.content}
                  </div>
                </div>

                {/* Rating buttons for assistant messages */}
                {msg.role === 'assistant' && msg.id !== 'welcome' && (
                  <div className="flex items-center gap-1 ml-8 mt-1">
                    <button
                      onClick={() => rateMessage(msg.id, 'up')}
                      className={`p-1 rounded transition-all ${
                        msg.rating === 'up' ? 'text-forest-400' : 'text-earth-700 hover:text-earth-400'
                      }`}
                      aria-label="Thumbs up"
                    >
                      <ThumbsUp size={12} fill={msg.rating === 'up' ? 'currentColor' : 'none'} />
                    </button>
                    <button
                      onClick={() => rateMessage(msg.id, 'down')}
                      className={`p-1 rounded transition-all ${
                        msg.rating === 'down' ? 'text-red-400' : 'text-earth-700 hover:text-earth-400'
                      }`}
                      aria-label="Thumbs down"
                    >
                      <ThumbsDown size={12} fill={msg.rating === 'down' ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                )}

                {/* Suggested follow-ups */}
                {msg.role === 'assistant' && msg.followUps && msg.followUps.length > 0 && msg.id === messages[messages.length - 1]?.id && !isLoading && (
                  <div className="flex flex-wrap gap-1.5 ml-8 mt-2">
                    {msg.followUps.map((fu) => (
                      <button
                        key={fu}
                        onClick={() => sendMessage(fu)}
                        className="text-[11px] px-2.5 py-1.5 bg-earth-800 hover:bg-earth-750 text-earth-400 hover:text-white rounded-lg transition-all border border-earth-700 hover:border-earth-600 flex items-center gap-1"
                      >
                        <Sparkles size={10} className="text-brand-400" /> {fu}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            
            {/* Typing indicator */}
            {isLoading && (
              <div className="flex items-start gap-2">
                <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-forest-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap size={10} className="text-white" fill="white" />
                </div>
                <div className="bg-earth-800 rounded-xl rounded-tl-sm px-3.5 py-2.5">
                  <TypingDots />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-earth-800">
            <div className="flex items-end gap-2 bg-earth-800 rounded-xl border border-earth-700 focus-within:border-brand-500/50 transition-colors p-2">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything about AI..."
                className="flex-1 bg-transparent text-sm text-earth-200 placeholder-earth-600 resize-none outline-none max-h-24 leading-relaxed"
                rows={1}
              />
              <div className="flex items-center gap-1 flex-shrink-0">
                {/* Voice button */}
                {'webkitSpeechRecognition' in (typeof window !== 'undefined' ? window : {}) && (
                  <button
                    onClick={toggleVoice}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${
                      isListening
                        ? 'bg-red-500/20 text-red-400 animate-pulse'
                        : 'hover:bg-earth-700 text-earth-500 hover:text-white'
                    }`}
                    aria-label={isListening ? 'Stop listening' : 'Voice input'}
                  >
                    {isListening ? <MicOff size={14} /> : <Mic size={14} />}
                  </button>
                )}
                <button
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || isLoading}
                  className="w-8 h-8 bg-brand-500 hover:bg-brand-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                  aria-label="Send message"
                >
                  <Send size={14} className="text-white" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
