const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const { protect } = require('../middleware/authMiddleware');
const { rateLimiter } = require('../utils/securityUtils');
const { 
  uploadDocuments, 
  getMyDocuments, 
  updateDocument, 
  deleteDocument,
  viewDocument,
  downloadDocument,
  getDocumentDetails,
  toggleFavorite
} = require('../controllers/documentController');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads', 'documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer config - Strict validation
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate UUID filename, preserve extension securely
    const ext = path.extname(file.originalname).toLowerCase();
    const uuidName = crypto.randomUUID() + ext;
    cb(null, uuidName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file type. Only PDF, JPG, JPEG, and PNG are allowed.'), false);
  }
};

const upload = multer({ 
  storage, 
  fileFilter,
  limits: { fileSize: 20 * 1024 * 1024 } // 20 MB max size
});

// Use rate limiting on document routes
router.use(rateLimiter({ limit: 100, windowMs: 15 * 60 * 1000 }));

// Routes
router.post('/upload', protect, upload.array('documents', 10), uploadDocuments);
router.get('/', protect, getMyDocuments);

// Secure File Access Routes (replacing static access)
router.get('/:id/view', protect, viewDocument);
router.get('/:id/download', protect, downloadDocument);
router.get('/:id/details', protect, getDocumentDetails); // Unmasked details for preview

router.put('/:id', protect, updateDocument);
router.put('/:id/favorite', protect, toggleFavorite);
router.delete('/:id', protect, deleteDocument);

// Handle multer errors specifically for this route
router.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File is too large. Maximum size is 20MB.' });
    }
    return res.status(400).json({ success: false, message: error.message });
  } else if (error) {
    return res.status(400).json({ success: false, message: error.message });
  }
  next();
});

module.exports = router;
