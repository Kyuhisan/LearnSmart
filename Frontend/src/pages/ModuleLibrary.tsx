import { useAuth } from '../context/AuthContext'
import { BitMascot } from '../components/ui/BitMascot'
import { Sidebar } from '../components/ui/Sidebar'
import { StudentModules } from '../features/modules/StudentModules'
import { ProfessorModules } from '../features/modules/ProfessorModules'

export function ModuleLibrary() {
  const { profil } = useAuth()

  if (!profil) return (
    <div className="page-loader">
      <BitMascot size={80} mood="thinking" float />
    </div>
  )

  return (
    <div className="dashboard-layout">
      <Sidebar vloga={profil.vloga} username={profil.username} />
      {profil.vloga === 'ucitelj' ? <ProfessorModules /> : <StudentModules />}
    </div>
  )
}