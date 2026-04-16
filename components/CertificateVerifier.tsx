'use client'

import { useState } from 'react'
import { Search, Loader2, CheckCircle, XCircle, Award, Calendar, GraduationCap } from 'lucide-react'
import { certificatesApi } from '@/lib/api'

export default function CertificateVerifier() {
  const [certId, setCertId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!certId.trim()) return

    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const res = await certificatesApi.verify(certId.trim())
      if (res.data.verified) {
        setResult(res.data.certificate)
      } else {
        setError('Certificate not found')
      }
    } catch {
      setError('Certificate not found or verification failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <form onSubmit={handleVerify} className="flex gap-2">
        <input
          type="text"
          placeholder="Enter certificate ID (e.g., AF-XXXXX-XXXXXX)"
          value={certId}
          onChange={e => setCertId(e.target.value)}
          className="input-field flex-1"
        />
        <button
          type="submit"
          disabled={loading || !certId.trim()}
          className="btn-primary py-2 px-6 whitespace-nowrap"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <><Search size={14} /> Verify</>}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div className="mt-4 p-5 bg-forest-500/10 border border-forest-500/20 rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <CheckCircle size={18} className="text-forest-400" />
            <span className="text-forest-400 font-medium">Certificate Verified ✓</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-earth-300">
              <GraduationCap size={14} className="text-earth-500" />
              <span className="text-earth-500">Recipient:</span>
              <span className="text-white font-medium">{result.userName}</span>
            </div>
            <div className="flex items-center gap-2 text-earth-300">
              <Award size={14} className="text-earth-500" />
              <span className="text-earth-500">Course:</span>
              <span className="text-white font-medium">{result.courseTitle}</span>
            </div>
            <div className="flex items-center gap-2 text-earth-300">
              <Calendar size={14} className="text-earth-500" />
              <span className="text-earth-500">Issued:</span>
              <span>{new Date(result.issuedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 text-earth-300">
              <span className="text-earth-500">Grade:</span>
              <span className={`capitalize font-medium ${result.grade === 'distinction' ? 'text-amber-400' : result.grade === 'merit' ? 'text-brand-400' : 'text-earth-300'}`}>
                {result.grade}
              </span>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-4 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-red-400 text-sm">
          <XCircle size={16} />
          {error}
        </div>
      )}
    </div>
  )
}
