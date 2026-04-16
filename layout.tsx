import type { Metadata, Viewport } from 'next'
import { Playfair_Display, DM_Sans } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['700', '800'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0C0A09',
}

export const metadata: Metadata = {
  title: {
    default: 'AfriFlow AI — Learn AI. Automate Work. Build Income.',
    template: '%s | AfriFlow AI',
  },
  description: "Africa's #1 platform for AI learning, automation, and digital income. From curious to earning in 30 days.",
  keywords: ['AI Africa', 'automation Africa', 'AI learning Ghana', 'AI Nigeria', 'AI Kenya', 'digital skills Africa', 'AI courses', 'no-code automation', 'African AI platform'],
  authors: [{ name: 'AfriFlow AI' }],
  creator: 'AfriFlow AI',
  metadataBase: new URL('https://afriflowai.com'),
  openGraph: {
    title: 'AfriFlow AI — Learn AI. Automate Work. Build Income.',
    description: "From AI-curious to AI-earning. Africa's most powerful AI automation platform.",
    url: 'https://afriflowai.com',
    siteName: 'AfriFlow AI',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AfriFlow AI — Learn AI. Automate Work. Build Income.',
    description: "Africa's #1 AI learning platform. 24K+ learners across 12+ countries.",
    creator: '@afriflowai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${dmSans.variable}`}>
      <body className="bg-earth-950 text-earth-100 antialiased font-body">
        {/* Skip to main content — accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[9999] focus:bg-brand-500 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <Providers>
          <main id="main-content">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  )
}
