import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import OverviewPage from "./pages/OverviewPage";
import ConferencesPage from "./pages/ConferencesPage";
import SpeakersPage from "./pages/SpeakersPage";
import SessionsPage from "./pages/SessionsPage";
import RegistrationsPage from "./pages/RegistrationsPage";
import CommunicationsPage from "./pages/CommunicationsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import UsersPage from "./pages/UsersPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
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
  );
}

export default App;