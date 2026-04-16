'use client'

import { useState, useEffect, useRef } from 'react'
import { Users } from 'lucide-react'

export default function LiveCounter() {
  const [count, setCount] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    // Random initial count between 340 and 420
    const initial = Math.floor(Math.random() * 80) + 340
    setCount(initial)

    intervalRef.current = setInterval(() => {
      // Randomly increment or decrement by 1-3
      setCount((prev) => {
        const delta = Math.random() > 0.3 ? Math.floor(Math.random() * 3) + 1 : -1
        return Math.max(200, prev + delta)
      })
    }, 3000 + Math.random() * 4000)

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  if (count === 0) return null

  return (
    <div className="inline-flex items-center gap-2 bg-forest-500/10 border border-forest-500/20 text-forest-400 text-sm font-medium px-4 py-2 rounded-full">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-forest-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-forest-400" />
      </span>
      <Users size={14} />
      <span>
        <span className="font-bold tabular-nums">{count}</span> learners online now
      </span>
    </div>
  )
}
