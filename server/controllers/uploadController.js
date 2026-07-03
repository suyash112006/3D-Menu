const { generateSignature } = require('../utils/cloudinary');
const Restaurant = require('../models/Restaurant');

// @desc    Get Cloudinary signature for direct uploads
// @route   GET /api/admin/upload-signature
// @access  Private
const getUploadSignature = async (req, res) => {
  try {
    const { type, name } = req.query; // type: 'image' or 'model', name: item name
    
    // Get user's restaurant to use as folder structure
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }

    const folder = `restaurants/${restaurant._id}/${type === 'model' ? 'models' : 'images'}`;
    
    // Generate an optional publicId (if a name is provided)
    let publicId = null;
    if (name) {
      // Slugify the name
      publicId = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now();
    }

    const signatureData = generateSignature(folder, publicId);

    res.json(signatureData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getUploadSignature };
