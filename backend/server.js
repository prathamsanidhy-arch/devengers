const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// No database connection

// Middleware
app.use(cors());
app.use(helmet({ crossOriginResourcePolicy: false })); // allow images to be served
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/complaints', require('./routes/complaintRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/schemes', require('./routes/schemeRoutes'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Smart Bharat API is running' });
});

// Serve frontend in production
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
