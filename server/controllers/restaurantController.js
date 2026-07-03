const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

// @desc    Get restaurant profile (Admin)
// @route   GET /api/admin/restaurant
// @access  Private
const getAdminRestaurant = async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Update restaurant profile (Admin)
// @route   PUT /api/admin/restaurant
// @access  Private
const updateRestaurant = async (req, res) => {
  try {
    let restaurant = await Restaurant.findOne({ owner: req.user._id });

    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const { name, description, subtitle, phone, address, hours, logo, logoPublicId } = req.body;
    
    const { deleteFromCloudinary } = require('../utils/cloudinary');

    // If there is a new logo provided and it's different from the old one, delete the old one
    if (logoPublicId && restaurant.logoPublicId && logoPublicId !== restaurant.logoPublicId) {
      await deleteFromCloudinary(restaurant.logoPublicId, 'image');
    }

    restaurant.name = name || restaurant.name;
    restaurant.subtitle = subtitle !== undefined ? subtitle : restaurant.subtitle;
    restaurant.description = description !== undefined ? description : restaurant.description;
    restaurant.phone = phone !== undefined ? phone : restaurant.phone;
    restaurant.address = address !== undefined ? address : restaurant.address;
    if (hours) {
      restaurant.hours = hours;
    }
    if (logo) {
      // Validate that the URL belongs to Cloudinary and this restaurant's folder
      if (logo.includes('cloudinary.com') && logoPublicId.includes(`restaurants/${restaurant._id}`)) {
        restaurant.logo = logo;
        restaurant.logoPublicId = logoPublicId;
      }
    }

    await restaurant.save();

    res.json(restaurant);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get public restaurant and full menu
// @route   GET /api/restaurants/:slug
// @access  Public
const getPublicRestaurant = async (req, res) => {
  try {
    const { slug } = req.params;

    const restaurant = await Restaurant.findOne({ slug });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    // Get categories and menu items
    const categories = await Category.find({ restaurant: restaurant._id }).sort('order');
    const menuItems = await MenuItem.find({ restaurant: restaurant._id, isAvailable: true });

    // Restructure into nested format
    const menu = categories.map(category => {
      const items = menuItems.filter(item => item.category.toString() === category._id.toString());
      return {
        _id: category._id,
        name: category.name,
        icon: category.icon,
        items
      };
    });

    res.json({
      restaurant,
      menu
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  getAdminRestaurant,
  updateRestaurant,
  getPublicRestaurant
};
