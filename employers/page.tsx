import type { Metadata } from 'next'
import EmployerPortalClient from './EmployerPortalClient'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import LazyAfriAICoach from '@/components/LazyAfriAICoach'

export const metadata: Metadata = {
  title: 'Employer Portal — AfriFlow AI | Hire Verified AI Talent from Africa',
  description:
    'Search AfriFlow AI graduates by skill and certification. Post jobs, bulk-verify certificates, and hire Africa\'s top AI talent.',
  openGraph: {
    title: 'Hire Africa\'s Top AI Talent — AfriFlow AI Employer Portal',
    description:
      'Access 4,000+ verified AI professionals. Search by skill, post jobs, and bulk-verify certificates in seconds.',
  },
}

export default function EmployersPage() {
  return (
    <>
      <Navbar />
      <EmployerPortalClient />
      <Footer />
      <LazyAfriAICoach />
    </>
  )
}
