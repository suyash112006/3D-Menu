import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../services/api';
import { useAuth } from '../../hooks/useAuth';
import Toast from '../ui/Toast';
import { Camera, Store, Phone, MapPin, FileText, LogOut, Save } from 'lucide-react';

const ProfileManager = () => {
  const [profile, setProfile] = useState({
    name: '',
    subtitle: '',
    description: '',
    phone: '',
    address: '',
    slug: '',
    logo: '',
  });

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await api.get('/admin/restaurant');
      setProfile({
        name: data.name || '',
        subtitle: data.subtitle || '',
        description: data.description || '',
        phone: data.phone || '',
        address: data.address || '',
        slug: data.slug || '',
        logo: data.logo || '',
      });
      if (data.logo && data.logo !== 'no-photo.jpg') {
        setLogoPreview(data.logo);
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load profile' });
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);
    try {
      let logoUrl = profile.logo;
      let logoKey = profile.logoKey;

      if (logoFile) {
        const { uploadFileDirectly } = await import('../../services/storage');
        const uploadResult = await uploadFileDirectly(logoFile, 'image', profile.name ? `${profile.name}-logo` : 'logo');
        if (uploadResult) {
          logoUrl = uploadResult.secure_url;
          logoKey = uploadResult.public_id;
        }
      }

      const updateData = {
        name: profile.name,
        subtitle: profile.subtitle,
        description: profile.description,
        phone: profile.phone,
        address: profile.address,
        logo: logoUrl,
        logoKey: logoKey
      };

      await api.put('/admin/restaurant', updateData);
      
      setProfile({ ...profile, logo: logoUrl, logoKey });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const initials = profile.name ? profile.name.charAt(0).toUpperCase() : '?';

  return (
    <div className="admin-page profile-page">
      {/* Centered title */}
      <div className="profile-page-title">
        <h1>Profile</h1>
        <p>Manage your restaurant information</p>
      </div>

      {message && <Toast message={message.text} type={message.type} />}

      <form onSubmit={handleSubmit}>
        {/* Avatar / Logo */}
        <div className="profile-avatar-section">
          <div className="profile-avatar-wrapper">
            {logoPreview ? (
              <img src={logoPreview} alt="Logo" className="profile-avatar-img" />
            ) : (
              <div className="profile-avatar-placeholder">{initials}</div>
            )}
            <button
              type="button"
              className="profile-avatar-edit-btn"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera size={16} />
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </div>

        {/* Fields */}
        <div className="profile-fields-card glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '1.5rem' }}>
          <div className="admin-form-group">
            <label><Store size={14} /> RESTAURANT NAME</label>
            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Your Restaurant Name"
              required
            />
          </div>

          <div className="admin-form-group">
            <label><Store size={14} /> SUBTITLE (SUB BOX)</label>
            <input
              type="text"
              name="subtitle"
              value={profile.subtitle}
              onChange={handleChange}
              placeholder="e.g. Authentic Italian Cuisine"
            />
          </div>

          <div className="admin-form-group">
            <label><Phone size={14} /> PHONE</label>
            <input
              type="text"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="+1 234 567 8900"
            />
          </div>

          <div className="admin-form-group">
            <label><MapPin size={14} /> ADDRESS</label>
            <input
              type="text"
              name="address"
              value={profile.address}
              onChange={handleChange}
              placeholder="123 Food Street"
            />
          </div>

          <div className="admin-form-group">
            <label><FileText size={14} /> DESCRIPTION</label>
            <div className="admin-textarea-wrapper">
              <textarea
                name="description"
                value={profile.description}
                onChange={handleChange}
                placeholder="Tell customers about your restaurant..."
                rows="4"
              />
            </div>
          </div>
        </div>

        {/* Menu URL */}
        <div className="profile-url-card glass-card">
          <span className="profile-url-label">Menu URL</span>
          <span className="profile-url-value">/menu/{profile.slug}</span>
        </div>

        {/* Save */}
        <button type="submit" className="profile-save-btn" disabled={isLoading}>
          {isLoading ? (
            <span className="auth-spinner" />
          ) : (
            <>
              <Save size={18} />
              Save Profile
            </>
          )}
        </button>

        {/* Logout */}
        <button
          type="button"
          className="profile-logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          Logout
        </button>
      </form>
    </div>
  );
};

export default ProfileManager;
