const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  restaurant: {
    type: mongoose.Schema.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a menu item name'],
    trim: true,
    maxlength: [100, 'Name can not be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description can not be more than 500 characters']
  },
  price: {
    type: Number,
    required: [true, 'Please add a price']
  },
  image: {
    type: String,
    default: 'no-photo.jpg'
  },
  imagePublicId: {
    type: String,
    default: null
  },
  model3D: {
    type: String, // URL to .glb/.gltf file
    default: null
  },
  model3DPublicId: {
    type: String,
    default: null
  },
  isAvailable: {
    type: Boolean,
    default: true
  },
  tags: {
    type: [String], // Array of strings (e.g. ['vegan', 'spicy'])
    default: []
  },
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 4.5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);
