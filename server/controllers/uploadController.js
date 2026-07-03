const { generatePresignedUrl } = require('../utils/r2');
const Restaurant = require('../models/Restaurant');

// @desc    Get R2 upload presigned URL
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
    
    let publicId = name ? name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') + '-' + Date.now() : Date.now().toString();
    const extension = type === 'model' ? '.glb' : '.jpg';
    
    const key = `${folder}/${publicId}${extension}`;
    const contentType = type === 'model' ? 'model/gltf-binary' : 'image/jpeg';

    const signatureData = await generatePresignedUrl(key, contentType);

    res.json(signatureData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = { getUploadSignature };
