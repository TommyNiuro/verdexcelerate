import Sidebar from './Sidebar'
import CommandPalette from './CommandPalette'
import AIChat from './AIChat'

export default function AppLayout({ children }: { children: React.ReactNode; title?: string }) {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main">
        {children}
      </main>
      <CommandPalette />
      <AIChat />
    </div>
  )
}
