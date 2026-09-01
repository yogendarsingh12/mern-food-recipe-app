const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

// Setup CloudinaryStorage for Multer with async params
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req, file) => {
    // Generate clean unique filename
    const cleanFileName = file.originalname
      ? file.originalname.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_')
      : 'recipe';

    return {
      folder: 'recipes',
      resource_type: 'image',
      public_id: `${Date.now()}-${cleanFileName}`,
      transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }],
    };
  },
});

// File filter to validate images before upload
const fileFilter = (req, file, cb) => {
  if (file.mimetype && file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only image files (JPG, PNG, WebP) are allowed!'), false);
  }
};

// Initialize multer upload middleware
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
});

module.exports = upload;
