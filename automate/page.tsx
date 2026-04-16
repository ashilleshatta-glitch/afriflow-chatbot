import { Metadata } from 'next'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import AutomateClient from './AutomateClient'

export const metadata: Metadata = {
  title: 'Automate Your Business | AfriFlow AI',
  description:
    'Tell us your repetitive process — our team builds your custom automation with AI, Zapier, and Make. From leads to ops, we automate anything.',
}

export default function AutomatePage() {
  return (
    <>
      <Navbar />
      <AutomateClient />
      <Footer />
    </>
  )
}
