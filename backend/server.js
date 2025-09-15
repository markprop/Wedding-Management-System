const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB (only if not in test environment)
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/locations', require('./routes/locations'));
app.use('/api/guests', require('./routes/guests'));
app.use('/api/expenses', require('./routes/expenses'));
app.use('/api/food', require('./routes/food'));
app.use('/api/import-export', require('./routes/importExport'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ message: 'Wedding Planner API is running!' });
});

// Mapbox configuration endpoint
app.get('/api/mapbox/config', (req, res) => {
  const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;
  
  if (!mapboxToken) {
    return res.status(500).json({ 
      error: 'Mapbox access token not configured' 
    });
  }
  
  res.json({ 
    accessToken: mapboxToken,
    style: 'mapbox://styles/mapbox/streets-v12'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Only start server if not in test environment
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
