const Category = require('../models/Category');
const Restaurant = require('../models/Restaurant');

// Helper to get user's restaurant
const getRestaurantId = async (userId) => {
  const restaurant = await Restaurant.findOne({ owner: userId });
  return restaurant ? restaurant._id : null;
};

// @desc    Get all categories for admin
// @route   GET /api/admin/categories
// @access  Private
const getCategories = async (req, res) => {
  try {
    const restaurantId = await getRestaurantId(req.user._id);
    if (!restaurantId) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const categories = await Category.find({ restaurant: restaurantId }).sort('order');
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Create a category
// @route   POST /api/admin/categories
// @access  Private
const createCategory = async (req, res) => {
  try {
    const restaurantId = await getRestaurantId(req.user._id);
    if (!restaurantId) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const { name, icon, order } = req.body;

    const category = await Category.create({
      restaurant: restaurantId,
      name,
      icon,
      order: order || 0
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update a category
// @route   PUT /api/admin/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
  try {
    const restaurantId = await getRestaurantId(req.user._id);
    
    let category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Make sure user owns this category
    if (category.restaurant.toString() !== restaurantId.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete a category
// @route   DELETE /api/admin/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
  try {
    const restaurantId = await getRestaurantId(req.user._id);
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    // Make sure user owns this category
    if (category.restaurant.toString() !== restaurantId.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.json({ message: 'Category removed' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory
};
