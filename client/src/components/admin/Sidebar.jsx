import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { 
  LayoutDashboard, 
  Store, 
  Tags, 
  UtensilsCrossed, 
  QrCode, 
  LogOut,
  Plus,
  Settings
} from 'lucide-react';

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Profile', path: '/admin/profile', icon: <Store size={20} /> },
    { name: 'Categories', path: '/admin/categories', icon: <Tags size={20} /> },
    { name: 'Menu Items', path: '/admin/menu-items', icon: <UtensilsCrossed size={20} /> },
    { name: 'QR Code', path: '/admin/qr-code', icon: <QrCode size={20} /> },
  ];

  // Bottom nav items for mobile (5 items: Dashboard, Menu, +AddFood, QR, Settings/Profile)
  const bottomNavItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={22} /> },
    { name: 'Menu', path: '/admin/menu-items', icon: <UtensilsCrossed size={22} /> },
    { name: 'Add Food', path: '/admin/menu-items?add=true', icon: null, isCenter: true },
    { name: 'QR Codes', path: '/admin/qr-code', icon: <QrCode size={22} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={22} /> },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar glass-card">
        <div className="sidebar-header">
          <h2>3D Menu</h2>
          <span className="badge">Admin</span>
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            >
              {item.icon}
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button onClick={handleLogout} className="nav-link logout-btn">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation */}
      <nav className="mobile-bottom-nav">
        {bottomNavItems.map((item) => {
          if (item.isCenter) {
            return (
              <NavLink key={item.name} to={item.path} className="mobile-nav-center-wrapper">
                <div className="mobile-nav-center-btn">
                  <Plus size={26} strokeWidth={2.5} />
                </div>
                <span className="mobile-nav-label">{item.name}</span>
              </NavLink>
            );
          }
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `mobile-nav-item ${isActive ? 'mobile-nav-active' : ''}`}
            >
              {item.icon}
              <span className="mobile-nav-label">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
};

export default Sidebar;
