const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const fs = require('fs');
const path = require('path');

// Helper to get user's restaurant
const getRestaurantId = async (userId) => {
  const restaurant = await Restaurant.findOne({ owner: userId });
  return restaurant ? restaurant._id : null;
};

// @desc    Get all menu items for admin
// @route   GET /api/admin/menu-items
// @access  Private
const getMenuItems = async (req, res) => {
  try {
    const restaurantId = await getRestaurantId(req.user._id);
    if (!restaurantId) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const items = await MenuItem.find({ restaurant: restaurantId }).populate('category', 'name');
    res.json(items);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a menu item
// @route   POST /api/admin/menu-items
// @access  Private
const createMenuItem = async (req, res) => {
  try {
    const restaurantId = await getRestaurantId(req.user._id);
    if (!restaurantId) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const { name, description, price, rating, category, isAvailable, tags } = req.body;
    
    const menuItemData = {
      restaurant: restaurantId,
      category,
      name,
      description,
      price,
      rating,
      isAvailable: isAvailable !== undefined ? isAvailable : true,
      tags: tags ? JSON.parse(tags) : []
    };

    if (req.files) {
      if (req.files['image']) {
        menuItemData.image = `/uploads/${req.files['image'][0].filename}`;
      }
      if (req.files['model3D']) {
        menuItemData.model3D = `/uploads/${req.files['model3D'][0].filename}`;
      }
    }

    const item = await MenuItem.create(menuItemData);

    res.status(201).json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a menu item
// @route   PUT /api/admin/menu-items/:id
// @access  Private
const updateMenuItem = async (req, res) => {
  try {
    const restaurantId = await getRestaurantId(req.user._id);
    
    let item = await MenuItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Make sure user owns this item
    if (item.restaurant.toString() !== restaurantId.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { name, description, price, rating, category, isAvailable, tags } = req.body;
    
    const updateData = {
      name,
      description,
      price,
      rating,
      category,
      isAvailable,
    };
    
    if (tags) {
      updateData.tags = JSON.parse(tags);
    }

    if (req.files) {
      if (req.files['image']) {
        updateData.image = `/uploads/${req.files['image'][0].filename}`;
      }
      if (req.files['model3D']) {
        updateData.model3D = `/uploads/${req.files['model3D'][0].filename}`;
      }
    }

    item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a menu item
// @route   DELETE /api/admin/menu-items/:id
// @access  Private
const deleteMenuItem = async (req, res) => {
  try {
    const restaurantId = await getRestaurantId(req.user._id);
    
    const item = await MenuItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Make sure user owns this item
    if (item.restaurant.toString() !== restaurantId.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.json({ message: 'Menu item removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Toggle menu item availability
// @route   PATCH /api/admin/menu-items/:id/toggle
// @access  Private
const toggleAvailability = async (req, res) => {
  try {
    const restaurantId = await getRestaurantId(req.user._id);
    
    const item = await MenuItem.findById(req.params.id);
    
    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Make sure user owns this item
    if (item.restaurant.toString() !== restaurantId.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    item.isAvailable = !item.isAvailable;
    await item.save();

    res.json(item);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}


module.exports = {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
  toggleAvailability
};
