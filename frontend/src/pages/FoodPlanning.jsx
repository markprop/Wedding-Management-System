import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';
import FoodModal from '../components/FoodModal';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';

const FoodPlanning = () => {
  const [foodItems, setFoodItems] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingFoodItem, setEditingFoodItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = [
    'Appetizer', 'Main Course', 'Dessert', 'Beverage', 'Side Dish', 'Snack'
  ];

  const courses = ['breakfast', 'lunch', 'dinner', 'snack'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [foodData, statsData] = await Promise.all([
        api.getFoodItems(),
        api.getFoodStats()
      ]);
      
      setFoodItems(foodData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateFoodItem = async (foodData) => {
    try {
      await api.createFoodItem(foodData);
      await fetchData();
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateFoodItem = async (id, foodData) => {
    try {
      await api.updateFoodItem(id, foodData);
      await fetchData();
      setShowModal(false);
      setEditingFoodItem(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteFoodItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this food item?')) {
      try {
        await api.deleteFoodItem(id);
        await fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEditFoodItem = (foodItem) => {
    setEditingFoodItem(foodItem);
    setShowModal(true);
  };

  const filteredFoodItems = foodItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const categoryData = Array.isArray(stats.byCategory) ? stats.byCategory.map(item => ({
    label: item._id,
    value: item.totalCost
  })) : [];

  const courseData = Array.isArray(stats.byCourse) ? stats.byCourse.map(item => ({
    label: item._id,
    value: item.totalCost
  })) : [];

  const perPersonData = Array.isArray(stats.byPerPerson) ? stats.byPerPerson.map(item => ({
    label: item._id ? 'Per Person' : 'Shared',
    value: item.totalCost
  })) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Food Planning</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary self-start sm:self-auto"
        >
          Add Food Item
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
              <span className="text-2xl sm:text-3xl animate-bounce-slow">🍽️</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Items</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.overview?.totalItems || 0}</p>
            </div>
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">💰</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Cost</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{formatCurrency(stats.overview?.totalCost || 0)}</p>
            </div>
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">📊</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Quantity</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">{stats.overview?.totalQuantity || 0}</p>
            </div>
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">📈</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Avg Cost/Item</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">
                {formatCurrency((stats.overview?.totalCost || 0) / (stats.overview?.totalItems || 1))}
              </p>
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
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Cost by Category</h3>
          </div>
          <div className="chart-container">
            <PieChart data={categoryData} />
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.5s'}}>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mr-3">
              <span className="text-xl">🍽️</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Cost by Course</h3>
          </div>
          <div className="chart-container">
            <BarChart data={courseData} />
          </div>
        </div>
      </div>

      <div className="card-hover animate-slide-in" style={{animationDelay: '0.6s'}}>
        <div className="flex items-center mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mr-3">
            <span className="text-xl">👥</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Per Person vs Shared</h3>
        </div>
        <div className="chart-container">
          <PieChart data={perPersonData} />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card-hover animate-slide-in" style={{animationDelay: '0.7s'}}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center">
            <div className="p-2 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg mr-3">
              <span className="text-xl">📋</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Food Items List</h2>
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
              placeholder="Search food items..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field search-input"
            />
          </div>
        </div>

        {/* Table */}
        <div className="table-responsive">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Name</th>
                <th className="table-header">Category</th>
                <th className="table-header">Course</th>
                <th className="table-header">Quantity</th>
                <th className="table-header">Unit</th>
                <th className="table-header">Cost/Unit</th>
                <th className="table-header">Total Cost</th>
                <th className="table-header">Per Person</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFoodItems.map((item) => (
                <tr key={item._id} className="hover:bg-gray-50">
                  <td className="table-cell-long font-medium" title={item.name}>{item.name}</td>
                  <td className="table-cell">
                    <span className="status-badge status-badge-info">
                      {item.category}
                    </span>
                  </td>
                  <td className="table-cell capitalize">
                    <span className="status-badge status-badge-warning">
                      {item.course}
                    </span>
                  </td>
                  <td className="table-cell font-medium" title={item.quantity}>{item.quantity}</td>
                  <td className="table-cell" title={item.unit}>{item.unit}</td>
                  <td className="table-cell font-medium" title={formatCurrency(item.cost)}>{formatCurrency(item.cost)}</td>
                  <td className="table-cell font-medium text-green-600" title={formatCurrency(item.quantity * item.cost)}>
                    {formatCurrency(item.quantity * item.cost)}
                  </td>
                  <td className="table-cell">
                    <span className={`status-badge ${
                      item.perPerson ? 'status-badge-success' : 'status-badge-primary'
                    }`}>
                      {item.perPerson ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditFoodItem(item)}
                        className="btn-sm btn-outline"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFoodItem(item._id)}
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
      </div>

      {/* Modal */}
      {showModal && (
        <FoodModal
          foodItem={editingFoodItem}
          categories={categories}
          courses={courses}
          onSave={editingFoodItem ? handleUpdateFoodItem : handleCreateFoodItem}
          onClose={() => {
            setShowModal(false);
            setEditingFoodItem(null);
          }}
        />
      )}
    </div>
  );
};

export default FoodPlanning;
