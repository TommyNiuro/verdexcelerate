-- =====================================================================
-- VerdeXcelerate  ·  Mapeo Vivo AgrifoodTech  ·  Esquema canonico v2
-- Postgres 15+ / Supabase
--
-- Principio: la base de datos ES el producto. Reporte, dashboard,
-- perfiles por pais, memo de cobertura y analisis de genero salen como
-- vistas; no se reconstruyen a mano.
--
-- Cobertura del TOR en este esquema:
--   Sec 5  -> taxonomia de actores (enum actor_type + extensiones por tipo)
--   Sec 3  -> paises + zonas prioritarias con geometria (PostGIS)
--   6.1    -> brechas, financiamiento desagregado, genero, alianzas
--   2.2/6.1-> retos de innovacion abierta derivados de brechas
--   4.1.A  -> procedencia por registro + memo de cobertura (captura-recaptura)
--   4.3    -> talleres / eventos de validacion (Fase III)
--   6.2    -> autorregistro con validacion semiautomatica (RLS)
--   Sec 10 -> trazabilidad fAIr LAC: fuente + metodo + modelo IA + humano
-- =====================================================================

create extension if not exists postgis;        -- mapa + zonas prioritarias
create extension if not exists vector;          -- dedup y clasificacion semantica
create extension if not exists pg_trgm;         -- matching difuso de nombres
create extension if not exists "uuid-ossp";
create extension if not exists btree_gin;

-- =====================================================================
-- 0. ENUMS  (taxonomia y dominios controlados)
-- =====================================================================

create type actor_type as enum (
  'startup', 'inversor', 'eso', 'asociacion_agricola', 'corporativo_ancla',
  'academia', 'agencia_gubernamental', 'organismo_internacional', 'red_comunidad'
);
create type scope_level     as enum ('local', 'nacional', 'regional');
create type support_stage    as enum ('idea', 'prototipo', 'crecimiento', 'escala');
create type startup_stage    as enum ('pre_seed', 'seed', 'serie_a', 'post_serie_a');
create type investor_type    as enum (
  'angel', 'vc', 'fondo_impacto', 'dfi', 'microfinanciera', 'capital_semilla', 'corporate_vc'
);
create type activity_level   as enum ('alto', 'medio', 'bajo', 'inactivo', 'desconocido');
create type ecosystem_phase  as enum ('activacion', 'emergente', 'crecimiento', 'maduro');
create type record_status    as enum ('borrador','pendiente_validacion','aprobado','rechazado','archivado');
create type capture_method   as enum (
  'api_oficial','dataset_abierto','web_scraping','extraccion_llm',
  'fuente_secundaria','encuesta_primaria','entrevista_primaria','autorregistro','manual'
);
create type gender    as enum ('mujer','hombre','no_binario','no_declara','desconocido');
create type age_range as enum ('menor_25','25_34','35_44','45_54','mayor_55','desconocido');

-- Tipologia de brechas criticas (TOR 6.1)
create type gap_category as enum ('financiamiento','talento','conectividad','regulacion','mercado','infraestructura','genero');

-- =====================================================================
-- 1. GEOGRAFIA
-- =====================================================================

create table countries (
  id              smallint primary key,
  iso2            char(2) unique not null,
  name            text not null,
  ecosystem_phase ecosystem_phase,
  notes           text,
  geom            geometry(MultiPolygon, 4326)
);

create table priority_zones (
  id           serial primary key,
  country_id   smallint not null references countries(id),
  name         text not null,
  zone_type    text,                              -- departamento / region
  rationale    text,                              -- vulnerabilidad, poblacion indigena, ruralidad
  is_priority  boolean default true,
  geom         geometry(MultiPolygon, 4326)
);
create index idx_priority_zones_geom on priority_zones using gist (geom);
comment on table priority_zones is 'TOR 3.1: zonas de alta vulnerabilidad priorizadas por el proyecto';

create table thematic_areas (
  id    serial primary key,
  slug  text unique not null,
  name  text not null,
  parent_id int references thematic_areas(id)     -- jerarquia opcional de subsectores
);

create table value_chains (                        -- cadenas agroalimentarias (TOR 3.2 / 4.1)
  id   serial primary key,
  slug text unique not null,
  name text not null                               -- cafe, cacao, lacteos, hortalizas, aguacate...
);

-- =====================================================================
-- 2. ACTORES  (tabla central)
-- =====================================================================

create table actors (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  legal_name      text,
  type            actor_type not null,
  country_id      smallint references countries(id),
  priority_zone_id int references priority_zones(id),
  scope           scope_level,
  support_stage   support_stage,                   -- etapa que soporta (ESOs)
  thematic_area_ids int[]  default '{}',
  value_chain_ids   int[]  default '{}',
  activity_level  activity_level default 'desconocido',

  -- Contacto clave (TOR 5)
  website         text,
  linkedin_url    text,
  email           text,
  phone           text,
  contact_name    text,
  contact_role    text,

  description     text,
  short_pitch     text,
  founded_year    smallint,

  -- Genero y edad a nivel organizacion (TOR 5)
  women_led               boolean,
  women_cofounded         boolean,
  woman_ceo               boolean,
  has_programs_for_women  boolean,
  has_programs_for_youth  boolean,

  -- Mapa (TOR 6.2)
  geom            geometry(Point, 4326),
  address         text,

  -- Trazabilidad / gobernanza IA (TOR 4.1.A + Sec 10)
  status              record_status not null default 'pendiente_validacion',
  primary_source_url  text,
  capture_method      capture_method,
  classified_by_model text,                        -- ej. gemini-2.5-flash-lite
  classified_at       timestamptz,
  classification_rationale text,                   -- explicabilidad (fAIr LAC)
  confidence          numeric(4,3) check (confidence between 0 and 1),
  human_validated     boolean default false,
  validated_by        text,
  validated_at        timestamptz,

  embedding       vector(768),                     -- Gemini embeddings (dedup + clasificacion)

  created_at      timestamptz default now(),
  updated_at      timestamptz default now(),

  constraint chk_serie_a check (founded_year is null or founded_year between 1950 and extract(year from now())::int)
);

create index idx_actors_geom      on actors using gist (geom);
create index idx_actors_type      on actors (type);
create index idx_actors_country   on actors (country_id);
create index idx_actors_status    on actors (status);
create index idx_actors_name_trgm on actors using gin (name gin_trgm_ops);
create index idx_actors_thematic  on actors using gin (thematic_area_ids);
create index idx_actors_vchain    on actors using gin (value_chain_ids);
create index idx_actors_embedding on actors using hnsw (embedding vector_cosine_ops);

comment on column actors.status is 'Autorregistro (TOR 6.2): publico envia -> pendiente_validacion -> IA valida -> humano aprueba';
comment on column actors.classification_rationale is 'fAIr LAC: explicabilidad de la decision de la IA, auditable por humano';

-- =====================================================================
-- 3. EXTENSIONES POR TIPO (1:1 con actors)
-- =====================================================================

create table startups (
  actor_id            uuid primary key references actors(id) on delete cascade,
  stage               startup_stage,
  business_model      text,
  serves_smallholders boolean,                     -- usuario/beneficiario = pequeno productor (TOR 3.2)
  smallholder_notes   text,
  smallholder_model_proven boolean,                -- modelo que ha funcionado a escala (TOR 4.2.2)
  -- Resiliencia climatica (TOR 4.2.1)
  measures_co2e       boolean,
  co2e_metric_type    text,                        -- reducidas / evitadas / secuestradas
  co2e_methodology    text,
  team_size           smallint
);
comment on table startups is 'TOR 5: empresas etapa temprana (hasta Serie A) en cadenas agroalimentarias';

create table investors (
  actor_id           uuid primary key references actors(id) on delete cascade,
  investor_type      investor_type,
  bid_lab_supported  boolean default false,        -- SPventures, Pomona Impact, INNOGEN III (TOR 5)
  ticket_min_usd     numeric,
  ticket_max_usd     numeric,
  stages_covered     startup_stage[],
  agrifoodtech_focus boolean,
  women_youth_criteria boolean                      -- criterios/estrategia pro mujeres y jovenes (TOR 4.2.2)
);

create table esos (
  actor_id         uuid primary key references actors(id) on delete cascade,
  eso_type         text,                            -- pre_incubadora/incubadora/aceleradora/venture_studio
  programs_count   smallint,
  cohorts_per_year smallint,
  women_youth_track boolean                          -- track o cupos para mujeres/jovenes
);

-- =====================================================================
-- 4. PERSONAS / FUNDADORES (desagregacion genero y edad, TOR 4.2.1)
-- =====================================================================

create table people (
  id                uuid primary key default uuid_generate_v4(),
  full_name         text not null,
  gender            gender   default 'desconocido',
  age_range         age_range default 'desconocido',
  education         text,
  experience_years  smallint,
  geographic_origin text,
  linkedin_url      text,
  primary_source_url text,
  capture_method    capture_method,
  human_validated   boolean default false,
  created_at        timestamptz default now()
);

create table actor_people (
  actor_id      uuid references actors(id) on delete cascade,
  person_id     uuid references people(id) on delete cascade,
  role          text,
  is_founder    boolean default false,
  is_leadership boolean default false,             -- rol de liderazgo/decision (TOR 4.2.1)
  primary key (actor_id, person_id, role)
);

-- =====================================================================
-- 5. FINANCIAMIENTO (analisis automatizado de rondas, TOR 6.1)
-- =====================================================================

create table funding_rounds (
  id            uuid primary key default uuid_generate_v4(),
  startup_id    uuid not null references actors(id) on delete cascade,
  stage         startup_stage,
  amount_usd    numeric,
  currency_orig text,
  amount_orig   numeric,
  announced_on  date,
  primary_source_url text,
  capture_method capture_method,
  created_at    timestamptz default now()
);
create table round_investors (
  round_id    uuid references funding_rounds(id) on delete cascade,
  investor_id uuid references actors(id) on delete cascade,
  primary key (round_id, investor_id)
);
create index idx_funding_stage   on funding_rounds (stage);
create index idx_funding_startup on funding_rounds (startup_id);

-- =====================================================================
-- 6. PROGRAMAS, EVENTOS Y RELACIONES
-- =====================================================================

-- Convocatorias / programas de aceleracion / concursos (fuente de startups, TOR 4.1.A)
create table programs (
  id           uuid primary key default uuid_generate_v4(),
  operator_id  uuid references actors(id),          -- ESO/corporativo/gobierno que opera
  name         text not null,
  program_type text,                                -- aceleracion / convocatoria / concurso / reto
  country_id   smallint references countries(id),
  edition      text,
  open_call    boolean,
  primary_source_url text
);
create table program_participants (
  program_id uuid references programs(id) on delete cascade,
  actor_id   uuid references actors(id) on delete cascade,
  outcome    text,                                  -- participante / finalista / ganador / graduado
  primary key (program_id, actor_id)
);

-- Eventos / hubs / comunidades (TOR Sec 5: GET Forum, eventos ANDE, Latimpacto)
create table events (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  event_type  text,                                 -- foro / hub / comunidad / plataforma
  scope       scope_level,
  country_id  smallint references countries(id),
  url         text
);

-- Relaciones entre actores (densidad/calidad de red, TOR 4.2.1)
create table actor_relationships (
  id             bigserial primary key,
  from_actor_id  uuid references actors(id) on delete cascade,
  to_actor_id    uuid references actors(id) on delete cascade,
  relationship_type text,                           -- invierte_en/acelera_a/pilotea_con/mentorea/transfiere_tech
  strength       smallint check (strength between 1 and 5),
  source_notes   text,
  unique (from_actor_id, to_actor_id, relationship_type)
);

-- =====================================================================
-- 7. BRECHAS, RETOS DE INNOVACION ABIERTA Y ALIANZAS (TOR 6.1)
-- =====================================================================

create table gaps (
  id          uuid primary key default uuid_generate_v4(),
  category    gap_category not null,
  country_id  smallint references countries(id),    -- null = regional
  priority_zone_id int references priority_zones(id),
  title       text not null,
  description text,
  severity    smallint check (severity between 1 and 5),
  affects_women boolean,                             -- brecha con dimension de genero
  affects_smallholders boolean,                      -- necesidad no resuelta de pequenos productores
  evidence_refs text[]
);
comment on table gaps is 'TOR 6.1: mapa de brechas criticas por pais y region';

-- Retos de innovacion abierta derivados de brechas (TOR 2.2 / 6.1)
create table innovation_challenges (
  id          uuid primary key default uuid_generate_v4(),
  gap_id      uuid references gaps(id),
  title       text not null,
  problem_statement text,
  target_segment text,                               -- p.ej. pequenos productores de cafe en Alta Verapaz
  potential_solvers text,                            -- tipos de startups que podrian resolver
  priority    smallint check (priority between 1 and 5)
);

-- Candidatas a alianza formal (al menos 5, TOR 6.1 Recomendaciones)
create table alliance_candidates (
  id          uuid primary key default uuid_generate_v4(),
  actor_id    uuid references actors(id),
  rationale   text,                                  -- por que es candidata
  component   smallint,                              -- 2 = aceleracion, 3 = inversion
  fit_score   smallint check (fit_score between 1 and 5),
  status      text default 'propuesta'
);

-- =====================================================================
-- 8. PROCEDENCIA / FUENTES  (anexo de referencias + captura-recaptura)
-- =====================================================================

create table sources (
  id          serial primary key,
  name        text not null,
  source_type text,                                  -- api / scraping / documental
  url         text,
  is_licensed boolean,                               -- uso licito documentado (TOR 10)
  tos_notes   text,
  risk_tier   smallint check (risk_tier between 0 and 3)  -- 0 verde ... 3 rojo
);

-- Una fila por (actor, fuente) -> estimacion del universo por solapamiento
create table actor_source_appearances (
  actor_id   uuid references actors(id) on delete cascade,
  source_id  int references sources(id),
  seen_at    timestamptz default now(),
  primary key (actor_id, source_id)
);

-- =====================================================================
-- 9. INVESTIGACION PRIMARIA  (datos sensibles; NO van por IA tier gratuito)
-- =====================================================================

create table validation_events (                     -- talleres Fase III (TOR 4.3)
  id            uuid primary key default uuid_generate_v4(),
  name          text,
  held_on       date,
  modality      text,                                -- virtual / presencial
  country_scope text,                                -- regional o pais
  participants_count smallint,
  notes         text
);

create table interviews (
  id            uuid primary key default uuid_generate_v4(),
  actor_id      uuid references actors(id),
  interviewee   text,
  actor_type    actor_type,
  country_id    smallint references countries(id),
  conducted_on  date,
  consent_given boolean not null default false,      -- consentimiento informado (TOR 10)
  transcript_ref text,                               -- referencia a almacenamiento seguro, NO texto crudo
  coded_themes  text[],
  saturation_flag boolean,                            -- punto de saturacion (TOR 4.2.2)
  pii_redacted  boolean default false,
  created_at    timestamptz default now()
);
comment on table interviews is
  'PII / datos sensibles. Codificacion tematica con IA solo en modelo local (Ollama) o tier de pago con privacidad. NUNCA tier gratuito.';

create table survey_responses (
  id            uuid primary key default uuid_generate_v4(),
  actor_id      uuid references actors(id),
  country_id    smallint references countries(id),
  respondent_gender gender,
  respondent_age age_range,
  founder_education text,
  startup_stage startup_stage,
  funding_sources text[],
  funding_obtained_usd numeric,
  unmet_funding_needs  text,
  barriers      text[],                              -- barreras diferenciadas (mujeres/jovenes)
  serves_smallholders boolean,
  measures_co2e boolean,
  co2e_methodology text,
  consent_given boolean default false,
  created_at    timestamptz default now()
);

-- =====================================================================
-- 10. AUDITORIA (gobernanza: trazabilidad de cambios)
-- =====================================================================

create table audit_log (
  id         bigserial primary key,
  table_name text,
  row_id     uuid,
  action     text,                                  -- insert / update / approve / reject
  actor      text,                                  -- usuario o proceso (ej. enricher@engine)
  diff       jsonb,
  created_at timestamptz default now()
);

-- =====================================================================
-- 11. FUNCIONES
-- =====================================================================

-- updated_at automatico + reset de validacion humana ante cambio material
create or replace function touch_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  if (new.name, new.type, new.country_id) is distinct from (old.name, old.type, old.country_id) then
    new.human_validated = false;                    -- cambio material exige re-validacion
  end if;
  return new;
end; $$ language plpgsql;

create trigger trg_actors_touch before update on actors
  for each row execute function touch_updated_at();

-- Captura-recaptura (estimador de Chapman) para el memo de cobertura (TOR 4.1.A)
-- N_hat = ((n1+1)(n2+1)/(m+1)) - 1   sobre dos fuentes digitales independientes
create or replace function estimate_universe(src1 int, src2 int)
returns numeric as $$
declare n1 int; n2 int; m int;
begin
  select count(*) into n1 from actor_source_appearances where source_id = src1;
  select count(*) into n2 from actor_source_appearances where source_id = src2;
  select count(*) into m from (
    select actor_id from actor_source_appearances where source_id = src1
    intersect
    select actor_id from actor_source_appearances where source_id = src2
  ) t;
  if m = 0 then return null; end if;                 -- sin solapamiento no es estimable
  return round(((n1+1)::numeric * (n2+1) / (m+1)) - 1, 0);
end; $$ language plpgsql;

-- Candidatos a duplicado por similitud de embedding (paso de dedup)
create or replace function find_duplicates(target uuid, max_distance numeric default 0.15)
returns table(candidate_id uuid, candidate_name text, distance numeric) as $$
  select a.id, a.name, (a.embedding <=> t.embedding)
  from actors a, actors t
  where t.id = target
    and a.id <> target
    and a.embedding is not null and t.embedding is not null
    and (a.embedding <=> t.embedding) < max_distance
  order by 3 asc
  limit 10;
$$ language sql stable;

-- =====================================================================
-- 12. VISTAS  (los entregables como queries)
-- =====================================================================

-- 12.1 Indicador de genero por pais (TOR 6.1 Analisis Transversal de Genero)
create view v_female_leadership_by_country as
select c.iso2, c.name,
       count(*) filter (where a.status='aprobado')                      as startups_mapeadas,
       count(*) filter (where a.status='aprobado' and a.woman_ceo)      as con_ceo_mujer,
       count(*) filter (where a.status='aprobado' and a.women_led)      as lideradas_por_mujer,
       round(100.0 * count(*) filter (where a.status='aprobado' and (a.woman_ceo or a.women_led))
             / nullif(count(*) filter (where a.status='aprobado'),0),1) as pct_liderazgo_femenino
from actors a
join startups s on s.actor_id = a.id
join countries c on c.id = a.country_id
group by c.iso2, c.name;

-- 12.2 Brecha de financiamiento por pais x etapa x tipo de inversor (TOR 6.1)
create view v_funding_gap as
select c.iso2, f.stage, i.investor_type,
       count(distinct f.id)         as rondas,
       sum(f.amount_usd)            as monto_total_usd,
       count(distinct f.startup_id) as startups_financiadas
from funding_rounds f
join actors sa on sa.id = f.startup_id
join countries c on c.id = sa.country_id
left join round_investors ri on ri.round_id = f.id
left join investors i on i.actor_id = ri.investor_id
group by c.iso2, f.stage, i.investor_type;

-- 12.3 Memo de cobertura digital (TOR 4.1.A): % capturado por metodo, por pais y tipo
create view v_digital_coverage as
select c.iso2, a.type,
       count(*) as total,
       count(*) filter (where a.capture_method in
         ('web_scraping','extraccion_llm','api_oficial','dataset_abierto'))   as via_digital,
       count(*) filter (where a.capture_method in
         ('encuesta_primaria','entrevista_primaria'))                         as via_primaria,
       round(100.0 * count(*) filter (where a.capture_method in
         ('web_scraping','extraccion_llm','api_oficial','dataset_abierto'))
         / nullif(count(*),0),1)                                              as pct_digital
from actors a join countries c on c.id = a.country_id
group by c.iso2, a.type;

-- 12.4 Presencia en zonas prioritarias (TOR 6.1)
create view v_priority_zone_presence as
select pz.name as zona, c.iso2, a.type, count(*) as actores
from actors a
join priority_zones pz on pz.id = a.priority_zone_id
join countries c on c.id = pz.country_id
where a.status='aprobado'
group by pz.name, c.iso2, a.type;

-- 12.5 Dashboard regional comparativo (materializada; refrescar por cron)
create materialized view mv_country_dashboard as
select c.iso2, c.name, c.ecosystem_phase,
  count(*) filter (where a.type='startup'   and a.status='aprobado') as startups,
  count(*) filter (where a.type='inversor'  and a.status='aprobado') as inversores,
  count(*) filter (where a.type='eso'       and a.status='aprobado') as esos,
  count(*) filter (where a.type='academia'  and a.status='aprobado') as academia,
  count(*) filter (where a.type='corporativo_ancla' and a.status='aprobado') as corporativos,
  count(*) filter (where s.serves_smallholders) as startups_pequenos_productores,
  count(*) filter (where a.woman_ceo or a.women_led) as lideradas_por_mujer
from countries c
left join actors a   on a.country_id = c.id
left join startups s on s.actor_id = a.id
group by c.iso2, c.name, c.ecosystem_phase;

create unique index on mv_country_dashboard (iso2);
-- refresh: select pg_catalog.now(); refresh materialized view concurrently mv_country_dashboard;

-- =====================================================================
-- 13. RLS  (autorregistro con validacion semiautomatica, TOR 6.2)
-- Roles Supabase: anon (publico), authenticated (admin), service_role (motor, bypassa RLS)
-- =====================================================================

alter table actors enable row level security;

create policy "publico lee aprobados" on actors
  for select to anon
  using (status = 'aprobado');

create policy "publico envia pendientes" on actors
  for insert to anon
  with check (status = 'pendiente_validacion' and human_validated = false);

create policy "admin lee todo" on actors
  for select to authenticated using (true);
create policy "admin gestiona" on actors
  for all to authenticated using (true) with check (true);

-- (people, programs, etc. heredan el mismo patron: lectura publica solo de lo aprobado)

-- =====================================================================
-- 14. SEED
-- =====================================================================

insert into countries (id, iso2, name, ecosystem_phase, notes) values
 (1,'CO','Colombia','maduro',    'Mas maduro de la region. Foco Caribe: La Guajira, Sucre, Cordoba (excl. Monteria), Magdalena'),
 (2,'CR','Costa Rica','emergente','Solida infraestructura de innovacion; base agroindustrial exportadora'),
 (3,'SV','El Salvador','crecimiento','Foco Morazan (alta vulnerabilidad y potencial agroalimentario)'),
 (4,'GT','Guatemala','crecimiento','Foco Alta Verapaz (poblacion indigena y ruralidad)'),
 (5,'HN','Honduras','crecimiento','Potencial agroindustrial; brecha pronunciada de financiamiento temprano'),
 (6,'PA','Panama','emergente',  'Ventajas logisticas y de conectividad financiera regional')
on conflict (id) do nothing;

insert into priority_zones (country_id, name, zone_type, rationale) values
 (1,'La Guajira','departamento','Region Caribe; alta vulnerabilidad'),
 (1,'Sucre','departamento','Region Caribe; alta vulnerabilidad'),
 (1,'Cordoba (excl. Monteria)','departamento','Region Caribe; excluye Monteria'),
 (1,'Magdalena','departamento','Region Caribe; alta vulnerabilidad'),
 (3,'Morazan','departamento','Alta vulnerabilidad y potencial agroalimentario'),
 (4,'Alta Verapaz','departamento','Alta concentracion de poblacion indigena y ruralidad')
on conflict do nothing;

insert into thematic_areas (slug, name) values
 ('agtech_insumos','AgTech - insumos y bioinsumos'),
 ('agtech_precision','Agricultura de precision e IoT'),
 ('foodtech','FoodTech - procesamiento y nuevos alimentos'),
 ('trazabilidad','Trazabilidad y blockchain'),
 ('riego_agua','Gestion de agua y riego'),
 ('financiamiento_agro','Fintech agricola y financiamiento'),
 ('logistica_mercado','Logistica y acceso a mercado'),
 ('clima_carbono','Resiliencia climatica y carbono'),
 ('biotecnologia','Biotecnologia agricola')
on conflict (slug) do nothing;

insert into value_chains (slug, name) values
 ('cafe','Cafe'), ('cacao','Cacao'), ('lacteos','Lacteos'), ('hortalizas','Hortalizas'),
 ('aguacate','Aguacate'), ('granos_basicos','Granos basicos'), ('frutas','Frutas'),
 ('cana','Cana de azucar'), ('pesca_acuicultura','Pesca y acuicultura')
on conflict (slug) do nothing;

-- Fuentes con su tier de riesgo (alimenta la estrategia de scraping, doc 04)
insert into sources (name, source_type, url, is_licensed, risk_tier) values
 ('Apollo','api','https://apollo.io',true,0),
 ('Crunchbase API','api','https://crunchbase.com',true,0),
 ('Dealroom API','api','https://dealroom.co',true,0),
 ('Eatable Adventures - State of AgrifoodTech','documental','https://eatableadventures.com',true,0),
 ('IDB AGTECH Innovation Map (Valoral)','documental',null,true,0),
 ('Startup Genome','documental','https://startupgenome.com',true,0),
 ('F6S directorio AgriTech','scraping','https://f6s.com',null,1),
 ('Sitios de aceleradoras / incubadoras','scraping',null,null,1),
 ('Portales de convocatorias y concursos','scraping',null,null,1),
 ('Contxto (rondas LATAM)','scraping','https://contxto.com',null,1),
 ('LinkedIn','manual','https://linkedin.com',false,3)
on conflict do nothing;
