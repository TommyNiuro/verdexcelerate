import { supabase } from './supabase'

export type Actor = {
  id: string
  name: string
  type: string
  country_id: number | null
  description: string | null
  short_pitch: string | null
  website: string | null
  founded_year: number | null
  status: string
  confidence: number | null
  capture_method: string | null
  women_led: boolean | null
  woman_ceo: boolean | null
  activity_level: string
  countries?: { iso2: string; name: string } | null
}

export type Country = {
  id: number
  iso2: string
  name: string
  ecosystem_phase: string | null
  notes: string | null
}

const COUNTRY_IDS: Record<string, number> = { CO: 1, CR: 2, SV: 3, GT: 4, HN: 5, PA: 6 }

export async function getActors(filters?: {
  type?: string
  country?: string
  search?: string
  chain?: number
  sort?: string
  limit?: number
  offset?: number
}) {
  let query = supabase
    .from('actors')
    .select('*, countries(iso2, name)', { count: 'exact' })
    .eq('status', 'aprobado')

  switch (filters?.sort) {
    case 'az':        query = query.order('name', { ascending: true }); break
    case 'za':        query = query.order('name', { ascending: false }); break
    case 'conf-desc': query = query.order('confidence', { ascending: false, nullsFirst: false }); break
    case 'conf-asc':  query = query.order('confidence', { ascending: true,  nullsFirst: true }); break
    case 'recientes':
    default:          query = query.order('created_at', { ascending: false })
  }

  if (filters?.type && filters.type !== 'todos' && filters.type !== 'all') {
    query = query.eq('type', filters.type)
  }
  if (filters?.country && filters.country !== 'todos') {
    const countryId = COUNTRY_IDS[filters.country.toUpperCase()]
    if (countryId) query = query.eq('country_id', countryId)
  }
  if (filters?.chain) {
    query = query.contains('value_chain_ids', [filters.chain])
  }
  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  query = query.range(filters?.offset ?? 0, (filters?.offset ?? 0) + (filters?.limit ?? 24) - 1)

  const { data, error, count } = await query
  if (error) throw error
  return { actors: data as Actor[], count }
}

const COUNTRY_NAME_ID: Record<string, number> = {
  'colombia': 1, 'costa rica': 2, 'el salvador': 3, 'guatemala': 4, 'honduras': 5, 'panama': 6,
}

const TYPE_LABEL_ENUM: Record<string, string> = {
  'startup agritech': 'startup', 'startup': 'startup', 'inversor': 'inversor', 'eso': 'eso',
  'asociacion agricola': 'asociacion_agricola', 'asociacion': 'asociacion_agricola',
  'corporativo': 'corporativo_ancla', 'corporativo ancla': 'corporativo_ancla',
  'academia': 'academia', 'gobierno': 'agencia_gubernamental', 'agencia gubernamental': 'agencia_gubernamental',
  'organismo internacional': 'organismo_internacional', 'organismo': 'organismo_internacional',
  'red/comunidad': 'red_comunidad', 'red': 'red_comunidad', 'red comunidad': 'red_comunidad',
}

export type NewActorInput = {
  name: string
  type: string          // enum value already, or human label
  countryName?: string  // human name (Colombia...)
  country_id?: number
  description?: string
  women_led?: boolean
  value_chain_ids?: number[]
}

function normalizeActor(input: NewActorInput) {
  const typeEnum = TYPE_LABEL_ENUM[(input.type || '').toLowerCase().trim()] ?? input.type
  const countryId = input.country_id
    ?? (input.countryName ? COUNTRY_NAME_ID[input.countryName.toLowerCase().trim()] : undefined)
  return {
    name: input.name.trim(),
    type: typeEnum,
    country_id: countryId ?? null,
    description: input.description?.trim() || null,
    women_led: input.women_led ?? false,
    value_chain_ids: input.value_chain_ids ?? null,
    status: 'pendiente_validacion',
    human_validated: false,
    capture_method: 'manual',
  }
}

/** Inserta un actor. RLS anon exige status=pendiente_validacion + human_validated=false. */
export async function insertActor(input: NewActorInput) {
  const { error } = await supabase.from('actors').insert(normalizeActor(input))
  if (error) throw error
}

/** Inserta varios actores (import CSV). Devuelve cuantos se insertaron. */
export async function insertActors(inputs: NewActorInput[]) {
  const rows = inputs.filter(i => i.name?.trim()).map(normalizeActor)
  if (!rows.length) return 0
  const { error } = await supabase.from('actors').insert(rows)
  if (error) throw error
  return rows.length
}

/** Estadisticas reales del directorio (actores aprobados). */
export async function getDirectoryStats() {
  const { data, error } = await supabase
    .from('actors')
    .select('type, women_led, woman_ceo, confidence')
    .eq('status', 'aprobado')
  if (error) throw error
  const rows = data || []
  const total = rows.length
  const startups = rows.filter(a => (a as any).type === 'startup').length
  const inversores = rows.filter(a => (a as any).type === 'inversor').length
  const womenLed = rows.filter(a => (a as any).women_led || (a as any).woman_ceo).length
  const confVals = rows.map(a => (a as any).confidence).filter((c): c is number => c != null)
  return {
    total,
    startups,
    inversores,
    womenPct: total ? Math.round((womenLed / total) * 100) : 0,
    avgConf: confVals.length ? Math.round((confVals.reduce((s, c) => s + Number(c), 0) / confVals.length) * 100) : 0,
  }
}

export async function getCountries(): Promise<Country[]> {
  const { data, error } = await supabase
    .from('countries')
    .select('*')
    .order('name')
  if (error) throw error
  return data as Country[]
}

export async function getDashboardStats() {
  const { data: actors, error } = await supabase
    .from('actors')
    .select('type, country_id, status, woman_ceo, women_led, countries(iso2, name)')
    .eq('status', 'aprobado')

  if (error) throw error

  const byCountry: Record<string, {
    iso2: string; name: string;
    startups: number; inversores: number; esos: number;
    academia: number; corporativos: number; total: number;
    lideradas_mujer: number;
  }> = {}

  for (const a of (actors || [])) {
    const country = (a as any).countries
    if (!country) continue
    const iso = country.iso2
    if (!byCountry[iso]) {
      byCountry[iso] = { iso2: iso, name: country.name, startups: 0, inversores: 0, esos: 0, academia: 0, corporativos: 0, total: 0, lideradas_mujer: 0 }
    }
    byCountry[iso].total++
    if ((a as any).type === 'startup') byCountry[iso].startups++
    if ((a as any).type === 'inversor') byCountry[iso].inversores++
    if ((a as any).type === 'eso') byCountry[iso].esos++
    if ((a as any).type === 'academia') byCountry[iso].academia++
    if ((a as any).type === 'corporativo_ancla') byCountry[iso].corporativos++
    if ((a as any).woman_ceo || (a as any).women_led) byCountry[iso].lideradas_mujer++
  }

  return Object.values(byCountry)
}

export async function getActorCount(): Promise<number> {
  const { count } = await supabase
    .from('actors')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'aprobado')
  return count ?? 0
}

// ---------------------------------------------------------------------------
// Datos reales para el resto de las pantallas (todo computado desde Supabase)
// ---------------------------------------------------------------------------

export const COUNTRY_BY_ID: Record<number, { iso2: string; name: string }> = {
  1: { iso2: 'CO', name: 'Colombia' }, 2: { iso2: 'CR', name: 'Costa Rica' },
  3: { iso2: 'SV', name: 'El Salvador' }, 4: { iso2: 'GT', name: 'Guatemala' },
  5: { iso2: 'HN', name: 'Honduras' }, 6: { iso2: 'PA', name: 'Panama' },
}

export type GeoActor = {
  id: string; name: string; type: string; city: string | null
  lat: number | null; lng: number | null; country_id: number | null
  website: string | null; short_pitch: string | null
  countries?: { iso2: string; name: string } | null
}

export type SourceRow = {
  id: number; name: string; source_type: string; url: string | null
  is_licensed: boolean | null; risk_tier: number; description: string | null
  data_provided: string | null; coverage: string | null
  update_frequency: string | null; status: string | null
}

export type Benchmark = {
  id: number; metric: string; country_id: number | null; value: number | null
  value_text: string | null; unit: string | null; year: number | null
  source_name: string | null; source_url: string | null; note: string | null
}

export type ZoneRow = {
  id: number; country_id: number; name: string
  zone_type: string | null; rationale: string | null; is_priority: boolean
}

export type RefRow = { id: number; slug: string; name: string }

/** Actores aprobados con coordenadas, para el mapa. */
export async function getGeoActors(): Promise<GeoActor[]> {
  const { data, error } = await supabase
    .from('actors')
    .select('id,name,type,city,lat,lng,country_id,website,short_pitch,countries(iso2,name)')
    .eq('status', 'aprobado')
    .not('lat', 'is', null)
  if (error) throw error
  return (data || []) as unknown as GeoActor[]
}

/** KPIs regionales reales (totales del dataset capturado). */
export async function getRegionalKpis() {
  const { data, error } = await supabase
    .from('actors')
    .select('type,country_id,women_led,woman_ceo,value_chain_ids')
    .eq('status', 'aprobado')
  if (error) throw error
  const rows = (data || []) as any[]
  const total = rows.length
  const startups = rows.filter(r => r.type === 'startup').length
  const inversores = rows.filter(r => r.type === 'inversor').length
  const esos = rows.filter(r => r.type === 'eso').length
  const womenLed = rows.filter(r => r.women_led || r.woman_ceo).length
  const countries = new Set(rows.map(r => r.country_id).filter(Boolean)).size
  const chains = new Set(rows.flatMap(r => r.value_chain_ids || [])).size
  return {
    total, startups, inversores, esos, womenLed,
    womenPct: total ? Math.round((womenLed / total) * 100) : 0,
    countries, chains,
  }
}

/** Conteo de actores por cadena de valor (opcional por pais). */
export async function getValueChainCounts(country_id?: number): Promise<Record<number, number>> {
  let q = supabase.from('actors').select('value_chain_ids').eq('status', 'aprobado')
  if (country_id) q = q.eq('country_id', country_id)
  const { data, error } = await q
  if (error) throw error
  const counts: Record<number, number> = {}
  for (const r of (data || []) as any[]) for (const id of (r.value_chain_ids || [])) counts[id] = (counts[id] || 0) + 1
  return counts
}

/** Conteo de actores por area tematica (opcional por pais). */
export async function getThematicCounts(country_id?: number): Promise<Record<number, number>> {
  let q = supabase.from('actors').select('thematic_area_ids').eq('status', 'aprobado')
  if (country_id) q = q.eq('country_id', country_id)
  const { data, error } = await q
  if (error) throw error
  const counts: Record<number, number> = {}
  for (const r of (data || []) as any[]) for (const id of (r.thematic_area_ids || [])) counts[id] = (counts[id] || 0) + 1
  return counts
}

export async function getValueChains(): Promise<RefRow[]> {
  const { data, error } = await supabase.from('value_chains').select('id,slug,name').order('id')
  if (error) throw error
  return (data || []) as RefRow[]
}

export async function getThematicAreas(): Promise<RefRow[]> {
  const { data, error } = await supabase.from('thematic_areas').select('id,slug,name').order('id')
  if (error) throw error
  return (data || []) as RefRow[]
}

/** Perfil real de un pais: conteos por tipo, genero, cadenas. */
export async function getCountryProfile(country_id: number) {
  const { data, error } = await supabase
    .from('actors')
    .select('type,women_led,woman_ceo,value_chain_ids,confidence')
    .eq('status', 'aprobado')
    .eq('country_id', country_id)
  if (error) throw error
  const rows = (data || []) as any[]
  const total = rows.length
  const byType: Record<string, number> = {}
  for (const r of rows) byType[r.type] = (byType[r.type] || 0) + 1
  const womenLed = rows.filter(r => r.women_led || r.woman_ceo).length
  const chainCounts: Record<number, number> = {}
  for (const r of rows) for (const id of (r.value_chain_ids || [])) chainCounts[id] = (chainCounts[id] || 0) + 1
  return {
    total, byType, womenLed,
    womenPct: total ? Math.round((womenLed / total) * 100) : 0,
    chainCounts,
  }
}

export async function getZones(): Promise<ZoneRow[]> {
  const { data, error } = await supabase
    .from('priority_zones').select('id,country_id,name,zone_type,rationale,is_priority').order('id')
  if (error) throw error
  return (data || []) as ZoneRow[]
}

/** Fuentes con su contexto desarrollado. */
export async function getSourcesDetailed(): Promise<SourceRow[]> {
  const { data, error } = await supabase
    .from('sources')
    .select('id,name,source_type,url,is_licensed,risk_tier,description,data_provided,coverage,update_frequency,status')
    .order('risk_tier').order('name')
  if (error) throw error
  return (data || []) as SourceRow[]
}

/** Benchmarks externos citados (cifras de contexto del ecosistema). */
export async function getBenchmarks(opts?: { country_id?: number; metric?: string }): Promise<Benchmark[]> {
  let q = supabase.from('ecosystem_benchmarks').select('*')
  if (opts?.country_id != null) q = q.eq('country_id', opts.country_id)
  if (opts?.metric) q = q.eq('metric', opts.metric)
  const { data, error } = await q.order('metric')
  if (error) throw error
  return (data || []) as Benchmark[]
}

/** Metricas reales de calidad de datos del dataset capturado. */
export async function getDataQuality() {
  const { data, error } = await supabase
    .from('actors')
    .select('type,country_id,website,description,short_pitch,founded_year,value_chain_ids,thematic_area_ids,confidence,human_validated,women_led,woman_ceo,updated_at')
    .eq('status', 'aprobado')
  if (error) throw error
  const rows = (data || []) as any[]
  const total = rows.length || 1
  const pct = (n: number) => Math.round((n / total) * 100)
  const withWebsite = rows.filter(r => r.website).length
  const withDesc = rows.filter(r => r.description).length
  const withChain = rows.filter(r => (r.value_chain_ids || []).length).length
  const withTheme = rows.filter(r => (r.thematic_area_ids || []).length).length
  const validated = rows.filter(r => r.human_validated).length
  const womenLed = rows.filter(r => r.women_led || r.woman_ceo).length
  const confVals = rows.map(r => Number(r.confidence)).filter(c => !isNaN(c))
  const avgConf = confVals.length ? Math.round((confVals.reduce((s, c) => s + c, 0) / confVals.length) * 100) : 0
  // completitud = promedio de campos clave presentes por actor
  const completeness = pct(rows.reduce((s, r) => {
    const f = [r.website, r.description, r.country_id, (r.value_chain_ids || []).length > 0, (r.thematic_area_ids || []).length > 0]
    return s + f.filter(Boolean).length / f.length
  }, 0))
  // frescura: % actualizado en los ultimos 90 dias
  const now = Date.parse(rows[0]?.updated_at || '') || 0
  const fresh = now ? pct(rows.filter(r => (now - Date.parse(r.updated_at)) < 90 * 864e5).length) : 0
  return {
    total: rows.length,
    completeness,
    websitePct: pct(withWebsite), descPct: pct(withDesc),
    chainPct: pct(withChain), themePct: pct(withTheme),
    validatedPct: pct(validated), womenPct: pct(womenLed),
    avgConfidence: avgConf, freshness: fresh,
  }
}
