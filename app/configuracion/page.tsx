'use client'

import { useState } from 'react'
import AppLayout from '@/components/AppLayout'

type Panel = 'perfil' | 'plataforma' | 'notificaciones' | 'autoregistro' | 'equipo' | 'api' | 'exportar'

const NAV_ITEMS: { key: Panel; label: string; icon: React.ReactNode }[] = [
  { key: 'perfil', label: 'Mi perfil', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
  { key: 'plataforma', label: 'Plataforma', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg> },
  { key: 'notificaciones', label: 'Notificaciones', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg> },
  { key: 'autoregistro', label: 'Auto-registro', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg> },
  { key: 'equipo', label: 'Equipo', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg> },
  { key: 'api', label: 'API & Integraciones', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg> },
  { key: 'exportar', label: 'Exportar datos', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" width="18" height="18"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg> },
]

export default function ConfiguracionPage() {
  const [panel, setPanel] = useState<Panel>('perfil')

  const toast = () => alert('Cambios guardados correctamente')

  return (
    <AppLayout>
      <header className="topbar">
        <div>
          <div className="breadcrumb">
            <a href="/dashboard">VerdeXcelerate</a>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9 18 15 12 9 6"/></svg>
            <span>Configuracion</span>
          </div>
          <h1>Configuracion</h1>
        </div>
      </header>

      <div className="settings-layout">
        {/* Settings nav */}
        <nav className="settings-nav">
          {NAV_ITEMS.map(item => (
            <button
              key={item.key}
              className={`settings-nav-item${panel === item.key ? ' active' : ''}`}
              onClick={() => setPanel(item.key)}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* Panel content */}
        <div className="settings-content">

          {panel === 'perfil' && (
            <div className="settings-panel">
              <h2 className="settings-panel-title">Mi perfil</h2>
              <p className="settings-panel-desc">Informacion de tu cuenta y preferencias personales.</p>
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label" htmlFor="nombre">Nombre completo</label>
                  <input id="nombre" className="form-input" type="text" defaultValue="Ana Martinez" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="email">Correo electronico</label>
                  <input id="email" className="form-input" type="email" defaultValue="ana.martinez@technoserve.org" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="org">Organizacion</label>
                  <input id="org" className="form-input" type="text" defaultValue="TechnoServe" />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="rol">Rol</label>
                  <select id="rol" className="form-input">
                    <option>Administrador</option>
                    <option>Analista</option>
                    <option>Viewer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="pais">Pais</label>
                  <select id="pais" className="form-input">
                    <option>Colombia</option>
                    <option>Costa Rica</option>
                    <option>El Salvador</option>
                    <option>Guatemala</option>
                    <option>Honduras</option>
                    <option>Panama</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="idioma">Idioma</label>
                  <select id="idioma" className="form-input">
                    <option>Espanol</option>
                    <option>English</option>
                  </select>
                </div>
              </div>
              <button className="btn btn-primary" onClick={toast}>Guardar cambios</button>

              <div className="settings-section">
                <h3 className="settings-section-title">Seguridad</h3>
                <div className="form-group">
                  <label className="form-label" htmlFor="pwd">Nueva contrasena</label>
                  <input id="pwd" className="form-input" type="password" placeholder="••••••••" />
                </div>
                <div className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-label">Autenticacion de dos factores</div>
                    <div className="settings-toggle-desc">Agrega una capa extra de seguridad a tu cuenta</div>
                  </div>
                  <button className="toggle-btn" onClick={toast} aria-label="Activar 2FA"></button>
                </div>
                <button className="btn btn-secondary" onClick={toast}>Actualizar seguridad</button>
              </div>
            </div>
          )}

          {panel === 'plataforma' && (
            <div className="settings-panel">
              <h2 className="settings-panel-title">Configuracion de plataforma</h2>
              <p className="settings-panel-desc">Personaliza el nombre, descripcion y comportamiento de la plataforma.</p>
              <div className="form-grid">
                <div className="form-group" style={{gridColumn:'1/-1'}}>
                  <label className="form-label" htmlFor="pnombre">Nombre del proyecto</label>
                  <input id="pnombre" className="form-input" type="text" defaultValue="VerdeXcelerate AgriTech Hub" />
                </div>
                <div className="form-group" style={{gridColumn:'1/-1'}}>
                  <label className="form-label" htmlFor="pdesc">Descripcion</label>
                  <textarea id="pdesc" className="form-input" rows={3} defaultValue="Plataforma de inteligencia para el ecosistema AgriTech de Centroamerica y Colombia." />
                </div>
              </div>
              <div className="settings-toggles">
                <div className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-label">Actualizaciones automaticas</div>
                    <div className="settings-toggle-desc">El mapa se actualiza cada 24h con nuevos actores detectados por IA</div>
                  </div>
                  <button className="toggle-btn active" onClick={toast} aria-label="Toggle"></button>
                </div>
                <div className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-label">Modo publico</div>
                    <div className="settings-toggle-desc">Permite acceso de lectura sin autenticacion a paginas seleccionadas</div>
                  </div>
                  <button className="toggle-btn" onClick={toast} aria-label="Toggle"></button>
                </div>
                <div className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-label">Datos anonimizados en exports</div>
                    <div className="settings-toggle-desc">Oculta datos personales en exportaciones publicas</div>
                  </div>
                  <button className="toggle-btn active" onClick={toast} aria-label="Toggle"></button>
                </div>
              </div>
              <div className="settings-section">
                <h3 className="settings-section-title">Paises activos</h3>
                <div className="country-tags">
                  {['🇨🇴 Colombia','🇨🇷 Costa Rica','🇸🇻 El Salvador','🇬🇹 Guatemala','🇭🇳 Honduras','🇵🇦 Panama'].map(c => (
                    <span key={c} className="country-tag">
                      {c}
                      <button onClick={toast} aria-label={`Quitar ${c}`} className="tag-remove">×</button>
                    </span>
                  ))}
                </div>
              </div>
              <button className="btn btn-primary" onClick={toast}>Guardar configuracion</button>
            </div>
          )}

          {panel === 'notificaciones' && (
            <div className="settings-panel">
              <h2 className="settings-panel-title">Notificaciones</h2>
              <p className="settings-panel-desc">Configura como y cuando recibes alertas del sistema.</p>
              <div className="settings-toggles">
                {[
                  { label: 'Nuevo actor detectado', desc: 'Cuando la IA identifica un nuevo actor en el ecosistema' },
                  { label: 'Alerta de brecha critica', desc: 'Cuando se detecta una nueva brecha con severidad 5' },
                  { label: 'Actualizacion de datos', desc: 'Resumen semanal de cambios en el directorio' },
                  { label: 'Reporte mensual', desc: 'Informe automatico del estado del ecosistema cada mes' },
                  { label: 'Alertas de sesgo IA', desc: 'Cuando los modelos detectan desviaciones de sesgo' },
                  { label: 'Nuevas fuentes integradas', desc: 'Al conectar y validar una nueva fuente de datos' },
                ].map(n => (
                  <div key={n.label} className="settings-toggle-row">
                    <div>
                      <div className="settings-toggle-label">{n.label}</div>
                      <div className="settings-toggle-desc">{n.desc}</div>
                    </div>
                    <button className="toggle-btn active" onClick={toast} aria-label={n.label}></button>
                  </div>
                ))}
              </div>
              <div className="form-group" style={{marginTop:'1.5rem'}}>
                <label className="form-label" htmlFor="notif-email">Email para notificaciones</label>
                <input id="notif-email" className="form-input" type="email" defaultValue="ana.martinez@technoserve.org" style={{maxWidth:'400px'}} />
              </div>
              <button className="btn btn-primary" onClick={toast}>Guardar preferencias</button>
            </div>
          )}

          {panel === 'autoregistro' && (
            <div className="settings-panel">
              <h2 className="settings-panel-title">Auto-registro de actores</h2>
              <p className="settings-panel-desc">Configura el formulario publico para que actores del ecosistema se registren directamente.</p>
              <div className="settings-toggles">
                <div className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-label">Formulario publico activo</div>
                    <div className="settings-toggle-desc">Permite que startups, inversores y ESOs se registren via formulario</div>
                  </div>
                  <button className="toggle-btn active" onClick={toast} aria-label="Toggle"></button>
                </div>
                <div className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-label">Revision manual obligatoria</div>
                    <div className="settings-toggle-desc">Cada registro debe ser aprobado antes de aparecer en el directorio</div>
                  </div>
                  <button className="toggle-btn active" onClick={toast} aria-label="Toggle"></button>
                </div>
                <div className="settings-toggle-row">
                  <div>
                    <div className="settings-toggle-label">Clasificacion automatica con IA</div>
                    <div className="settings-toggle-desc">El modelo clasifica el tipo de actor automaticamente al registrarse</div>
                  </div>
                  <button className="toggle-btn active" onClick={toast} aria-label="Toggle"></button>
                </div>
              </div>
              <div className="form-group" style={{marginTop:'1.5rem'}}>
                <label className="form-label">URL del formulario publico</label>
                <div className="form-input" style={{display:'flex',alignItems:'center',gap:'0.5rem',cursor:'default'}}>
                  <span style={{color:'var(--muted)'}}>https://verdexcelerate.com/registro</span>
                  <button className="btn btn-ghost btn-sm" onClick={toast}>Copiar</button>
                </div>
              </div>
              <button className="btn btn-primary" onClick={toast}>Guardar configuracion</button>
            </div>
          )}

          {panel === 'equipo' && (
            <div className="settings-panel">
              <h2 className="settings-panel-title">Equipo</h2>
              <p className="settings-panel-desc">Gestiona los miembros del equipo y sus permisos de acceso.</p>
              <table className="data-table">
                <thead>
                  <tr><th>Usuario</th><th>Rol</th><th>Estado</th><th>Accion</th></tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Ana Martinez', email: 'ana@technoserve.org', rol: 'Admin', estado: 'Activo' },
                    { name: 'Carlos Vega', email: 'cvega@bidlab.org', rol: 'Analista', estado: 'Activo' },
                    { name: 'Sofia Reyes', email: 'sreyes@technoserve.org', rol: 'Viewer', estado: 'Activo' },
                    { name: 'Juan Torres', email: 'jtorres@partner.org', rol: 'Analista', estado: 'Pendiente' },
                  ].map(m => (
                    <tr key={m.email}>
                      <td><div>{m.name}</div><div style={{fontSize:'12px',color:'var(--muted)'}}>{m.email}</div></td>
                      <td>{m.rol}</td>
                      <td><span className={`status-badge ${m.estado === 'Activo' ? 'status-ok' : 'status-warning'}`}>{m.estado}</span></td>
                      <td><button className="btn btn-ghost btn-sm" onClick={toast}>Editar</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button className="btn btn-primary" style={{marginTop:'1rem'}} onClick={toast}>Invitar miembro</button>
            </div>
          )}

          {panel === 'api' && (
            <div className="settings-panel">
              <h2 className="settings-panel-title">API & Integraciones</h2>
              <p className="settings-panel-desc">Administra tus claves de API y conexiones con servicios externos.</p>
              <div className="settings-section">
                <h3 className="settings-section-title">Clave de API</h3>
                <div className="form-group">
                  <label className="form-label">Tu API Key</label>
                  <div style={{display:'flex',gap:'0.5rem'}}>
                    <input className="form-input" type="password" defaultValue="vx_live_sk_9f2a8c3d1e4b7f0a2c5e8d1f" readOnly style={{fontFamily:'monospace'}} />
                    <button className="btn btn-secondary" onClick={toast}>Regenerar</button>
                  </div>
                </div>
              </div>
              <div className="settings-section">
                <h3 className="settings-section-title">Integraciones activas</h3>
                {[
                  { name: 'Crunchbase Pro', status: 'Conectado' },
                  { name: 'LAVCA Database', status: 'Conectado' },
                  { name: 'LinkedIn Scraper', status: 'Conectado' },
                  { name: 'Google Sheets', status: 'Desconectado' },
                ].map(i => (
                  <div key={i.name} className="settings-toggle-row">
                    <div>
                      <div className="settings-toggle-label">{i.name}</div>
                    </div>
                    <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
                      <span className={`status-badge ${i.status === 'Conectado' ? 'status-ok' : 'status-muted'}`}>{i.status}</span>
                      <button className="btn btn-ghost btn-sm" onClick={toast}>{i.status === 'Conectado' ? 'Configurar' : 'Conectar'}</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {panel === 'exportar' && (
            <div className="settings-panel">
              <h2 className="settings-panel-title">Exportar datos</h2>
              <p className="settings-panel-desc">Descarga los datos del ecosistema en diferentes formatos para analisis externos.</p>
              <div className="export-grid">
                {[
                  { label: 'Directorio completo', desc: 'Todos los actores con metadata completa', fmt: 'CSV / XLSX' },
                  { label: 'Analisis de brechas', desc: 'Brechas priorizadas y recomendaciones', fmt: 'PDF / XLSX' },
                  { label: 'Mapa de actores', desc: 'Coordenadas y datos geograficos', fmt: 'GeoJSON / KML' },
                  { label: 'Reporte por pais', desc: 'Ficha completa de cada pais', fmt: 'PDF' },
                  { label: 'Fuentes de datos', desc: 'Linaje y metadata de fuentes', fmt: 'CSV' },
                  { label: 'Datos de gobernanza IA', desc: 'Metricas de modelos y auditoria', fmt: 'JSON' },
                ].map(e => (
                  <div key={e.label} className="export-card">
                    <div className="export-card-body">
                      <div className="export-card-title">{e.label}</div>
                      <div className="export-card-desc">{e.desc}</div>
                      <span className="export-fmt">{e.fmt}</span>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={toast}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      Descargar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  )
}
