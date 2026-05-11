import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LoginButton } from './components/LoginButton'
import { Callback } from './pages/Callback'

function HomePage() {
  return (
    <div>
      <h1>LearnSmart</h1>
      <LoginButton />
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
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App