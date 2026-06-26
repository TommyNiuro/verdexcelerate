import AppLayout from '@/components/AppLayout'
import { getDashboardStats, getActorCount } from '@/lib/queries'

const FLAGS: Record<string, string> = { CO: '🇨🇴', CR: '🇨🇷', SV: '🇸🇻', GT: '🇬🇹', HN: '🇭🇳', PA: '🇵🇦' }
const PHASES: Record<string, string> = {
  maduro: 'phase-maduro', crecimiento: 'phase-crecimiento',
  emergente: 'phase-emergente', activacion: 'phase-activacion',
}

export const revalidate = 60

export default async function DashboardPage() {
  const [stats, totalActors] = await Promise.all([getDashboardStats(), getActorCount()])

  const totalStartups = stats.reduce((s, c) => s + c.startups, 0)
  const totalInversores = stats.reduce((s, c) => s + c.inversores, 0)
  const totalEsos = stats.reduce((s, c) => s + c.esos, 0)
  const totalMujeres = stats.reduce((s, c) => s + c.lideradas_mujer, 0)

  return (
    <AppLayout title="Dashboard">
      {/* KPIs */}
      <div className="kpi-grid anim-fade-up">
        <div className="kpi-card delay-1">
          <div className="kpi-icon" style={{ background: 'rgba(0,167,157,.08)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="var(--accent)" strokeWidth="1.5" />
              <path d="M10 6V10L13 13" stroke="var(--accent)" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="kpi-info">
            <div className="kpi-value" style={{ color: 'var(--accent)' }}>{totalActors.toLocaleString()}</div>
            <div className="kpi-label">Actores totales</div>
          </div>
        </div>
        <div className="kpi-card delay-2">
          <div className="kpi-icon" style={{ background: 'rgba(99,102,241,.08)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M4 14L8 10L11 13L16 7" stroke="#6366f1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="kpi-info">
            <div className="kpi-value" style={{ color: '#6366f1' }}>{totalStartups}</div>
            <div className="kpi-label">Startups</div>
          </div>
        </div>
        <div className="kpi-card delay-3">
          <div className="kpi-icon" style={{ background: 'rgba(245,158,11,.08)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <rect x="4" y="8" width="12" height="8" rx="2" stroke="#f59e0b" strokeWidth="1.5" />
              <path d="M7 8V6a3 3 0 016 0v2" stroke="#f59e0b" strokeWidth="1.5" />
            </svg>
          </div>
          <div className="kpi-info">
            <div className="kpi-value" style={{ color: '#f59e0b' }}>{totalInversores}</div>
            <div className="kpi-label">Inversores</div>
          </div>
        </div>
        <div className="kpi-card delay-4">
          <div className="kpi-icon" style={{ background: 'rgba(16,185,129,.08)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="8" cy="7" r="3" stroke="#10b981" strokeWidth="1.5" />
              <circle cx="14" cy="9" r="2" stroke="#10b981" strokeWidth="1.5" />
              <path d="M2 16c0-3 2.7-5 6-5s6 2 6 5" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="kpi-info">
            <div className="kpi-value" style={{ color: '#10b981' }}>{totalEsos}</div>
            <div className="kpi-label">ESOs</div>
          </div>
        </div>
        <div className="kpi-card delay-5">
          <div className="kpi-icon" style={{ background: 'rgba(236,72,153,.08)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2l2 6h6l-5 4 2 6-5-4-5 4 2-6L2 8h6z" stroke="#ec4899" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="kpi-info">
            <div className="kpi-value" style={{ color: '#ec4899' }}>
              {totalActors > 0 ? Math.round((totalMujeres / totalActors) * 100) : 0}%
            </div>
            <div className="kpi-label">Lideradas por mujer</div>
          </div>
        </div>
        <div className="kpi-card delay-6">
          <div className="kpi-icon" style={{ background: 'rgba(27,42,74,.06)' }}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L2 6v8l8 4 8-4V6L10 2z" stroke="var(--fg)" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="kpi-info">
            <div className="kpi-value">6</div>
            <div className="kpi-label">Países</div>
          </div>
        </div>
      </div>

      {/* País cards */}
      <div className="section-header">
        <h2>Ecosistemas por país</h2>
        <a href="/pais" className="btn">Ver detalle →</a>
      </div>

      {stats.length === 0 ? (
        <div className="empty-state anim-fade-up">
          <svg viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" /><path d="M16 24h16M24 16v16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          <h3>Sin datos aún</h3>
          <p>Los actores aprobados aparecerán aquí una vez que se carguen en la base de datos.</p>
        </div>
      ) : (
        <div className="country-grid anim-fade-up delay-3">
          {stats.map((c) => (
            <div key={c.iso2} className="country-card">
              <div className="country-header">
                <div>
                  <div className="country-flag">{FLAGS[c.iso2] ?? '🌎'}</div>
                  <div className="country-name">{c.name}</div>
                </div>
              </div>
              <div className="country-stats">
                <div className="country-stat">
                  <div className="country-stat-val">{c.total}</div>
                  <div className="country-stat-label">Total</div>
                </div>
                <div className="country-stat">
                  <div className="country-stat-val">{c.startups}</div>
                  <div className="country-stat-label">Startups</div>
                </div>
                <div className="country-stat">
                  <div className="country-stat-val">{c.esos}</div>
                  <div className="country-stat-label">ESOs</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
