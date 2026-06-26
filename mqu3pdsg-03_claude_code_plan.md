# Plan de Build con Claude Code · v2
### VerdeXcelerate · Mapeo Vivo AgrifoodTech

Claude Code es el equipo de ingeniería. Regla de oro: **el esquema Postgres (`packages/db`) es la única fuente de verdad**; los tipos de TypeScript y los modelos Python se generan desde ahí. Web y motor comparten la taxonomía vía `packages/taxonomy`, así nunca se desincronizan.

---

## 1. Estructura del monorepo (pnpm + Turborepo)

```
verdexcelerate/
├── .claude/
│   ├── CLAUDE.md
│   ├── settings.json
│   ├── commands/    scrape-source · enrich-batch · dedup · coverage-memo · gen-types · refresh-dashboard
│   ├── agents/      scraper · enricher · data-modeler · frontend · qa
│   └── rules/       provenance · ai-governance · style · testing
│
├── apps/
│   └── web/                         # Next.js 15 (App Router) -> Vercel
│       ├── app/
│       │   ├── directorio/          # directorio interactivo filtrable (TOR 6.2)
│       │   ├── mapa/                # mapa geografico MapLibre (TOR 6.2)
│       │   ├── pais/[iso]/          # perfiles de ecosistema por pais (TOR 6.2)
│       │   ├── dashboard/           # dashboard regional comparativo (ref. CARIBEquity)
│       │   ├── zonas/[zona]/        # diagnostico de zonas prioritarias (TOR 6.1)
│       │   └── registrar/           # autorregistro + validacion semiautomatica
│       ├── components/  filters · actor-card · region-map · gap-chart
│       └── lib/  supabase.ts · queries.ts
│
├── services/
│   └── engine/                      # Python 3.12 -> Railway / cron serverless
│       ├── scrapers/                # uno por fuente (heredan BaseScraper)
│       │   ├── base.py
│       │   ├── f6s.py · accelerators.py · convocatorias.py · contxto.py ...
│       ├── ai/
│       │   ├── client.py            # cliente multi-proveedor (Gemini/Groq/Ollama) via AI Gateway
│       │   ├── classify.py          # clasificacion taxonomia (JSON mode)
│       │   └── prompts.py
│       ├── dedup/  blocking.py · embeddings.py · adjudicate.py
│       ├── coverage/  chapman.py    # estimador de universo
│       ├── pipeline.py              # orquestador
│       └── tests/
│
└── packages/
    ├── db/        schema.sql (canonico) · migrations/ · seed/
    ├── types/     tipos TS generados desde Supabase (no editar a mano)
    └── taxonomy/  taxonomy.py + taxonomy.ts (enum unico compartido)
```

## 2. `.claude/CLAUDE.md` (se carga en cada sesión)

```markdown
# VerdeXcelerate · Mapeo Vivo AgrifoodTech
Cliente: TechnoServe / BID Lab. Paises: CO, CR, SV, GT, HN, PA.

## Verdad del proyecto
- La base de datos Postgres ES el producto. Reporte/dashboard/perfiles son vistas.
- Taxonomia de actores: packages/taxonomy. No inventar tipos.
- Toda fila lleva primary_source_url + capture_method + classified_by_model + confidence.
- Tipos TS y modelos Python se GENERAN desde packages/db. No editar a mano.

## Gobernanza de IA (innegociable · TOR Seccion 10 · fAIr LAC)
- Dato publico -> Gemini/Groq tier gratuito (via Cloudflare AI Gateway).
- PII / investigacion primaria -> Ollama local. NUNCA tier gratuito.
- Ninguna salida de IA pasa a status 'aprobado' sin human_validated = true.
- Cada clasificacion guarda classification_rationale (explicabilidad).
- Campos women_* NUNCA se inventan: sin evidencia -> null + revision humana.

## Stack
- Web: Next.js 15 + Supabase + MapLibre. Deploy: Vercel.
- Engine: Python 3.12 + Playwright + cliente IA multi-proveedor. Deploy: Railway/cron.
- Cola con rate-limit (15 RPM) + backoff exponencial. JSON mode siempre.

## Estilo de entregables
- Espanol. Sin guion largo. Directo, sin relleno. Tablas con dato real.

## Comandos
/scrape-source <fuente>   /enrich-batch   /dedup   /coverage-memo
/gen-types                /refresh-dashboard
```

## 3. `.claude/settings.json`

```json
{
  "permissions": {
    "allow": [
      "Bash(pnpm *)", "Bash(python *)", "Bash(pytest *)",
      "Bash(supabase *)", "Edit(*)", "Write(*)"
    ],
    "deny": ["Bash(rm -rf *)", "Read(./**/.env)", "Read(./**/*secret*)"]
  },
  "env": { "PYTHONUNBUFFERED": "1" }
}
```

## 4. Comandos slash (contenido real)

`.claude/commands/scrape-source.md`
```markdown
Construye o ejecuta el scraper para la fuente: $ARGUMENTS.
1. Lee services/engine/scrapers/base.py y respeta el contrato BaseScraper.
2. Crea services/engine/scrapers/<fuente>.py.
3. Cada registro DEBE setear primary_source_url y capture_method.
4. Respeta robots.txt, ritmo lento, User-Agent identificable (rule provenance).
5. Agrega test en services/engine/tests/test_<fuente>.py con un fixture HTML real.
6. Corre el scraper en modo dry-run y muestra 5 registros de ejemplo antes de persistir.
```

`.claude/commands/enrich-batch.md`
```markdown
Corre el lote de clasificacion/enriquecimiento sobre actores en status borrador.
1. Usa services/engine/ai/client.py (Gemini primario, Groq overflow, via AI Gateway).
2. Salida en JSON mode conforme a packages/taxonomy. Sin inventar campos (null si no hay evidencia).
3. confidence < 0.6 o women_* no inferible -> status pendiente_validacion.
4. Respeta cola 15 RPM + backoff. Reanuda si se interrumpe (idempotente).
5. Reporta: procesados, % alta confianza, % a revision humana.
```

`.claude/commands/coverage-memo.md`
```markdown
Genera el memo de cobertura digital (TOR 4.1.A).
1. Para cada par de fuentes digitales independientes, corre estimate_universe(src1, src2).
2. Calcula cobertura por pais y por tipo de actor (vista v_digital_coverage).
3. Lista que zonas/segmentos quedan bajo el umbral -> input para Fase II.
4. Exporta a packages/db/reports/coverage_memo.md.
```

`.claude/commands/gen-types.md`
```markdown
Regenera tipos despues de una migracion.
1. Aplica migraciones pendientes (supabase migration up).
2. supabase gen types typescript --local > packages/types/db.ts
3. Verifica que apps/web compila (pnpm --filter web typecheck).
```

## 5. Agentes (subagentes con instrucción propia)

`.claude/agents/scraper.md`
```markdown
---
name: scraper
description: Construye scrapers Playwright por fuente, uno por archivo, respetando BaseScraper y la rule de provenance.
tools: Read, Edit, Write, Bash
---
Eres ingeniero de scraping. Construyes un scraper por fuente que emite registros
con el esquema de actors. Nunca scrapeas fuentes Tier 3 (LinkedIn) a escala.
Cada registro lleva primary_source_url + capture_method. Respetas robots.txt y ritmo lento.
Entregas con test (fixture HTML real) y dry-run de 5 registros.
```

`.claude/agents/enricher.md`
```markdown
---
name: enricher
description: Clasifica y enriquece actores con IA multi-proveedor (tier gratuito), JSON mode, sin inventar campos.
tools: Read, Edit, Bash
---
Clasificas contra la taxonomia (packages/taxonomy) en JSON mode. Dato publico via
Gemini/Groq; dato sensible NUNCA por tier gratuito. Sin evidencia -> null.
Guardas classification_rationale. confidence baja -> pendiente_validacion.
```

`.claude/agents/data-modeler.md` -> migraciones, vistas y funciones Postgres (Chapman, dedup), con `senior-architect`.
`.claude/agents/frontend.md` -> Mapeo Vivo con calidad visual tipo CARIBEquity, con `frontend-design-expert`.
`.claude/agents/qa.md` -> escribe y corre tests; valida provenance y gobernanza antes de aprobar un PR.

## 6. Reglas

`.claude/rules/provenance.md`
```markdown
Ningun registro se persiste sin primary_source_url y capture_method.
Scraping: respeta robots.txt, ritmo lento, User-Agent identificable. Sin Tier 3 a escala.
```
`.claude/rules/ai-governance.md`
```markdown
Dato sensible (PII, transcripciones) -> Ollama local. Nunca tier gratuito de terceros.
Toda salida de IA requiere supervision humana antes de status 'aprobado'.
No usar datos del mapeo para entrenar modelos de terceros.
```
`.claude/rules/style.md` -> espanol, sin guion largo, directo.
`.claude/rules/testing.md` -> todo scraper y toda funcion del pipeline llevan test.

## 7. Contrato `BaseScraper` (interfaz común de los scrapers)

```python
# services/engine/scrapers/base.py
from abc import ABC, abstractmethod
from dataclasses import dataclass, field

@dataclass
class RawActor:
    name: str
    primary_source_url: str          # obligatorio (rule provenance)
    capture_method: str              # web_scraping | api_oficial | dataset_abierto
    country_iso2: str | None = None
    website: str | None = None
    description: str | None = None
    raw: dict = field(default_factory=dict)   # payload original para auditoria

class BaseScraper(ABC):
    source_name: str
    risk_tier: int                   # 0 verde ... 3 rojo (no se permite 3 a escala)

    @abstractmethod
    async def fetch(self) -> list[RawActor]:
        """Devuelve actores crudos. Respeta robots.txt y ritmo lento."""

    def validate(self, items: list[RawActor]) -> list[RawActor]:
        assert self.risk_tier < 3, "Tier 3 prohibido a escala"
        return [i for i in items if i.name and i.primary_source_url]
```

Todos los scrapers heredan esto, así el enriquecedor consume una sola forma de dato.

## 8. Orden de build (alineado a los hitos de pago del TOR)

| Fase | Qué construye Claude Code | Entregable | Hito |
|---|---|---|---|
| **0. Scaffold** | Monorepo, `.claude/`, `schema.sql`, migraciones, `gen-types` | Plan e instrumentos | Hito 2 (20%) |
| **1. Motor mínimo** | `BaseScraper` + 3-4 scrapers Tier 0/1 + cliente IA + clasificación | Instrumentos validados | Hito 2 |
| **2. Registro inicial** | Pipeline completo; pobla `actors`; dedup; `coverage-memo` | Avance + hallazgos prelim. | **Hito 3 (25%)** |
| **3. Showroom** | Directorio + mapa + perfiles país + dashboard + zonas + autorregistro | Taller de validación | Hito 3 |
| **4. Producción** | Deploy, docs técnicas, vistas de reporte, dataset final, materializadas | Reporte + herramienta en producción | **Hito 4 (35%)** |

## 9. Flujo de desarrollo y testing

- **Web**: Vitest (unit) + Playwright (e2e de filtros y mapa). `pnpm --filter web test`.
- **Engine**: pytest con fixtures HTML reales por scraper; tests de `chapman.py` con casos numéricos conocidos; tests de dedup con pares duplicado/no-duplicado. `pytest services/engine`.
- **Gate de PR** (agente `qa`): falla si algún registro nuevo no tiene `primary_source_url`/`capture_method`, o si una salida de IA quedó `aprobado` sin `human_validated`.
- **CI** (GitHub Actions): lint + typecheck + tests en cada PR; `gen-types` verifica que el esquema y los tipos están sincronizados.

## 10. Paralelización (donde Claude Code rinde)

- **Scrapers en paralelo**: un agente `scraper` por fuente; interfaz común (`BaseScraper`) -> se construyen y prueban sin bloquearse.
- **Web y engine en paralelo**: contrato vía `packages/types` y `packages/taxonomy`.
- **`/gen-types`** tras cada migración propaga el esquema a TypeScript automáticamente.

## 11. Skills propias reutilizables

`cc-project-scaffolder` (genera `.claude/` y estructura) · `senior-architect` (migraciones, vistas, funciones) · `senior-backend` (cola IA, backoff, dedup, endpoints) · `senior-frontend` / `frontend-design-expert` (Mapeo Vivo calidad CARIBEquity).
