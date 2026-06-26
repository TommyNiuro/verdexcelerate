import Sidebar from './Sidebar'

export default function AppLayout({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        <header className="topbar">
          <div className="topbar-left">
            <h1>{title}</h1>
          </div>
          <div className="topbar-right">
            <button className="btn">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Buscar
            </button>
            <button className="btn btn-accent">
              <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 3V13M3 8H13" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              Agregar actor
            </button>
          </div>
        </header>
        <div className="content">{children}</div>
      </main>
    </div>
  )
}
