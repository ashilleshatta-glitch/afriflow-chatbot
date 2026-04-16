'use client'

import { useState, useEffect, useCallback } from 'react'

const WORDS = ['Learn AI', 'Automate Work', 'Build Income', 'Change Africa']
const TYPE_SPEED = 80
const DELETE_SPEED = 50
const PAUSE_DURATION = 2000

export default function TypewriterText() {
  const [wordIndex, setWordIndex] = useState(0)
  const [text, setText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  const tick = useCallback(() => {
    const currentWord = WORDS[wordIndex]

    if (!isDeleting) {
      setText(currentWord.slice(0, text.length + 1))
      if (text.length + 1 === currentWord.length) {
        setTimeout(() => setIsDeleting(true), PAUSE_DURATION)
        return
      }
    } else {
      setText(currentWord.slice(0, text.length - 1))
      if (text.length - 1 === 0) {
        setIsDeleting(false)
        setWordIndex((prev) => (prev + 1) % WORDS.length)
        return
      }
    }
  }, [text, isDeleting, wordIndex])

  useEffect(() => {
    const speed = isDeleting ? DELETE_SPEED : TYPE_SPEED
    const timer = setTimeout(tick, speed)
    return () => clearTimeout(timer)
  }, [tick, isDeleting])

  return (
    <span className="gradient-text inline-block min-w-[4ch]">
      {text}
      <span className="inline-block w-[3px] h-[0.9em] bg-brand-400 ml-0.5 align-middle animate-blink" />
    </span>
  )
}
