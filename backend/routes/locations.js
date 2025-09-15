const express = require('express');
const router = express.Router();
const {
  getLocations,
  getLocationById,
  createLocation,
  updateLocation,
  deleteLocation,
  getLocationStats
} = require('../controllers/locationController');

// GET /api/locations - Get all locations
router.get('/', getLocations);

// GET /api/locations/stats - Get location statistics
router.get('/stats', getLocationStats);

// GET /api/locations/:id - Get location by ID
router.get('/:id', getLocationById);

// POST /api/locations - Create new location
router.post('/', createLocation);

// PUT /api/locations/:id - Update location
router.put('/:id', updateLocation);

// DELETE /api/locations/:id - Delete location
router.delete('/:id', deleteLocation);

module.exports = router;
