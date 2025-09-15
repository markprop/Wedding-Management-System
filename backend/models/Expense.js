const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  category: {
    type: String,
    required: [true, 'Expense category is required'],
    enum: ['Venue', 'Catering', 'Decorations', 'Photography', 'Attire', 'Entertainment', 'Transportation', 'Other']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  vendor: {
    type: String,
    required: [true, 'Vendor name is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  date: {
    type: Date,
    required: [true, 'Date is required']
  },
  locationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Location'
  },
  paid: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Expense', expenseSchema);
