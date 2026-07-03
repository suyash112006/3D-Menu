const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const jwt = require('jsonwebtoken');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'your_jwt_secret_here', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user and create an empty restaurant profile
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { email, password, restaurantName } = req.body;

    if (!email || !password || !restaurantName) {
      return res.status(400).json({ message: 'Please provide all fields' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create user
    const user = await User.create({
      email,
      password,
    });

    // Create basic slug from restaurant name (lowercase, replace spaces with hyphens, remove special chars)
    let slug = restaurantName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    
    // Ensure slug uniqueness
    let slugExists = await Restaurant.findOne({ slug });
    let counter = 1;
    while (slugExists) {
      slug = `${slug}-${counter}`;
      slugExists = await Restaurant.findOne({ slug });
      counter++;
    }

    // Create restaurant profile for this user
    await Restaurant.create({
      name: restaurantName,
      slug,
      owner: user._id
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email and include password for comparison
    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  try {
    // req.user is set in auth middleware
    res.status(200).json(req.user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  register,
  login,
  getMe,
};
