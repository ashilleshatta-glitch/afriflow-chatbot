import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SchoolsClient from './SchoolsClient'

export const metadata: Metadata = {
  title: 'AfriFlow AI for Schools | B2B AI Education Platform',
  description:
    'Deploy AI education across your institution. Track student progress, assign courses, and certify your workforce with AfriFlow AI for Schools.',
}

export default function SchoolsPage() {
  return (
    <>
      <Navbar />
      <SchoolsClient />
      <Footer />
    </>
  )
}
