import Link from 'next/link'
import { Zap, Twitter, Linkedin, Youtube, MessageCircle } from 'lucide-react'

const footerLinks = {
  'Platform': [
    { label: 'Learn AI', href: '/courses' },
    { label: 'Automation Lab', href: '/lab' },
    { label: 'Templates', href: '/templates' },
    { label: 'Marketplace', href: '/marketplace' },
    { label: 'AfriAI Coach', href: '/coach' },
  ],
  'Schools': [
    { label: 'AI Foundations', href: '/courses?school=foundations' },
    { label: 'AI Automation', href: '/courses?school=automation' },
    { label: 'AI for Business', href: '/courses?school=business' },
    { label: 'AI Creator & Income', href: '/courses?school=creator' },
    { label: 'AI Builder School', href: '/courses?school=builder' },
  ],
  'Community': [
    { label: 'Discussion Forum', href: '/community' },
    { label: 'Find a Mentor', href: '/mentors' },
    { label: 'Career Paths', href: '/paths' },
    { label: 'Job Board', href: '/jobs' },
    { label: 'Certifications', href: '/certificates' },
  ],
  'Company': [
    { label: 'About Us', href: '/about' },
    { label: 'For Business', href: '/business' },
    { label: 'Blog', href: '/blog' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Contact', href: '/contact' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-earth-900 border-t border-earth-800" role="contentinfo" aria-label="Site footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4" aria-label="AfriFlow AI Home">
              <div className="w-8 h-8 bg-gradient-to-br from-brand-500 to-forest-500 rounded-lg flex items-center justify-center">
                <Zap size={16} className="text-white" fill="white" aria-hidden="true" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                AfriFlow<span className="text-brand-400"> AI</span>
              </span>
            </Link>
            <p className="text-earth-400 text-sm leading-relaxed mb-6">
              Africa&apos;s #1 platform for AI learning, automation, and digital income. 
              From AI-curious to AI-earning.
            </p>
            <div className="flex items-center gap-3" role="list" aria-label="Social media links">
              <a href="#" aria-label="Follow on Twitter" className="w-9 h-9 bg-earth-800 hover:bg-earth-700 rounded-lg flex items-center justify-center text-earth-400 hover:text-white transition-all">
                <Twitter size={16} aria-hidden="true" />
              </a>
              <a href="#" aria-label="Follow on LinkedIn" className="w-9 h-9 bg-earth-800 hover:bg-earth-700 rounded-lg flex items-center justify-center text-earth-400 hover:text-white transition-all">
                <Linkedin size={16} aria-hidden="true" />
              </a>
              <a href="#" aria-label="Subscribe on YouTube" className="w-9 h-9 bg-earth-800 hover:bg-earth-700 rounded-lg flex items-center justify-center text-earth-400 hover:text-white transition-all">
                <Youtube size={16} aria-hidden="true" />
              </a>
              <a href="#" aria-label="Join WhatsApp community" className="w-9 h-9 bg-[#25D366]/20 hover:bg-[#25D366]/30 rounded-lg flex items-center justify-center text-[#25D366] transition-all">
                <MessageCircle size={16} aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <nav key={category} aria-label={`${category} links`}>
              <h4 className="text-white font-medium text-sm mb-4">{category}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-earth-500 hover:text-earth-200 text-sm transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-earth-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-earth-600 text-sm">
            © {new Date().getFullYear()} AfriFlow AI. Built for Africa. 🌍
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-earth-600 hover:text-earth-400 text-sm transition-colors">Privacy</Link>
            <Link href="/terms" className="text-earth-600 hover:text-earth-400 text-sm transition-colors">Terms</Link>
            <Link href="/cookies" className="text-earth-600 hover:text-earth-400 text-sm transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
