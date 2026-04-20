import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
  title: 'DesignDojo',
  description: 'Interactive system design interview preparation — drag, drop, and get AI feedback.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full antialiased ${inter.variable}`}>
      <body className="h-full font-sans bg-zinc-950 text-zinc-100">{children}</body>
    </html>
  )
}
