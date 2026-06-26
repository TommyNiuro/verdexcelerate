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
  limit?: number
  offset?: number
}) {
  let query = supabase
    .from('actors')
    .select('*, countries(iso2, name)', { count: 'exact' })
    .eq('status', 'aprobado')
    .order('name')

  if (filters?.type && filters.type !== 'todos') {
    query = query.eq('type', filters.type)
  }
  if (filters?.country && filters.country !== 'todos') {
    const countryId = COUNTRY_IDS[filters.country.toUpperCase()]
    if (countryId) query = query.eq('country_id', countryId)
  }
  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }

  query = query.range(filters?.offset ?? 0, (filters?.offset ?? 0) + (filters?.limit ?? 24) - 1)

  const { data, error, count } = await query
  if (error) throw error
  return { actors: data as Actor[], count }
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
