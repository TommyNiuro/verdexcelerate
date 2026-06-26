'use client';
import { useState } from 'react';
import AppLayout from '@/components/AppLayout';

type Panel = 'perfil' | 'plataforma' | 'notificaciones' | 'autoregistro' | 'equipo' | 'api' | 'exportar';

const NAV: {key: Panel; label: string; icon: React.ReactNode}[] = [
  {key:'perfil', label:'Mi perfil', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>},
  {key:'plataforma', label:'Plataforma', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06"/></svg>},
  {key:'notificaciones', label:'Notificaciones', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>},
  {key:'autoregistro', label:'Auto-registro', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>},
  {key:'equipo', label:'Equipo', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>},
  {key:'api', label:'API & Integraciones', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>},
  {key:'exportar', label:'Exportar datos', icon:<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>},
];

function Toggle({checked, onChange}: {checked: boolean; onChange: () => void}) {
  return (
    <label className="toggle">
      <input type="checkbox" checked={checked} onChange={onChange}/>
      <span className="toggle-slider"></span>
    </label>
  );
}

const PAISES = ['🇨🇴 Colombia','🇨🇷 Costa Rica','🇸🇻 El Salvador','🇬🇹 Guatemala','🇭🇳 Honduras','🇵🇦 Panama'];

export default function ConfiguracionPage() {
  const [panel, setPanel] = useState<Panel>('perfil');
  const [toastMsg, setToastMsg] = useState('Cambios guardados exitosamente');
  const [toastVisible, setToastVisible] = useState(false);
  const [showPwd, setShowPwd] = useState(false);

  const [t, setT] = useState({
    twofa: true, mantenimiento: false, aiUpdates: true, humanReview: true,
    nuevosActores: true, tendencias: true, autoReg: true, calidad: true, sesgos: true, resumen: false,
    autoRegEnabled: true, aprobacion: true, emailVerif: true, captcha: true,
    crunchbase: true, linkedin: true, gsheets: false,
  });
  const tog = (k: keyof typeof t) => setT(prev => ({...prev, [k]: !prev[k]}));

  function showToast(msg = 'Cambios guardados exitosamente') {
    setToastMsg(msg); setToastVisible(true);
    setTimeout(() => setToastVisible(false), 3000);
  }

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

      <div className="content">
        <div className="settings-layout anim-fade-up">
          {/* Nav */}
          <nav className="settings-nav">
            {NAV.map(n => (
              <button key={n.key} className={`settings-nav-item${panel===n.key?' active':''}`} onClick={() => setPanel(n.key)}>
                {n.icon}{n.label}
              </button>
            ))}
          </nav>

          {/* Panels */}
          <div>

            {/* PERFIL */}
            {panel === 'perfil' && (
              <div className="settings-panel active">
                <div className="settings-section anim-fade-up">
                  <h3>Informacion del perfil</h3>
                  <p>Gestiona la informacion de tu cuenta y organizacion.</p>
                  <div className="avatar-upload">
                    <div className="avatar-large">TS</div>
                    <div>
                      <button className="btn-secondary" style={{marginBottom:6}} onClick={() => showToast('Selecciona una imagen para subir (funcionalidad demo)')}>Cambiar foto</button>
                      <div style={{fontSize:11,color:'var(--muted)'}}>JPG, PNG. Max 2MB</div>
                    </div>
                  </div>
                  <div className="settings-form-row">
                    <div className="form-group"><label className="form-label">Nombre completo</label><input className="form-input" type="text" defaultValue="Ana Maria Rodriguez"/></div>
                    <div className="form-group"><label className="form-label">Correo electronico</label><input className="form-input" type="email" defaultValue="arodriguez@technoserve.org"/></div>
                  </div>
                  <div className="settings-form-row">
                    <div className="form-group"><label className="form-label">Organizacion</label><input className="form-input" type="text" defaultValue="TechnoServe"/></div>
                    <div className="form-group"><label className="form-label">Rol</label><div style={{marginTop:4}}><span className="role-badge">Administrador</span></div></div>
                  </div>
                  <div className="settings-form-row">
                    <div className="form-group"><label className="form-label">Pais</label><select className="form-select"><option>Colombia</option><option>Costa Rica</option><option>El Salvador</option><option>Guatemala</option><option>Honduras</option><option>Panama</option></select></div>
                    <div className="form-group"><label className="form-label">Idioma</label><select className="form-select"><option>Espanol</option><option>English</option><option>Portugues</option></select></div>
                  </div>
                  <div className="btn-row">
                    <button className="btn-primary" onClick={() => showToast()}>Guardar cambios</button>
                    <button className="btn-secondary" onClick={() => showToast('Cambios descartados')}>Cancelar</button>
                  </div>
                </div>
                <div className="settings-section anim-fade-up delay-1">
                  <h3>Seguridad</h3>
                  <p>Gestiona tu contrasena y autenticacion de dos factores.</p>
                  <div className="settings-form-row">
                    <div className="form-group"><label className="form-label">Contrasena actual</label><input className="form-input" type="password" defaultValue="••••••••"/></div>
                    <div className="form-group"><label className="form-label">Nueva contrasena</label><input className="form-input" type="password" placeholder="Minimo 8 caracteres"/></div>
                  </div>
                  <div className="toggle-row">
                    <div className="toggle-info"><div className="toggle-title">Autenticacion de dos factores (2FA)</div><div className="toggle-desc">Agrega una capa adicional de seguridad a tu cuenta</div></div>
                    <Toggle checked={t.twofa} onChange={() => tog('twofa')}/>
                  </div>
                  <div className="btn-row"><button className="btn-primary" onClick={() => showToast()}>Actualizar seguridad</button></div>
                </div>
              </div>
            )}

            {/* PLATAFORMA */}
            {panel === 'plataforma' && (
              <div className="settings-panel active">
                <div className="settings-section anim-fade-up">
                  <h3>Configuracion de la plataforma</h3>
                  <p>Ajustes globales del mapeo vivo VerdeXcelerate.</p>
                  <div className="settings-form-row">
                    <div className="form-group"><label className="form-label">Nombre del proyecto</label><input className="form-input" type="text" defaultValue="VerdeXcelerate - Mapeo Vivo AgrifoodTech"/></div>
                    <div className="form-group"><label className="form-label">Version del mapeo</label><input className="form-input" type="text" defaultValue="v1.0-beta" disabled style={{background:'var(--bg)'}}/></div>
                  </div>
                  <div className="form-group"><label className="form-label">Descripcion</label><textarea className="form-input" defaultValue="Plataforma digital para el mapeo integral del ecosistema AgrifoodTech en 6 paises de America Latina y el Caribe (CO, CR, SV, GT, HN, PA). Proyecto TechnoServe/BID Lab."/></div>
                  <div className="toggle-row"><div className="toggle-info"><div className="toggle-title">Modo de mantenimiento</div><div className="toggle-desc">Desactiva el acceso publico temporalmente</div></div><Toggle checked={t.mantenimiento} onChange={() => tog('mantenimiento')}/></div>
                  <div className="toggle-row"><div className="toggle-info"><div className="toggle-title">Actualizaciones automaticas de IA</div><div className="toggle-desc">Permite que los modelos actualicen perfiles automaticamente</div></div><Toggle checked={t.aiUpdates} onChange={() => tog('aiUpdates')}/></div>
                  <div className="toggle-row"><div className="toggle-info"><div className="toggle-title">Revision humana obligatoria</div><div className="toggle-desc">Requiere aprobacion manual antes de publicar cambios de IA</div></div><Toggle checked={t.humanReview} onChange={() => tog('humanReview')}/></div>
                  <div className="btn-row"><button className="btn-primary" onClick={() => showToast()}>Guardar configuracion</button></div>
                </div>
                <div className="settings-section anim-fade-up delay-1">
                  <h3>Paises y cobertura</h3>
                  <p>Gestiona los paises incluidos en el mapeo.</p>
                  <div style={{display:'flex',flexWrap:'wrap',gap:10}}>
                    {PAISES.map(p => (
                      <span key={p} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'8px 14px',borderRadius:8,background:'var(--accent-soft)',color:'var(--accent)',fontSize:13,fontWeight:500}}>
                        {p} <span style={{cursor:'pointer',opacity:.5}} onClick={() => showToast(`${p} removido del mapeo`)}>&times;</span>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* NOTIFICACIONES */}
            {panel === 'notificaciones' && (
              <div className="settings-panel active">
                <div className="settings-section anim-fade-up">
                  <h3>Preferencias de notificaciones</h3>
                  <p>Controla como y cuando recibes notificaciones del sistema.</p>
                  {[
                    {k:'nuevosActores' as const, title:'Nuevos actores detectados por IA', desc:'Recibir alerta cuando se detecta un nuevo actor en el ecosistema'},
                    {k:'tendencias' as const, title:'Alertas de tendencias', desc:'Notificaciones sobre tendencias emergentes en AgriTech LATAM'},
                    {k:'autoReg' as const, title:'Solicitudes de auto-registro', desc:'Recibir aviso cuando un actor solicita registrarse'},
                    {k:'calidad' as const, title:'Alertas de calidad de datos', desc:'Notificaciones sobre problemas de calidad o duplicados'},
                    {k:'sesgos' as const, title:'Alertas de sesgo de IA', desc:'Recibir alerta cuando se detectan sesgos en los modelos'},
                    {k:'resumen' as const, title:'Resumen semanal por email', desc:'Recibir un resumen semanal del estado del ecosistema'},
                  ].map(n => (
                    <div key={n.k} className="toggle-row">
                      <div className="toggle-info"><div className="toggle-title">{n.title}</div><div className="toggle-desc">{n.desc}</div></div>
                      <Toggle checked={t[n.k]} onChange={() => tog(n.k)}/>
                    </div>
                  ))}
                  <div className="form-group" style={{marginTop:16}}><label className="form-label">Email para notificaciones</label><input className="form-input" type="email" defaultValue="arodriguez@technoserve.org"/></div>
                  <div className="btn-row"><button className="btn-primary" onClick={() => showToast()}>Guardar preferencias</button></div>
                </div>
              </div>
            )}

            {/* AUTO-REGISTRO */}
            {panel === 'autoregistro' && (
              <div className="settings-panel active">
                <div className="settings-section anim-fade-up">
                  <h3>Sistema de auto-registro</h3>
                  <p>Configuracion del formulario publico para que actores del ecosistema se auto-registren en la plataforma.</p>
                  {[
                    {k:'autoRegEnabled' as const, title:'Auto-registro habilitado', desc:'Permitir que actores externos se registren a traves del formulario publico'},
                    {k:'aprobacion' as const, title:'Aprobacion manual requerida', desc:'Los nuevos registros requieren revision y aprobacion de un administrador'},
                    {k:'emailVerif' as const, title:'Verificacion de email', desc:'Enviar correo de verificacion antes de procesar el registro'},
                    {k:'captcha' as const, title:'CAPTCHA anti-spam', desc:'Requiere verificacion CAPTCHA para prevenir registros automatizados'},
                  ].map(n => (
                    <div key={n.k} className="toggle-row">
                      <div className="toggle-info"><div className="toggle-title">{n.title}</div><div className="toggle-desc">{n.desc}</div></div>
                      <Toggle checked={t[n.k]} onChange={() => tog(n.k)}/>
                    </div>
                  ))}
                  <div className="form-group" style={{marginTop:16}}>
                    <label className="form-label">URL publica del formulario</label>
                    <div style={{display:'flex',gap:8}}>
                      <input className="form-input" type="text" defaultValue="https://verdexcelerate.technoserve.org/registro" readOnly style={{background:'var(--bg)',flex:1}}/>
                      <button className="btn-secondary" onClick={() => showToast('URL copiada al portapapeles')}>Copiar</button>
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Campos obligatorios</label>
                    <div style={{display:'flex',flexWrap:'wrap',gap:8}}>
                      {['Nombre','Tipo de actor','Pais','Email','Descripcion'].map(c => (
                        <span key={c} style={{padding:'6px 12px',borderRadius:6,fontSize:12,fontWeight:500,background:'var(--accent-soft)',color:'var(--accent)'}}>{c}</span>
                      ))}
                      {['Genero fundador(a)','Cadena de valor'].map(c => (
                        <span key={c} style={{padding:'6px 12px',borderRadius:6,fontSize:12,fontWeight:500,background:'rgba(245,158,11,.1)',color:'var(--warning)'}}>{c}</span>
                      ))}
                    </div>
                  </div>
                  <div className="btn-row"><button className="btn-primary" onClick={() => showToast()}>Guardar configuracion</button></div>
                </div>
                <div className="settings-section anim-fade-up delay-1">
                  <h3>Solicitudes pendientes</h3>
                  <p>Actores que han solicitado registrarse y esperan aprobacion.</p>
                  <table className="data-table">
                    <thead><tr><th>Actor</th><th>Tipo</th><th>Pais</th><th>Fecha</th><th>Accion</th></tr></thead>
                    <tbody>
                      {[
                        {name:'AgroSmart CR',email:'info@agrosmart.cr',tipo:'Startup',pais:'🇨🇷 Costa Rica',fecha:'Jun 24, 2026'},
                        {name:'FincaTech',email:'hello@fincatech.io',tipo:'Startup',pais:'🇬🇹 Guatemala',fecha:'Jun 23, 2026'},
                        {name:'CafeConnect',email:'admin@cafeconnect.hn',tipo:'ESO',pais:'🇭🇳 Honduras',fecha:'Jun 22, 2026'},
                      ].map(r => (
                        <tr key={r.email}>
                          <td><div style={{fontWeight:600}}>{r.name}</div><div style={{fontSize:11,color:'var(--muted)'}}>{r.email}</div></td>
                          <td>{r.tipo}</td>
                          <td>{r.pais}</td>
                          <td style={{fontFamily:'var(--font-mono)',fontSize:12}}>{r.fecha}</td>
                          <td><button className="btn-primary" style={{padding:'6px 14px',fontSize:12}} onClick={() => showToast('Actor aprobado exitosamente')}>Aprobar</button></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* EQUIPO */}
            {panel === 'equipo' && (
              <div className="settings-panel active">
                <div className="settings-section anim-fade-up">
                  <h3>Miembros del equipo</h3>
                  <p>Gestiona el acceso y los roles del equipo del proyecto.</p>
                  <table className="data-table">
                    <thead><tr><th>Miembro</th><th>Rol</th><th>Pais</th><th>Ultimo acceso</th><th>Estado</th></tr></thead>
                    <tbody>
                      {[
                        {init:'AR',bg:'rgba(0,167,157,.4)',ic:'rgba(0,167,157,.2)',tc:'var(--accent-light)',name:'Ana Maria Rodriguez',email:'arodriguez@technoserve.org',rol:'Administrador',rolBg:'var(--accent-soft)',rolC:'var(--accent)',pais:'🇨🇴',access:'Hoy',estado:'Activo',estadoC:'var(--success)'},
                        {init:'CM',bg:'rgba(99,102,241,.4)',ic:'rgba(99,102,241,.2)',tc:'#818cf8',name:'Carlos Mendez',email:'cmendez@technoserve.org',rol:'Analista',rolBg:'rgba(99,102,241,.1)',rolC:'#6366f1',pais:'🇨🇷',access:'Ayer',estado:'Activo',estadoC:'var(--success)'},
                        {init:'LP',bg:'rgba(236,72,153,.4)',ic:'rgba(236,72,153,.2)',tc:'#f472b6',name:'Laura Perez',email:'lperez@bidlab.org',rol:'Editor',rolBg:'rgba(236,72,153,.1)',rolC:'#ec4899',pais:'🇸🇻',access:'Jun 23',estado:'Activo',estadoC:'var(--success)'},
                        {init:'DV',bg:'rgba(245,158,11,.4)',ic:'rgba(245,158,11,.2)',tc:'#fbbf24',name:'Diego Vargas',email:'dvargas@technoserve.org',rol:'Consultor',rolBg:'rgba(245,158,11,.1)',rolC:'var(--warning)',pais:'🇬🇹',access:'Jun 20',estado:'Inactivo',estadoC:'var(--muted)'},
                      ].map(m => (
                        <tr key={m.email}>
                          <td>
                            <div style={{display:'flex',alignItems:'center',gap:10}}>
                              <div style={{width:32,height:32,borderRadius:8,background:`linear-gradient(135deg,${m.bg},${m.ic})`,display:'grid',placeItems:'center',fontSize:11,fontWeight:600,color:m.tc,flexShrink:0}}>{m.init}</div>
                              <div><div style={{fontWeight:600}}>{m.name}</div><div style={{fontSize:11,color:'var(--muted)'}}>{m.email}</div></div>
                            </div>
                          </td>
                          <td><span style={{padding:'4px 12px',borderRadius:6,fontSize:11,fontWeight:600,background:m.rolBg,color:m.rolC}}>{m.rol}</span></td>
                          <td>{m.pais}</td>
                          <td style={{fontFamily:'var(--font-mono)',fontSize:12}}>{m.access}</td>
                          <td style={{color:m.estadoC,fontWeight:600,fontSize:12}}>{m.estado}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* API */}
            {panel === 'api' && (
              <div className="settings-panel active">
                <div className="settings-section anim-fade-up">
                  <h3>API Keys y endpoints</h3>
                  <p>Claves de acceso para integraciones externas con la plataforma.</p>
                  <div className="form-group">
                    <label className="form-label">API Key (produccion)</label>
                    <div style={{display:'flex',gap:8}}>
                      <input className="form-input" type={showPwd?'text':'password'} defaultValue="vx_live_sk_1234567890abcdef" style={{flex:1,fontFamily:'var(--font-mono)'}}/>
                      <button className="btn-secondary" onClick={() => setShowPwd(!showPwd)}>{showPwd?'Ocultar':'Mostrar'}</button>
                    </div>
                  </div>
                  <div className="form-group"><label className="form-label">API Base URL</label><input className="form-input" type="text" defaultValue="https://api.verdexcelerate.technoserve.org/v1" readOnly style={{background:'var(--bg)',fontFamily:'var(--font-mono)'}}/></div>
                  <div className="form-group"><label className="form-label">Webhook URL</label><input className="form-input" type="text" placeholder="https://tu-servidor.com/webhook"/></div>
                  <div className="toggle-row"><div className="toggle-info"><div className="toggle-title">Integracion Crunchbase</div><div className="toggle-desc">Sincronizacion automatica con Crunchbase Pro</div></div><Toggle checked={t.crunchbase} onChange={() => tog('crunchbase')}/></div>
                  <div className="toggle-row"><div className="toggle-info"><div className="toggle-title">Integracion LinkedIn</div><div className="toggle-desc">Extraccion de perfiles y datos de LinkedIn</div></div><Toggle checked={t.linkedin} onChange={() => tog('linkedin')}/></div>
                  <div className="toggle-row"><div className="toggle-info"><div className="toggle-title">Google Sheets Export</div><div className="toggle-desc">Exportar datos automaticamente a Google Sheets</div></div><Toggle checked={t.gsheets} onChange={() => tog('gsheets')}/></div>
                  <div className="btn-row"><button className="btn-primary" onClick={() => showToast()}>Guardar integraciones</button></div>
                </div>
              </div>
            )}

            {/* EXPORTAR */}
            {panel === 'exportar' && (
              <div className="settings-panel active">
                <div className="settings-section anim-fade-up">
                  <h3>Exportar datos del ecosistema</h3>
                  <p>Descarga los datos del mapeo en diferentes formatos para analisis externo o reportes.</p>
                  <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:12,marginBottom:20}}>
                    {[
                      {emoji:'📊',label:'CSV',desc:'Directorio completo'},
                      {emoji:'📋',label:'Excel',desc:'Con graficos'},
                      {emoji:'🔗',label:'JSON API',desc:'Datos estructurados'},
                      {emoji:'📄',label:'PDF Reporte',desc:'Reporte ejecutivo'},
                    ].map(e => (
                      <div
                        key={e.label}
                        style={{border:'1px solid var(--border)',borderRadius:'var(--radius)',padding:20,textAlign:'center',cursor:'pointer',transition:'all .2s var(--ease-out-expo)'}}
                        onMouseEnter={el => (el.currentTarget.style.borderColor='var(--accent)',el.currentTarget.style.transform='translateY(-2px)')}
                        onMouseLeave={el => (el.currentTarget.style.borderColor='var(--border)',el.currentTarget.style.transform='none')}
                        onClick={() => showToast(`Exportando ${e.label}...`)}
                      >
                        <div style={{fontSize:28,marginBottom:8}}>{e.emoji}</div>
                        <div style={{fontWeight:600,fontSize:13}}>{e.label}</div>
                        <div style={{fontSize:11,color:'var(--muted)'}}>{e.desc}</div>
                      </div>
                    ))}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Filtrar exportacion</label>
                    <select className="form-select">
                      <option>Todos los datos</option><option>Solo startups</option><option>Solo inversores</option>
                      <option>Solo ESOs</option><option>Por pais: Colombia</option><option>Por pais: Costa Rica</option>
                      <option>Zonas prioritarias</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Rango de fechas</label>
                    <div className="settings-form-row">
                      <input className="form-input" type="date" defaultValue="2026-01-01"/>
                      <input className="form-input" type="date" defaultValue="2026-06-25"/>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      <div className={`toast${toastVisible?' show':''}`}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span>{toastMsg}</span>
      </div>
    </AppLayout>
  );
}
