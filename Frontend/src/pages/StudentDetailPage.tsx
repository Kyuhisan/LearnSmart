import { useParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BitMascot } from '../components/ui/BitMascot'
import { Sidebar } from '../components/ui/Sidebar'
import { AppHeader } from '../components/ui/AppHeader'
import { ProfessorStudentDetail } from '../features/studentDetail/ProfessorStudentDetail'

export function StudentDetailPage() {
  useParams() // will use { id } when implemented
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
        <ProfessorStudentDetail />
      </div>
    </div>
  )
}
