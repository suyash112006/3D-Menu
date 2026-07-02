import React from 'react';
import { Link } from 'react-router-dom';
import { QrCode, Box, Smartphone, CheckCircle } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav className="landing-nav glass-card">
        <div className="logo">
          <h2>3D Menu</h2>
        </div>
        <div className="nav-links">
          <Link to="/admin/login" className="btn btn-secondary">Admin Login</Link>
          <Link to="/admin/register" className="btn btn-primary">Get Started Free</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <div className="hero-content">
          <h1>Bring Your Menu to <span className="gold-text">Life</span> in 3D</h1>
          <p className="hero-subtitle">
            Create stunning digital menus with interactive 3D food models. 
            Generate a free QR code instantly and let your customers explore your dishes like never before.
          </p>
          <div className="hero-actions">
            <Link to="/admin/register" className="btn btn-primary btn-large">Create Your Free Menu</Link>
            <p className="no-cc">No credit card required • Free forever QR codes</p>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-grid">
          <div className="feature-card glass-card">
            <div className="feature-icon"><QrCode size={32} /></div>
            <h3>Free QR Codes</h3>
            <p>Generate, download, and print your menu QR code instantly. No paid APIs, no subscriptions.</p>
          </div>
          
          <div className="feature-card glass-card">
            <div className="feature-icon"><Box size={32} /></div>
            <h3>Interactive 3D Models</h3>
            <p>Upload .glb or .gltf files so customers can spin and view your dishes in full 3D before ordering.</p>
          </div>
          
          <div className="feature-card glass-card">
            <div className="feature-icon"><Smartphone size={32} /></div>
            <h3>Mobile Optimized</h3>
            <p>Your public menu looks like a premium native app, perfectly formatted for any smartphone.</p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <CheckCircle className="step-icon" />
            <h4>1. Sign Up</h4>
            <p>Create a free account and set up your restaurant profile.</p>
          </div>
          <div className="step">
            <CheckCircle className="step-icon" />
            <h4>2. Add Items</h4>
            <p>Upload your dishes, prices, and 3D models.</p>
          </div>
          <div className="step">
            <CheckCircle className="step-icon" />
            <h4>3. Print QR</h4>
            <p>Download your free QR code and place it on your tables.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>&copy; {new Date().getFullYear()} 3D Menu App. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
