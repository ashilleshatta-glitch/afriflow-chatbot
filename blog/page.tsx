import type { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AfriAICoach from '@/components/LazyAfriAICoach'
import NewsletterForm from '@/components/NewsletterForm'
import { BookOpen, Clock, ArrowRight, Tag, User, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Blog — AfriFlow AI | AI Insights for Africa',
  description: 'Read the latest insights on AI in Africa: tutorials, industry analysis, success stories, and practical guides for African professionals.',
  openGraph: {
    title: 'Blog — AfriFlow AI',
    description: 'AI insights, tutorials, and success stories from across Africa.',
  },
}

const ARTICLES = [
  {
    slug: 'why-africa-ai-moment-is-now',
    title: 'Why Africa\'s AI Moment Is Right Now — And How to Seize It',
    excerpt: 'Africa has the youngest population, the fastest-growing internet adoption, and problems that AI is uniquely positioned to solve. Here\'s why the next 5 years will define the continent\'s AI future.',
    author: 'AfriFlow AI Team',
    authorAvatar: 'AF',
    date: 'Mar 20, 2026',
    readTime: '8 min read',
    tags: ['Africa', 'AI Future', 'Opportunity'],
    featured: true,
    image: '🌍',
  },
  {
    slug: 'how-i-made-800-month-automating-whatsapp',
    title: 'How I Made $800/Month Automating WhatsApp for Small Businesses',
    excerpt: 'A step-by-step account of how an AfriFlow AI graduate in Accra built a thriving freelance business by automating WhatsApp customer support for local SMEs.',
    author: 'Kwame Mensah',
    authorAvatar: 'KM',
    date: 'Mar 15, 2026',
    readTime: '6 min read',
    tags: ['Success Story', 'WhatsApp', 'Freelancing'],
    featured: false,
    image: '💼',
  },
  {
    slug: 'best-ai-tools-low-bandwidth',
    title: 'The Best AI Tools That Work on Low Bandwidth in Africa',
    excerpt: 'Not all AI tools need fast internet. Here are 15 tools that work great on 2G/3G connections — perfect for learners and businesses in rural areas.',
    author: 'Amina Osei',
    authorAvatar: 'AO',
    date: 'Mar 10, 2026',
    readTime: '5 min read',
    tags: ['Tools', 'Low Bandwidth', 'Practical'],
    featured: false,
    image: '📡',
  },
  {
    slug: 'ai-for-churches-complete-guide',
    title: 'AI for Churches: A Complete Guide to Automating Your Ministry',
    excerpt: 'From automated follow-up messages to AI-generated sermon notes, here\'s how faith organizations across Africa are using AI to serve their communities better.',
    author: 'Wanjiku Kamau',
    authorAvatar: 'WK',
    date: 'Mar 5, 2026',
    readTime: '7 min read',
    tags: ['Church Tech', 'Automation', 'Community'],
    featured: false,
    image: '⛪',
  },
  {
    slug: 'chatgpt-vs-claude-for-african-languages',
    title: 'ChatGPT vs Claude: Which Is Better for African Languages?',
    excerpt: 'We tested both AI assistants across 10 African languages including Swahili, Yoruba, Twi, and Amharic. Here are the surprising results.',
    author: 'AfriFlow AI Team',
    authorAvatar: 'AF',
    date: 'Feb 28, 2026',
    readTime: '10 min read',
    tags: ['AI Comparison', 'Languages', 'Review'],
    featured: false,
    image: '🗣️',
  },
  {
    slug: 'start-ai-agency-africa-2026',
    title: 'How to Start an AI Agency in Africa in 2026 (Step-by-Step)',
    excerpt: 'The demand for AI services in Africa is exploding. Here\'s a practical guide to starting your own AI agency — from finding clients to pricing your services.',
    author: 'James Mwangi',
    authorAvatar: 'JM',
    date: 'Feb 20, 2026',
    readTime: '12 min read',
    tags: ['Business', 'Agency', 'Guide'],
    featured: false,
    image: '🚀',
  },
]

export default function BlogPage() {
  const featured = ARTICLES.find(a => a.featured)
  const rest = ARTICLES.filter(a => !a.featured)

  return (
    <div className="min-h-screen bg-earth-950">
      <Navbar />
      <div className="pt-16">
        {/* Hero */}
        <div className="relative py-20 bg-earth-900 border-b border-earth-800">
          <div className="absolute inset-0 bg-grid opacity-30" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
            <span className="section-tag mb-4"><BookOpen size={14} /> Blog</span>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-4">
              AI insights for <span className="gradient-text">Africa</span>
            </h1>
            <p className="text-earth-400 text-lg">
              Guides, success stories, tool reviews, and practical tips for using AI across the continent.
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Featured article */}
          {featured && (
            <Link href={`/blog/${featured.slug}`} className="block mb-12">
              <div className="card-glow group grid grid-cols-1 lg:grid-cols-5 gap-6 items-center">
                <div className="lg:col-span-2 flex items-center justify-center py-8 bg-earth-800/50 rounded-xl">
                  <span className="text-7xl">{featured.image}</span>
                </div>
                <div className="lg:col-span-3">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs px-2.5 py-1 bg-brand-500/10 text-brand-400 rounded-full">Featured</span>
                    <span className="text-earth-600 text-xs">{featured.date}</span>
                  </div>
                  <h2 className="font-display text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-brand-300 transition-colors">
                    {featured.title}
                  </h2>
                  <p className="text-earth-400 leading-relaxed mb-4">
                    {featured.excerpt}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-earth-500">
                    <span className="flex items-center gap-1.5">
                      <div className="w-6 h-6 bg-gradient-to-br from-brand-500 to-forest-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold">
                        {featured.authorAvatar}
                      </div>
                      {featured.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {featured.readTime}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )}

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2 mb-8">
            <span className="text-earth-500 text-sm">Topics:</span>
            {['All', 'Success Story', 'Tools', 'Business', 'Guide', 'AI Comparison', 'Church Tech'].map(tag => (
              <span
                key={tag}
                className="px-3 py-1.5 bg-earth-800 text-earth-400 hover:text-white text-xs rounded-lg cursor-pointer transition-all border border-earth-700 hover:border-earth-600"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Article grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((article) => (
              <Link key={article.slug} href={`/blog/${article.slug}`} className="block group">
                <div className="card h-full flex flex-col hover:border-earth-700 transition-all">
                  <div className="w-full h-36 bg-earth-800/50 rounded-xl flex items-center justify-center mb-4">
                    <span className="text-5xl">{article.image}</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {article.tags.map(tag => (
                      <span key={tag} className="text-xs px-2 py-0.5 bg-brand-500/10 text-brand-400 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h3 className="text-white font-semibold leading-snug mb-2 group-hover:text-brand-300 transition-colors flex-1">
                    {article.title}
                  </h3>

                  <p className="text-earth-500 text-sm leading-relaxed mb-4 line-clamp-2">
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between text-xs text-earth-600 mt-auto pt-4 border-t border-earth-800">
                    <span className="flex items-center gap-1.5">
                      <div className="w-5 h-5 bg-gradient-to-br from-brand-500 to-forest-500 rounded-full flex items-center justify-center text-white text-[8px] font-bold">
                        {article.authorAvatar}
                      </div>
                      {article.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={11} /> {article.readTime}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Newsletter CTA */}
          <div className="mt-16 rounded-2xl border border-brand-500/20 bg-brand-500/5 p-10 text-center">
            <div className="text-4xl mb-4">📬</div>
            <h2 className="font-display text-3xl font-bold text-white mb-3">
              Get weekly AI insights
            </h2>
            <p className="text-earth-400 mb-6 max-w-xl mx-auto">
              Join 12,000+ readers getting practical AI tips for African businesses every Friday.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <NewsletterForm source="blog" className="max-w-md mx-auto w-full" />
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <AfriAICoach />
    </div>
  )
}
