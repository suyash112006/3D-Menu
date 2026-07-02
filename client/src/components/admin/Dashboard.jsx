import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { 
  Tags, UtensilsCrossed, QrCode, TrendingUp, 
  ChevronRight, Bell, Plus, Star, Eye,
  ShoppingBag, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    categories: 0,
    menuItems: 0,
    availableItems: 0,
    restaurantName: '...',
    restaurantImage: null,
  });
  const [recentItems, setRecentItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [resRestaurant, resCategories, resMenuItems] = await Promise.all([
          api.get('/admin/restaurant'),
          api.get('/admin/categories'),
          api.get('/admin/menu-items')
        ]);

        const available = resMenuItems.filter(i => i.isAvailable).length;

        setStats({
          categories: resCategories.length || 0,
          menuItems: resMenuItems.length || 0,
          availableItems: available,
          restaurantName: resRestaurant.name,
          restaurantImage: resRestaurant.logo,
        });

        setRecentItems(resMenuItems.slice(0, 4));
      } catch (error) {
        console.error('Failed to load stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="dash-page">

      {/* ── Top Bar ── */}
      <div className="dash-topbar">
        <div className="dash-brand">
          {stats.restaurantImage ? (
            <img src={stats.restaurantImage} alt="logo" className="dash-brand-avatar" />
          ) : (
            <div className="dash-brand-initial">
              {stats.restaurantName.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="dash-greeting">{getGreeting()}</div>
            <div className="dash-restaurant-name">{stats.restaurantName}</div>
          </div>
        </div>
        <button className="dash-notif-btn">
          <Bell size={20} />
          <span className="dash-notif-dot" />
        </button>
      </div>

      {/* ── Hero Banner ── */}
      <div className="dash-hero">
        <div className="dash-hero-text">
          <div className="dash-hero-tag">📊 Overview</div>
          <h2>Your Menu at a Glance</h2>
          <p>{stats.menuItems} items across {stats.categories} categories</p>
        </div>
        <div className="dash-hero-circle">
          <TrendingUp size={28} className="dash-hero-icon" />
        </div>
      </div>

      {/* ── Stats Grid ── */}
      <div className="dash-stats-grid">
        <div className="dash-stat-card gold">
          <div className="dash-stat-top">
            <div className="dash-stat-icon-wrap gold">
              <UtensilsCrossed size={18} />
            </div>
            <ArrowUpRight size={14} className="dash-stat-arrow" />
          </div>
          <div className="dash-stat-val">{stats.menuItems}</div>
          <div className="dash-stat-label">Total Items</div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-top">
            <div className="dash-stat-icon-wrap">
              <Tags size={18} />
            </div>
            <ArrowUpRight size={14} className="dash-stat-arrow" />
          </div>
          <div className="dash-stat-val">{stats.categories}</div>
          <div className="dash-stat-label">Categories</div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-top">
            <div className="dash-stat-icon-wrap green">
              <ShoppingBag size={18} />
            </div>
            <ArrowUpRight size={14} className="dash-stat-arrow" />
          </div>
          <div className="dash-stat-val">{stats.availableItems}</div>
          <div className="dash-stat-label">Available</div>
        </div>

        <div className="dash-stat-card">
          <div className="dash-stat-top">
            <div className="dash-stat-icon-wrap purple">
              <QrCode size={18} />
            </div>
          </div>
          <div className="dash-stat-val dash-stat-link-val">
            <Link to="/admin/qr-code">QR Code</Link>
          </div>
          <div className="dash-stat-label">Share Menu</div>
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="dash-section-header">
        <span className="dash-section-title">Quick Actions</span>
      </div>
      <div className="dash-quick-actions">
        <Link to="/admin/menu-items?add=true" className="dash-action-btn primary">
          <Plus size={18} />
          Add Food Item
        </Link>
        <Link to="/admin/categories" className="dash-action-btn secondary">
          <Tags size={18} />
          Categories
        </Link>
        <Link to="/admin/qr-code" className="dash-action-btn secondary">
          <QrCode size={18} />
          QR Code
        </Link>
        <Link to="/admin/profile" className="dash-action-btn secondary">
          <Eye size={18} />
          View Profile
        </Link>
      </div>

      {/* ── Recent Menu Items ── */}
      {recentItems.length > 0 && (
        <>
          <div className="dash-section-header">
            <span className="dash-section-title">Recent Items</span>
            <Link to="/admin/menu-items" className="dash-see-all">See all <ChevronRight size={14} /></Link>
          </div>
          <div className="dash-recent-list">
            {recentItems.map((item) => (
              <div key={item._id} className="dash-recent-row">
                <div className="dash-recent-img-wrap">
                  <img src={item.image} alt={item.name} className="dash-recent-img" />
                </div>
                <div className="dash-recent-info">
                  <div className="dash-recent-name">{item.name}</div>
                  <div className="dash-recent-cat">{item.category?.name || 'Uncategorized'}</div>
                </div>
                <div className="dash-recent-right">
                  <div className="dash-recent-price">₹{item.price}</div>
                  <div className={`dash-recent-status ${item.isAvailable ? 'active' : 'inactive'}`}>
                    {item.isAvailable ? '● Active' : '● Inactive'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  );
};

export default Dashboard;
