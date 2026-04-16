import { Metadata } from 'next'
import SchoolAdminClient from './SchoolAdminClient'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `School Admin — ${params.slug} | AfriFlow AI`,
    robots: { index: false, follow: false },
  }
}

export default function SchoolAdminPage({ params }: { params: { slug: string } }) {
  return <SchoolAdminClient slug={params.slug} />
}
