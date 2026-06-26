import AppLayout from '@/components/AppLayout'

export default function ConfiguracionPage() {
  return (
    <AppLayout title="Configuración">
      <div className="anim-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{
          background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24,
        }}>
          <div className="section-header" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontFamily: 'var(--font-body)', fontWeight: 700, margin: 0 }}>Base de datos</h2>
            <span className="badge badge-green">Conectada</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[
              { label: 'Proyecto Supabase', value: 'extbsoadlcfjjrwkwksv' },
              { label: 'Región', value: 'South America (São Paulo)' },
              { label: 'Extensiones activas', value: 'PostGIS, pgvector, pg_trgm' },
              { label: 'RLS', value: 'Habilitado (anon + authenticated)' },
            ].map((item) => (
              <div key={item.label} style={{ padding: 14, background: 'var(--fg-soft)', borderRadius: 8 }}>
                <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 13, fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24,
        }}>
          <div className="section-header" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontFamily: 'var(--font-body)', fontWeight: 700, margin: 0 }}>Cobertura de captura</h2>
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
            El estimador Chapman calcula el universo total de actores AgrifoodTech a partir de las
            intersecciones entre fuentes independientes. Requiere al menos dos fuentes con actores
            en común para producir un estimado confiable.
          </div>
          <button className="btn btn-accent" style={{ marginTop: 16 }}>
            Ejecutar estimación Chapman
          </button>
        </div>

        <div style={{
          background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: 24,
        }}>
          <div className="section-header" style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontFamily: 'var(--font-body)', fontWeight: 700, margin: 0 }}>Deduplicación vectorial</h2>
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.7 }}>
            La función <code style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>find_duplicates()</code> compara
            los embeddings de 768 dimensiones usando distancia coseno con pgvector. Los pares con
            similitud {'>'} 0.92 se marcan para revisión humana.
          </div>
          <button className="btn" style={{ marginTop: 16 }}>
            Detectar duplicados
          </button>
        </div>
      </div>
    </AppLayout>
  )
}
