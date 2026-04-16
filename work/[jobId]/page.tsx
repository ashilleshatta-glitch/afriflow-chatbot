import { Metadata } from 'next'
import JobDetailClient from './JobDetailClient'

export const metadata: Metadata = {
  title: 'Job Details — AfriFlow Work',
}

export default function JobDetailPage({ params }: { params: { jobId: string } }) {
  return <JobDetailClient jobId={params.jobId} />
}
