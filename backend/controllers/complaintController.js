const { complaints } = require('../data');

// Helper to generate ID
const generateId = () => Math.random().toString(16).slice(2);

const createComplaint = async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;
    let imageUrl = null;

    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;
    }

    if (!title || !description || !category) {
      return res.status(400).json({ success: false, message: 'Please provide title, description, and category' });
    }

    const complaint = {
      _id: generateId(),
      user: req.user._id,
      title,
      description,
      category,
      priority: priority || 'Medium',
      imageUrl,
      status: 'Pending',
      createdAt: new Date().toISOString(),
      timeline: [{
        status: 'Pending',
        description: 'Complaint submitted successfully.',
        date: new Date().toISOString()
      }]
    };

    complaints.push(complaint);

    res.status(201).json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getComplaints = async (req, res) => {
  try {
    const userComplaints = complaints
      .filter(c => c.user === req.user._id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
    res.json({ success: true, count: userComplaints.length, data: userComplaints });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getComplaint = async (req, res) => {
  try {
    const complaint = complaints.find(c => c._id === req.params.id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (complaint.user !== req.user._id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, data: complaint });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createComplaint,
  getComplaints,
  getComplaint,
};
