import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AfriflowIDProfile from './AfriflowIDProfile'

interface Props {
  params: { publicId: string }
  searchParams: { endorsed?: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://afriflow.ai'
  try {
    const res = await fetch(`${appUrl}/api/id/${params.publicId}`, { next: { revalidate: 3600 } })
    if (!res.ok) return { title: 'Profile Not Found — AfriFlow AI' }
    const { data } = await res.json()
    return {
      title: `${data.displayName} (${data.publicId}) — AfriFlow ID`,
      description: data.headline || `Verified AI professional from ${data.country}. View their skills, projects, and certificates on AfriFlow AI.`,
      openGraph: {
        title: `${data.displayName} — AfriFlow ID`,
        description: data.headline || `Verification score: ${data.verificationScore}/100`,
        url: `${appUrl}/id/${params.publicId}`,
      },
    }
  } catch {
    return { title: 'AfriFlow ID' }
  }
}

export default function AfriflowIDPage({ params, searchParams }: Props) {
  if (!params.publicId.match(/^AFR-[A-Z0-9]{4}-[A-Z0-9]{4}$/)) {
    notFound()
  }
  return <AfriflowIDProfile publicId={params.publicId} justEndorsed={searchParams.endorsed === '1'} />
}
