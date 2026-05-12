import { BrowserRouter, Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { LoginButton } from './components/LoginButton'
import { Callback } from './pages/Callback'
import { QuestionnaireWizard } from './features/questionnaire/QuestionnaireWizard'
import type { LearningStyle } from './styles/tokens'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()
  if (loading) return <p>Loading...</p>
  if (!session) return <Navigate to="/" />
  return <>{children}</>
}

function HomePage() {
  const { session } = useAuth()
  if (session) return <Navigate to="/dashboard" />
  return (
    <div>
      <h1>LearnSmart</h1>
      <LoginButton />
    </div>
  )
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
  return (
    <div>
      <h1>Coming soon</h1>
      <p>Welcome to your dashboard!</p>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/questionnaire" element={
            <ProtectedRoute>
              <QuestionnairePage />
            </ProtectedRoute>
          } />
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