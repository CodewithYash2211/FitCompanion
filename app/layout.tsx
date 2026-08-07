/**
 * Root Layout — FitCompanion
 * Wraps the entire application with global providers, fonts, and PWA metadata.
 */

import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/components/providers'
import '@/app/globals.css'

// ─── Metadata ─────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default: 'FitCompanion — AI Fitness & Nutrition for Students',
    template: '%s | FitCompanion',
  },
  description:
    'Your AI-powered fitness and nutrition coach built for college students. Get personalized diet plans, workout routines, and AI coaching — all in one place.',
  keywords: [
    'fitness app for students',
    'hostel diet plan',
    'AI nutrition coach',
    'college workout planner',
    'calorie tracker India',
    'student health app',
  ],
  authors: [{ name: 'FitCompanion' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'FitCompanion',
  },
  openGraph: {
    type: 'website',
    siteName: 'FitCompanion',
    title: 'FitCompanion — AI Fitness & Nutrition for Students',
    description: 'AI-powered fitness and nutrition for hostel students, gym-goers, and beginners.',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0a0c',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

// ─── Root Layout ──────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`dark ${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="antialiased min-h-screen font-sans" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>

        {/* Global toast notifications — styled to match premium linear theme */}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: '#121214',
              border: '1px solid #27272a',
              color: '#ededef',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            },
          }}
        />
      </body>
    </html>
  )
}
