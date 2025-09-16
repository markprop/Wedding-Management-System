import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatCurrency, calculateNetPawo } from '../utils/formatters';
import GuestModal from '../components/GuestModal';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';

const GuestManagement = () => {
  const [guests, setGuests] = useState([]);
  const [locations, setLocations] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [guestsData, locationsData, statsData] = await Promise.all([
        api.getGuests(),
        api.getLocations(),
        api.getGuestStats()
      ]);
      
      setGuests(guestsData);
      setLocations(locationsData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGuest = async (guestData) => {
    try {
      await api.createGuest(guestData);
      await fetchData();
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateGuest = async (id, guestData) => {
    try {
      await api.updateGuest(id, guestData);
      await fetchData();
      setShowModal(false);
      setEditingGuest(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteGuest = async (id) => {
    if (window.confirm('Are you sure you want to delete this guest?')) {
      try {
        await api.deleteGuest(id);
        await fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEditGuest = (guest) => {
    setEditingGuest(guest);
    setShowModal(true);
  };

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone.includes(searchTerm) ||
    (guest.email && guest.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const attendanceData = [
    { label: 'Attending', value: guests.filter(g => g.attending).length },
    { label: 'Not Attending', value: guests.filter(g => !g.attending).length }
  ];

  const mealPreferenceData = Array.isArray(stats.mealPreferences) ? stats.mealPreferences.map(item => ({
    label: item._id,
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Guest Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary self-start sm:self-auto"
        >
          Add Guest
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
              <span className="text-2xl sm:text-3xl animate-bounce-slow">👥</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Guests</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.overview?.totalGuests || 0}</p>
            </div>
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">✅</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Attending</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{stats.overview?.attendingGuests || 0}</p>
            </div>
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">💰</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Net Pawo</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">{formatCurrency(stats.overview?.totalUpper || 0)}</p>
            </div>
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">🎁</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Upper</p>
              <p className="text-2xl sm:text-3xl font-bold text-orange-600 mt-1">{formatCurrency(stats.overview?.totalUpper || 0)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="responsive-grid-2">
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.4s'}}>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mr-3">
              <span className="text-xl">👥</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Attendance Status</h3>
          </div>
          <div className="chart-container">
            <PieChart data={attendanceData} />
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.5s'}}>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mr-3">
              <span className="text-xl">🍽️</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Meal Preferences</h3>
          </div>
          <div className="chart-container">
            <BarChart data={mealPreferenceData} />
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
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Guests List</h2>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search guests..."
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
                <th className="table-header">Name</th>
                <th className="table-header">Phone</th>
                <th className="table-header">Email</th>
                <th className="table-header">Attending</th>
                <th className="table-header">Location</th>
                <th className="table-header">Pawo</th>
                <th className="table-header">Net Contribution</th>
                <th className="table-header">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGuests.map((guest) => (
                <tr key={guest._id} className="hover:bg-gray-50">
                  <td className="table-cell font-medium" title={guest.name}>{guest.name}</td>
                  <td className="table-cell" title={guest.phone}>{guest.phone}</td>
                  <td className="table-cell-email" title={guest.email || '-'}>{guest.email || '-'}</td>
                  <td className="table-cell">
                    <span className={`status-badge ${
                      guest.attending ? 'status-badge-success' : 'status-badge-danger'
                    }`}>
                      {guest.attending ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="table-cell" title={guest.locationId?.name || '-'}>{guest.locationId?.name || '-'}</td>
                  <td className="table-cell-long">
                    <div className="text-xs sm:text-sm space-y-1">
                      <div className="truncate">Upper: {formatCurrency(guest.pawo?.upper || 0)}</div>
                      <div className="truncate">Awoto: {formatCurrency(guest.pawo?.awoto || 0)}</div>
                      <div className="truncate">Banodo: {formatCurrency(guest.pawo?.banodo || 0)}</div>
                    </div>
                  </td>
                  <td className="table-cell font-medium text-green-600" title={formatCurrency(calculateNetPawo(guest.pawo))}>
                    {formatCurrency(calculateNetPawo(guest.pawo))}
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditGuest(guest)}
                        className="btn-sm btn-outline"
                      >
                        ✏️ Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGuest(guest._id)}
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
          {filteredGuests.map((guest) => (
            <div key={guest._id} className="mobile-card">
              <div className="mobile-card-header">
                <div>
                  <div className="mobile-card-title">{guest.name}</div>
                  <div className="mobile-card-subtitle">{guest.phone}</div>
                  {guest.email && (
                    <div className="mobile-card-subtitle">{guest.email}</div>
                  )}
                </div>
                <span className={`status-badge ${
                  guest.attending ? 'status-badge-success' : 'status-badge-danger'
                }`}>
                  {guest.attending ? 'Attending' : 'Not Attending'}
                </span>
              </div>
              
            <div className="mobile-card-content">
              <div>
                <span className="font-medium text-gray-600">Location:</span> 
                <span className="mobile-card-text ml-1">{guest.locationId?.name || '-'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-600">Net Contribution:</span>
                <span className="font-semibold text-green-600 ml-1">
                  {formatCurrency(calculateNetPawo(guest.pawo))}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <div className="font-medium text-gray-600">Upper</div>
                  <div className="mobile-card-text">{formatCurrency(guest.pawo?.upper || 0)}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Awoto</div>
                  <div className="mobile-card-text">{formatCurrency(guest.pawo?.awoto || 0)}</div>
                </div>
                <div>
                  <div className="font-medium text-gray-600">Banodo</div>
                  <div className="mobile-card-text">{formatCurrency(guest.pawo?.banodo || 0)}</div>
                </div>
              </div>
            </div>
              
              <div className="mobile-card-actions">
                <button
                  onClick={() => handleEditGuest(guest)}
                  className="mobile-card-action"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDeleteGuest(guest._id)}
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
        <GuestModal
          guest={editingGuest}
          locations={locations}
          onSave={editingGuest ? handleUpdateGuest : handleCreateGuest}
          onClose={() => {
            setShowModal(false);
            setEditingGuest(null);
          }}
        />
      )}
    </div>
  );
};

export default GuestManagement;
