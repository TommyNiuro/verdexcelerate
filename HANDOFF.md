# VerdeXcelerate — Handoff para nueva sesión

## URL de producción
**https://verdexcelerate.vercel.app**

GitHub: https://github.com/TommyNiuro/verdexcelerate  
Proyecto local: `/Users/enderys/Desktop/verdexcelerate`  
Prototipo HTML: `/private/tmp/claude-501/-Users-enderys-Desktop-Claude-Code/d5d88ab4-8e33-4f06-8637-c0c61d3c4769/scratchpad/verdexcelerate/`

---

## Stack
- **Next.js App Router** (v16.2.9), TypeScript
- **Supabase**: PostgreSQL + PostGIS + pgvector. Project ID `extbsoadlcfjjrwkwksv`
- **29 actores seed** en 6 países (CO, CR, SV, GT, HN, PA), todos `status='aprobado'`
- **Vercel**: proyecto `verdexcelerate`, ID `prj_1rCU6Lskd29aEpLsZn4N2d2H5ZUU`

## Tokens de diseño (globals.css)
```
--accent: #00A79D
--fg: #1B2A4A
--bg: #f4f5f7
--sidebar-bg: linear-gradient(195deg,#0f1729,#162038,#1a2744)
Fuentes: DM Serif Display + Inter
App shell: display:grid; grid-template-columns:260px 1fr; height:100vh; overflow:hidden
```

---

## Estado actual por sección

### ✅ HECHO — Dashboard (`/dashboard`)
- Topbar completo: breadcrumb, "En vivo — pipeline activo", buscador (abre con ⌘K), campana con panel de 5 notificaciones, botón exportar
- `<div className="content">` wrapper
- Command palette funcional (⌘K, ESC para cerrar, filtrado de 9 rutas)
- Country filter chips con CountCard animados (useCountUp)
- Tabla "Ecosistemas por pais" + feed "Actividad reciente"
- Insights IA (ancho completo)
- Pipeline de datos con 5 etapas
- TOR Goals + DQ Score (gauge)
- Quick bar: Actor / Exportar / Pipeline (scroll) / Insights (scroll)
- AI chat FAB + panel

### ✅ HECHO — Directorio (`/directorio`)
- Topbar con breadcrumb + botones "Agregar actor / Importar / Exportar"
- Stats strip (2,847 actores, 1,243 startups, etc.)
- Type chips filtro (Todos, Startup, Inversores, ESO, Asociación rural)
- Cards con confidence bar, source badge, country flag
- Paginación con Supabase real
- Filtro por país usa COUNTRY_IDS static map (bug de Supabase JS v2 resuelto)

### ⚠️ PENDIENTE — Secciones secundarias
Las siguientes páginas fueron reescritas con estructura aproximada al prototipo, pero **NO han sido comparadas meticulosamente** con sus HTML prototipos. Revisar cada una contra el prototipo correspondiente:

| Ruta | Prototipo | Estado estimado |
|------|-----------|----------------|
| `/mapa` | `mapa.html` | Placeholder con mapa estático (no interactivo) |
| `/pais` | `pais.html` | Tarjetas de país — verificar vs prototipo |
| `/zonas` | `zonas.html` | Zonas prioritarias — verificar vs prototipo |
| `/brechas` | `brechas.html` | Brechas y retos — verificar vs prototipo |
| `/fuentes` | `fuentes.html` | Fuentes de datos — verificar vs prototipo |
| `/gobernanza` | `gobernanza.html` | Gobernanza IA — verificar vs prototipo |
| `/configuracion` | `configuracion.html` | Configuración — verificar vs prototipo |

---

## Arquitectura de archivos clave

```
app/
  globals.css          — 1,350+ líneas. CSS completo: design system + page-specific
  layout.tsx           — root layout (DM Serif + Inter fonts, metadata)
  dashboard/page.tsx   — 'use client', completo
  directorio/page.tsx  — 'use client', Supabase real vía getActors()
  mapa/page.tsx        — placeholder (mapa no interactivo)
  pais/page.tsx        — perfiles de país
  zonas/page.tsx       — zonas prioritarias
  brechas/page.tsx     — brechas y retos
  fuentes/page.tsx     — fuentes de datos
  gobernanza/page.tsx  — gobernanza IA
  configuracion/page.tsx — configuración
components/
  AppLayout.tsx        — shell: <div class="app-shell"> + <Sidebar> + <main class="main">
  Sidebar.tsx          — nav exacta del prototipo, badges, íconos SVG
lib/
  supabase.ts          — createClient
  queries.ts           — getActors(filter) — country usa COUNTRY_IDS {CO:1,CR:2,...}
```

## Reglas críticas para continuar
1. **NUNCA** editar los repos de proyectos dentro de `Claude Code/`. Solo editar `verdexcelerate/`.
2. El campo `confidence` en Supabase es `DECIMAL(4,3)` rango 0-1 → mostrar como `(val*100).toFixed(0)%`
3. Filtro por país en Supabase JS v2: NO usar `.eq('countries.iso2', val)`. Usar static map: `{ CO:1, CR:2, SV:3, GT:4, HN:5, PA:6 }` y `.eq('country_id', id)`
4. RLS: anon solo lee `status='aprobado'`
5. Después de cambios: `npx tsc --noEmit` → `git add -A` → `git commit` → `git push origin main` → `npx vercel --prod --yes`

## Tarea pendiente principal
**Auditar y corregir las 7 secciones secundarias** para que coincidan exactamente con sus prototipos HTML. El workflow es:
1. Leer `[seccion].html` del prototipo
2. Leer `app/[seccion]/page.tsx` actual
3. Identificar diferencias (estructura, clases CSS, contenido, interactividad)
4. Corregir
5. Verificar si faltan clases CSS en `globals.css` y añadirlas
6. Compilar, commit, deploy
