import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./hooks/useAuth";

import Layout from "./components/layout/Layout";
import LoginPage from "./pages/LoginPage";
import AcceptInvitePage from "./pages/AcceptInvitePage";
import LoadingSpinner from "./components/shared/LoadingSpinner";

import OverviewPage from "./pages/OverviewPage";
import ConferencesPage from "./pages/ConferencesPage";
import SpeakersPage from "./pages/SpeakersPage";
import SessionsPage from "./pages/SessionsPage";
import RegistrationsPage from "./pages/RegistrationsPage";
import CommunicationsPage from "./pages/CommunicationsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";

function ProtectedRoute({ children }) {
  const { session, loading } = useAuth();
  if (loading) return <LoadingSpinner fullPage />;
  if (!session) return <Navigate to="/login" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/accept-invite" element={<AcceptInvitePage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<OverviewPage />} />
            <Route path="conferences" element={<ConferencesPage />} />
            <Route path="speakers" element={<SpeakersPage />} />
            <Route path="sessions" element={<SessionsPage />} />
            <Route path="registrations" element={<RegistrationsPage />} />
            <Route path="communications" element={<CommunicationsPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;