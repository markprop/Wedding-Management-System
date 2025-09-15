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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Food Planning</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Items</p>
            <p className="text-2xl font-bold text-gray-900">{stats.overview?.totalItems || 0}</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Cost</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.overview?.totalCost || 0)}</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Quantity</p>
            <p className="text-2xl font-bold text-blue-600">{stats.overview?.totalQuantity || 0}</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Avg Cost/Item</p>
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency((stats.overview?.totalCost || 0) / (stats.overview?.totalItems || 1))}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Cost by Category</h3>
          <PieChart data={categoryData} />
        </div>
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Cost by Course</h3>
          <BarChart data={courseData} />
        </div>
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Per Person vs Shared</h3>
          <PieChart data={perPersonData} />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Food Items List</h2>
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
              placeholder="Search food items..."
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
                  <td className="table-cell font-medium">{item.name}</td>
                  <td className="table-cell">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      {item.category}
                    </span>
                  </td>
                  <td className="table-cell capitalize">{item.course}</td>
                  <td className="table-cell">{item.quantity}</td>
                  <td className="table-cell">{item.unit}</td>
                  <td className="table-cell">{formatCurrency(item.cost)}</td>
                  <td className="table-cell font-medium text-green-600">
                    {formatCurrency(item.quantity * item.cost)}
                  </td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.perPerson ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {item.perPerson ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditFoodItem(item)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFoodItem(item._id)}
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
