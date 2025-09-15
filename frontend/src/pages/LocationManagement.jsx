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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Location Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Locations</p>
            <p className="text-2xl font-bold text-gray-900">{locations.length}</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Venues</p>
            <p className="text-2xl font-bold text-blue-600">
              {locations.filter(l => l.type === 'venue').length}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Receptions</p>
            <p className="text-2xl font-bold text-green-600">
              {locations.filter(l => l.type === 'reception').length}
            </p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Other</p>
            <p className="text-2xl font-bold text-purple-600">
              {locations.filter(l => !['venue', 'reception'].includes(l.type)).length}
            </p>
          </div>
        </div>
      </div>

      {/* Charts and Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Locations by Type</h3>
          <PieChart data={typeData} />
        </div>
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Map View</h3>
          <MapView locations={locations} />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Locations List</h2>
          <div className="flex items-center space-x-4">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="input-field w-48"
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
                <th className="table-header">Type</th>
                <th className="table-header">Address</th>
                <th className="table-header">Coordinates</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredLocations.map((location) => (
                <tr key={location._id} className="hover:bg-gray-50">
                  <td className="table-cell font-medium">{location.name}</td>
                  <td className="table-cell">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs capitalize">
                      {location.type}
                    </span>
                  </td>
                  <td className="table-cell">{location.address}</td>
                  <td className="table-cell text-sm text-gray-600">
                    {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditLocation(location)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteLocation(location._id)}
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
