import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api';
import Toast from '../ui/Toast';
import { Trash2, Edit2, Plus, Box, Search, Filter, Menu as MenuIcon, MoreVertical, CheckCircle2, XCircle, ChevronLeft, ImagePlus, FileBox, X, Utensils, Layers, Tag, Star, AlignLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import ModelModal from '../public/ModelModal';

const MenuItemManager = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState({ url: null, name: '' });
  const [editingItem, setEditingItem] = useState(null);
  const [message, setMessage] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    rating: 4.5,
    category: '',
    isAvailable: true,
  });
  const [imageFile, setImageFile] = useState(null);
  const [modelFile, setModelFile] = useState(null);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('add') === 'true' && categories.length > 0 && !isModalOpen) {
      openAddModal();
      navigate('/admin/menu-items', { replace: true });
    }
  }, [location.search, categories, isModalOpen]);

  const fetchData = async () => {
    try {
      const [itemsData, catsData] = await Promise.all([
        api.get('/admin/menu-items'),
        api.get('/admin/categories')
      ]);
      setItems(itemsData);
      setCategories(catsData);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load menu data' });
    }
  };

  const openAddModal = () => {
    setEditingItem(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      rating: 4.5,
      category: categories.length > 0 ? categories[0]._id : '',
      isAvailable: true,
    });
    setImageFile(null);
    setModelFile(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      rating: item.rating || 4.5,
      category: item.category?._id || item.category,
      isAvailable: item.isAvailable,
    });
    setImageFile(null);
    setModelFile(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('rating', formData.rating);
    data.append('category', formData.category);
    data.append('isAvailable', formData.isAvailable);
    
    if (imageFile) data.append('image', imageFile);
    if (modelFile) data.append('model3D', modelFile);

    try {
      if (editingItem) {
        await api.put(`/admin/menu-items/${editingItem._id}`, data, true);
        setMessage({ type: 'success', text: 'Item updated successfully' });
      } else {
        await api.post('/admin/menu-items', data, true);
        setMessage({ type: 'success', text: 'Item added successfully' });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save item' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await api.delete(`/admin/menu-items/${id}`);
        setItems(items.filter(item => item._id !== id));
        setMessage({ type: 'success', text: 'Item deleted' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete item' });
      }
    }
  };

  const handleToggleAvailability = async (id) => {
    try {
      const updated = await api.patch(`/admin/menu-items/${id}/toggle`);
      setItems(items.map(item => item._id === updated._id ? updated : item));
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to toggle availability' });
    }
  };

  // State for search and active category
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const searchRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target) &&
          !event.target.closest('.admin-search-toggle-btn')) {
        setShowSearch(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeDropdown, setActiveDropdown] = useState(null);

  const filteredItems = items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || (item.category && item.category.name === activeCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="admin-menu-page">
      {/* Top Header */}
      <div className="admin-menu-header">
        <button className="admin-icon-btn"><MenuIcon size={22} /></button>
          <h2 className="admin-menu-title">Menu</h2>
          <button className="admin-icon-btn admin-search-toggle-btn" onClick={() => setShowSearch(!showSearch)}>
            <Search size={22} />
          </button>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="admin-search-container" ref={searchRef}>
            <div className="admin-search-box">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search dishes..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <button className="admin-filter-btn">
          <Filter size={18} />
        </button>
      </div>
      )}

      {/* Category Chips */}
      <div className="admin-cat-strip">
        <button 
          className={`admin-cat-chip ${activeCategory === 'All' ? 'active' : ''}`}
          onClick={() => setActiveCategory('All')}
        >
          All
        </button>
        {categories.map(c => (
          <button 
            key={c._id}
            className={`admin-cat-chip ${activeCategory === c.name ? 'active' : ''}`}
            onClick={() => setActiveCategory(c.name)}
          >
            {c.name}
          </button>
        ))}
      </div>

      {message && <Toast message={message.text} type={message.type} />}

      {/* Menu List */}
      <div className="admin-menu-list">
        {filteredItems.map((item) => (
          <div key={item._id} className="admin-menu-row">
            <div className="admin-menu-row-img-wrap">
              <img src={item.image} alt={item.name} className="admin-menu-row-img" />
              {item.model3D && (
                <div className="pub-3d-badge">
                  <Box size={10} /> 3D
                </div>
              )}
            </div>
            
            <div className="admin-menu-row-info">
              <div className="admin-menu-row-title-bar">
                <h3 className="admin-menu-row-name">{item.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  {item.model3D && (
                    <button 
                      className="pub-3d-view-btn"
                      style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', borderRadius: '12px' }}
                      onClick={(e) => { 
                        e.stopPropagation(); 
                        setCurrentModel({ url: item.model3D, name: item.name });
                        setIs3DModalOpen(true);
                      }}
                    >
                      <Box size={12} style={{ marginRight: '4px' }} />
                      3D View
                    </button>
                  )}
                  <div className="admin-dropdown-container">
                    <button 
                      className="admin-more-btn"
                      onClick={() => setActiveDropdown(activeDropdown === item._id ? null : item._id)}
                    >
                      <MoreVertical size={18} />
                    </button>
                    
                    {activeDropdown === item._id && (
                      <div className="admin-dropdown-menu">
                        <button onClick={() => { openEditModal(item); setActiveDropdown(null); }}>
                          <Edit2 size={14} /> Edit
                        </button>
                        <button className="delete" onClick={() => { handleDelete(item._id); setActiveDropdown(null); }}>
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="admin-menu-row-price">₹{item.price}</div>
              
              <div className="admin-menu-row-status-bar">
                <div className="status-indicator">
                  {item.isAvailable ? (
                    <><CheckCircle2 size={12} className="status-icon active" /> <span className="status-text active">Active</span></>
                  ) : (
                    <><XCircle size={12} className="status-icon inactive" /> <span className="status-text inactive">Inactive</span></>
                  )}
                </div>
                
                <button 
                  className={`status-toggle-btn ${item.isAvailable ? 'active' : 'inactive'}`}
                  onClick={() => handleToggleAvailability(item._id)}
                >
                  {item.isAvailable ? 'Active ✓' : 'Inactive ✗'}
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredItems.length === 0 && (
          <div className="pub-empty">No items found.</div>
        )}
      </div>

      {isModalOpen && (
        <div className="admin-full-modal">
          <div className="admin-modal-header">
            <button className="admin-modal-back" onClick={() => setIsModalOpen(false)}>
              <ChevronLeft size={24} />
            </button>
            <h2>{editingItem ? 'Edit Food' : 'Add New Food'}</h2>
            <div style={{ width: 24 }}></div>
          </div>
          
          <div className="admin-modal-content">
            {(editingItem?.image && !imageFile) ? (
              <div className="admin-modal-hero">
                <img src={editingItem.image} alt={formData.name} className="admin-modal-hero-img" />
                <label className="admin-modal-hero-btn" style={{cursor: 'pointer'}}>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => setImageFile(e.target.files[0])} 
                    style={{ display: 'none' }}
                  />
                  <Edit2 size={16} />
                </label>
              </div>
            ) : (
              <>
                <h3 className="admin-form-section-title">Basic Information</h3>
                <label className="admin-image-upload-box">
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={e => setImageFile(e.target.files[0])} 
                    style={{ display: 'none' }}
                  />
                  <ImagePlus size={32} className="upload-icon" />
                  <span className="upload-text">Upload Image</span>
                  <span className="upload-sub">JPG, PNG (Max 5MB)</span>
                  {imageFile && <span className="upload-success">Selected: {imageFile.name}</span>}
                </label>
              </>
            )}

            <form onSubmit={handleSubmit} className="admin-premium-form">
              <div className="admin-form-group">
                <label><Utensils size={14} /> FOOD NAME</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                  placeholder="Enter food name"
                  required 
                />
              </div>
              
              <div className="admin-form-group">
                <label><Layers size={14} /> CATEGORY</label>
                <div className="admin-select-wrapper">
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({...formData, category: e.target.value})} 
                    required
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map(c => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="admin-form-group">
                <label><Tag size={14} /> PRICE</label>
                <div className="admin-price-input">
                  <span className="currency-symbol">₹</span>
                  <input 
                    type="number" 
                    step="0.01" 
                    value={formData.price} 
                    onChange={e => setFormData({...formData, price: e.target.value})} 
                    placeholder="Enter price"
                    required 
                  />
                </div>
              </div>

              <div className="admin-form-group">
                <label><Star size={14} /> RATING (0-5)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  min="0"
                  max="5"
                  value={formData.rating} 
                  onChange={e => setFormData({...formData, rating: e.target.value})} 
                  placeholder="e.g. 4.5"
                  required 
                />
              </div>
              
              <div className="admin-form-group">
                <label><AlignLeft size={14} /> SHORT DESCRIPTION</label>
                <div className="admin-textarea-wrapper">
                  <textarea 
                    value={formData.description} 
                    onChange={e => setFormData({...formData, description: e.target.value})} 
                    placeholder="Enter short description"
                    maxLength={120}
                  />
                  <div className="char-count">{formData.description?.length || 0}/120</div>
                </div>
              </div>
              
              <div className="admin-form-group">
                <label><Box size={14} /> 3D MODEL (GLB)</label>
                {(editingItem?.model3D || modelFile) ? (
                  <div className="admin-file-card">
                    <div className="file-icon-wrap">
                      <FileBox size={20} />
                    </div>
                    <div className="file-details">
                      <span className="file-name">{modelFile ? modelFile.name : editingItem.model3D?.split('/').pop()}</span>
                      <span className="file-size">12.4 MB</span>
                    </div>
                    <button type="button" className="file-remove" onClick={() => {
                      setModelFile(null);
                      if (editingItem && editingItem.model3D) {
                        setEditingItem({ ...editingItem, model3D: null });
                      }
                    }}>
                      <X size={18} />
                    </button>
                  </div>
                ) : (
                  <label className="admin-file-upload-box">
                    <input 
                      type="file" 
                      accept=".glb,.gltf" 
                      onChange={e => setModelFile(e.target.files[0])} 
                      style={{ display: 'none' }}
                    />
                    <span className="upload-text">Upload 3D Model</span>
                  </label>
                )}
              </div>

              <button type="submit" className="admin-submit-btn">
                {editingItem ? 'Update Food' : 'Add Food'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 3D Model Modal */}
      <ModelModal
        isOpen={is3DModalOpen}
        onClose={() => setIs3DModalOpen(false)}
        modelUrl={currentModel.url}
        itemName={currentModel.name}
      />
    </div>
  );
};

export default MenuItemManager;
