import AppLayout from '@/components/AppLayout'
import { supabase } from '@/lib/supabase'

async function getZonas() {
  const { data } = await supabase
    .from('priority_zones')
    .select('*, countries(name, iso2)')
    .order('name')
  return data ?? []
}

export const revalidate = 60

export default async function ZonasPage() {
  const zonas = await getZonas()

  return (
    <AppLayout title="Zonas Prioritarias">
      <div className="section-header">
        <h2>Zonas de intervención</h2>
        <span className="badge badge-teal">{zonas.length} zonas</span>
      </div>
      {zonas.length === 0 ? (
        <div className="empty-state">
          <svg viewBox="0 0 48 48" fill="none"><path d="M24 4L4 14v20l20 10 20-10V14L24 4z" stroke="currentColor" strokeWidth="2" /></svg>
          <h3>Sin zonas configuradas</h3>
          <p>Las zonas prioritarias se agregarán durante la fase de levantamiento de campo.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {zonas.map((z: any) => (
            <div key={z.id} className="actor-card">
              <div className="actor-top">
                <div>
                  <div className="actor-name">{z.name}</div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
                    {z.zone_type} · {(z.countries as any)?.name ?? '—'}
                  </div>
                </div>
                <span className="badge badge-teal">{(z.countries as any)?.iso2 ?? '—'}</span>
              </div>
              {z.description && (
                <div className="actor-desc">{z.description}</div>
              )}
              {z.rationale_for_inclusion && (
                <div style={{ fontSize: 12, color: 'var(--muted)', padding: '10px 0', borderTop: '1px solid var(--border)' }}>
                  <strong>Justificación:</strong> {z.rationale_for_inclusion}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  )
}
