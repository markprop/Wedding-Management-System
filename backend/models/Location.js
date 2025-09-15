const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Location name is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  lat: {
    type: Number,
    required: [true, 'Latitude is required']
  },
  lng: {
    type: Number,
    required: [true, 'Longitude is required']
  },
  type: {
    type: String,
    required: [true, 'Location type is required'],
    enum: ['venue', 'reception', 'mehndi', 'barat', 'photography', 'custom']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Location', locationSchema);
