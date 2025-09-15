const Expense = require('../models/Expense');
const Location = require('../models/Location');

// Get all expenses
const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find()
      .populate('locationId', 'name type address')
      .sort({ createdAt: -1 });
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get expense by ID
const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate('locationId', 'name type address');
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expense);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new expense
const createExpense = async (req, res) => {
  try {
    const expense = new Expense(req.body);
    await expense.save();
    await expense.populate('locationId', 'name type address');
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update expense
const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('locationId', 'name type address');
    
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json(expense);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete expense
const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);
    if (!expense) {
      return res.status(404).json({ message: 'Expense not found' });
    }
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get expense statistics
const getExpenseStats = async (req, res) => {
  try {
    const stats = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          paidAmount: { $sum: { $cond: ['$paid', '$amount', 0] } },
          unpaidAmount: { $sum: { $cond: ['$paid', 0, '$amount'] } }
        }
      }
    ]);

    const categoryStats = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' },
          paidAmount: { $sum: { $cond: ['$paid', '$amount', 0] } }
        }
      }
    ]);

    const paymentStats = await Expense.aggregate([
      {
        $group: {
          _id: '$paid',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      }
    ]);

    const vendorStats = await Expense.aggregate([
      {
        $group: {
          _id: '$vendor',
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 10 }
    ]);

    const monthlyStats = await Expense.aggregate([
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' }
          },
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json({
      overview: stats[0] || {},
      byCategory: categoryStats,
      byPayment: paymentStats,
      byVendor: vendorStats,
      monthly: monthlyStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getExpenses,
  getExpenseById,
  createExpense,
  updateExpense,
  deleteExpense,
  getExpenseStats
};
