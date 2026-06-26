import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VerdeXcelerate — Mapa AgrifoodTech LAC',
  description: 'Plataforma de mapeo del ecosistema AgrifoodTech en Latinoamérica para TechnoServe y BID Lab.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
