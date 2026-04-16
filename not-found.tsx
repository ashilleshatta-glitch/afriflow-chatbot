import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-earth-950 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="text-8xl mb-6">🌍</div>
        <h1 className="font-display text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-earth-400 text-xl mb-8">This page doesn&apos;t exist — yet.</p>
        <Link href="/" className="btn-primary py-3 px-8">
          <ArrowLeft size={16} /> Back to AfriFlow AI
        </Link>
      </div>
    </div>
  )
}
