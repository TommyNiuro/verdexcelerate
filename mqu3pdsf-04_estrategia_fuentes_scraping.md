# Estrategia de Fuentes y Scraping · v2
### VerdeXcelerate · Mapeo Vivo AgrifoodTech

Principio rector: **API y datasets abiertos antes de scrapear; scraping permisivo antes que hostil; nunca scraping masivo de fuentes con términos agresivos.** No es solo prudencia operativa: el TOR (Sección 10) condiciona el pago al uso lícito y a la procedencia documentada, y el scraping descontrolado es un riesgo existencial (bloqueos, baneo de cuentas, incumplimiento contractual). La procedencia se diseña en el pipeline, no se parcha al final.

---

## Tiers por riesgo legal

### Tier 0 · Verde · Datos propios, licenciados o abiertos (empezar aquí)

| Fuente | Método | Qué se extrae | Cumplimiento |
|---|---|---|---|
| **Apollo** (ya licenciado) | API | Contactos clave, empresas, enriquecimiento | Uso conforme a licencia existente |
| **Crunchbase / Dealroom** | **API oficial** | Rondas de inversión, fundación, etapa, inversores | API, no scraper. Cumple ToS |
| **IDB AGTECH Innovation Map** (Valoral Advisors) | Documento / descarga | Mapa regional de actores y subsectores | Publicación abierta del propio BID |
| **Eatable Adventures - State of AgrifoodTech** (Colombia y regional) | Documento | Tamaño de mercado, rondas, actores destacados | Reporte público anual |
| **Startup Genome / GSER** | Documento | Marcos de fase de ecosistema, benchmarks | Publicación abierta |
| **Datasets abiertos** (FAO, IICA, FIDA, gobiernos) | Descarga / API | Cadenas de valor, indicadores territoriales | Licencias abiertas |
| **Registros públicos empresariales** | API / descarga | Razón social, sector, ubicación | Dato público oficial (ver por país abajo) |

Regla: para Crunchbase y Dealroom se usa la **API**. Si el presupuesto no cubre la API, se sustituye por fuentes abiertas y se documenta la limitación en el memo de cobertura.

### Tier 1 · Amarillo · Web pública con scraping permisivo

| Fuente | Método | Qué se extrae | Cumplimiento |
|---|---|---|---|
| **F6S** (directorio AgriTech por país) | Playwright | Listados base de startups por país | Verificar términos; ritmo lento |
| Sitios de **aceleradoras / incubadoras** | Playwright | Portafolios, cohortes, programas | robots.txt + ritmo lento |
| Portales de **convocatorias y concursos** de innovación | Playwright | Startups participantes, finalistas, ganadoras | Contenido público |
| **Contxto** y prensa del ecosistema | Playwright / RSS | Anuncios de rondas, lanzamientos | Citar fuente; no reproducir texto íntegro |
| **THRIVE LATAM**, Village Capital, Startupbootcamp (portafolios) | Playwright | Startups AgriFoodTech de la región | Contenido público de portafolio |

Regla Tier 1: User-Agent identificable, ritmo lento, respeto a robots.txt, `primary_source_url` en cada registro. La IA extrae y estructura; no se republica contenido textual.

### Tier 2 · Naranja · Preferir API de pago sobre scraping
Plataformas con dato valioso pero términos restrictivos. Si tienen API (aunque sea de pago), **se usa la API**. El scraping aquí solo se justifica puntual, documentado y a bajo volumen.

### Tier 3 · Rojo · ToS hostil — minimizar al máximo

| Fuente | Postura |
|---|---|
| **LinkedIn** | Sin scraping masivo. Viola sus términos y expone a bloqueos y baneo de cuenta. Los perfiles de contactos clave se obtienen vía **Apollo** (Tier 0) o consulta manual puntual. El liderazgo femenino se completa en Fase II (primaria), no raspando LinkedIn. |
| Redes con login obligatorio | Solo lo accesible públicamente, bajo volumen; preferir APIs oficiales donde existan |

## Fuentes por país (punto de partida del registro inicial)

Colombia es el ecosistema más maduro y mejor documentado; sirve de referencia para los mercados nacientes de Centroamérica. Los registros mercantiles son la base oficial; conviene verificar el portal vigente de cada uno antes de scrapear.

| País | Registro mercantil / oficial | Fuentes específicas del ecosistema |
|---|---|---|
| **Colombia** | RUES / Confecámaras | Eatable Adventures (State of AgrifoodTech CO), Vertical-i, F6S, programas de regalías e innovación dptal. (énfasis Caribe) |
| **Costa Rica** | Registro Nacional | PROCOMER, agencias de innovación, base agroindustrial exportadora |
| **El Salvador** | CNR (Centro Nacional de Registros) | CONAMYPE, programas de innovación; énfasis Morazán |
| **Guatemala** | Registro Mercantil | Agexport, incubadoras locales; énfasis Alta Verapaz |
| **Honduras** | Cámaras de comercio / registros | **Agro-Hub Zamorano** (clave para AgrifoodTech), EDF Zamorano |
| **Panamá** | Registro Público | SENACYT, hubs logísticos y de innovación |

Plataformas regionales transversales (TOR + ecosistema): LAVCA, ANDE, Endeavor, Latimpacto, GET Forum, redes de fondos BID Lab (SPventures, Pomona Impact, INNOGEN Fondo III). Estas sirven tanto para mapear inversores como para validar actores.

## Detalle operativo por tipo de fuente

| Tipo | Frecuencia inicial | Campos prioritarios | Procedencia |
|---|---|---|---|
| Directorios (F6S, Dealroom) | 1 barrido + refresco trimestral | nombre, web, país, etapa, sector | `web_scraping` / `api_oficial` |
| Aceleradoras / convocatorias | 1 barrido + por nueva convocatoria | startups, cohorte, año, resultado | `web_scraping` |
| Prensa (Contxto) | continuo (RSS) | rondas, montos, inversores, fecha | `web_scraping` |
| APIs (Crunchbase/Dealroom/Apollo) | bajo demanda | rondas, contactos, firmografía | `api_oficial` |
| Registros públicos | 1 descarga + anual | razón social, sector, ubicación | `dataset_abierto` |
| Documentos (reportes) | una vez por edición | benchmarks, actores destacados | `fuente_secundaria` |

## Manejo técnico y ético del scraping

- **robots.txt** respetado por defecto; si una sección lo prohíbe, no se raspa.
- **Ritmo lento** (1 request cada pocos segundos por dominio) y **User-Agent identificable**; nada de fuerza bruta ni rotación agresiva para evadir bloqueos.
- **Sin evasión de logins ni paywalls**; lo que requiere autenticación no se raspa.
- **`primary_source_url`** guardado siempre; payload original en `raw` para auditoría.
- **Lección incorporada**: el scraping masivo de plataformas con ToS hostil no es un atajo, es un pasivo (bloqueos, pérdida de datos, baneo de la infraestructura de cuentas). Por eso el orden por riesgo está en el diseño del pipeline.

## Memo de cobertura: captura-recaptura (ejemplo trabajado)

Para estimar el universo real sin conocer el denominador, se cruzan dos fuentes digitales **independientes** con el estimador de Chapman:

```
N_hat = ((n1 + 1)(n2 + 1) / (m + 1)) − 1
```

Ejemplo (startups AgrifoodTech en Colombia):
- Crunchbase aporta n1 = 180
- F6S aporta n2 = 150
- aparecen en ambas m = 90
- N̂ ≈ ((181 × 151) / 91) − 1 ≈ **299** startups estimadas
- Si el dataset único capturado tiene 240, la **cobertura digital ≈ 80%**, y el 20% restante (rural, sin web, informal) define el foco de la Fase II.

Implementado como `estimate_universe(src1, src2)` en el esquema; la tabla `actor_source_appearances` registra cada (actor, fuente) para calcularlo por país y por tipo de actor.

## Cobertura esperada por método (orientativa para el plan de campo)

| Segmento | Cobertura digital esperada | Cómo se completa |
|---|---|---|
| Startups con web/registro | Alta | Scraping + API + IA |
| Inversores / fondos | Alta | Crunchbase/Dealroom/LAVCA + Apollo |
| ESOs / aceleradoras | Alta | Sitios propios + directorios |
| Academia / gobierno | Media-alta | Sitios institucionales + documentos |
| **Asociaciones rurales / cooperativas** | **Baja** | **Fase II: entrevistas, aliados locales** |
| **Actores en zonas prioritarias** | **Baja** | **Fase II: trabajo de campo dirigido** |
| **Liderazgo femenino (variable women_*)** | **Parcial** | **Fase II + validación humana** |

Las filas en negrita son, por diseño, lo que la aproximación digital no captura y donde se concentra la investigación primaria. Esa decisión sale del memo de cobertura, no de un supuesto.
