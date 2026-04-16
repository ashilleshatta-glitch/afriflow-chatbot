'use client'

import { AuthProvider } from '@/context/AuthContext'
import { Toaster } from 'react-hot-toast'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#292524',
            color: '#F5F5F4',
            border: '1px solid #44403C',
          },
        }}
      />
      {children}
    </AuthProvider>
  )
}
