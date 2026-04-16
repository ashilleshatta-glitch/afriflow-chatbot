import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BenchmarkClient from './BenchmarkClient'

export const metadata: Metadata = {
  title: 'African AI Adoption Index | AfriFlow Benchmark Q1 2026',
  description:
    'The definitive ranking of African countries by AI readiness, talent, policy, and adoption. Download the full report with 22 country profiles.',
  openGraph: {
    title: 'African AI Adoption Index Q1 2026',
    description: 'Rankings, insights, and data on AI across Africa — by AfriFlow AI.',
    type: 'website',
  },
}

export default function BenchmarkPage() {
  return (
    <>
      <Navbar />
      <BenchmarkClient />
      <Footer />
    </>
  )
}
