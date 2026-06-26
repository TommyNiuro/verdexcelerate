import AppLayout from '@/components/AppLayout'
import { supabase } from '@/lib/supabase'

async function getFuentes() {
  const { data } = await supabase.from('sources').select('*').order('risk_tier').order('name')
  return data ?? []
}

export const revalidate = 60

const TIER_CONFIG = [
  { tier: 0, label: 'Tier 0 - Sin riesgo', color: 'badge-green', bg: 'rgba(16,185,129,.06)' },
  { tier: 1, label: 'Tier 1 - Riesgo bajo', color: 'badge-yellow', bg: 'rgba(245,158,11,.06)' },
  { tier: 2, label: 'Tier 2 - Riesgo medio', color: 'badge-purple', bg: 'rgba(139,92,246,.06)' },
  { tier: 3, label: 'Tier 3 - Solo con MITM', color: 'badge-red', bg: 'rgba(239,68,68,.06)' },
]

export default async function FuentesPage() {
  const fuentes = await getFuentes()
  const byTier = TIER_CONFIG.map((t) => ({
    ...t,
    items: fuentes.filter((f: any) => f.risk_tier === t.tier),
  }))

  return (
    <AppLayout title="Fuentes de datos">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }} className="anim-fade-up">
        {byTier.map((tier) => (
          tier.items.length > 0 && (
            <div key={tier.tier}>
              <div className="section-header">
                <h2 style={{ fontSize: 16, fontFamily: 'var(--font-body)', fontWeight: 600 }}>{tier.label}</h2>
                <span className={`badge ${tier.color}`}>{tier.items.length}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12 }}>
                {tier.items.map((f: any) => (
                  <div key={f.id} className="kpi-card" style={{ background: tier.bg, alignItems: 'flex-start', flexDirection: 'column', gap: 10 }}>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{f.name}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span className="tag">{f.source_type}</span>
                      {f.is_licensed && <span className="tag stage">Con licencia</span>}
                    </div>
                    {f.url && (
                      <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: 'var(--accent)', fontFamily: 'var(--font-mono)' }}>
                        {f.url.replace('https://', '')}
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        ))}
      </div>
    </AppLayout>
  )
}
