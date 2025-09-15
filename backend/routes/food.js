const express = require('express');
const router = express.Router();
const {
  getFoodItems,
  getFoodItemById,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  getFoodStats
} = require('../controllers/foodController');

// GET /api/food - Get all food items
router.get('/', getFoodItems);

// GET /api/food/stats - Get food statistics
router.get('/stats', getFoodStats);

// GET /api/food/:id - Get food item by ID
router.get('/:id', getFoodItemById);

// POST /api/food - Create new food item
router.post('/', createFoodItem);

// PUT /api/food/:id - Update food item
router.put('/:id', updateFoodItem);

// DELETE /api/food/:id - Delete food item
router.delete('/:id', deleteFoodItem);

module.exports = router;
