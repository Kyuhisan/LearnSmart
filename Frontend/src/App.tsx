import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { Callback } from './pages/Callback'
import { LoginPage } from './pages/LoginPage'
import { QuestionnaireWizard } from './features/questionnaire/QuestionnaireWizard'
import type { LearningStyle } from './styles/tokens'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return <p>Loading...</p>
  if (!session) return <Navigate to="/" />
  return <>{children}</>
}

function QuestionnairePage() {
  const navigate = useNavigate()

  const handleComplete = (style: LearningStyle) => {
    console.log('Learning style determined:', style)
    navigate('/dashboard')
  }

  return <QuestionnaireWizard onComplete={handleComplete} />
}

function DashboardPage() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Dashboard</h1>
      <p>Dobrodošel, {session?.user.email}!</p>
      <button onClick={handleLogout}>Odjava</button>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App