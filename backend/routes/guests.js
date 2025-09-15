const express = require('express');
const router = express.Router();
const {
  getGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
  getGuestStats
} = require('../controllers/guestController');

// GET /api/guests - Get all guests
router.get('/', getGuests);

// GET /api/guests/stats - Get guest statistics
router.get('/stats', getGuestStats);

// GET /api/guests/:id - Get guest by ID
router.get('/:id', getGuestById);

// POST /api/guests - Create new guest
router.post('/', createGuest);

// PUT /api/guests/:id - Update guest
router.put('/:id', updateGuest);

// DELETE /api/guests/:id - Delete guest
router.delete('/:id', deleteGuest);

module.exports = router;
