import Sidebar from './Sidebar'

export default function AppLayout({ children }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        {children}
      </main>
    </div>
  )
}
