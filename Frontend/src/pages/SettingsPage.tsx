import { useAuth } from '../context/AuthContext'
import { BitMascot } from '../components/ui/BitMascot'
import { Sidebar } from '../components/ui/Sidebar'
import { AppHeader } from '../components/ui/AppHeader'
import { StudentSettings } from '../features/settings/StudentSettings'
import { ProfessorSettings } from '../features/settings/ProfessorSettings'

export function SettingsPage() {
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
        {profil.vloga === 'ucitelj' ? <ProfessorSettings /> : <StudentSettings />}
      </div>
    </div>
  )
}
