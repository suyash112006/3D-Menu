const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const generateSignature = (folder, publicId = null) => {
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  const params = {
    timestamp,
    folder,
  };
  
  if (publicId) {
    params.public_id = publicId;
  }
  
  const signature = cloudinary.utils.api_sign_request(
    params,
    process.env.CLOUDINARY_API_SECRET
  );
  
  return { 
    timestamp, 
    signature, 
    cloudName: process.env.CLOUDINARY_CLOUD_NAME, 
    apiKey: process.env.CLOUDINARY_API_KEY 
  };
};

const deleteFromCloudinary = async (publicId, resourceType = 'image') => {
  if (!publicId) return;
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: resourceType });
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
  }
};

module.exports = { cloudinary, generateSignature, deleteFromCloudinary };
