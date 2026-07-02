import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import Toast from '../ui/Toast';
import { Trash2, Edit2, Plus, ChevronLeft, Save, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', order: 0 });
  const [editingCategory, setEditingCategory] = useState(null);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await api.get('/admin/categories');
      setCategories(data);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load categories' });
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newCategory.name.trim()) return;
    try {
      const added = await api.post('/admin/categories', newCategory);
      setCategories([...categories, added]);
      setNewCategory({ name: '', order: categories.length + 1 });
      setMessage({ type: 'success', text: 'Category added successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to add category' });
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingCategory.name.trim()) return;
    try {
      const updated = await api.put(`/admin/categories/${editingCategory._id}`, editingCategory);
      setCategories(categories.map(c => c._id === updated._id ? updated : c));
      setEditingCategory(null);
      setMessage({ type: 'success', text: 'Category updated successfully' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update category' });
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await api.delete(`/admin/categories/${id}`);
        setCategories(categories.filter(c => c._id !== id));
        setMessage({ type: 'success', text: 'Category deleted' });
      } catch (error) {
        setMessage({ type: 'error', text: 'Failed to delete category' });
      }
    }
  };

  return (
    <div className="dash-page">
      {/* ── Top Bar ── */}
      <div className="dash-topbar" style={{ paddingBottom: '1rem' }}>
        <div className="dash-brand">
          <button onClick={() => navigate(-1)} className="admin-icon-btn" style={{ marginRight: '0.5rem' }}>
            <ChevronLeft size={24} />
          </button>
          <div className="dash-restaurant-name">Categories</div>
        </div>
      </div>

      {message && <Toast message={message.text} type={message.type} />}

      <div style={{ padding: '0 1rem' }}>
        {/* ── Add Category Card ── */}
        <div className="dash-hero" style={{ margin: '0 0 1.5rem 0', flexDirection: 'column', alignItems: 'stretch' }}>
          <div className="dash-hero-tag" style={{ marginBottom: '0.8rem' }}>✨ New Category</div>
          <form onSubmit={handleAdd} className="admin-cat-add-form">
            <input
              type="text"
              placeholder="e.g. Starters, Desserts..."
              value={newCategory.name}
              onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
              className="admin-cat-input"
            />
            <button type="submit" className="admin-cat-add-btn" disabled={!newCategory.name.trim()}>
              <Plus size={20} />
            </button>
          </form>
        </div>

        {/* ── Category List ── */}
        <div className="dash-section-header" style={{ padding: '0 0 0.5rem' }}>
          <span className="dash-section-title">All Categories ({categories.length})</span>
        </div>
        
        <div className="admin-cat-list">
          {categories.map((cat) => (
            <div key={cat._id} className="admin-cat-row">
              {editingCategory?._id === cat._id ? (
                <form onSubmit={handleUpdate} className="admin-cat-edit-form">
                  <input
                    type="text"
                    value={editingCategory.name}
                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                    className="admin-cat-input edit-mode"
                    autoFocus
                  />
                  <div className="admin-cat-actions">
                    <button type="submit" className="cat-action-btn save">
                      <Save size={16} />
                    </button>
                    <button type="button" onClick={() => setEditingCategory(null)} className="cat-action-btn cancel">
                      <X size={16} />
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <div className="admin-cat-name-wrap">
                    <div className="admin-cat-dot"></div>
                    <span className="admin-cat-name">{cat.name}</span>
                  </div>
                  <div className="admin-cat-actions">
                    <button onClick={() => setEditingCategory(cat)} className="cat-action-btn edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => handleDelete(cat._id)} className="cat-action-btn delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
          {categories.length === 0 && (
            <div className="pub-empty" style={{ paddingTop: '1rem' }}>No categories created yet.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryManager;
