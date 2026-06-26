# Propuesta Técnica · Stack de IA, Datos y Gobernanza
### VerdeXcelerate · Componente 1 · Mapeo Vivo AgrifoodTech

Cubre los criterios de mayor peso: **calidad técnica (40%)** y **propuesta económica (20%)**. Enfoque exigido por el TOR (Sección 4): maximizar IA y scraping antes de cualquier investigación primaria, operando sobre **tiers gratuitos** con costo de API cercano a cero, sin romper la cláusula de gobernanza de datos.

---

## 1. Arquitectura del pipeline (vista de un vistazo)

```
  FUENTES (doc 04)                MOTOR (Python, serverless)              BASE CANONICA (doc 01)
 ┌────────────────┐   scraping   ┌──────────────────────────────┐       ┌───────────────────┐
 │ APIs / datasets│─────────────▶│ 1. Ingesta (Playwright)      │       │ Postgres+PostGIS  │
 │ aceleradoras   │              │ 2. Normalizacion             │──────▶│ pgvector          │
 │ convocatorias  │              │ 3. Clasificacion IA (taxon.) │       │ provenance x fila │
 │ prensa / F6S   │              │ 4. Enriquecimiento IA        │       └─────────┬─────────┘
 └────────────────┘              │ 5. Dedup (embeddings)        │                 │
                                 │ 6. Cobertura (capt-recapt.)  │      vistas     ▼
        ┌───────── AI GATEWAY (Cloudflare) ──────────┐         ┌───────────────────────────────┐
        │  cache · rate-limit · logging · routing      │         │ Mapeo Vivo (Next.js, Vercel)  │
        └──────┬─────────┬──────────┬──────────────────┘         │ directorio · mapa · dashboard │
               ▼         ▼          ▼                            │ perfiles pais · autorregistro │
          Gemini      Groq      Ollama (local)                   └───────────────────────────────┘
        (publico)  (overflow)  (datos sensibles)
```

La regla que sostiene todo: el **AI Gateway de Cloudflare** se pone delante de los proveedores. Cachea respuestas (no se reprocesa lo mismo dos veces), aplica rate-limit, deja un log auditable de cada llamada (trazabilidad fAIr LAC) y permite **enrutar entre proveedores** desde un solo punto. Si Google vuelve a cortar su tier gratuito (lo hizo 50-80% en diciembre 2025), se cambia el destino sin tocar el resto del sistema.

## 2. Capa de IA multi-proveedor (costo de API ≈ USD 0 en consultoría)

Ningún tier gratuito alcanza solo para el volumen, pero combinados sí, y la combinación es además una protección ante cambios de política. Datos verificados a junio 2026:

| Proveedor | Modelo gratuito | Límites tier gratuito | Rol en el pipeline |
|---|---|---|---|
| **Google Gemini** | 2.5 Flash-Lite / 2.5 Flash | ~15 RPM · 1.500 RPD · 1M TPM · contexto 1M | **Primario**: clasificación masiva y extracción de dato **público** |
| **Groq** (LPU) | llama-3.1-8b-instant | 30 RPM · **14.400 RPD** · 500K TPD | **Overflow** de alto volumen cuando se agota el RPD de Gemini |
| **Groq** | llama-3.3-70b-versatile | 30 RPM · 1.000 RPD · 100K TPD | Extracción difícil que necesita más calidad |
| **Cloudflare** | Workers AI + **AI Gateway** | 10.000 neurons/día (texto chico); embeddings; 100K logs/mes | **Router + caché + logging**; embeddings de respaldo |
| **Gemini Embeddings** | gemini-embedding (768d) | gratis, hasta 10M TPM | Vectores para dedup y clasificación semántica |
| **Ollama (local)** | Llama / Qwen open-weight | sin límite, costo USD 0 | **Datos sensibles** (PII, transcripciones) que no pueden salir a un tier gratuito |

Notas de diseño obligatorias en tier gratuito:
- **Cola con rate-limit** a ~1 req/4 s (15 RPM real de Gemini) y **backoff exponencial con jitter** ante HTTP 429.
- **JSON mode / function calling** (incluido en tier gratuito de Gemini y Groq) para forzar estructura conforme a la taxonomía.
- **Caché por hash de input** en el AI Gateway: las re-corridas de monitoreo no reprocesan lo ya visto.
- **Procesamiento por lotes nocturno** para respetar el límite diario (RPD), repartido entre Gemini y Groq.
- Compatibilidad: Groq es **OpenAI-compatible**, así que el mismo cliente sirve para Groq, Ollama y un eventual fallback de pago, cambiando solo `base_url`.

## 3. Dimensionamiento y throughput (por qué cierra a costo cero)

Universo estimado a clasificar y enriquecer en los 6 países: del orden de **2.000 a 3.500 actores** (startups + inversores + ESOs + academia + gobierno + asociaciones + organismos). A ~3 llamadas IA por actor (clasificar, enriquecer, adjudicar dedup en empates) son **6.000 a 10.500 llamadas**.

- Solo con Gemini gratuito (1.500 RPD): **4 a 7 noches** de lote.
- Sumando Groq llama-3.1-8b-instant (14.400 RPD): **1 a 2 noches**.
- El límite que ata es el RPD, no el de tokens (1M TPM de Gemini sobra para textos de actores).
- Embeddings (uno por actor, ~2.000-3.500): trivial dentro del límite gratuito.

Conclusión defendible para la propuesta económica: **el levantamiento completo de IA cuesta USD 0 y se ejecuta en días, no semanas.** El monitoreo posterior (autorregistro + re-clasificación incremental) es volumen bajo, holgadamente dentro del tier gratuito.

## 4. Clasificación y enriquecimiento (prompt real, salida estructurada)

La IA recibe el dato crudo (nombre, web, descripción scrapeada) y devuelve JSON conforme a la taxonomía de la Sección 5. Few-shot + JSON mode. Esquema de salida:

```json
{
  "actor_type": "startup|inversor|eso|asociacion_agricola|corporativo_ancla|academia|agencia_gubernamental|organismo_internacional|red_comunidad",
  "country_iso2": "CO|CR|SV|GT|HN|PA",
  "scope": "local|nacional|regional",
  "thematic_areas": ["agtech_precision", "trazabilidad"],
  "value_chains": ["cafe", "cacao"],
  "serves_smallholders": true,
  "women_led": null,
  "woman_ceo": null,
  "stage": "seed",
  "confidence": 0.0,
  "rationale": "frase corta y auditable de por que se clasifico asi"
}
```

Reglas del prompt:
- Si un campo no se infiere con evidencia, devolver `null`, nunca inventar (mitiga alucinación y sesgo).
- `confidence < 0.6` o `women_*` no inferible -> el registro queda en `pendiente_validacion` y entra a cola de revisión humana.
- `rationale` obligatorio: es la explicabilidad que exige fAIr LAC y lo que revisa la persona validadora.

## 5. Deduplicación (3 pasos, umbrales explícitos)

6 países y fuentes en varios idiomas generan duplicados. Pipeline:

1. **Bloqueo barato**: agrupar por dominio web normalizado y por nombre normalizado con `pg_trgm` (similitud > 0,6). Reduce el espacio de comparación.
2. **Similitud semántica**: dentro de cada bloque, distancia coseno entre embeddings (`embedding <=> embedding`). Candidato a duplicado si distancia < 0,15 (`find_duplicates()` en el esquema).
3. **Adjudicación LLM** solo en los empates dudosos (0,15-0,25): el modelo decide "misma entidad sí/no" con las dos fichas. Barato porque es un subconjunto chico.

Resultado: una fila canónica por organización, con todas las fuentes registradas en `actor_source_appearances` (insumo del paso 6).

## 6. Memo de cobertura digital con método defendible (captura-recaptura)

El "% del universo capturado" exige un denominador desconocido. Se estima con **captura-recaptura (estimador de Chapman)** cruzando dos fuentes digitales **independientes**:

```
N_hat = ((n1 + 1)(n2 + 1) / (m + 1)) − 1
```

donde n1 = actores vistos en la fuente A, n2 = en la fuente B, m = en ambas. Implementado como `estimate_universe(src1, src2)` en el esquema. Ejemplo: si Crunchbase aporta 180 startups, F6S aporta 150, y 90 aparecen en ambas, el universo estimado es N̂ ≈ 300, y la cobertura digital ≈ (actores únicos capturados / 300). El memo reporta esto **por país y por tipo de actor**, y define dónde concentrar la Fase II primaria (solo donde lo digital no llega: zonas prioritarias, actores rurales sin huella, liderazgo femenino sub-representado).

## 7. Gobernanza y uso responsable de IA (alineado a fAIr LAC · TOR Sección 10)

El TOR prohíbe **usar los datos del mapeo para entrenar o ajustar modelos de terceros**. El tier gratuito de Gemini declara que sus inputs/outputs pueden usarse para mejorar los modelos de Google. Contradicción real, resuelta por **segmentación de dato por sensibilidad**:

| Tipo de dato | Volumen | Ruta de IA | Por qué |
|---|---|---|---|
| Público scrapeado (org, web, descripción) | ~90% | Gemini Flash gratuito (vía AI Gateway) | Dominio público; bajo riesgo; procedencia documentada |
| PII (fundadores, contactos) | ~7% | Ollama local o Flash de pago con privacidad (USD 0,15/0,60 por M, marginal) | Datos personales no van por tier gratuito |
| Primaria (transcripciones, encuestas) | ~3% | **Ollama local** (incl. Whisper local para transcribir) | Cumple fAIr LAC y la cláusula de no-entrenamiento |

Los cinco principios fAIr LAC, mapeados a implementación:

1. **Privacidad y protección de datos** -> segmentación anterior; consentimiento informado (`consent_given`); redacción de PII (`pii_redacted`).
2. **Transparencia y explicabilidad** -> `classification_rationale` por registro; log de cada llamada IA en el AI Gateway.
3. **Supervisión humana** -> ninguna salida de IA pasa a `aprobado` sin `human_validated = true`. La IA propone, una persona dispone.
4. **Equidad y no discriminación** -> ver mitigación de sesgo (§8).
5. **Responsabilidad y seguridad** -> `audit_log` con diff de cada cambio; cláusula de no-entrenamiento replicada en el contrato con cualquier proveedor de API.

## 8. Mitigación de sesgo (no es retórica, es muestreo)

El levantamiento automático sub-representa de forma sistemática a los actores rurales, sin sitio web, informales y liderados por mujeres, justamente la población que el proyecto prioriza. Contramedidas:

- **Auditoría de cobertura por género y geografía** antes de cerrar el dataset (vistas `v_female_leadership_by_country`, `v_priority_zone_presence`): si una zona prioritaria o el liderazgo femenino están bajo el umbral esperado, se dispara muestreo dirigido.
- **Fase II compensatoria**: las entrevistas y encuestas se concentran donde lo digital falla, no como repetición del barrido digital.
- **Campos `women_*` nunca inventados**: si no hay evidencia, `null` y revisión humana, no una suposición del modelo.
- **Fuentes no-digitales** para zonas prioritarias: asociaciones, cooperativas y aliados locales aportan actores que no tienen huella web.

## 9. Observabilidad y resiliencia

- **AI Gateway** como punto único: métricas de uso por proveedor, latencia, tasa de 429, caché hit-rate, y log auditable (hasta 100.000 logs/mes en plan gratuito).
- **Contingencia de proveedor**: cliente IA con abstracción; si Gemini cambia límites, se redirige a Groq u Ollama sin reescribir el pipeline. Diseño multi-proveedor explícito como mitigación de riesgo, no como lujo.
- **Idempotencia**: cada actor scrapeado tiene clave estable (dominio normalizado); re-correr el pipeline no duplica.
- **Reintentos** con backoff y `retry-after`; cola persistente para reanudar lotes interrumpidos.

## 10. Costos

### 10.1 Durante la consultoría

| Concepto | Costo | Nota |
|---|---|---|
| LLM clasificación/enriquecimiento (público) | **USD 0** | Gemini + Groq tier gratuito |
| LLM datos sensibles (PII + primaria) | **USD 0** | Ollama local (incl. transcripción Whisper local) |
| Embeddings (dedup) | **USD 0** | Gemini tier gratuito |
| AI Gateway (caché/logs/routing) | **USD 0** | Cloudflare plan gratuito |
| Enriquecimiento de contactos | **USD 0** | Apollo (ya licenciado por el equipo) |
| Fuentes premium (Crunchbase / Dealroom API) | **opcional / cotizable** | Solo si el cliente exige cobertura exhaustiva de rondas |

### 10.2 Mantenimiento anual post-consultoría (TOR 6.2)

| Concepto | Costo anual | Nota |
|---|---|---|
| Hosting web (Vercel) | USD 0–240 | Gratuito alcanza para tráfico moderado |
| Base de datos (Supabase) | USD 0–300 | Gratuito/Pro |
| Tiles de mapa (MapLibre + tiles propios / OpenFreeMap) | USD 0–120 | MapLibre evita dependencia de proveedor pago |
| IA de monitoreo (re-clasificación incremental) | USD 0–60 | Tier gratuito + caché |
| **Total indicativo** | **USD 0–720 / año** | Arquitectura serverless: sin servidores que mantener |

La sostenibilidad no descansa en presupuesto recurrente alto sino en el **autorregistro con validación semiautomática**: el ecosistema mantiene su propio dato, la IA valida los envíos contra la taxonomía, y TechnoServe solo aprueba, sin conocimientos técnicos avanzados.
