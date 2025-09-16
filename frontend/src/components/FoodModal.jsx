import React, { useState, useEffect } from 'react';

const FoodModal = ({ foodItem, categories, courses, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    unit: '',
    cost: '',
    perPerson: false,
    course: ''
  });

  useEffect(() => {
    if (foodItem) {
      setFormData({
        name: foodItem.name || '',
        category: foodItem.category || '',
        quantity: foodItem.quantity || '',
        unit: foodItem.unit || '',
        cost: foodItem.cost || '',
        perPerson: foodItem.perPerson || false,
        course: foodItem.course || ''
      });
    }
  }, [foodItem]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const dataToSave = {
      ...formData,
      quantity: parseFloat(formData.quantity),
      cost: parseFloat(formData.cost)
    };
    
    if (foodItem) {
      onSave(foodItem._id, dataToSave);
    } else {
      onSave(dataToSave);
    }
  };

  const totalCost = (parseFloat(formData.quantity) || 0) * (parseFloat(formData.cost) || 0);

  return (
    <div className="modal-overlay">
      <div className="modal-content-sm">
        <div className="modal-header">
          <h2 className="modal-title">
            {foodItem ? 'Edit Food Item' : 'Add New Food Item'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            <div className="animate-slide-in">
              <label className="label-required">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter food item name"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="animate-slide-in" style={{animationDelay: '0.1s'}}>
                <label className="label-required">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div className="animate-slide-in" style={{animationDelay: '0.2s'}}>
                <label className="label-required">
                  Course
                </label>
                <select
                  name="course"
                  value={formData.course}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select Course</option>
                  {courses.map(course => (
                    <option key={course} value={course}>{course.charAt(0).toUpperCase() + course.slice(1)}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="animate-slide-in" style={{animationDelay: '0.3s'}}>
                <label className="label-required">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="0"
                />
              </div>
              <div className="animate-slide-in" style={{animationDelay: '0.4s'}}>
                <label className="label-required">
                  Unit
                </label>
                <input
                  type="text"
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  required
                  placeholder="e.g., kg, pieces, liters"
                  className="input-field"
                />
              </div>
              <div className="animate-slide-in" style={{animationDelay: '0.5s'}}>
                <label className="label-required">
                  Cost per Unit (PKR)
                </label>
                <input
                  type="number"
                  name="cost"
                  value={formData.cost}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex items-center animate-slide-in" style={{animationDelay: '0.6s'}}>
              <input
                type="checkbox"
                name="perPerson"
                checked={formData.perPerson}
                onChange={handleChange}
                className="mr-3 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-lg transition-all duration-200"
              />
              <label className="text-sm font-semibold text-gray-700 cursor-pointer">
                Per Person Item
              </label>
            </div>

            {totalCost > 0 && (
              <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200 animate-slide-in" style={{animationDelay: '0.7s'}}>
                <p className="text-sm font-semibold text-green-800">
                  <span className="mr-2">💰</span>
                  <strong>Total Cost:</strong> {totalCost.toLocaleString('en-PK', {
                    style: 'currency',
                    currency: 'PKR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
              </div>
            )}

            <div className="modal-footer">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                {foodItem ? 'Update Food Item' : 'Add Food Item'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FoodModal;
