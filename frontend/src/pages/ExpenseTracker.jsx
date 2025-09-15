import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatCurrency, formatDate, getStatusColor } from '../utils/formatters';
import ExpenseModal from '../components/ExpenseModal';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';

const ExpenseTracker = () => {
  const [expenses, setExpenses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = [
    'Venue', 'Catering', 'Decorations', 'Photography', 
    'Attire', 'Entertainment', 'Transportation', 'Other'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [expensesData, locationsData, statsData] = await Promise.all([
        api.getExpenses(),
        api.getLocations(),
        api.getExpenseStats()
      ]);
      
      setExpenses(expensesData);
      setLocations(locationsData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateExpense = async (expenseData) => {
    try {
      await api.createExpense(expenseData);
      await fetchData();
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateExpense = async (id, expenseData) => {
    try {
      await api.updateExpense(id, expenseData);
      await fetchData();
      setShowModal(false);
      setEditingExpense(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteExpense = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.deleteExpense(id);
        await fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEditExpense = (expense) => {
    setEditingExpense(expense);
    setShowModal(true);
  };

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expense.vendor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || expense.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoryData = Array.isArray(stats.byCategory) ? stats.byCategory.map(item => ({
    label: item._id,
    value: item.totalAmount
  })) : [];

  const paymentData = [
    { label: 'Paid', value: stats.overview?.paidAmount || 0 },
    { label: 'Unpaid', value: stats.overview?.unpaidAmount || 0 }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
        >
          Add Expense
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.overview?.totalAmount || 0)}</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Paid</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.overview?.paidAmount || 0)}</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Unpaid</p>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(stats.overview?.unpaidAmount || 0)}</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Count</p>
            <p className="text-2xl font-bold text-blue-600">{stats.overview?.totalExpenses || 0}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Expenses by Category</h3>
          <PieChart data={categoryData} />
        </div>
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Payment Status</h3>
          <PieChart data={paymentData} />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Expenses List</h2>
          <div className="flex items-center space-x-4">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field w-48"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field w-64"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Description</th>
                <th className="table-header">Category</th>
                <th className="table-header">Vendor</th>
                <th className="table-header">Amount</th>
                <th className="table-header">Date</th>
                <th className="table-header">Location</th>
                <th className="table-header">Status</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredExpenses.map((expense) => (
                <tr key={expense._id} className="hover:bg-gray-50">
                  <td className="table-cell font-medium">{expense.description}</td>
                  <td className="table-cell">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      {expense.category}
                    </span>
                  </td>
                  <td className="table-cell">{expense.vendor}</td>
                  <td className="table-cell font-medium">{formatCurrency(expense.amount)}</td>
                  <td className="table-cell">{formatDate(expense.date)}</td>
                  <td className="table-cell">{expense.locationId?.name || '-'}</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      expense.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {expense.paid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <ExpenseModal
          expense={editingExpense}
          locations={locations}
          categories={categories}
          onSave={editingExpense ? handleUpdateExpense : handleCreateExpense}
          onClose={() => {
            setShowModal(false);
            setEditingExpense(null);
          }}
        />
      )}
    </div>
  );
};

export default ExpenseTracker;
