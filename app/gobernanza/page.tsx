import AppLayout from '@/components/AppLayout'

const PRINCIPLES = [
  {
    title: 'Humano en el bucle',
    icon: '◻',
    color: 'var(--accent)',
    bg: 'rgba(0,167,157,.08)',
    desc: 'Ningún actor pasa a estado aprobado sin validación humana explícita. El campo human_validated debe ser true antes de que el status cambie a aprobado.',
  },
  {
    title: 'Trazabilidad obligatoria',
    icon: '≡',
    color: '#6366f1',
    bg: 'rgba(99,102,241,.08)',
    desc: 'Todo cambio de clasificación requiere classification_rationale. Sin explicación, no hay cambio. El audit_log registra cada acción con actor y diff.',
  },
  {
    title: 'PII solo con Ollama',
    icon: '⊞',
    color: '#f59e0b',
    bg: 'rgba(245,158,11,.08)',
    desc: 'Los datos de personas identificables (nombres, cédulas, correos) se procesan únicamente con modelos locales vía Ollama. Jamás se envían a APIs externas.',
  },
  {
    title: 'Consentimiento explícito',
    icon: '◈',
    color: '#ec4899',
    bg: 'rgba(236,72,153,.08)',
    desc: 'Los actores que pueden ser identificados individualmente deben haber dado consentimiento para su inclusión en el mapeo. Se documenta la fuente y fecha.',
  },
  {
    title: 'Estimación Chapman',
    icon: '◎',
    color: '#10b981',
    bg: 'rgba(16,185,129,.08)',
    desc: 'La cobertura del universo se estima con el método capture-recapture Chapman. La función estimate_universe() calcula el sesgo de captura entre fuentes.',
  },
  {
    title: 'Deduplicación vectorial',
    icon: '⬡',
    color: '#8b5cf6',
    bg: 'rgba(139,92,246,.08)',
    desc: 'La función find_duplicates() usa embeddings de 768 dimensiones (pgvector, coseno) para detectar duplicados. Umbral configurable, siempre requiere revisión humana.',
  },
]

export default function GobernanzaPage() {
  return (
    <AppLayout title="Gobernanza IA">
      <div className="anim-fade-up">
        <div style={{
          background: 'linear-gradient(135deg, rgba(0,167,157,.06), rgba(0,167,157,.02))',
          border: '1px solid rgba(0,167,157,.15)', borderRadius: 'var(--radius-lg)',
          padding: '20px 24px', marginBottom: 28, display: 'flex', gap: 14, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 24 }}>◻</span>
          <div>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>Marco fAIr LAC</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
              VerdeXcelerate implementa los principios del marco fAIr LAC para el uso responsable
              de IA en iniciativas de desarrollo económico en América Latina y el Caribe.
              Estos principios garantizan equidad, transparencia y participación humana en cada
              decisión automatizada del sistema de mapeo.
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
          {PRINCIPLES.map((p, i) => (
            <div key={p.title} className={`actor-card anim-fade-up delay-${i + 1}`}>
              <div className="actor-top">
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: p.bg,
                  display: 'grid', placeItems: 'center', fontSize: 20, color: p.color,
                }}>
                  {p.icon}
                </div>
              </div>
              <div className="actor-name">{p.title}</div>
              <div className="actor-desc" style={{ WebkitLineClamp: 'unset' }}>{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  )
}
