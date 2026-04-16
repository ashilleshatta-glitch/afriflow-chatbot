import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import SchoolPortalClient from './SchoolPortalClient'

export async function generateMetadata({
  params,
}: {
  params: { slug: string }
}): Promise<Metadata> {
  return {
    title: `School Portal — ${params.slug} | AfriFlow AI`,
    description: 'Manage AI education for your institution on AfriFlow AI.',
  }
}

export default function SchoolPortalPage({ params }: { params: { slug: string } }) {
  return (
    <>
      <Navbar />
      <SchoolPortalClient slug={params.slug} />
      <Footer />
    </>
  )
}
