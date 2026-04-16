'use client'

import { useEffect, useRef, useCallback } from 'react'

const GRID_SPACING = 40
const DOT_RADIUS = 1
const INFLUENCE_RADIUS = 120
const DOT_COLOR = 'rgba(255, 122, 0, 0.15)'
const DOT_ACTIVE_COLOR = 'rgba(255, 122, 0, 0.5)'

interface Dot {
  x: number
  y: number
  baseAlpha: number
  alpha: number
}

export default function ParticleGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dotsRef = useRef<Dot[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const rafRef = useRef<number>(0)

  const initDots = useCallback((width: number, height: number) => {
    const dots: Dot[] = []
    const cols = Math.ceil(width / GRID_SPACING) + 1
    const rows = Math.ceil(height / GRID_SPACING) + 1

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        dots.push({
          x: c * GRID_SPACING,
          y: r * GRID_SPACING,
          baseAlpha: 0.08 + Math.random() * 0.12,
          alpha: 0,
        })
      }
    }
    dotsRef.current = dots
  }, [])

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const mx = mouseRef.current.x
    const my = mouseRef.current.y

    for (const dot of dotsRef.current) {
      const dx = mx - dot.x
      const dy = my - dot.y
      const dist = Math.sqrt(dx * dx + dy * dy)

      const targetAlpha =
        dist < INFLUENCE_RADIUS
          ? dot.baseAlpha + (1 - dist / INFLUENCE_RADIUS) * 0.6
          : dot.baseAlpha

      // Smooth interpolation
      dot.alpha += (targetAlpha - dot.alpha) * 0.08

      ctx.beginPath()
      ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2)
      ctx.fillStyle =
        dot.alpha > dot.baseAlpha + 0.1 ? DOT_ACTIVE_COLOR : DOT_COLOR
      ctx.globalAlpha = dot.alpha
      ctx.fill()
    }

    ctx.globalAlpha = 1
    rafRef.current = requestAnimationFrame(animate)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`

      const ctx = canvas.getContext('2d')
      ctx?.scale(dpr, dpr)

      initDots(rect.width, rect.height)
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseRef.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      }
    }

    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 }
    }

    // Reduce motion check
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      resize()
      // Draw once, static
      const ctx = canvas.getContext('2d')
      if (ctx) {
        for (const dot of dotsRef.current) {
          ctx.beginPath()
          ctx.arc(dot.x, dot.y, DOT_RADIUS, 0, Math.PI * 2)
          ctx.fillStyle = DOT_COLOR
          ctx.globalAlpha = dot.baseAlpha
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }
      return
    }

    resize()
    rafRef.current = requestAnimationFrame(animate)

    window.addEventListener('resize', resize)
    canvas.addEventListener('mousemove', onMouseMove)
    canvas.addEventListener('mouseleave', onMouseLeave)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mousemove', onMouseMove)
      canvas.removeEventListener('mouseleave', onMouseLeave)
    }
  }, [animate, initDots])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-auto"
      aria-hidden="true"
    />
  )
}
