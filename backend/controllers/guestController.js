const Guest = require('../models/Guest');
const Location = require('../models/Location');

// Get all guests
const getGuests = async (req, res) => {
  try {
    const guests = await Guest.find()
      .populate('locationId', 'name type address')
      .sort({ createdAt: -1 });
    res.json(guests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get guest by ID
const getGuestById = async (req, res) => {
  try {
    const guest = await Guest.findById(req.params.id).populate('locationId', 'name type address');
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.json(guest);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new guest
const createGuest = async (req, res) => {
  try {
    const guest = new Guest(req.body);
    await guest.save();
    await guest.populate('locationId', 'name type address');
    res.status(201).json(guest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update guest
const updateGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('locationId', 'name type address');
    
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.json(guest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete guest
const deleteGuest = async (req, res) => {
  try {
    const guest = await Guest.findByIdAndDelete(req.params.id);
    if (!guest) {
      return res.status(404).json({ message: 'Guest not found' });
    }
    res.json({ message: 'Guest deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get guest statistics
const getGuestStats = async (req, res) => {
  try {
    const stats = await Guest.aggregate([
      {
        $group: {
          _id: null,
          totalGuests: { $sum: 1 },
          attendingGuests: { $sum: { $cond: ['$attending', 1, 0] } },
          totalUpper: { $sum: '$pawo.upper' },
          totalAwoto: { $sum: '$pawo.awoto' },
          totalBanodo: { $sum: '$pawo.banodo' },
          totalPrevious: { $sum: '$previousAmount' }
        }
      }
    ]);

    const attendanceStats = await Guest.aggregate([
      {
        $group: {
          _id: '$attending',
          count: { $sum: 1 }
        }
      }
    ]);

    const mealStats = await Guest.aggregate([
      {
        $group: {
          _id: '$mealPreference',
          count: { $sum: 1 }
        }
      }
    ]);

    const locationStats = await Guest.aggregate([
      {
        $lookup: {
          from: 'locations',
          localField: 'locationId',
          foreignField: '_id',
          as: 'location'
        }
      },
      {
        $unwind: { path: '$location', preserveNullAndEmptyArrays: true }
      },
      {
        $group: {
          _id: '$location.name',
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      overview: stats[0] || {},
      attendance: attendanceStats,
      mealPreferences: mealStats,
      byLocation: locationStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGuests,
  getGuestById,
  createGuest,
  updateGuest,
  deleteGuest,
  getGuestStats
};
