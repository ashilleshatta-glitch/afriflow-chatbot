import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/LazyAfriAICoach'
import { Users, Star, MapPin, ArrowRight, Briefcase, MessageSquare, Filter } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Mentors — AfriFlow AI | Learn from African AI Experts',
  description: 'Connect with AI mentors across Africa. Get 1-on-1 guidance from experienced professionals in AI, automation, and digital business.',
  openGraph: {
    title: 'Mentors — AfriFlow AI',
    description: 'Connect with AI mentors across Ghana, Nigeria, Kenya, and more.',
  },
}

const MENTORS = [
  {
    name: 'Kwame Mensah',
    avatar: 'KM',
    title: 'AI Automation Consultant',
    country: '🇬🇭 Ghana',
    city: 'Accra',
    specialty: ['Automation', 'WhatsApp Bots', 'No-Code'],
    rating: 4.9,
    sessions: 142,
    bio: 'Helped 50+ SMEs automate their WhatsApp customer service. Ex-software engineer turned AI consultant. Specializes in no-code automation for African businesses.',
    availability: 'Available',
    price: '$25/session',
    color: 'from-brand-500 to-yellow-500',
  },
  {
    name: 'Amina Osei',
    avatar: 'AO',
    title: 'AI Career Coach',
    country: '🇳🇬 Nigeria',
    city: 'Lagos',
    specialty: ['Career', 'Resume AI', 'Interview Prep'],
    rating: 4.8,
    sessions: 98,
    bio: 'Former recruiter at a Big 4 firm. Now helps African graduates land AI-ready jobs. Expert in AI-enhanced CVs and interview preparation.',
    availability: 'Available',
    price: '$20/session',
    color: 'from-indigo-500 to-blue-500',
  },
  {
    name: 'James Mwangi',
    avatar: 'JM',
    title: 'AI Freelancing Expert',
    country: '🇰🇪 Kenya',
    city: 'Nairobi',
    specialty: ['Freelancing', 'Client Acquisition', 'Pricing'],
    rating: 4.9,
    sessions: 211,
    bio: 'Built a $5K/month AI freelance business from scratch. Teaches others how to find clients, package services, and scale their AI side hustle.',
    availability: 'Waitlist',
    price: '$30/session',
    color: 'from-forest-500 to-teal-500',
  },
  {
    name: 'Fatima El-Amin',
    avatar: 'FE',
    title: 'AI for Education Specialist',
    country: '🇪🇬 Egypt',
    city: 'Cairo',
    specialty: ['EdTech', 'Curriculum Design', 'AI Tutoring'],
    rating: 4.7,
    sessions: 67,
    bio: 'Former university lecturer who now designs AI-powered learning experiences. Specializes in making AI accessible for non-technical learners.',
    availability: 'Available',
    price: '$20/session',
    color: 'from-purple-500 to-pink-500',
  },
  {
    name: 'Samuel Adeyemi',
    avatar: 'SA',
    title: 'Business Automation Architect',
    country: '🇳🇬 Nigeria',
    city: 'Abuja',
    specialty: ['Business', 'Zapier', 'Make', 'n8n'],
    rating: 4.8,
    sessions: 156,
    bio: 'Automates businesses end-to-end. Has saved clients 500+ hours per month collectively. Expert in Zapier, Make, and n8n for African SMEs.',
    availability: 'Available',
    price: '$35/session',
    color: 'from-red-500 to-orange-500',
  },
  {
    name: 'Grace Nakamura',
    avatar: 'GN',
    title: 'AI Content & Marketing',
    country: '🇷🇼 Rwanda',
    city: 'Kigali',
    specialty: ['Content', 'Marketing AI', 'Social Media'],
    rating: 4.9,
    sessions: 89,
    bio: 'Digital marketing veteran who teaches businesses to 10x their content output using AI. Specializes in social media automation and AI copywriting.',
    availability: 'Available',
    price: '$25/session',
    color: 'from-pink-500 to-rose-500',
  },
  {
    name: 'David Chukwuma',
    avatar: 'DC',
    title: 'Python & AI Builder',
    country: '🇳🇬 Nigeria',
    city: 'Port Harcourt',
    specialty: ['Python', 'APIs', 'Chatbots', 'LangChain'],
    rating: 4.7,
    sessions: 74,
    bio: 'Full-stack developer turned AI builder. Teaches Python for AI automation, API integrations, and custom chatbot development.',
    availability: 'Available',
    price: '$30/session',
    color: 'from-cyan-500 to-blue-500',
  },
  {
    name: 'Wanjiku Kamau',
    avatar: 'WK',
    title: 'AI for Faith Organizations',
    country: '🇰🇪 Kenya',
    city: 'Mombasa',
    specialty: ['Church Tech', 'Community', 'Admin AI'],
    rating: 4.8,
    sessions: 43,
    bio: 'Pioneered AI adoption in faith-based organizations across East Africa. Helps churches and NGOs automate admin, comms, and member management.',
    availability: 'Waitlist',
    price: '$15/session',
    color: 'from-amber-500 to-orange-500',
  },
]

const SPECIALTIES = ['All', 'Automation', 'Career', 'Freelancing', 'Business', 'Content', 'Python', 'EdTech']

export default function MentorsPage() {
  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="relative py-20 bg-earth-900 border-b border-earth-800">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <span className="section-tag mb-4"><Users size={14} /> Mentors</span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              Learn from Africans who&apos;ve <span className="gradient-text">done it</span>
            </h1>
            <p className="text-earth-400 text-lg mb-8 max-w-2xl mx-auto">
              Book 1-on-1 sessions with experienced AI practitioners across Africa.
              Real guidance from real people who understand your context.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {SPECIALTIES.map(s => (
                <span
                  key={s}
                  className="px-4 py-2 bg-earth-800 hover:bg-earth-700 text-earth-400 hover:text-white text-sm rounded-xl cursor-pointer transition-all border border-earth-700 hover:border-earth-600"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="border-b border-earth-800 bg-earth-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
              {[
                { value: '8+', label: 'Expert mentors' },
                { value: '880+', label: 'Sessions completed' },
                { value: '4.8', label: 'Average rating' },
                { value: '6', label: 'Countries represented' },
              ].map(s => (
                <div key={s.label}>
                  <p className="font-display text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-earth-500 text-sm mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mentors grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MENTORS.map((mentor) => (
              <div key={mentor.name} className="card-glow group">
                <div className="flex items-start gap-4">
                  {/* Avatar */}
                  <div className={`w-14 h-14 bg-gradient-to-br ${mentor.color} rounded-2xl flex items-center justify-center text-white font-bold text-lg flex-shrink-0`}>
                    {mentor.avatar}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-white font-semibold group-hover:text-brand-300 transition-colors">
                          {mentor.name}
                        </h3>
                        <p className="text-earth-400 text-sm">{mentor.title}</p>
                      </div>
                      <span className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-full border ${
                        mentor.availability === 'Available'
                          ? 'bg-forest-500/10 text-forest-400 border-forest-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      }`}>
                        {mentor.availability}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 mt-2 text-xs text-earth-500">
                      <span className="flex items-center gap-1">
                        <MapPin size={11} /> {mentor.country}
                      </span>
                      <span className="flex items-center gap-1 text-amber-400">
                        <Star size={11} fill="currentColor" /> {mentor.rating}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare size={11} /> {mentor.sessions} sessions
                      </span>
                    </div>

                    <p className="text-earth-400 text-sm leading-relaxed mt-3 line-clamp-2">
                      {mentor.bio}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {mentor.specialty.map(s => (
                        <span key={s} className="text-xs px-2 py-0.5 bg-earth-800 text-earth-400 rounded-md border border-earth-700">
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-earth-800">
                      <span className="text-white font-medium text-sm">{mentor.price}</span>
                      <Link
                        href="/auth/register"
                        className={`text-sm font-medium flex items-center gap-1 transition-colors ${
                          mentor.availability === 'Available'
                            ? 'text-brand-400 hover:text-brand-300'
                            : 'text-earth-500 hover:text-earth-400'
                        }`}
                      >
                        {mentor.availability === 'Available' ? 'Book session' : 'Join waitlist'}
                        <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Become a mentor CTA */}
          <div className="mt-16 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-10 text-center">
            <div className="text-4xl mb-4">🎓</div>
            <h2 className="font-display text-3xl font-bold text-white mb-3">
              Become a mentor
            </h2>
            <p className="text-earth-400 mb-6 max-w-xl mx-auto">
              Are you an AI practitioner in Africa? Share your expertise, earn from your skills,
              and help shape the continent&apos;s AI future.
            </p>
            <a href="mailto:mentors@afriflowai.com" className="btn-primary py-3 px-8">
              Apply to Mentor <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </div>
      <Footer />
      <AfriAICoach />
    </div>
  )
}
