const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { getAdminRestaurant, updateRestaurant } = require('../controllers/restaurantController');

const { getCategories, createCategory, updateCategory, deleteCategory } = require('../controllers/categoryController');
const { getMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, toggleAvailability } = require('../controllers/menuController');
const { getUploadSignature } = require('../controllers/uploadController');

// All admin routes are protected
router.use(protect);

// Upload signature route
router.get('/upload-signature', getUploadSignature);

// Restaurant Profile routes
router.route('/restaurant')
  .get(getAdminRestaurant)
  .put(updateRestaurant);

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
  .post(createMenuItem);
router.route('/menu-items/:id')
  .put(updateMenuItem)
  .delete(deleteMenuItem);
router.patch('/menu-items/:id/toggle', toggleAvailability);

module.exports = router;
