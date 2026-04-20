/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { AppLayout } from './components/AppLayout';
import { Home } from './pages/Home';
import { MapPage } from './pages/MapPage';
import { ReportPage } from './pages/ReportPage';
import { AdminPage } from './pages/AdminPage';
import { ProfilePage } from './pages/ProfilePage';
import { AlertDetailPage } from './pages/AlertDetailPage';
import { NotificationsPage } from './pages/NotificationsPage';

export default function App() {
  return (
    <AuthProvider>
      <AlertProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout><Home /></AppLayout>} />
            <Route path="/map" element={<AppLayout><MapPage /></AppLayout>} />
            <Route path="/report" element={<AppLayout><ReportPage /></AppLayout>} />
            <Route path="/admin" element={<AppLayout><AdminPage /></AppLayout>} />
            <Route path="/profile" element={<AppLayout><ProfilePage /></AppLayout>} />
            <Route path="/notifications" element={<AppLayout><NotificationsPage /></AppLayout>} />
            <Route path="/alert/:id" element={<AppLayout><AlertDetailPage /></AppLayout>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AlertProvider>
    </AuthProvider>
  );
}
