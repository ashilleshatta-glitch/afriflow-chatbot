'use client'

import { useState } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Link from 'next/link'

const ENDPOINTS = [
  {
    method: 'GET',
    path: '/api/v1/verify/certificate/:certificateId',
    title: 'Verify Certificate',
    desc: 'Verify an AfriFlow certificate by its unique ID. Returns holder name, course, grade, and skills. No API key required.',
    auth: false,
    plans: ['free', 'starter', 'growth', 'enterprise'],
    example: {
      js: `const res = await fetch(
  'https://afriflowai.com/api/v1/verify/certificate/CERT-ABC123'
)
const data = await res.json()
console.log(data.data.holderName)  // "Amara Osei"
console.log(data.data.valid)       // true`,
      python: `import requests
r = requests.get(
    "https://afriflowai.com/api/v1/verify/certificate/CERT-ABC123"
)
print(r.json()["data"]["holderName"])  # "Amara Osei"`,
      curl: `curl https://afriflowai.com/api/v1/verify/certificate/CERT-ABC123`,
    },
    response: `{
  "valid": true,
  "data": {
    "certificateId": "CERT-ABC123",
    "holderName": "Amara Osei",
    "holderCountry": "Ghana",
    "courseName": "AI Automation Fundamentals",
    "courseSchool": "AfriFlow AI Academy",
    "completionDate": "2024-11-01T00:00:00.000Z",
    "grade": "distinction",
    "score": 94,
    "skills": ["n8n", "Zapier", "ChatGPT API"],
    "automationsBuilt": 3,
    "verificationHash": "sha256:..."
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/verify/id/:afriflowId',
    title: 'Verify AfriFlow ID',
    desc: 'Look up an AfriFlow ID profile by its public ID (e.g. AFR-XXXX-XXXX). Returns skills, certificates, and hire status.',
    auth: true,
    plans: ['free', 'starter', 'growth', 'enterprise'],
    example: {
      js: `const res = await fetch(
  'https://afriflowai.com/api/v1/verify/id/AFR-4Z2K-8XQR',
  { headers: { Authorization: 'Bearer afr_live_xxxxxxxx' } }
)
const { data } = await res.json()`,
      python: `import requests
r = requests.get(
    "https://afriflowai.com/api/v1/verify/id/AFR-4Z2K-8XQR",
    headers={"Authorization": "Bearer afr_live_xxxxxxxx"}
)
data = r.json()["data"]`,
      curl: `curl -H "Authorization: Bearer afr_live_xxxxxxxx" \\
  https://afriflowai.com/api/v1/verify/id/AFR-4Z2K-8XQR`,
    },
    response: `{
  "valid": true,
  "data": {
    "afriflowId": "AFR-4Z2K-8XQR",
    "displayName": "Kwame Boateng",
    "country": "Ghana",
    "headline": "AI Automation Engineer",
    "verificationScore": 87,
    "isHireable": true,
    "topSkills": [
      { "name": "n8n", "level": "advanced" },
      { "name": "ChatGPT API", "level": "intermediate" }
    ],
    "certificatesCount": 4
  }
}`,
  },
  {
    method: 'GET',
    path: '/api/v1/search/graduates',
    title: 'Search Graduates',
    desc: 'Search AfriFlow graduates by skill, country, and hire status. Paginated. Requires Starter plan or higher.',
    auth: true,
    plans: ['starter', 'growth', 'enterprise'],
    example: {
      js: `const res = await fetch(
  'https://afriflowai.com/api/v1/search/graduates?skill=n8n&country=Nigeria&hireable=true',
  { headers: { Authorization: 'Bearer afr_live_xxxxxxxx' } }
)
const { data } = await res.json()
// data.graduates — array of candidates`,
      python: `import requests
r = requests.get(
    "https://afriflowai.com/api/v1/search/graduates",
    params={"skill": "n8n", "country": "Nigeria", "hireable": True},
    headers={"Authorization": "Bearer afr_live_xxxxxxxx"}
)`,
      curl: `curl -G "https://afriflowai.com/api/v1/search/graduates" \\
  -d "skill=n8n" -d "country=Nigeria" -d "hireable=true" \\
  -H "Authorization: Bearer afr_live_xxxxxxxx"`,
    },
    response: `{
  "data": {
    "graduates": [
      {
        "afriflowId": "AFR-4Z2K-8XQR",
        "displayName": "Kwame Boateng",
        "country": "Nigeria",
        "verificationScore": 87,
        "isHireable": true,
        "certificatesCount": 4
      }
    ],
    "pagination": { "page": 1, "limit": 10, "total": 142, "pages": 15 },
    "apiCallsRemaining": 4872
  }
}`,
  },
]

const PLANS = [
  {
    id: 'free',
    name: 'Free',
    calls: '500 calls/mo',
    price: 'Free forever',
    endpoints: ['verify/certificate (no key needed)'],
    highlight: false,
  },
  {
    id: 'starter',
    name: 'Starter',
    calls: '5,000 calls/mo',
    price: '$29/mo',
    endpoints: ['verify/certificate', 'verify/id', 'search/graduates'],
    highlight: false,
  },
  {
    id: 'growth',
    name: 'Growth',
    calls: '50,000 calls/mo',
    price: '$99/mo',
    endpoints: ['All endpoints', 'Webhooks', 'Priority SLA'],
    highlight: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    calls: '1M+ calls/mo',
    price: 'Custom',
    endpoints: ['All endpoints', 'Dedicated IP', 'SLA contract', 'Custom integration support'],
    highlight: false,
  },
]

const LANG_LABELS = { js: 'JavaScript', python: 'Python', curl: 'cURL' }

export default function DevelopersPage() {
  const [activeLang, setActiveLang] = useState<'js' | 'python' | 'curl'>('js')
  const [activeEndpoint, setActiveEndpoint] = useState(0)

  const endpoint = ENDPOINTS[activeEndpoint]

  return (
    <div className="min-h-screen bg-earth-950 text-white">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <div className="glow-orb w-[500px] h-[500px] bg-purple-500/10 -top-40 left-1/2 -translate-x-1/2" />
        <div className="bg-grid absolute inset-0 opacity-20" />
        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <span className="section-tag mb-4">AfriFlow Public API — System 4</span>
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            Build on Africa&apos;s<br />
            <span className="gradient-text">AI infrastructure</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-10">
            Verify certificates, look up AfriFlow IDs, and search verified AI talent — all via a simple REST API.
            Designed for HR platforms, governments, and EdTech integrators across Africa.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/dashboard/api" className="btn-primary px-8 py-4">Get API Key</Link>
            <a href="#endpoints" className="btn-secondary px-8 py-4">Browse Endpoints</a>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 border-y border-earth-800">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-6 text-center">
          {[
            { label: 'Certificates verifiable', value: '8,200+' },
            { label: 'AfriFlow IDs indexed', value: '24,000+' },
            { label: 'API calls / month', value: '400K+' },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-3xl font-bold gradient-text">{s.value}</p>
              <p className="text-sm text-gray-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Endpoint Explorer */}
      <section id="endpoints" className="py-20 max-w-7xl mx-auto px-6">
        <div className="text-center mb-12">
          <span className="section-tag mb-4">API Reference</span>
          <h2 className="text-3xl font-bold">Interactive endpoint explorer</h2>
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-2">
            {ENDPOINTS.map((ep, i) => (
              <button
                key={ep.path}
                onClick={() => setActiveEndpoint(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all ${
                  i === activeEndpoint
                    ? 'border-brand-500 bg-brand-500/10'
                    : 'border-earth-700 hover:border-earth-600 bg-earth-900/50'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      ep.method === 'GET' ? 'bg-forest-500/20 text-forest-400' : 'bg-brand-500/20 text-brand-400'
                    }`}
                  >
                    {ep.method}
                  </span>
                  {!ep.auth && (
                    <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded">No key</span>
                  )}
                </div>
                <p className="text-sm font-semibold">{ep.title}</p>
                <p className="text-xs text-gray-500 font-mono mt-1 truncate">{ep.path}</p>
              </button>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-forest-500/20 text-forest-400">
                  {endpoint.method}
                </span>
                <code className="text-sm text-gray-300 font-mono">{endpoint.path}</code>
              </div>
              <p className="text-gray-300 mb-4">{endpoint.desc}</p>
              <div className="flex gap-2 flex-wrap">
                {endpoint.plans.map((p) => (
                  <span key={p} className="text-xs bg-earth-700 text-gray-300 px-2 py-0.5 rounded capitalize">{p}</span>
                ))}
              </div>
            </div>

            {/* Code example */}
            <div className="card overflow-hidden">
              <div className="flex border-b border-earth-700">
                {(Object.keys(LANG_LABELS) as Array<'js' | 'python' | 'curl'>).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setActiveLang(lang)}
                    className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
                      activeLang === lang ? 'border-brand-500 text-brand-400' : 'border-transparent text-gray-400'
                    }`}
                  >
                    {LANG_LABELS[lang]}
                  </button>
                ))}
              </div>
              <pre className="p-5 text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed">
                <code>{endpoint.example[activeLang]}</code>
              </pre>
            </div>

            {/* Response */}
            <div className="card overflow-hidden">
              <div className="px-5 py-3 border-b border-earth-700 flex items-center justify-between">
                <span className="text-sm text-gray-400">Example Response</span>
                <span className="text-xs font-mono bg-forest-500/20 text-forest-400 px-2 py-0.5 rounded">200 OK</span>
              </div>
              <pre className="p-5 text-sm text-gray-300 overflow-x-auto font-mono leading-relaxed">
                <code>{endpoint.response}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 bg-earth-900/50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="section-tag mb-4">API Pricing</span>
            <h2 className="text-3xl font-bold">Start free. Scale as you grow.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`card p-6 flex flex-col ${plan.highlight ? 'ring-2 ring-brand-500 relative' : ''}`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-500 text-black text-xs font-bold px-3 py-0.5 rounded-full">
                    Popular
                  </span>
                )}
                <p className="font-bold text-lg mb-1">{plan.name}</p>
                <p className="text-brand-500 font-semibold mb-1">{plan.calls}</p>
                <p className="text-gray-400 text-sm mb-4">{plan.price}</p>
                <ul className="space-y-1 flex-1 mb-6">
                  {plan.endpoints.map((e) => (
                    <li key={e} className="text-xs text-gray-400 flex gap-1.5">
                      <span className="text-forest-400">✓</span> {e}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/dashboard/api"
                  className={`text-center text-sm py-2.5 rounded-lg font-semibold ${
                    plan.highlight ? 'btn-primary' : 'btn-secondary'
                  }`}
                >
                  Get started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 max-w-5xl mx-auto px-6">
        <h2 className="text-3xl font-bold text-center mb-12">Built for African builders</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: '🏢',
              title: 'HR & Recruitment Platforms',
              desc: 'Auto-verify candidate certificates before interviews. Integrate AfriFlow ID checks into your ATS.',
            },
            {
              icon: '🏛️',
              title: 'Government & Regulators',
              desc: 'Bulk-verify AI training credentials for public service hiring. Get verified skill data by country.',
            },
            {
              icon: '🎓',
              title: 'Universities & EdTech',
              desc: 'Cross-reference student credentials. Search alumni talent for employer partnerships.',
            },
          ].map((uc) => (
            <div key={uc.title} className="card p-6">
              <span className="text-3xl">{uc.icon}</span>
              <h3 className="font-bold mt-3 mb-2">{uc.title}</h3>
              <p className="text-sm text-gray-400">{uc.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
