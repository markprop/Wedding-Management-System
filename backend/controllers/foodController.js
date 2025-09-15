const FoodItem = require('../models/FoodItem');

// Get all food items
const getFoodItems = async (req, res) => {
  try {
    const foodItems = await FoodItem.find().sort({ createdAt: -1 });
    res.json(foodItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get food item by ID
const getFoodItemById = async (req, res) => {
  try {
    const foodItem = await FoodItem.findById(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json(foodItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new food item
const createFoodItem = async (req, res) => {
  try {
    const foodItem = new FoodItem(req.body);
    await foodItem.save();
    res.status(201).json(foodItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update food item
const updateFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json(foodItem);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete food item
const deleteFoodItem = async (req, res) => {
  try {
    const foodItem = await FoodItem.findByIdAndDelete(req.params.id);
    if (!foodItem) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json({ message: 'Food item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get food statistics
const getFoodStats = async (req, res) => {
  try {
    const stats = await FoodItem.aggregate([
      {
        $group: {
          _id: null,
          totalItems: { $sum: 1 },
          totalCost: { $sum: { $multiply: ['$quantity', '$cost'] } },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    const categoryStats = await FoodItem.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalCost: { $sum: { $multiply: ['$quantity', '$cost'] } },
          totalQuantity: { $sum: '$quantity' }
        }
      }
    ]);

    const courseStats = await FoodItem.aggregate([
      {
        $group: {
          _id: '$course',
          count: { $sum: 1 },
          totalCost: { $sum: { $multiply: ['$quantity', '$cost'] } }
        }
      }
    ]);

    const perPersonStats = await FoodItem.aggregate([
      {
        $group: {
          _id: '$perPerson',
          count: { $sum: 1 },
          totalCost: { $sum: { $multiply: ['$quantity', '$cost'] } }
        }
      }
    ]);

    res.json({
      overview: stats[0] || {},
      byCategory: categoryStats,
      byCourse: courseStats,
      byPerPerson: perPersonStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getFoodItems,
  getFoodItemById,
  createFoodItem,
  updateFoodItem,
  deleteFoodItem,
  getFoodStats
};
