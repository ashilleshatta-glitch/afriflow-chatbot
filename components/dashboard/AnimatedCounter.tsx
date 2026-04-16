'use client'

import { useState, useEffect, useRef } from 'react'

/** Counts from 0 to `end` on mount. */
export default function AnimatedCounter({ end, duration = 1200, prefix = '', suffix = '' }: {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
}) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasAnimated.current) return
        hasAnimated.current = true

        const startTime = performance.now()
        const step = (now: number) => {
          const elapsed = now - startTime
          const progress = Math.min(elapsed / duration, 1)
          // Ease out cubic
          const eased = 1 - Math.pow(1 - progress, 3)
          setValue(Math.floor(eased * end))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      },
      { threshold: 0.3 }
    )

    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [end, duration])

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}{value.toLocaleString()}{suffix}
    </span>
  )
}
