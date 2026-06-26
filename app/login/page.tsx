'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #0f1729 0%, #162038 50%, #1a2744 100%)',
    }}>
      <div style={{
        background: 'white', borderRadius: 'var(--radius-xl)', padding: '40px 36px',
        width: '100%', maxWidth: 400, boxShadow: 'var(--shadow-xl)',
      }} className="anim-scale">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 52, height: 52, borderRadius: 14, margin: '0 auto 16px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent-dark))',
            display: 'grid', placeItems: 'center', boxShadow: '0 8px 24px rgba(0,167,157,.3)',
          }}>
            <svg width="24" height="24" viewBox="0 0 18 18" fill="none">
              <path d="M9 2L16 6V12L9 16L2 12V6L9 2Z" stroke="white" strokeWidth="1.5" fill="none" />
              <circle cx="9" cy="9" r="2.5" fill="white" />
            </svg>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--fg)', marginBottom: 4 }}>
            VerdeXcelerate
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            Plataforma AgrifoodTech LAC
          </div>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)', display: 'block', marginBottom: 6 }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="usuario@ejemplo.com"
              required
              style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius)', font: 'inherit', fontSize: 14, outline: 'none',
                boxSizing: 'border-box', transition: 'border-color .2s',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--accent)' }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)' }}
            />
          </div>
          <div>
            <label style={{ fontSize: 12, fontWeight: 600, color: 'var(--fg)', display: 'block', marginBottom: 6 }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{
                width: '100%', padding: '10px 14px', border: '1.5px solid var(--border)',
                borderRadius: 'var(--radius)', font: 'inherit', fontSize: 14, outline: 'none',
                boxSizing: 'border-box', transition: 'border-color .2s',
              }}
              onFocus={(e) => { e.target.style.borderColor = 'var(--accent)' }}
              onBlur={(e) => { e.target.style.borderColor = 'var(--border)' }}
            />
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', background: 'rgba(239,68,68,.06)', border: '1px solid rgba(239,68,68,.2)',
              borderRadius: 8, fontSize: 13, color: 'var(--danger)',
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn btn-accent"
            disabled={loading}
            style={{ justifyContent: 'center', padding: '12px', marginTop: 4, fontSize: 14 }}
          >
            {loading ? 'Entrando…' : 'Ingresar al sistema'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--muted)' }}>
          Acceso restringido a equipo TechnoServe / BID Lab
        </div>
      </div>
    </div>
  )
}
