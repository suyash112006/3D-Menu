import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Loader from '../components/ui/Loader';
import ModelModal from '../components/public/ModelModal';
import {
  QrCode, LayoutGrid, Search, Heart, User,
  MapPin, Phone, Star, Plus, X, ChevronLeft,
  RotateCcw, ZoomIn, Info, Maximize2, Share2,
  Box, Filter, Clock, Minus, Utensils, HeartOff
} from 'lucide-react';

/* ── helper: fake rating from name hash ── */
const fakeRating = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0;
  return (4.2 + (h % 9) / 10).toFixed(1);
};
const fakeReviews = (str) => {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 17 + str.charCodeAt(i)) >>> 0;
  return 80 + (h % 180);
};

/* ── Item Detail Sheet ── */
const ItemSheet = ({ item, onClose, onOpen3D }) => {
  const rating = item.rating !== undefined ? item.rating.toFixed(1) : "4.5";
  const reviews = fakeReviews(item.name);
  const [liked, setLiked] = useState(false);

  return (
    <div className="pub-sheet-overlay" onClick={onClose}>
      <div className="pub-sheet" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="pub-sheet-header">
          <button className="pub-sheet-back" onClick={onClose}><ChevronLeft size={22} /></button>
          <span className="pub-sheet-title">{item.name}</span>
        </div>

        {/* Hero image */}
        <div className="pub-sheet-img-wrap">
          <img src={item.image} alt={item.name} className="pub-sheet-img" />
          {/* 360 orbit SVG animation */}
          <svg className="orbit-svg" viewBox="0 0 300 220" xmlns="http://www.w3.org/2000/svg">
            {/* Horizontal orbit ring */}
            <ellipse cx="150" cy="110" rx="130" ry="35"
              fill="none" stroke="rgba(212,175,55,0.7)" strokeWidth="1.5"
              strokeDasharray="8 4"
            >
              <animateTransform attributeName="transform" type="rotate"
                from="0 150 110" to="360 150 110" dur="5s" repeatCount="indefinite" />
            </ellipse>
            {/* Vertical orbit ring */}
            <ellipse cx="150" cy="110" rx="40" ry="100"
              fill="none" stroke="rgba(212,175,55,0.5)" strokeWidth="1.2"
              strokeDasharray="6 5"
            >
              <animateTransform attributeName="transform" type="rotate"
                from="0 150 110" to="360 150 110" dur="7s" repeatCount="indefinite" />
            </ellipse>
            {/* Gold dot - horizontal orbit */}
            <circle r="5" fill="#D4AF37" opacity="0.9">
              <animateMotion dur="5s" repeatCount="indefinite">
                <mpath xlinkHref="#hOrbit" />
              </animateMotion>
            </circle>
            {/* Gold dot - vertical orbit */}
            <circle r="4" fill="#F4D03F" opacity="0.8">
              <animateMotion dur="7s" repeatCount="indefinite" begin="1s">
                <mpath xlinkHref="#vOrbit" />
              </animateMotion>
            </circle>
            {/* Hidden paths for animateMotion */}
            <path id="hOrbit" d="M 280,110 A 130,35 0 1,1 279.99,110" fill="none" />
            <path id="vOrbit" d="M 150,10 A 40,100 0 1,1 149.99,10" fill="none" />
          </svg>
          {item.model3D && (
            <div className="pub-sheet-360-badge">
              <Box size={12} /> 360°
            </div>
          )}
        </div>

        {/* Info */}
        <div className="pub-sheet-info">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
            <h2 className="pub-sheet-name" style={{ margin: 0 }}>{item.name}</h2>
            <div style={{ color: 'var(--color-gold)', fontSize: '1.25rem', fontWeight: 'bold', marginLeft: '1rem' }}>
              ₹{item.price.toFixed(2)}
            </div>
          </div>
          <p className="pub-sheet-desc" style={{ marginTop: 0 }}>{item.description || 'Classic delight with 100% real ingredients and authentic flavors.'}</p>

          <div className="pub-sheet-meta">
            <span className="pub-sheet-rating">
              <Star size={14} fill="#D4AF37" stroke="#D4AF37" /> {rating}
            </span>
            {item.isAvailable
              ? <span className="pub-sheet-avail">● Available</span>
              : <span className="pub-sheet-unavail">● Sold Out</span>}
          </div>

          {/* Ingredients */}
          {item.tags && item.tags.length > 0 && (
            <div className="pub-sheet-section">
              <h4>Ingredients</h4>
              <ul className="pub-sheet-ingr">
                {item.tags.map(t => <li key={t}>• {t}</li>)}
              </ul>
            </div>
          )}

          </div>

        {/* Footer CTA */}
        <div className="pub-sheet-footer">
          <button 
            className="pub-add-cart-btn" 
            style={{ width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
            onClick={() => {
              if (item.model3D) {
                onOpen3D(item);
              } else {
                onClose();
              }
            }}
          >
            {item.model3D ? (
              <><Box size={18} style={{ marginRight: '8px' }} /> 3D Dish View</>
            ) : (
              'Close Details'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

/* ── Main Page ── */
const MenuPage = () => {
  const { restaurantSlug } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('');
  const [activeNav, setActiveNav] = useState('menu');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState({ url: null, name: '' });
  const categoryNavRef = useRef(null);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // Don't close if clicking the search button or inside the search bar
      if (searchRef.current && !searchRef.current.contains(event.target) && 
          !event.target.closest('.pub-floating-search-btn') &&
          !event.target.closest('.pub-icon-btn') &&
          !event.target.closest('.pub-sheet-overlay')) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/api/restaurants/${restaurantSlug}`);
        if (!response.ok) throw new Error('Restaurant not found');
        const result = await response.json();
        setData(result);
        if (result.menu && result.menu.length > 0) setActiveCategory(result.menu[0]._id);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, [restaurantSlug]);

  const scrollToCategory = (catId) => {
    setActiveCategory(catId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // scroll chip into view
    const chip = document.getElementById(`chip-${catId}`);
    if (chip) chip.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  };

  const toggleFavorite = (id) => {
    setFavorites(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);
  };

  const openItem = (item) => setSelectedItem(item);

  const allItems = data?.menu?.flatMap(c => c.items) || [];
  const filteredMenu = searchQuery.trim()
    ? [{ _id: 'search', name: 'Results', items: allItems.filter(i => i.name.toLowerCase().includes(searchQuery.toLowerCase())) }]
    : (data?.menu ? data.menu.filter(c => c._id === activeCategory) : []);

  const favItems = allItems.filter(i => favorites.includes(i._id));

  const displayMenu = activeNav === 'favorites' ? [{ _id: 'fav', name: 'Favorites', items: favItems }] : filteredMenu;

  if (loading) return <div className="full-page-loader"><Loader /></div>;
  if (error) return (
    <div className="menu-error-page">
      <div className="glass-card"><h2>Oops!</h2><p>{error}</p></div>
    </div>
  );
  if (!data) return null;

  const { restaurant, menu } = data;
  const logoInitial = restaurant.name?.charAt(0).toUpperCase() || '?';

  return (
    <div className="pub-page">
      {/* ── TOP NAV BAR ── */}
      <header className="pub-topbar">
        <div className="pub-topbar-left">
          {restaurant.logo && restaurant.logo !== 'no-photo.jpg'
            ? <img src={restaurant.logo} alt="" className="pub-brand-logo" />
            : <span className="pub-brand-initial">{logoInitial}</span>
          }
          <div className="pub-brand-name">{restaurant.name}</div>
        </div>
        <div className="pub-topbar-right">
          <button className="pub-icon-btn" onClick={() => { setShowSearch(!showSearch); setActiveNav('menu'); }}>
            <Search size={20} />
          </button>
        </div>
      </header>

      {/* ── SEARCH BAR ── */}
      {showSearch && (
        <div className="pub-search-bar" ref={searchRef}>
          <Search size={16} className="pub-search-icon" />
          <input
            autoFocus
            className="pub-search-input"
            placeholder="Search dishes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="pub-search-clear">
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {/* ── HERO BANNER (only on home / menu) ── */}
      {activeNav === 'menu' && !showSearch && (
        <div className="pub-hero">
          <div className="pub-hero-text">
            <h2>Delicious food,</h2>
            <p>Great experience</p>
          </div>
          <div className="pub-hero-img-wrap">
            {allItems[0]?.image
              ? <img src={allItems[0].image} alt="" className="pub-hero-img" />
              : <div className="pub-hero-img-placeholder" />}
          </div>
        </div>
      )}

      {/* ── CATEGORY CHIPS ── */}
      {activeNav === 'menu' && (
        <div className="pub-cat-strip" ref={categoryNavRef}>
          {menu.map((cat, i) => (
            <button
              key={cat._id}
              id={`chip-${cat._id}`}
              className={`pub-cat-chip ${activeCategory === cat._id ? 'active' : ''}`}
              onClick={() => scrollToCategory(cat._id)}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}

      {/* ── MENU CONTENT ── */}
      <main className="pub-main">
        {displayMenu.map(category => (
          <section key={category._id} id={`cat-${category._id}`} className="pub-section">
            <div className="pub-section-header">
              <h3 className="pub-section-title">{category.name}</h3>
              <span className="pub-section-count">{category.items.length} items</span>
            </div>

            <div className="pub-items-list">
              {category.items.map((item, idx) => {
                const rating = item.rating !== undefined ? item.rating.toFixed(1) : "4.5";
                const isFav = favorites.includes(item._id);
                return (
                  <div
                    key={item._id}
                    className="pub-item-row"
                    style={{ animationDelay: `${idx * 50}ms` }}
                  >
                    {/* image */}
                    <div className="pub-item-img-wrap" onClick={() => openItem(item)}>
                      <img src={item.image} alt={item.name} className="pub-item-img" />
                      {item.model3D && <span className="pub-3d-badge"><Box size={10} /> 3D</span>}
                    </div>

                    {/* info */}
                    <div className="pub-item-info" onClick={() => openItem(item)}>
                      <p className="pub-item-name">{item.name}</p>
                      <p className="pub-item-price">₹{item.price.toFixed(2)}</p>
                      <div className="pub-item-rating">
                        <Star size={12} fill="#D4AF37" stroke="#D4AF37" />
                        <span>{rating}</span>
                      </div>
                    </div>

                      {/* actions */}
                      <div className="pub-item-actions">
                        <button 
                          className="pub-3d-view-btn"
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            if (item.model3D) {
                              setCurrentModel({ url: item.model3D, name: item.name });
                              setIsModalOpen(true);
                            } else {
                              openItem(item); 
                            }
                          }}
                        >
                          <Box size={14} style={{ marginRight: '4px' }} />
                          {item.model3D ? '3D View' : 'View'}
                        </button>
                      </div>
                  </div>
                );
              })}

              {category.items.length === 0 && (
                <div className="pub-empty" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  {activeNav === 'favorites' 
                    ? <><HeartOff size={18} /> No favorites yet</> 
                    : <><Utensils size={18} /> No items</>}
                </div>
              )}
            </div>
          </section>
        ))}
      </main>

      {/* ── FLOATING SEARCH BUTTON ── */}
      <button 
        className="pub-floating-search-btn"
        onClick={() => {
          setActiveNav('search');
          setShowSearch(true);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      >
        <Search size={26} strokeWidth={2.5} />
      </button>

      {/* ── ITEM DETAIL SHEET ── */}
      {selectedItem && (
        <ItemSheet 
          item={selectedItem} 
          onClose={() => setSelectedItem(null)} 
          onOpen3D={(item) => {
            setCurrentModel({ url: item.model3D, name: item.name });
            setIsModalOpen(true);
          }}
        />
      )}

      {/* ── 3D MODAL ── */}
      <ModelModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        modelUrl={currentModel.url}
        itemName={currentModel.name}
      />
    </div>
  );
};

export default MenuPage;
