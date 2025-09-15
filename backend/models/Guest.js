const mongoose = require('mongoose');

const pawoSchema = new mongoose.Schema({
  upper: {
    type: Number,
    default: 0,
    min: 0
  },
  awoto: {
    type: Number,
    default: 0,
    min: 0
  },
  banodo: {
    type: Number,
    default: 0,
    min: 0
  }
});

const guestSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Guest name is required'],
    trim: true
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  attending: {
    type: Boolean,
    default: false
  },
  pawo: {
    type: pawoSchema,
    default: () => ({})
  },
  previousAmount: {
    type: Number,
    default: 0,
    min: 0
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  rsvpDate: {
    type: Date,
    default: Date.now
  },
  mealPreference: {
    type: String,
    enum: ['vegetarian', 'non-vegetarian', 'vegan', 'no-preference'],
    default: 'no-preference'
  },
  tableNumber: {
    type: Number,
    min: 1
  }
}, {
  timestamps: true
});

// Virtual for net contribution calculation
guestSchema.virtual('netContribution').get(function() {
  // Net = Upper + (Awoto - Previous Amount) = Upper (since Previous = Awoto)
  return this.pawo.upper;
});

// Ensure previousAmount equals awoto amount
guestSchema.pre('save', function(next) {
  if (this.pawo && this.pawo.awoto !== undefined) {
    this.previousAmount = this.pawo.awoto;
  }
  next();
});

guestSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Guest', guestSchema);
