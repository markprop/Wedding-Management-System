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
    <div className="modal-overlay">
      <div className="modal-content-sm">
        <div className="modal-header">
          <h2 className="modal-title">
            {location ? 'Edit Location' : 'Add New Location'}
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
                placeholder="Enter location name"
              />
            </div>

            <div className="animate-slide-in" style={{animationDelay: '0.1s'}}>
              <label className="label-required">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                className="input-field"
                placeholder="Enter full address"
              />
            </div>

            <div className="animate-slide-in" style={{animationDelay: '0.2s'}}>
              <label className="label-required">
                Type
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="animate-slide-in" style={{animationDelay: '0.3s'}}>
                <label className="label-required">
                  Latitude
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
              <div className="animate-slide-in" style={{animationDelay: '0.4s'}}>
                <label className="label-required">
                  Longitude
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

            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200 animate-slide-in" style={{animationDelay: '0.5s'}}>
              <p className="text-sm font-semibold text-blue-800 mb-2">
                <span className="mr-2">💡</span>
                <strong>Note:</strong> You can get coordinates from Google Maps by right-clicking on a location and selecting "What's here?"
              </p>
              <p className="text-sm text-blue-700">
                <strong>Karachi Examples:</strong><br/>
                • Karachi Airport: 24.9065, 67.1608<br/>
                • Clifton Beach: 24.8138, 67.0306<br/>
                • Saddar: 24.8607, 67.0011
              </p>
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
