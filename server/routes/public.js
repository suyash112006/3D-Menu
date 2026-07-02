const express = require('express');
const router = express.Router();
const { getPublicRestaurant } = require('../controllers/restaurantController');

// Public route to get restaurant profile and menu by slug
router.get('/restaurants/:slug', getPublicRestaurant);

module.exports = router;
