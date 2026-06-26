import AppLayout from '@/components/AppLayout'
import { supabase } from '@/lib/supabase'

async function getBrechas() {
  const { data } = await supabase
    .from('gaps')
    .select('*, countries(name, iso2)')
    .order('severity', { ascending: false })
  return data ?? []
}

export const revalidate = 60

const CAT_COLORS: Record<string, string> = {
  financiamiento: 'badge-purple',
  talento: 'badge-yellow',
  mercado: 'badge-teal',
  infraestructura: 'badge-red',
  regulatorio: 'badge-yellow',
  ecosistema: 'badge-green',
  tecnologia: 'badge-teal',
  genero: 'badge-purple',
}

export default async function BrechasPage() {
  const brechas = await getBrechas()

  return (
    <AppLayout title="Brechas del ecosistema">
      <div className="section-header">
        <h2>Brechas identificadas</h2>
        <span className="badge badge-red">{brechas.length} brechas</span>
      </div>

      {brechas.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 48 48" fill="none"><path d="M24 8v20M24 36v4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" /><circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="2" /></svg>
          <h3>Sin brechas registradas</h3>
          <p>Las brechas se identificarán durante la fase de análisis de ecosistema.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {brechas.map((b: any) => (
            <div key={b.id} className="actor-card">
              <div className="actor-top">
                <div>
                  <div className="actor-name">{b.title}</div>
                  <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                    <span className={`badge ${CAT_COLORS[b.category] ?? 'badge-teal'}`}>{b.category}</span>
                    {b.affects_women && <span className="badge badge-purple">Género</span>}
                    {b.affects_smallholders && <span className="badge badge-yellow">Pequeños agricultores</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: '50%', display: 'grid', placeItems: 'center',
                    background: b.severity >= 4 ? 'rgba(239,68,68,.1)' : b.severity >= 3 ? 'rgba(245,158,11,.1)' : 'rgba(16,185,129,.1)',
                    fontWeight: 700, fontFamily: 'var(--font-mono)',
                    color: b.severity >= 4 ? 'var(--danger)' : b.severity >= 3 ? 'var(--warning)' : 'var(--success)',
                  }}>
                    {b.severity}/5
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--muted)' }}>severidad</div>
                </div>
              </div>
              {b.description && <div className="actor-desc">{b.description}</div>}
              {(b.countries as any)?.name && (
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{(b.countries as any).name}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
