import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import {
  BadgeCheck, XCircle, Clock, Shield, BookOpen, Zap,
  Calendar, Award, ExternalLink, Download, Share2,
} from 'lucide-react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

interface VerifyPageProps {
  params: { certificateId: string }
}

export async function generateMetadata({ params }: VerifyPageProps): Promise<Metadata> {
  return {
    title: `Verify Certificate ${params.certificateId} — AfriFlow AI`,
    description: `Verify the authenticity of AfriFlow AI certificate ${params.certificateId}`,
  }
}

async function fetchCertificate(id: string) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'
    const res = await fetch(`${baseUrl}/api/certificates/verify/${id}`, {
      next: { revalidate: 3600 },
    })
    return await res.json()
  } catch {
    return { verified: false, error: 'Unable to reach verification service' }
  }
}

const GRADE_LABELS: Record<string, string> = {
  distinction: 'Distinction',
  merit: 'Merit',
  pass: 'Pass',
}
const GRADE_COLORS: Record<string, string> = {
  distinction: 'text-yellow-400 border-yellow-400/40 bg-yellow-400/10',
  merit: 'text-sky-400 border-sky-400/40 bg-sky-400/10',
  pass: 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10',
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default async function VerifyCertificatePage({ params }: VerifyPageProps) {
  const { certificateId } = params
  const data = await fetchCertificate(certificateId)

  const isValid = data.verified === true && data.status === 'valid'
  const isRevoked = data.status === 'revoked'
  const isExpired = data.status === 'expired'
  const cert = data.certificate

  const linkedInShareUrl = cert
    ? `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        `${process.env.NEXT_PUBLIC_SITE_URL || 'https://afriflowai.com'}/verify/${certificateId}`
      )}&title=${encodeURIComponent(`${cert.userName} earned the ${cert.courseTitle} certificate from AfriFlow AI`)}&summary=${encodeURIComponent('Verified African AI credentials powered by AfriFlow AI')}`
    : '#'

  const twitterShareUrl = cert
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        `🎓 Just verified: ${cert.userName} completed "${cert.courseTitle}" with ${GRADE_LABELS[cert.grade] || 'Pass'} grade on @AfriFlowAI!\n\nVerify: ${process.env.NEXT_PUBLIC_SITE_URL || 'https://afriflowai.com'}/verify/${certificateId}`
      )}`
    : '#'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-earth-950 pt-24 pb-20">
        {/* Background grid */}
        <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6">

          {/* Header */}
          <div className="text-center mb-10">
            <span className="section-tag mb-4">Certificate Verification</span>
            <h1 className="text-3xl md:text-4xl font-bold font-display text-white mb-3">
              AfriFlow AI Verified
            </h1>
            <p className="text-white/60 text-sm">
              Certificate ID: <span className="font-mono text-brand-400">{certificateId}</span>
            </p>
          </div>

          {/* Status Card */}
          <div className={`card border-2 rounded-2xl p-8 mb-8 text-center ${
            isValid
              ? 'border-emerald-500/50 bg-emerald-500/5'
              : isRevoked
              ? 'border-red-500/50 bg-red-500/5'
              : 'border-orange-500/50 bg-orange-500/5'
          }`}>
            {isValid ? (
              <>
                <BadgeCheck className="w-16 h-16 text-emerald-400 mx-auto mb-4 drop-shadow-[0_0_16px_rgba(34,197,94,0.5)]" />
                <h2 className="text-2xl font-bold text-emerald-400 mb-2">✓ Certificate Verified</h2>
                <p className="text-white/70">This is an authentic AfriFlow AI certificate with tamper-proof verification.</p>
              </>
            ) : isRevoked ? (
              <>
                <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-400 mb-2">✗ Certificate Revoked</h2>
                <p className="text-white/70">This certificate has been revoked and is no longer valid.</p>
              </>
            ) : isExpired ? (
              <>
                <Clock className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-orange-400 mb-2">⚠ Certificate Expired</h2>
                <p className="text-white/70">This certificate has passed its expiry date.</p>
              </>
            ) : (
              <>
                <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-red-400 mb-2">✗ Certificate Not Found</h2>
                <p className="text-white/70">{data.error || 'We could not find a certificate with this ID. Please check and try again.'}</p>
              </>
            )}
          </div>

          {/* Certificate Details */}
          {cert && (
            <div className="card rounded-2xl p-8 mb-8">

              {/* AfriFlow seal */}
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/10">
                <div className="w-14 h-14 rounded-2xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center">
                  <Shield className="w-7 h-7 text-brand-400" />
                </div>
                <div>
                  <div className="text-white font-bold text-lg">AfriFlow AI</div>
                  <div className="text-white/50 text-sm">Official Certificate Issuer</div>
                </div>
                {isValid && (
                  <div className="ml-auto flex items-center gap-2 text-emerald-400 text-sm font-medium">
                    <BadgeCheck className="w-4 h-4" />
                    Tamper-Proof
                  </div>
                )}
              </div>

              {/* Holder + Course */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Certificate Holder</div>
                  <div className="text-white text-xl font-bold font-display">{cert.userName}</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Course Completed</div>
                  <div className="text-white font-semibold">{cert.courseTitle}</div>
                  <div className="text-brand-400 text-sm capitalize mt-0.5">{cert.courseSchool} School</div>
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Issue Date</div>
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-4 h-4 text-white/40" />
                    {formatDate(cert.issuedAt)}
                  </div>
                </div>
                <div>
                  <div className="text-white/40 text-xs uppercase tracking-widest mb-1">Expiry Date</div>
                  <div className="flex items-center gap-2 text-white">
                    <Calendar className="w-4 h-4 text-white/40" />
                    {cert.expiryDate ? formatDate(cert.expiryDate) : 'No expiry'}
                  </div>
                </div>
              </div>

              {/* Grade + Score */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border ${GRADE_COLORS[cert.grade] || 'text-white/70 border-white/20 bg-white/5'}`}>
                  <Award className="w-4 h-4" />
                  {GRADE_LABELS[cert.grade] || cert.grade}
                </span>
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border text-white/80 border-white/20 bg-white/5">
                  Score: {cert.score}%
                </span>
                {cert.projectsCompleted > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border text-sky-300 border-sky-400/30 bg-sky-400/10">
                    <BookOpen className="w-4 h-4" />
                    {cert.projectsCompleted} Project{cert.projectsCompleted !== 1 ? 's' : ''}
                  </span>
                )}
                {cert.automationsBuilt > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold border text-purple-300 border-purple-400/30 bg-purple-400/10">
                    <Zap className="w-4 h-4" />
                    {cert.automationsBuilt} Automation{cert.automationsBuilt !== 1 ? 's' : ''} Built
                  </span>
                )}
              </div>

              {/* Skills */}
              {cert.skills && cert.skills.length > 0 && (
                <div className="mb-6">
                  <div className="text-white/40 text-xs uppercase tracking-widest mb-3">Verified Skills</div>
                  <div className="flex flex-wrap gap-2">
                    {cert.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="px-3 py-1 rounded-full text-xs font-medium bg-brand-500/15 text-brand-300 border border-brand-500/20"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Hash Integrity */}
              {isValid && (
                <div className="flex items-center gap-2 text-xs text-white/40 pt-4 border-t border-white/10 font-mono">
                  <Shield className="w-3.5 h-3.5" />
                  Hash verified: {data.certificate?.hashIntact ? '✓ Intact' : '⚠ Mismatch'}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          {cert && isValid && (
            <div className="flex flex-col sm:flex-row gap-3 mb-10">
              <a
                href={linkedInShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#0A66C2] hover:bg-[#0958a8] text-white font-semibold transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Share on LinkedIn
              </a>
              <a
                href={twitterShareUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 border border-[#1DA1F2]/30 text-[#1DA1F2] font-semibold transition-colors"
              >
                <Share2 className="w-4 h-4" />
                Share on X / Twitter
              </a>
            </div>
          )}

          {/* Employer CTA */}
          <div className="card rounded-2xl p-6 text-center bg-brand-500/5 border border-brand-500/20">
            <h3 className="text-white font-bold text-lg mb-2">Are you an Employer?</h3>
            <p className="text-white/60 text-sm mb-4">
              Bulk-verify certificates, search AfriFlow AI graduates by skill, and post jobs — all in one place.
            </p>
            <Link href="/employers" className="btn-primary inline-flex items-center gap-2 text-sm px-6 py-2.5">
              Visit Employer Portal
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>

          {/* Verify another */}
          <div className="mt-8 text-center">
            <Link href="/certificates" className="text-brand-400 hover:text-brand-300 text-sm underline underline-offset-4 transition-colors">
              ← Verify another certificate
            </Link>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
