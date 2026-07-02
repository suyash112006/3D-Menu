const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Use memory storage instead of disk storage for Cloudinary
const storage = multer.memoryStorage();

// Check file type
function checkFileType(file, cb) {
  // Allowed ext
  const filetypes = /jpeg|jpg|png|webp|glb|gltf/;
  // Check ext
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  
  // Browsers often send .glb as application/octet-stream or empty mimetype
  const is3DModelExt = /glb|gltf/.test(path.extname(file.originalname).toLowerCase());
  
  // Check mime
  const mimetype = filetypes.test(file.mimetype) || 
                   file.mimetype === 'model/gltf-binary' || 
                   file.mimetype === 'model/gltf+json' ||
                   (is3DModelExt && (file.mimetype === 'application/octet-stream' || !file.mimetype || file.mimetype === ''));

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Images and 3D Models (.glb/.gltf) Only!'));
  }
}

// Init upload
const upload = multer({
  storage,
  limits: { fileSize: 50000000 }, // 50MB
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
});

module.exports = upload;
