import { useAuth } from '../context/AuthContext'
import { Sidebar } from '../components/ui/Sidebar'
import { StudentModuleDetail } from '../features/moduleDetail/StudentModuleDetail'
import { ProfessorModuleDetail } from '../features/moduleDetail/ProfessorModuleDetail'

export function ModuleDetailPage() {
  const { profil } = useAuth()

  return (
    <div className="dashboard-layout">
      <Sidebar vloga={profil?.vloga ?? 'ucenec'} username={profil?.username ?? ''} />
      {profil?.vloga === 'ucitelj' ? <ProfessorModuleDetail /> : <StudentModuleDetail />}
    </div>
  )
}