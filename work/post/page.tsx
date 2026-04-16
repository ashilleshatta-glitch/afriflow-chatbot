'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { useAuth } from '@/context/AuthContext'
import api from '@/lib/api'
import {
  Building, Briefcase, ListChecks, Eye, ChevronRight, ChevronLeft,
  Plus, X, CheckCircle, RefreshCw, Shield, Zap,
} from 'lucide-react'
import toast from 'react-hot-toast'

const STEPS = ['Company', 'Job Details', 'Requirements', 'Preview & Post'] as const

interface FormState {
  // Step 1
  companyName: string
  companyLogoUrl: string
  companySize: string
  companyCountry: string
  // Step 2
  title: string
  description: string
  type: string
  remote: boolean
  location: string
  responsibilities: string[]
  // Step 3
  requiredSkills: string[]
  requiredCertifications: string[]
  niceToHaveSkills: string[]
  requirements: string[]
  minimumVerificationScore: number
  salaryMin: string
  salaryMax: string
  currency: string
  salaryPeriod: string
  applicationDeadline: string
}

const INIT: FormState = {
  companyName: '', companyLogoUrl: '', companySize: '', companyCountry: '',
  title: '', description: '', type: 'fulltime', remote: false, location: '',
  responsibilities: [''],
  requiredSkills: [''], requiredCertifications: [], niceToHaveSkills: [],
  requirements: [''],
  minimumVerificationScore: 0,
  salaryMin: '', salaryMax: '', currency: 'USD', salaryPeriod: 'monthly',
  applicationDeadline: '',
}

const COMPANY_SIZES = ['1–10', '11–50', '51–200', '201–500', '500+']
const JOB_TYPES = [
  { value: 'fulltime', label: 'Full-time' },
  { value: 'parttime', label: 'Part-time' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'internship', label: 'Internship' },
  { value: 'contract', label: 'Contract' },
]

function TagInput({ label, values, onChange, placeholder }: {
  label: string
  values: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}) {
  const [input, setInput] = useState('')
  const add = () => {
    const t = input.trim()
    if (t && !values.includes(t)) onChange([...values, t])
    setInput('')
  }
  return (
    <div>
      <label className="label">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); add() } }}
          placeholder={placeholder}
          className="input flex-1 text-sm"
        />
        <button type="button" onClick={add} className="btn-secondary px-3 py-2 text-sm">
          <Plus size={14} />
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {values.map(v => (
          <span key={v} className="flex items-center gap-1.5 rounded-lg bg-white/8 px-2.5 py-1 text-xs text-white/70">
            {v}
            <button type="button" onClick={() => onChange(values.filter(x => x !== v))} className="text-white/30 hover:text-red-400">
              <X size={10} />
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}

function BulletList({ label, values, onChange, placeholder }: {
  label: string
  values: string[]
  onChange: (v: string[]) => void
  placeholder?: string
}) {
  const update = (i: number, val: string) => { const a = [...values]; a[i] = val; onChange(a) }
  const remove = (i: number) => onChange(values.filter((_, idx) => idx !== i))
  const add = () => onChange([...values, ''])
  return (
    <div>
      <label className="label">{label}</label>
      <div className="space-y-2">
        {values.map((v, i) => (
          <div key={i} className="flex gap-2">
            <input value={v} onChange={e => update(i, e.target.value)} placeholder={placeholder} className="input flex-1 text-sm" />
            {values.length > 1 && (
              <button type="button" onClick={() => remove(i)} className="text-white/20 hover:text-red-400 px-1">
                <X size={14} />
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={add} className="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1">
          <Plus size={12} /> Add item
        </button>
      </div>
    </div>
  )
}

export default function PostJobPage() {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [form, setForm] = useState<FormState>(INIT)
  const [submitting, setSubmitting] = useState(false)

  const set = <K extends keyof FormState>(k: K, v: FormState[K]) =>
    setForm(f => ({ ...f, [k]: v }))

  const stepIcons = [Building, Briefcase, ListChecks, Eye]

  const validateStep = (): boolean => {
    if (step === 0) {
      if (!form.companyName.trim()) { toast.error('Company name is required'); return false }
      if (!form.companyCountry.trim()) { toast.error('Company country is required'); return false }
    }
    if (step === 1) {
      if (!form.title.trim()) { toast.error('Job title is required'); return false }
      if (!form.description.trim() || form.description.length < 50) {
        toast.error('Description must be at least 50 characters'); return false
      }
    }
    if (step === 2) {
      const skills = form.requiredSkills.filter(Boolean)
      if (!skills.length) { toast.error('Add at least one required skill'); return false }
    }
    return true
  }

  const handleSubmit = async () => {
    if (!user) { router.push('/auth/login?next=/work/post'); return }
    setSubmitting(true)
    try {
      const payload = {
        ...form,
        responsibilities: form.responsibilities.filter(Boolean),
        requirements: form.requirements.filter(Boolean),
        requiredSkills: form.requiredSkills.filter(Boolean),
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        applicationDeadline: form.applicationDeadline || undefined,
      }
      const res = await api.post('/work/jobs', payload)
      toast.success('Job posted successfully!')
      router.push(`/work/${res.data.data._id}`)
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { error?: string } } })?.response?.data?.error
      toast.error(msg ?? 'Failed to post job')
    } finally {
      setSubmitting(false)
    }
  }

  if (isLoading) return null

  if (!user) {
    return (
      <div className="min-h-screen bg-earth-950">
        <Navbar />
        <div className="flex flex-col items-center justify-center pt-40">
          <Shield size={40} className="text-brand-400 mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Sign in to post a job</h2>
          <p className="text-white/40 mb-6 text-sm">Reach Africa&apos;s top AI-verified talent</p>
          <Link href="/auth/login?next=/work/post" className="btn-primary px-8 py-3">Sign in</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 pt-24">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-2xl font-bold text-white">Post a Job</h1>
          <p className="text-white/40 text-sm mt-1">Reach AfriFlow&apos;s verified talent network</p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {STEPS.map((label, i) => {
              const Icon = stepIcons[i]
              return (
                <div key={i} className="flex flex-1 items-center">
                  <div className={`flex flex-col items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
                    <div className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-all
                      ${i === step ? 'border-brand-500 bg-brand-500 text-white' :
                        i < step ? 'border-forest-500 bg-forest-500/20 text-forest-400' :
                        'border-white/10 bg-white/5 text-white/20'}`}>
                      {i < step ? <CheckCircle size={16} /> : <Icon size={16} />}
                    </div>
                    <span className={`mt-1.5 hidden text-[10px] font-medium sm:block ${i === step ? 'text-brand-400' : 'text-white/20'}`}>
                      {label}
                    </span>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className={`mb-5 h-px flex-1 transition-all ${i < step ? 'bg-forest-500/40' : 'bg-white/10'}`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Step content */}
        <div className="card">

          {/* Step 1 — Company */}
          {step === 0 && (
            <div className="space-y-5">
              <h2 className="font-semibold text-white text-lg">Company Details</h2>
              <div>
                <label className="label">Company Name *</label>
                <input value={form.companyName} onChange={e => set('companyName', e.target.value)} className="input w-full" placeholder="e.g. Andela, Flutterwave" />
              </div>
              <div>
                <label className="label">Country *</label>
                <input value={form.companyCountry} onChange={e => set('companyCountry', e.target.value)} className="input w-full" placeholder="e.g. Nigeria, Kenya, South Africa" />
              </div>
              <div>
                <label className="label">Company Size</label>
                <div className="flex flex-wrap gap-2">
                  {COMPANY_SIZES.map(s => (
                    <button key={s} type="button" onClick={() => set('companySize', s)}
                      className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${form.companySize === s ? 'border-brand-500 bg-brand-500/20 text-brand-300' : 'border-white/10 text-white/50 hover:border-white/20'}`}>
                      {s} employees
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label">Company Logo URL</label>
                <input value={form.companyLogoUrl} onChange={e => set('companyLogoUrl', e.target.value)} className="input w-full" placeholder="https://..." />
              </div>
            </div>
          )}

          {/* Step 2 — Job Details */}
          {step === 1 && (
            <div className="space-y-5">
              <h2 className="font-semibold text-white text-lg">Job Details</h2>
              <div>
                <label className="label">Job Title *</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} className="input w-full" placeholder="e.g. Senior AI Engineer" />
              </div>
              <div>
                <label className="label">Employment Type</label>
                <div className="flex flex-wrap gap-2">
                  {JOB_TYPES.map(t => (
                    <button key={t.value} type="button" onClick={() => set('type', t.value)}
                      className={`rounded-xl border px-3 py-1.5 text-sm transition-colors ${form.type === t.value ? 'border-brand-500 bg-brand-500/20 text-brand-300' : 'border-white/10 text-white/50 hover:border-white/20'}`}>
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => set('remote', !form.remote)}
                  className={`h-6 w-11 rounded-full transition-colors ${form.remote ? 'bg-brand-500' : 'bg-white/10'} relative`}>
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${form.remote ? 'translate-x-5' : 'translate-x-0.5'}`} />
                </button>
                <span className="text-sm text-white/70">Remote position</span>
              </div>
              {!form.remote && (
                <div>
                  <label className="label">Location</label>
                  <input value={form.location} onChange={e => set('location', e.target.value)} className="input w-full" placeholder="e.g. Lagos, Nigeria" />
                </div>
              )}
              <div>
                <label className="label">Description * <span className="text-white/30 font-normal">(min 50 chars)</span></label>
                <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={5}
                  className="input w-full resize-none text-sm" placeholder="Describe the role, team, and impact..." />
                <p className="mt-1 text-right text-xs text-white/20">{form.description.length} chars</p>
              </div>
              <BulletList label="Responsibilities" values={form.responsibilities} onChange={v => set('responsibilities', v)} placeholder="e.g. Build and maintain ML pipelines" />
            </div>
          )}

          {/* Step 3 — Requirements */}
          {step === 2 && (
            <div className="space-y-5">
              <h2 className="font-semibold text-white text-lg">Requirements & Compensation</h2>
              <BulletList label="Requirements" values={form.requirements} onChange={v => set('requirements', v)} placeholder="e.g. 3+ years Python experience" />
              <TagInput label="Required Skills *" values={form.requiredSkills.filter(Boolean)} onChange={v => set('requiredSkills', v)} placeholder="Press Enter to add skill" />
              <TagInput label="Required AfriFlow Certifications" values={form.requiredCertifications} onChange={v => set('requiredCertifications', v)} placeholder="e.g. Machine Learning Fundamentals" />
              <TagInput label="Nice to Have Skills" values={form.niceToHaveSkills} onChange={v => set('niceToHaveSkills', v)} placeholder="e.g. Rust, Go" />
              <div>
                <label className="label">Minimum AfriFlow Verification Score <span className="text-white/30 font-normal">(0–100)</span></label>
                <input type="number" min={0} max={100} value={form.minimumVerificationScore}
                  onChange={e => set('minimumVerificationScore', Number(e.target.value))}
                  className="input w-32" />
                <p className="mt-1 text-xs text-white/30">0 = no minimum. Applicants below this score see a warning.</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Min Salary</label>
                  <input type="number" value={form.salaryMin} onChange={e => set('salaryMin', e.target.value)} className="input w-full" placeholder="e.g. 2000" />
                </div>
                <div>
                  <label className="label">Max Salary</label>
                  <input type="number" value={form.salaryMax} onChange={e => set('salaryMax', e.target.value)} className="input w-full" placeholder="e.g. 5000" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Currency</label>
                  <select value={form.currency} onChange={e => set('currency', e.target.value)} className="input w-full">
                    {['USD', 'EUR', 'GBP', 'NGN', 'KES', 'ZAR', 'GHS', 'EGP'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Period</label>
                  <select value={form.salaryPeriod} onChange={e => set('salaryPeriod', e.target.value)} className="input w-full">
                    <option value="monthly">Monthly</option>
                    <option value="annual">Annual</option>
                    <option value="per_project">Per project</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="label">Application Deadline</label>
                <input type="date" value={form.applicationDeadline} onChange={e => set('applicationDeadline', e.target.value)}
                  min={new Date().toISOString().split('T')[0]} className="input w-full" />
              </div>
            </div>
          )}

          {/* Step 4 — Preview */}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-semibold text-white text-lg">Preview</h2>
              {/* Job card preview */}
              <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-xl font-bold text-white/30">
                    {form.companyLogoUrl ? <img src={form.companyLogoUrl} alt="" className="h-11 w-11 rounded-xl object-contain" /> : form.companyName?.[0] ?? 'C'}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{form.title || 'Job Title'}</h3>
                    <p className="text-sm text-white/50">{form.companyName || 'Company'} · {form.companyCountry || 'Country'}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-white/40">
                      <span>{JOB_TYPES.find(t => t.value === form.type)?.label}</span>
                      {form.remote ? <span className="text-forest-400">Remote</span> : <span>{form.location}</span>}
                      {form.salaryMin && <span className="text-forest-400">{form.currency} {form.salaryMin}{form.salaryMax ? `–${form.salaryMax}` : '+'}/{form.salaryPeriod === 'monthly' ? 'mo' : form.salaryPeriod === 'annual' ? 'yr' : 'proj'}</span>}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-sm text-white/60 leading-relaxed line-clamp-3">{form.description}</p>
                {form.requiredSkills.filter(Boolean).length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {form.requiredSkills.filter(Boolean).map(s => (
                      <span key={s} className="rounded-md bg-white/8 px-2 py-0.5 text-xs text-white/50">{s}</span>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-start gap-2 rounded-xl border border-brand-500/20 bg-brand-500/5 p-3 text-xs text-brand-300">
                <Zap size={13} className="mt-0.5 shrink-0" />
                Your listing will be reviewed and go live within minutes. Candidates will apply instantly using their AfriFlow IDs.
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-white/50 hover:text-white transition-colors disabled:opacity-0"
            >
              <ChevronLeft size={14} /> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => { if (validateStep()) setStep(s => s + 1) }}
                className="btn-primary flex items-center gap-2 px-6 py-2.5"
              >
                Next <ChevronRight size={14} />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="btn-primary flex items-center gap-2 px-8 py-2.5 disabled:opacity-60"
              >
                {submitting ? <><RefreshCw size={14} className="animate-spin" /> Posting...</> : <><CheckCircle size={14} /> Post Job</>}
              </button>
            )}
          </div>
        </div>

      </div>
      <Footer />
    </div>
  )
}
