import AppLayout from '@/components/AppLayout'

export default function MapaPage() {
  return (
    <AppLayout title="Mapa Regional">
      <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Placeholder - mapa interactivo se integra con Mapbox/Leaflet en siguiente iteración */}
        <div style={{
          background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
          padding: '48px 32px', textAlign: 'center', minHeight: 480, display: 'flex',
          flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16,
        }}>
          <svg width="64" height="64" viewBox="0 0 64 64" fill="none" style={{ opacity: .3 }}>
            <path d="M32 8L8 20V44L32 56L56 44V20L32 8Z" stroke="var(--accent)" strokeWidth="2" fill="none" />
            <circle cx="32" cy="32" r="8" stroke="var(--accent)" strokeWidth="2" />
            <path d="M32 24V32L38 38" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 22, color: 'var(--fg)', margin: 0 }}>
            Mapa interactivo
          </h3>
          <p style={{ color: 'var(--muted)', maxWidth: 420, margin: 0 }}>
            Visualización georreferenciada de los 847 actores AgrifoodTech en Colombia,
            Costa Rica, El Salvador, Guatemala, Honduras y Panamá.
            Integración con Mapbox disponible en la próxima versión.
          </p>
          <div style={{ display: 'flex', gap: 12, marginTop: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
            {[
              { color: 'var(--accent)', label: 'Startups' },
              { color: '#6366f1', label: 'Inversores' },
              { color: '#f59e0b', label: 'ESOs' },
              { color: '#ec4899', label: 'Academia' },
              { color: '#10b981', label: 'Corporativos' },
            ].map((l) => (
              <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: l.color, display: 'inline-block' }} />
                {l.label}
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {[
            { flag: '🇨🇴', name: 'Colombia', count: 320 },
            { flag: '🇨🇷', name: 'Costa Rica', count: 180 },
            { flag: '🇸🇻', name: 'El Salvador', count: 75 },
            { flag: '🇬🇹', name: 'Guatemala', count: 120 },
            { flag: '🇭🇳', name: 'Honduras', count: 85 },
            { flag: '🇵🇦', name: 'Panamá', count: 67 },
          ].map((c) => (
            <div key={c.name} className="kpi-card">
              <div className="kpi-icon" style={{ background: 'transparent', fontSize: 28 }}>{c.flag}</div>
              <div className="kpi-info">
                <div className="kpi-value">{c.count}</div>
                <div className="kpi-label">{c.name}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
