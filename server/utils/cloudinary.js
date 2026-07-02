const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = (buffer, is3DModel = false) => {
  return new Promise((resolve, reject) => {
    // 3D models must be uploaded as raw resource type in cloudinary usually, 
    // but cloudinary supports glb/gltf as image with format options or raw. 
    // 'raw' works perfectly for delivering .glb files.
    const resourceType = is3DModel ? 'raw' : 'image';
    
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: resourceType, folder: '3d-menu' },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

module.exports = { cloudinary, uploadToCloudinary };
