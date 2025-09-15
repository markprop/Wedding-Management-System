const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Food item name is required'],
    trim: true
  },
  category: {
    type: String,
    required: [true, 'Food category is required'],
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Side Dish', 'Snack']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: 0
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    trim: true
  },
  cost: {
    type: Number,
    required: [true, 'Cost is required'],
    min: 0
  },
  perPerson: {
    type: Boolean,
    default: false
  },
  course: {
    type: String,
    required: [true, 'Course is required'],
    enum: ['breakfast', 'lunch', 'dinner', 'snack']
  }
}, {
  timestamps: true
});

// Virtual for total cost calculation
foodItemSchema.virtual('totalCost').get(function() {
  return this.quantity * this.cost;
});

foodItemSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('FoodItem', foodItemSchema);
