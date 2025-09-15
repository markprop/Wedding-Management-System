import React, { useState, useEffect } from 'react';

const LocationModal = ({ location, types, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    lat: '',
    lng: '',
    type: ''
  });

  useEffect(() => {
    if (location) {
      setFormData({
        name: location.name || '',
        address: location.address || '',
        lat: location.lat || '',
        lng: location.lng || '',
        type: location.type || ''
      });
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateCoordinates = (lat, lng) => {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return 'Please enter valid numeric coordinates';
    }
    
    if (latitude < -90 || latitude > 90) {
      return 'Latitude must be between -90 and 90 degrees';
    }
    
    if (longitude < -180 || longitude > 180) {
      return 'Longitude must be between -180 and 180 degrees';
    }
    
    // Check if coordinates are reasonable for Pakistan/Karachi area
    if (latitude < 20 || latitude > 40 || longitude < 60 || longitude > 80) {
      return 'Warning: These coordinates seem outside Pakistan area. Please verify.';
    }
    
    return null;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const lat = parseFloat(formData.lat);
    const lng = parseFloat(formData.lng);
    
    const validationError = validateCoordinates(lat, lng);
    if (validationError) {
      alert(validationError);
      return;
    }
    
    const dataToSave = {
      ...formData,
      lat: lat,
      lng: lng
    };
    
    if (location) {
      onSave(location._id, dataToSave);
    } else {
      onSave(dataToSave);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              {location ? 'Edit Location' : 'Add New Location'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <span className="text-2xl">&times;</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
                className="input-field"
              >
                <option value="">Select Type</option>
                {types.map(type => (
                  <option key={type} value={type}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Latitude *
                </label>
                <input
                  type="number"
                  name="lat"
                  value={formData.lat}
                  onChange={handleChange}
                  required
                  step="any"
                  className="input-field"
                  placeholder="e.g., 24.8607"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Longitude *
                </label>
                <input
                  type="number"
                  name="lng"
                  value={formData.lng}
                  onChange={handleChange}
                  required
                  step="any"
                  className="input-field"
                  placeholder="e.g., 67.0011"
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800 mb-2">
                <strong>Note:</strong> You can get coordinates from Google Maps by right-clicking on a location and selecting "What's here?"
              </p>
              <p className="text-sm text-blue-700">
                <strong>Karachi Examples:</strong><br/>
                • Karachi Airport: 24.9065, 67.1608<br/>
                • Clifton Beach: 24.8138, 67.0306<br/>
                • Saddar: 24.8607, 67.0011
              </p>
            </div>

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
                {location ? 'Update Location' : 'Add Location'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LocationModal;
