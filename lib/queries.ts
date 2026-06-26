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
