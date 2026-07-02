import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Pages & Layouts
import AdminLogin from './pages/AdminLogin';
import AdminRegister from './pages/AdminRegister';
import AdminLayout from './components/admin/AdminLayout';
import Dashboard from './components/admin/Dashboard';
import ProfileManager from './components/admin/ProfileManager';
import CategoryManager from './components/admin/CategoryManager';
import MenuItemManager from './components/admin/MenuItemManager';
import QRCodeManager from './components/admin/QRCodeManager';
import SettingsPage from './components/admin/SettingsPage';

import LandingPage from './pages/LandingPage';
import MenuPage from './pages/MenuPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="profile" element={<ProfileManager />} />
            <Route path="categories" element={<CategoryManager />} />
            <Route path="menu-items" element={<MenuItemManager />} />
            <Route path="qr-code" element={<QRCodeManager />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          
          <Route path="/menu/:restaurantSlug" element={<MenuPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
