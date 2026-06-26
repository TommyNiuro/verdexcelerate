# VerdeXcelerate — Mapeo Vivo AgrifoodTech

**Cliente:** TechnoServe / BID Lab  
**Cobertura:** Colombia, Costa Rica, El Salvador, Guatemala, Honduras y Panama  
**Estado:** Prototipo de alta fidelidad — desplegado en produccion

---

## Que es esto

Plataforma de inteligencia para mapear, analizar y conectar el ecosistema de innovacion agroalimentaria en Centroamerica y el norte de Sudamerica. El producto central es una base de datos viva de actores (startups, inversores, aceleradoras, academia, gobierno) con trazabilidad completa de cada registro segun los principios fAIr LAC.

Referencia de calidad de diseno: [CARIBEquity Ecosystem Map](https://caribequity.com).

---

## Pantallas del prototipo

| Ruta | Descripcion |
|------|-------------|
| `/` | Landing / launcher con busqueda global y estadisticas del ecosistema |
| `/login` | Onboarding con Google / GitHub / email. Panel de marca TechnoServe |
| `/dashboard` | Vista comparativa regional de los 6 paises con KPIs clave |
| `/directorio` | Directorio filtrable de 2,847+ actores con confianza IA y fuente |
| `/mapa` | Mapa geografico interactivo (preparado para MapLibre / PostGIS) |
| `/pais` | Perfil de ecosistema por pais (Colombia como ejemplo) |
| `/zonas` | Diagnostico de 6 zonas de alta vulnerabilidad con brechas criticas |
| `/brechas` | Analisis de 38 brechas criticas con recomendaciones estrategicas |
| `/fuentes` | Rastreo de 18 fuentes de datos con pipeline de procesamiento |
| `/gobernanza` | Monitoreo de modelos IA, sesgos de genero y auditoria etica |
| `/configuracion` | Panel de admin: perfil, equipo, API keys, autorregistro |

---

## Stack tecnologico (arquitectura completa)

```
verdexcelerate/
├── apps/
│   └── web/                    # Next.js 15 (App Router) -> Vercel
├── services/
│   └── engine/                 # Python 3.12 + Playwright -> Railway
└── packages/
    ├── db/                     # Schema Postgres canonico (schema.sql)
    ├── types/                  # Tipos TS generados desde Supabase
    └── taxonomy/               # Taxonomia compartida (TS + Python)
```

**Web:** Next.js 15 + Supabase + MapLibre. Deploy: Vercel  
**Motor:** Python 3.12 + Playwright + cliente IA multi-proveedor. Deploy: Railway / cron serverless  
**Base de datos:** PostgreSQL 15 + PostGIS + pgvector en Supabase

---

## Base de datos

El schema completo esta en [`schema.sql`](schema.sql). Incluye:

- Taxonomia de 9 tipos de actores con extensiones por tipo
- Cobertura geografica con geometria PostGIS para mapas
- Trazabilidad completa (fuente, metodo de captura, modelo IA, validador humano)
- Gobernanza fAIr LAC: `classification_rationale` auditabe por humano
- RLS de Supabase: publico ve solo actores `aprobados`; admin ve todo
- Vistas de reporting pre-construidas: `v_female_leadership_by_country`, `v_funding_gap`, `v_digital_coverage`, `mv_country_dashboard`
- Funciones: `estimate_universe()` (Chapman capture-recapture), `find_duplicates()` (embeddings vectoriales)

### Desplegar el schema en Supabase

```bash
# 1. Crear proyecto en supabase.com
# 2. Instalar CLI
npm install -g supabase

# 3. Inicializar y aplicar schema
supabase init
supabase db push --db-url "postgresql://postgres:[password]@[host]:5432/postgres" < schema.sql
```

---

## Fuentes de datos

| Fuente | Tipo | Risk Tier |
|--------|------|-----------|
| Apollo | API oficial | 0 (verde) |
| Crunchbase API | API oficial | 0 |
| Dealroom API | API oficial | 0 |
| Eatable Adventures State of AgrifoodTech | Documental | 0 |
| IDB AGTECH Innovation Map (Valoral) | Documental | 0 |
| F6S directorio AgriTech | Scraping | 1 |
| Sitios de aceleradoras / incubadoras | Scraping | 1 |
| Portales de convocatorias | Scraping | 1 |
| Contxto (rondas LATAM) | Scraping | 1 |
| LinkedIn | Manual | 3 (rojo — NO a escala) |

---

## Gobernanza de IA

Segun TOR Seccion 10 + principios fAIr LAC:

- **Dato publico** -> Gemini Flash / Groq (via Cloudflare AI Gateway)
- **PII / investigacion primaria** -> Ollama local. NUNCA tier gratuito externo
- **Sin human_validated = true** -> ningun registro llega a status `aprobado`
- **classification_rationale** obligatorio en cada clasificacion (explicabilidad)
- **Campos women_*** nunca se inventan: sin evidencia -> `null` + revision humana

---

## Zonas prioritarias cubiertas

| Zona | Pais | Razon |
|------|------|-------|
| La Guajira | Colombia | Region Caribe, alta vulnerabilidad |
| Sucre | Colombia | Region Caribe, alta vulnerabilidad |
| Cordoba (excl. Monteria) | Colombia | Region Caribe |
| Magdalena | Colombia | Region Caribe, alta vulnerabilidad |
| Morazan | El Salvador | Alta vulnerabilidad y potencial agroalimentario |
| Alta Verapaz | Guatemala | Alta concentracion de poblacion indigena y ruralidad |

---

## Desarrollo local

```bash
# Clonar
git clone https://github.com/[org]/verdexcelerate.git
cd verdexcelerate

# Abrir en el navegador (prototipo estatico)
open index.html

# O con un servidor local
npx serve .
```

---

## Hoja de ruta (hitos del TOR)

| Fase | Entregable | Hito |
|------|-----------|------|
| **0. Scaffold** | Monorepo, schema, gen-types | 20% |
| **1. Motor minimo** | 3-4 scrapers + cliente IA + clasificacion | 20% |
| **2. Registro inicial** | Pipeline completo + dedup + coverage-memo | **25%** |
| **3. Showroom** | Directorio + mapa + perfiles + dashboard | 25% |
| **4. Produccion** | Deploy completo + docs tecnicas + dataset final | **35%** |

---

## Documentacion tecnica

- [`schema.sql`](schema.sql) — Schema Postgres canonico v2
- [`docs/propuesta-tecnica-ia.md`](docs/propuesta-tecnica-ia.md) — Arquitectura del motor de IA
- [`docs/estrategia-fuentes-scraping.md`](docs/estrategia-fuentes-scraping.md) — Estrategia de scraping por fuente
- [`docs/plan-build.md`](docs/plan-build.md) — Plan completo de build con Claude Code
- [`brand-spec.md`](brand-spec.md) — Especificacion de marca TechnoServe / VerdeXcelerate

---

## Creditos

TechnoServe / BID Lab · Mapeo AgrifoodTech Centroamerica  
Diseno: Claude Open Design · Implementacion: Claude Code
