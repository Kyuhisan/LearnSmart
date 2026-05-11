import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LoginButton } from './components/LoginButton'
import { Callback } from './pages/Callback'
import { QuestionnaireWizard } from './features/questionnaire/QuestionnaireWizard'
import type { LearningStyle } from './styles/tokens'

function HomePage() {
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
    // TODO: persist style to user profile, then navigate to dashboard
    console.log('Learning style determined:', style)
    navigate('/dashboard')
  }

  return <QuestionnaireWizard onComplete={handleComplete} />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
