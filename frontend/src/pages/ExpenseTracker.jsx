import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatCurrency, formatDate } from '../utils/formatters';
import ExpenseModal from '../components/ExpenseModal';
import PieChart from '../components/PieChart';

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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Expense Tracker</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary self-start sm:self-auto"
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
      <div className="responsive-grid-4">
        <div className="card-hover animate-slide-in">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">💰</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Expenses</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{formatCurrency(stats.overview?.totalAmount || 0)}</p>
            </div>
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">✅</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Paid</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{formatCurrency(stats.overview?.paidAmount || 0)}</p>
            </div>
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">❌</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Unpaid</p>
              <p className="text-2xl sm:text-3xl font-bold text-red-600 mt-1">{formatCurrency(stats.overview?.unpaidAmount || 0)}</p>
            </div>
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">📊</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Count</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">{stats.overview?.totalExpenses || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="responsive-grid-2">
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mr-3">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Expenses by Category</h3>
          </div>
          <div className="chart-container">
            <PieChart data={categoryData} />
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.5s'}}>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mr-3">
              <span className="text-xl">💳</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Payment Status</h3>
          </div>
          <div className="chart-container">
            <PieChart data={paymentData} />
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card-hover animate-slide-in" style={{animationDelay: '0.6s'}}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg mr-3">
              <span className="text-xl">📋</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Expenses List</h2>
          </div>
          <div className="search-container">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="input-field filter-select"
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
              className="input-field search-input"
            />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="desktop-table table-responsive">
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
                  <td className="table-cell-long font-medium" title={expense.description}>{expense.description}</td>
                  <td className="table-cell">
                    <span className="status-badge status-badge-info">
                      {expense.category}
                    </span>
                  </td>
                  <td className="table-cell" title={expense.vendor}>{expense.vendor}</td>
                  <td className="table-cell font-medium" title={formatCurrency(expense.amount)}>{formatCurrency(expense.amount)}</td>
                  <td className="table-cell">{formatDate(expense.date)}</td>
                  <td className="table-cell" title={expense.locationId?.name || '-'}>{expense.locationId?.name || '-'}</td>
                  <td className="table-cell">
                    <span className={`status-badge ${
                      expense.paid ? 'status-badge-success' : 'status-badge-danger'
                    }`}>
                      {expense.paid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditExpense(expense)}
                        className="btn-sm btn-outline"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExpense(expense._id)}
                        className="btn-sm btn-danger"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="mobile-table">
          {filteredExpenses.map((expense) => (
            <div key={expense._id} className="mobile-card">
              <div className="mobile-card-header">
                <div>
                  <div className="mobile-card-title">{expense.description}</div>
                  <div className="mobile-card-subtitle">{expense.vendor}</div>
                </div>
                <span className={`status-badge ${
                  expense.paid ? 'status-badge-success' : 'status-badge-danger'
                }`}>
                  {expense.paid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600">Amount:</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(expense.amount)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600">Category:</span>
                  <span className="status-badge status-badge-info text-xs">
                    {expense.category}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600">Date:</span>
                  <span>{formatDate(expense.date)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-600">Location:</span>
                  <span>{expense.locationId?.name || '-'}</span>
                </div>
              </div>
              
              <div className="mobile-card-actions">
                <button
                  onClick={() => handleEditExpense(expense)}
                  className="mobile-card-action"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteExpense(expense._id)}
                  className="mobile-card-action-danger"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
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
