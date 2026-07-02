const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { protect } = require('../middleware/auth');
const { getAdminRestaurant, updateRestaurant } = require('../controllers/restaurantController');

const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability } = require('../controllers/menuController');

// All admin routes are protected
router.use(protect);

// Restaurant Profile routes
router.route('/restaurant')
  .get(getAdminRestaurant)
  .put(upload.single('logo'), updateRestaurant);

// Category routes
router.route('/categories')
  .get(getCategories)
  .post(createCategory);
router.route('/categories/:id')
  .put(updateCategory)
  .delete(deleteCategory);

// Menu Item routes
router.route('/menu-items')
  .get(getMenuItems)
  .post(upload.fields([{ name: 'image', maxCount: 1 }, { name: 'model3D', maxCount: 1 }]), createMenuItem);
router.route('/menu-items/:id')
  .put(upload.fields([{ name: 'image', maxCount: 1 }, { name: 'model3D', maxCount: 1 }]), updateMenuItem)
  .delete(deleteMenuItem);
router.patch('/menu-items/:id/toggle', toggleAvailability);

module.exports = router;
