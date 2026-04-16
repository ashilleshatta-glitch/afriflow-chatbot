// Static African AI Adoption Index data
// Updated quarterly — Q1 2026

export interface CountryData {
  country: string
  code: string
  flag: string
  region: 'West Africa' | 'East Africa' | 'North Africa' | 'Southern Africa' | 'Central Africa'
  overallScore: number        // 0-100
  digitalInfraScore: number   // internet penetration, mobile money, devices
  talentScore: number         // AI graduates, bootcamp enrolment, online learners
  policyScore: number         // govt AI strategy, data protection law, investment
  adoptionScore: number       // businesses using AI, automation rate, fintech
  startupScore: number        // AI startups, VC funding, accelerators
  rank: number
  prevRank: number
  highlights: string[]
  risks: string[]
  keyStats: { label: string; value: string }[]
}

export const INDEX_YEAR = 2026
export const INDEX_QUARTER = 'Q1'
export const TOTAL_COUNTRIES = 22

export const COUNTRY_DATA: CountryData[] = [
  {
    country: 'Nigeria',
    code: 'NG',
    flag: '🇳🇬',
    region: 'West Africa',
    overallScore: 78,
    digitalInfraScore: 72,
    talentScore: 85,
    policyScore: 61,
    adoptionScore: 82,
    startupScore: 88,
    rank: 1,
    prevRank: 1,
    highlights: ['Largest AI startup ecosystem in Africa', 'Over 300 active AI companies', 'Fintech AI adoption at 91%'],
    risks: ['Infrastructure gaps outside Lagos/Abuja', 'Brain drain to UK/Canada', 'Regulatory uncertainty for AI firms'],
    keyStats: [
      { label: 'AI Startups', value: '300+' },
      { label: 'VC Funding (2025)', value: '$1.2B' },
      { label: 'Internet Penetration', value: '51%' },
      { label: 'Coding Bootcamps', value: '85+' },
    ],
  },
  {
    country: 'Kenya',
    code: 'KE',
    flag: '🇰🇪',
    region: 'East Africa',
    overallScore: 76,
    digitalInfraScore: 78,
    talentScore: 80,
    policyScore: 72,
    adoptionScore: 75,
    startupScore: 77,
    rank: 2,
    prevRank: 2,
    highlights: ['Silicon Savannah hub — 200+ tech companies', 'M-Pesa AI fraud detection industry-wide', 'iHub alumni driving AI adoption'],
    risks: ['Small domestic market for AI products', 'Power infrastructure instability', 'Limited AI-specific regulation'],
    keyStats: [
      { label: 'AI Startups', value: '200+' },
      { label: 'VC Funding (2025)', value: '$680M' },
      { label: 'Internet Penetration', value: '85%' },
      { label: 'AI Policy Framework', value: 'Draft 2025' },
    ],
  },
  {
    country: 'South Africa',
    code: 'ZA',
    flag: '🇿🇦',
    region: 'Southern Africa',
    overallScore: 74,
    digitalInfraScore: 88,
    talentScore: 71,
    policyScore: 78,
    adoptionScore: 70,
    startupScore: 65,
    rank: 3,
    prevRank: 3,
    highlights: ['Most mature digital infrastructure on continent', 'JSE-listed firms leading enterprise AI', 'Cape Town emerging as AI research hub'],
    risks: ['Unemployment limits domestic AI market', 'Load-shedding disrupts digital businesses', 'Inequality in tech access'],
    keyStats: [
      { label: 'Enterprise AI Rate', value: '43%' },
      { label: 'AI Research Papers (2025)', value: '1,200+' },
      { label: 'Internet Penetration', value: '72%' },
      { label: 'Coding Bootcamps', value: '40+' },
    ],
  },
  {
    country: 'Egypt',
    code: 'EG',
    flag: '🇪🇬',
    region: 'North Africa',
    overallScore: 71,
    digitalInfraScore: 75,
    talentScore: 77,
    policyScore: 80,
    adoptionScore: 62,
    startupScore: 62,
    rank: 4,
    prevRank: 5,
    highlights: ['National AI Strategy 2030 fully funded', 'Cairo University AI research top-ranked', 'Government e-services AI integration'],
    risks: ['Currency instability affecting tech investment', 'Limited English AI resource access', 'Political constraints on data sovereignty'],
    keyStats: [
      { label: 'Govt AI Investment', value: '$500M (2025-30)' },
      { label: 'AI Graduates/yr', value: '8,000+' },
      { label: 'Internet Penetration', value: '72%' },
      { label: 'AI Startups', value: '120+' },
    ],
  },
  {
    country: 'Ghana',
    code: 'GH',
    flag: '🇬🇭',
    region: 'West Africa',
    overallScore: 67,
    digitalInfraScore: 65,
    talentScore: 72,
    policyScore: 65,
    adoptionScore: 63,
    startupScore: 68,
    rank: 5,
    prevRank: 6,
    highlights: ['Accra ranked #3 African tech startup hub', 'Highest youth AI literacy growth (+34% YoY)', 'AgriTech AI adoption leading region'],
    risks: ['Small talent pool relative to Nigeria/Egypt', 'Debt-driven economic headwinds', 'Limited Series A+ funding ecosystem'],
    keyStats: [
      { label: 'AI Startups', value: '80+' },
      { label: 'Youth AI Adoption', value: '38%' },
      { label: 'Internet Penetration', value: '68%' },
      { label: 'VC Funding (2025)', value: '$210M' },
    ],
  },
  {
    country: 'Rwanda',
    code: 'RW',
    flag: '🇷🇼',
    region: 'East Africa',
    overallScore: 65,
    digitalInfraScore: 74,
    talentScore: 58,
    policyScore: 88,
    adoptionScore: 60,
    startupScore: 55,
    rank: 6,
    prevRank: 7,
    highlights: ['Strongest AI policy framework in Africa', 'Kigali Innovation City attracting global AI firms', 'Drone AI delivery infrastructure built'],
    risks: ['Very small talent base (12M population)', 'Heavy reliance on foreign AI investment', 'Limited domestic AI market scale'],
    keyStats: [
      { label: 'Policy Score', value: '#1 Africa' },
      { label: 'Internet Penetration', value: '61%' },
      { label: 'AI Policy Status', value: 'Published 2024' },
      { label: 'AI FDI (2025)', value: '$120M' },
    ],
  },
  {
    country: 'Morocco',
    code: 'MA',
    flag: '🇲🇦',
    region: 'North Africa',
    overallScore: 63,
    digitalInfraScore: 70,
    talentScore: 65,
    policyScore: 68,
    adoptionScore: 58,
    startupScore: 55,
    rank: 7,
    prevRank: 8,
    highlights: ['French-Arabic AI content leadership', 'Casablanca Finance City AI hub growing', 'EU-adjacent for AI talent export'],
    risks: ['Brain drain to France/Spain', 'Slow enterprise AI adoption outside banking', 'Regulatory framework in early stages'],
    keyStats: [
      { label: 'AI Startups', value: '60+' },
      { label: 'Internet Penetration', value: '88%' },
      { label: 'VC Funding (2025)', value: '$180M' },
      { label: 'Bilingual AI Talent', value: 'Top 3 Africa' },
    ],
  },
  {
    country: 'Ethiopia',
    code: 'ET',
    flag: '🇪🇹',
    region: 'East Africa',
    overallScore: 55,
    digitalInfraScore: 42,
    talentScore: 60,
    policyScore: 55,
    adoptionScore: 50,
    startupScore: 58,
    rank: 8,
    prevRank: 10,
    highlights: ['Fastest growing AI talent pool in East Africa', 'Addis Ababa tech scene doubling annually', 'Government digitisation programme accelerating'],
    risks: ['Internet penetration still below 40%', 'Geopolitical instability in some regions', 'Limited capital markets for AI startups'],
    keyStats: [
      { label: 'Population', value: '120M (largest market)' },
      { label: 'Internet Penetration', value: '37%' },
      { label: 'AI Startups', value: '45+' },
      { label: 'YoY Talent Growth', value: '+52%' },
    ],
  },
  {
    country: 'Senegal',
    code: 'SN',
    flag: '🇸🇳',
    region: 'West Africa',
    overallScore: 54,
    digitalInfraScore: 60,
    talentScore: 55,
    policyScore: 58,
    adoptionScore: 48,
    startupScore: 50,
    rank: 9,
    prevRank: 9,
    highlights: ['Dakar emerging as Francophone AI capital', 'Orange Africa AI lab headquartered here', 'Strong STEM university output'],
    risks: ['Small economy limits AI scale', 'French-language AI resource gap', 'Talent migrates to Paris/Montreal'],
    keyStats: [
      { label: 'Internet Penetration', value: '67%' },
      { label: 'AI Startups', value: '35+' },
      { label: 'Language AI Research', value: 'Wolof NLP leader' },
      { label: 'VC Funding (2025)', value: '$95M' },
    ],
  },
  {
    country: 'Tanzania',
    code: 'TZ',
    flag: '🇹🇿',
    region: 'East Africa',
    overallScore: 50,
    digitalInfraScore: 55,
    talentScore: 48,
    policyScore: 50,
    adoptionScore: 46,
    startupScore: 50,
    rank: 10,
    prevRank: 11,
    highlights: ['M-Pesa-driven fintech AI foundation', 'Dar es Salaam startup ecosystem growing', 'AgriTech AI for smallholder farmers'],
    risks: ['Mobile internet quality inconsistent', 'Limited AI-specific tertiary education', 'Slow regulatory evolution'],
    keyStats: [
      { label: 'Internet Penetration', value: '45%' },
      { label: 'Mobile Money Users', value: '28M' },
      { label: 'AI Startups', value: '25+' },
      { label: 'AgriTech AI Farms', value: '12,000+' },
    ],
  },
]

// Remaining 12 countries — summary only
export const ADDITIONAL_COUNTRIES = [
  { country: 'Uganda', flag: '🇺🇬', rank: 11, overallScore: 48 },
  { country: "Côte d'Ivoire", flag: '🇨🇮', rank: 12, overallScore: 47 },
  { country: 'Tunisia', flag: '🇹🇳', rank: 13, overallScore: 46 },
  { country: 'Cameroon', flag: '🇨🇲', rank: 14, overallScore: 44 },
  { country: 'Zambia', flag: '🇿🇲', rank: 15, overallScore: 43 },
  { country: 'Zimbabwe', flag: '🇿🇼', rank: 16, overallScore: 41 },
  { country: 'Botswana', flag: '🇧🇼', rank: 17, overallScore: 40 },
  { country: 'Algeria', flag: '🇩🇿', rank: 18, overallScore: 39 },
  { country: 'Angola', flag: '🇦🇴', rank: 19, overallScore: 37 },
  { country: 'Mozambique', flag: '🇲🇿', rank: 20, overallScore: 35 },
  { country: 'Malawi', flag: '🇲🇼', rank: 21, overallScore: 31 },
  { country: 'Mali', flag: '🇲🇱', rank: 22, overallScore: 28 },
]

export const DIMENSION_DESCRIPTIONS: Record<string, string> = {
  digitalInfraScore: 'Internet penetration, mobile money adoption, device access, data centre density',
  talentScore: 'AI graduates, bootcamp enrolment, online learners, researcher output',
  policyScore: 'Government AI strategy maturity, data protection law, public AI investment',
  adoptionScore: 'Businesses using AI, automation penetration rate, AI-enabled fintech services',
  startupScore: 'Active AI companies, VC funding raised, accelerator programmes, exits',
}

export const REPORT_INSIGHTS = [
  'Nigeria + Kenya + South Africa capture 68% of all African AI VC funding',
  'AI talent pool grew 41% continent-wide in 2025 — fastest in the world',
  'Only 6 of 54 countries have published dedicated AI strategies',
  'Mobile-first AI is the dominant deployment pattern (87% of new tools)',
  'Agriculture and fintech lead AI adoption, followed by healthcare',
  'French-speaking Africa lags English-speaking peers by avg 18 index points',
]
