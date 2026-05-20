import { useAuth } from '../context/AuthContext'
import { Sidebar } from '../components/ui/Sidebar'
import { AppHeader } from '../components/ui/AppHeader'
import { StudentModuleDetail } from '../features/moduleDetail/StudentModuleDetail'
import { ProfessorModuleDetail } from '../features/moduleDetail/ProfessorModuleDetail'

export function ModuleDetailPage() {
  const { profil } = useAuth()

  return (
    <div className="app-shell">
      <AppHeader />
      <div className="app-body">
        <Sidebar vloga={profil?.vloga ?? 'ucenec'} username={profil?.username ?? ''} />
        {profil?.vloga === 'ucitelj' ? <ProfessorModuleDetail /> : <StudentModuleDetail />}
      </div>
    </div>
  )
}
