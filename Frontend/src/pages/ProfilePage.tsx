import { useAuth } from '../context/AuthContext'
import { BitMascot } from '../components/ui/BitMascot'
import { Sidebar } from '../components/ui/Sidebar'
import { AppHeader } from '../components/ui/AppHeader'
import { StudentProfile } from '../features/profile/StudentProfile'
import { ProfessorProfile } from '../features/profile/ProfessorProfile'

export function ProfilePage() {
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
        {profil.vloga === 'ucitelj' ? <ProfessorProfile /> : <StudentProfile />}
      </div>
    </div>
  )
}
