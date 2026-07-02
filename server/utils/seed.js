const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Category = require('../models/Category');
const MenuItem = require('../models/MenuItem');

dotenv.config({ path: '../.env' }); // Adjust if needed
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/3d-menu-app';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for seeding');

    // Clear existing
    await User.deleteMany();
    await Restaurant.deleteMany();
    await Category.deleteMany();
    await MenuItem.deleteMany();

    // Create Admin User
    const user = await User.create({
      email: 'admin@restaurant.com',
      password: 'password123',
    });

    // Create Restaurant
    const restaurant = await Restaurant.create({
      name: 'Bella Italia',
      slug: 'bella-italia',
      owner: user._id,
      description: 'Authentic Italian Cuisine',
      phone: '123-456-7890',
      address: '123 Pizza Street, Rome',
    });

    // Create Categories
    const cat1 = await Category.create({ restaurant: restaurant._id, name: 'Starters', order: 1 });
    const cat2 = await Category.create({ restaurant: restaurant._id, name: 'Main Course', order: 2 });
    const cat3 = await Category.create({ restaurant: restaurant._id, name: 'Desserts', order: 3 });

    // Create Menu Items
    await MenuItem.create({
      restaurant: restaurant._id,
      category: cat1._id,
      name: 'Garlic Bread',
      description: 'Toasted bread with garlic and herbs',
      price: 5.99,
      tags: ['vegetarian']
    });

    await MenuItem.create({
      restaurant: restaurant._id,
      category: cat2._id,
      name: 'Margherita Pizza',
      description: 'Classic pizza with tomato and mozzarella',
      price: 14.99,
      tags: ['vegetarian']
    });

    await MenuItem.create({
      restaurant: restaurant._id,
      category: cat3._id,
      name: 'Tiramisu',
      description: 'Coffee-flavored Italian dessert',
      price: 7.99,
    });

    console.log('Data seeded successfully!');
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
