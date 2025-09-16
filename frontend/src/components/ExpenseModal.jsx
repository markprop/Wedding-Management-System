import React, { useState, useEffect } from 'react';

const ExpenseModal = ({ expense, locations, categories, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    description: '',
    category: '',
    vendor: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    locationId: '',
    paid: false
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description || '',
        category: expense.category || '',
        vendor: expense.vendor || '',
        amount: expense.amount || '',
        date: expense.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        locationId: expense.locationId?._id || '',
        paid: expense.paid || false
      });
    }
  }, [expense]);

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
      amount: parseFloat(formData.amount)
    };
    
    if (expense) {
      onSave(expense._id, dataToSave);
    } else {
      onSave(dataToSave);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-sm">
        <div className="modal-header">
          <h2 className="modal-title">
            {expense ? 'Edit Expense' : 'Add New Expense'}
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
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="Enter expense description"
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
                  Vendor
                </label>
                <input
                  type="text"
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter vendor name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="animate-slide-in" style={{animationDelay: '0.3s'}}>
                <label className="label-required">
                  Amount (PKR)
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                  min="0"
                  step="0.01"
                  className="input-field"
                  placeholder="0.00"
                />
              </div>
              <div className="animate-slide-in" style={{animationDelay: '0.4s'}}>
                <label className="label-required">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div className="animate-slide-in" style={{animationDelay: '0.5s'}}>
              <label className="label">
                Location
              </label>
              <select
                name="locationId"
                value={formData.locationId}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">Select Location</option>
                {locations.map(location => (
                  <option key={location._id} value={location._id}>
                    {location.name} ({location.type})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center animate-slide-in" style={{animationDelay: '0.6s'}}>
              <input
                type="checkbox"
                name="paid"
                checked={formData.paid}
                onChange={handleChange}
                className="mr-3 h-5 w-5 text-primary-600 focus:ring-primary-500 border-gray-300 rounded-lg transition-all duration-200"
              />
              <label className="text-sm font-semibold text-gray-700 cursor-pointer">
                Paid
              </label>
            </div>

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
                {expense ? 'Update Expense' : 'Add Expense'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpenseModal;
