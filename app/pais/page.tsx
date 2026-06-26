import AppLayout from '@/components/AppLayout'
import { getCountries, getDashboardStats } from '@/lib/queries'

const FLAGS: Record<string, string> = { CO: '🇨🇴', CR: '🇨🇷', SV: '🇸🇻', GT: '🇬🇹', HN: '🇭🇳', PA: '🇵🇦' }

export const revalidate = 60

export default async function PaisPage() {
  const [countries, stats] = await Promise.all([getCountries(), getDashboardStats()])
  const statsMap = Object.fromEntries(stats.map((s) => [s.iso2, s]))

  return (
    <AppLayout title="Vista por País">
      <div className="country-grid anim-fade-up">
        {countries.map((c, i) => {
          const s = statsMap[c.iso2]
          return (
            <div key={c.id} className={`country-card anim-fade-up delay-${i + 1}`}>
              <div className="country-header">
                <div>
                  <div className="country-flag">{FLAGS[c.iso2] ?? '🌎'}</div>
                  <div className="country-name">{c.name}</div>
                </div>
                {c.ecosystem_phase && (
                  <span className={`country-phase ${
                    c.ecosystem_phase === 'maduro' ? 'phase-maduro' :
                    c.ecosystem_phase === 'crecimiento' ? 'phase-crecimiento' :
                    c.ecosystem_phase === 'emergente' ? 'phase-emergente' : 'phase-activacion'
                  }`}>
                    {c.ecosystem_phase}
                  </span>
                )}
              </div>

              {c.notes && (
                <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 14, lineHeight: 1.5 }}>{c.notes}</p>
              )}

              <div className="country-stats">
                <div className="country-stat">
                  <div className="country-stat-val">{s?.total ?? 0}</div>
                  <div className="country-stat-label">Total</div>
                </div>
                <div className="country-stat">
                  <div className="country-stat-val">{s?.startups ?? 0}</div>
                  <div className="country-stat-label">Startups</div>
                </div>
                <div className="country-stat">
                  <div className="country-stat-val">{s?.inversores ?? 0}</div>
                  <div className="country-stat-label">Inversores</div>
                </div>
              </div>
              <div className="country-stats" style={{ marginTop: 10 }}>
                <div className="country-stat">
                  <div className="country-stat-val">{s?.esos ?? 0}</div>
                  <div className="country-stat-label">ESOs</div>
                </div>
                <div className="country-stat">
                  <div className="country-stat-val">{s?.academia ?? 0}</div>
                  <div className="country-stat-label">Academia</div>
                </div>
                <div className="country-stat">
                  <div className="country-stat-val" style={{ color: '#ec4899' }}>{s?.lideradas_mujer ?? 0}</div>
                  <div className="country-stat-label">Lideradas mujer</div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </AppLayout>
  )
}
