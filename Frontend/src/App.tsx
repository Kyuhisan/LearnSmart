import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { BitMascot } from "./components/ui/BitMascot";
import { Callback } from "./pages/Callback";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { DashboardPage } from "./pages/DashboardPage";
import { QuestionnaireWizard } from "./features/questionnaire/QuestionnaireWizard";
import type { LearningStyle } from "./styles/tokens";
import { ModuleLibrary } from "./pages/ModuleLibrary";
import { ModuleDetailPage } from "./pages/ModuleDetailPage";
import { ProfilePage } from "./pages/ProfilePage";
import { QuizPage } from "./pages/QuizPage";
import { QuizHistoryPage } from "./pages/QuizHistoryPage";
import { LeaderboardPage } from "./pages/LeaderboardPage";
import { ProgressPage } from "./pages/ProgressPage";
import { NotificationsPage } from "./pages/NotificationsPage";
import { SettingsPage } from "./pages/SettingsPage";
import { StudentDetailPage } from "./pages/StudentDetailPage";
import { StudentsPage } from "./pages/StudentsPage";
import { UploadPage } from "./pages/UploadPage";
import { AIQuizBuilderPage } from "./pages/AIQuizBuilderPage";
import { AnalyticsPage } from "./pages/AnalyticsPage";

function ProtectedRoute({
  children,
  role,
}: {
  children: React.ReactNode
  role?: 'ucenec' | 'ucitelj'
}) {
  const { session, loading, profil } = useAuth();
  if (loading) return <div className="page-loader"><BitMascot size={80} mood="thinking" float /></div>;
  if (!session) return <Navigate to="/" />;
  if (role && profil && profil.vloga !== role) return <Navigate to="/dashboard" />;
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
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          {/* ── Student only ── */}
          <Route
            path="/quiz"
            element={
              <ProtectedRoute role="ucenec">
                <QuizPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/history"
            element={
              <ProtectedRoute role="ucenec">
                <QuizHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leaderboard"
            element={
              <ProtectedRoute role="ucenec">
                <LeaderboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/progress"
            element={
              <ProtectedRoute role="ucenec">
                <ProgressPage />
              </ProtectedRoute>
            }
          />

          {/* ── Both roles ── */}
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* ── Professor only ── */}
          <Route
            path="/students"
            element={
              <ProtectedRoute role="ucitelj">
                <StudentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students/:id"
            element={
              <ProtectedRoute role="ucitelj">
                <StudentDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute role="ucitelj">
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ai-quiz-builder"
            element={
              <ProtectedRoute role="ucitelj">
                <AIQuizBuilderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute role="ucitelj">
                <AnalyticsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
