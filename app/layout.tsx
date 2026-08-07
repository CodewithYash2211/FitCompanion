/**
 * Root Layout — FitCompanion
 * Wraps the entire application with global providers, fonts, and PWA metadata.
 *
 * Fonts are loaded via <link> tags (Google Fonts CDN) rather than next/font/google
 * to avoid build-time network failures in restricted environments.
 */

import type { Metadata, Viewport } from 'next'
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
  themeColor: '#7C3AED',
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
      className="dark"
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect for faster font loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Google Fonts — loaded at runtime, not build time */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />

        {/* PWA Icons */}
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="antialiased min-h-screen bg-bg-base" suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>

        {/* Global toast notifications — styled to match glass theme */}
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: 'rgba(13, 13, 26, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(20px)',
              color: '#F0F0FF',
            },
          }}
        />
      </body>
    </html>
  )
}
