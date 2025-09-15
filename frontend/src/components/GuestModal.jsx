import React, { useState, useEffect } from 'react';

const GuestModal = ({ guest, locations, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    attending: false,
    pawo: {
      upper: 0,
      awoto: 0,
      banodo: 0
    },
    previousAmount: 0,
    locationId: '',
    rsvpDate: new Date().toISOString().split('T')[0],
    mealPreference: 'no-preference',
    tableNumber: ''
  });
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    if (guest) {
      setFormData({
        name: guest.name || '',
        phone: guest.phone || '',
        email: guest.email || '',
        attending: guest.attending || false,
        pawo: {
          upper: guest.pawo?.upper || 0,
          awoto: guest.pawo?.awoto || 0,
          banodo: guest.pawo?.banodo || 0
        },
        previousAmount: guest.previousAmount || 0,
        locationId: guest.locationId?._id || '',
        rsvpDate: guest.rsvpDate ? new Date(guest.rsvpDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        mealPreference: guest.mealPreference || 'no-preference',
        tableNumber: guest.tableNumber || ''
      });
    }
  }, [guest]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.startsWith('pawo.')) {
      const pawoField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        pawo: {
          ...prev.pawo,
          [pawoField]: parseFloat(value) || 0
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setValidationError('');
    
    // Validate that previous amount equals awoto amount
    if (formData.previousAmount !== formData.pawo.awoto) {
      setValidationError('Error: Previous amount must equal Awoto amount. Please adjust the values.');
      return;
    }
    
    // Ensure previousAmount equals awoto amount
    const dataToSave = {
      ...formData,
      previousAmount: formData.pawo.awoto
    };
    
    if (guest) {
      onSave(guest._id, dataToSave);
    } else {
      onSave(dataToSave);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {guest ? 'Edit Guest' : 'Add New Guest'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Validation Error */}
            {validationError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {validationError}
              </div>
            )}
            
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  className="input-field"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
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
            </div>

            {/* Attendance and Preferences */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="attending"
                  checked={formData.attending}
                  onChange={handleChange}
                  className="mr-2"
                />
                <label className="text-sm font-medium text-gray-700">
                  Attending
                </label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meal Preference
                </label>
                <select
                  name="mealPreference"
                  value={formData.mealPreference}
                  onChange={handleChange}
                  className="input-field"
                >
                  <option value="no-preference">No Preference</option>
                  <option value="vegetarian">Vegetarian</option>
                  <option value="non-vegetarian">Non-Vegetarian</option>
                  <option value="vegan">Vegan</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Table Number
                </label>
                <input
                  type="number"
                  name="tableNumber"
                  value={formData.tableNumber}
                  onChange={handleChange}
                  min="1"
                  className="input-field"
                />
              </div>
            </div>

            {/* Pawo Information */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Pawo Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upper Amount (PKR) *
                  </label>
                  <input
                    type="number"
                    name="pawo.upper"
                    value={formData.pawo.upper}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Awoto Amount (PKR) *
                  </label>
                  <input
                    type="number"
                    name="pawo.awoto"
                    value={formData.pawo.awoto}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="input-field"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Banodo Amount (PKR)
                  </label>
                  <input
                    type="number"
                    name="pawo.banodo"
                    value={formData.pawo.banodo}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    className="input-field"
                  />
                </div>
              </div>
              
              {/* Previous Amount Display */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Previous Amount (PKR) - Auto-calculated
                </label>
                <input
                  type="number"
                  value={formData.pawo.awoto}
                  readOnly
                  className="input-field bg-gray-100 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This field automatically equals the Awoto amount
                </p>
              </div>
              
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Pawo System Rules:</strong>
                </p>
                <ul className="text-sm text-blue-800 mt-2 list-disc list-inside space-y-1">
                  <li>Previous Amount = Awoto Amount (they cancel each other out)</li>
                  <li>Net Contribution = Upper Amount only</li>
                  <li>Banodo is an additional gift amount</li>
                </ul>
                <p className="text-sm text-blue-800 mt-2 font-medium">
                  <strong>Net Contribution:</strong> {formData.pawo.upper} PKR
                </p>
                
                {/* Real-time validation message */}
                {formData.previousAmount !== formData.pawo.awoto && formData.previousAmount > 0 && (
                  <div className="mt-3 p-3 bg-yellow-100 border border-yellow-400 rounded">
                    <p className="text-sm text-yellow-800">
                      <strong>⚠️ Validation Notice:</strong> Previous amount ({formData.previousAmount}) should equal Awoto amount ({formData.pawo.awoto}). 
                      The system will automatically set Previous amount to match Awoto amount when you save.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
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
                {guest ? 'Update Guest' : 'Add Guest'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default GuestModal;
