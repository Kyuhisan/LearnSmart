import { useAuth } from '../context/AuthContext'
import { BitMascot } from '../components/ui/BitMascot'
import { Sidebar } from '../components/ui/Sidebar'
import { AppHeader } from '../components/ui/AppHeader'
import { Notifications } from '../features/notifications/Notifications'

export function NotificationsPage() {
  const { profil } = useAuth()

  if (!profil) return (
    <div className="page-loader">
      <BitMascot size={80} mood="thinking" float />
    </div>
  )

  return (
    <div className="app-shell">
      <AppHeader />
      <div className="app-body">
        <Sidebar vloga={profil.vloga} username={profil.username} />
        <Notifications />
      </div>
    </div>
  )
}
