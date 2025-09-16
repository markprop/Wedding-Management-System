import React, { useState, useEffect } from 'react';
import api from '../services/api';
import LocationModal from '../components/LocationModal';
import MapView from '../components/MapView';
import PieChart from '../components/PieChart';

const LocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const locationTypes = [
    'venue', 'reception', 'mehndi', 'barat', 'photography', 'custom'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [locationsData, statsData] = await Promise.all([
        api.getLocations(),
        api.getLocationStats()
      ]);
      
      setLocations(locationsData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLocation = async (locationData) => {
    try {
      await api.createLocation(locationData);
      await fetchData();
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateLocation = async (id, locationData) => {
    try {
      await api.updateLocation(id, locationData);
      await fetchData();
      setShowModal(false);
      setEditingLocation(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteLocation = async (id) => {
    if (window.confirm('Are you sure you want to delete this location?')) {
      try {
        await api.deleteLocation(id);
        await fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEditLocation = (location) => {
    setEditingLocation(location);
    setShowModal(true);
  };

  const filteredLocations = locations.filter(location => {
    const matchesSearch = location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         location.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !typeFilter || location.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const typeData = Array.isArray(stats) ? stats.map(item => ({
    label: item._id.charAt(0).toUpperCase() + item._id.slice(1),
    value: item.count
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
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Location Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary self-start sm:self-auto"
        >
          Add Location
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Statistics */}
      <div className="responsive-grid-4">
        <div className="card-hover animate-slide-in">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">📍</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Locations</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{locations.length}</p>
            </div>
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">🏛️</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Venues</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">
                {locations.filter(l => l.type === 'venue').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">🎉</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Receptions</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">
                {locations.filter(l => l.type === 'reception').length}
              </p>
            </div>
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">🎯</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Other</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">
                {locations.filter(l => !['venue', 'reception'].includes(l.type)).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Map */}
      <div className="responsive-grid-2">
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mr-3">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Locations by Type</h3>
          </div>
          <div className="chart-container">
            <PieChart data={typeData} />
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.5s'}}>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mr-3">
              <span className="text-xl">🗺️</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Map View</h3>
          </div>
          <div className="w-full h-64 sm:h-80 lg:h-96 rounded-lg overflow-hidden">
            <MapView locations={locations} />
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
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Locations List</h2>
          </div>
          <div className="search-container">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field filter-select"
            >
              <option value="">All Types</option>
              {locationTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Search locations..."
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
                <th className="table-header">Type</th>
                <th className="table-header">Address</th>
                <th className="table-header">Coordinates</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLocations.map((location) => (
                <tr key={location._id} className="hover:bg-gray-50">
                  <td className="table-cell-long font-medium" title={location.name}>{location.name}</td>
                  <td className="table-cell">
                    <span className="status-badge status-badge-info">
                      {location.type}
                    </span>
                  </td>
                  <td className="table-cell-long" title={location.address}>{location.address}</td>
                  <td className="table-cell text-sm text-gray-600" title={`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}>
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditLocation(location)}
                        className="btn-sm btn-outline"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLocation(location._id)}
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
        <LocationModal
          location={editingLocation}
          types={locationTypes}
          onSave={editingLocation ? handleUpdateLocation : handleCreateLocation}
          onClose={() => {
            setShowModal(false);
            setEditingLocation(null);
          }}
        />
      )}
    </div>
  );
};

export default LocationManagement;
