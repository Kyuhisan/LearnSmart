import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { Callback } from "./pages/Callback";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { QuestionnaireWizard } from "./features/questionnaire/QuestionnaireWizard";
import type { LearningStyle } from "./styles/tokens";
import { ModuleLibrary } from "./pages/ModuleLibrary";
import { ModuleDetailPage } from "./pages/ModuleDetailPage";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return <p>Loading...</p>;
  if (!session) return <Navigate to="/" />;
  return <>{children}</>;
}

function QuestionnairePage() {
  const navigate = useNavigate();

  const handleComplete = (style: LearningStyle) => {
    console.log("Learning style determined:", style);
    navigate("/dashboard");
  };

  return <QuestionnaireWizard onComplete={handleComplete} />;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/questionnaire" element={<QuestionnairePage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/modules"
            element={
              <ProtectedRoute>
                <ModuleLibrary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/modules/:id"
            element={
              <ProtectedRoute>
                <ModuleDetailPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
