import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Store,
  Info,
  Clock,
  Share2,
  Moon,
  DollarSign,
  Globe,
  ChevronRight,
  Bell,
  Shield,
  Trash2,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const SettingRow = ({ icon: Icon, label, value, onClick, isDanger }) => (
  <button
    className={`settings-row ${isDanger ? 'settings-row--danger' : ''}`}
    onClick={onClick}
    type="button"
  >
    <div className="settings-row-left">
      <span className={`settings-row-icon ${isDanger ? 'settings-row-icon--danger' : ''}`}>
        <Icon size={18} />
      </span>
      <span className="settings-row-label">{label}</span>
    </div>
    <div className="settings-row-right">
      {value && <span className="settings-row-value">{value}</span>}
      <ChevronRight size={16} className="settings-row-chevron" />
    </div>
  </button>
);

const SettingsPage = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = useState('Dark');
  const [currency, setCurrency] = useState('USD ($)');
  const [language, setLanguage] = useState('English');

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-page settings-page">
      <div className="profile-page-title">
        <h1>Settings</h1>
      </div>

      {/* General Section */}
      <div className="settings-section">
        <h2 className="settings-section-title">General</h2>
        <div className="settings-group glass-card">
          <SettingRow
            icon={Store}
            label="Restaurant Profile"
            onClick={() => navigate('/admin/profile')}
          />
        </div>
      </div>

      {/* Preferences Section */}
      <div className="settings-section">
        <h2 className="settings-section-title">Preferences</h2>
        <div className="settings-group glass-card">
          <SettingRow
            icon={Moon}
            label="Theme"
            value={theme}
            onClick={() => setTheme(theme === 'Dark' ? 'Light' : 'Dark')}
          />
        </div>
      </div>



      {/* Danger Zone */}
      <div className="settings-section">
        <h2 className="settings-section-title">Account</h2>
        <div className="settings-group glass-card">
          <SettingRow
            icon={LogOut}
            label="Logout"
            onClick={handleLogout}
            isDanger={false}
          />
        </div>
      </div>

      <p className="settings-version">3D Menu Admin • v1.0.0</p>
    </div>
  );
};

export default SettingsPage;
