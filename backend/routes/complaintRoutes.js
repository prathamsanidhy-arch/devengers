const express = require('express');
const router = express.Router();
const { createComplaint, getComplaints, getComplaint } = require('../controllers/complaintController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .post(protect, upload.single('image'), createComplaint)
  .get(protect, getComplaints);

router.route('/:id')
  .get(protect, getComplaint);

module.exports = router;
