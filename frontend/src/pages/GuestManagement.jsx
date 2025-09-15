import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatCurrency, formatDate, calculateNetPawo, getStatusColor } from '../utils/formatters';
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Guest Management</h1>
        <button
          onClick={() => setShowModal(true)}
          className="btn-primary"
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Guests</p>
            <p className="text-2xl font-bold text-gray-900">{stats.overview?.totalGuests || 0}</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Attending</p>
            <p className="text-2xl font-bold text-green-600">{stats.overview?.attendingGuests || 0}</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Net Pawo</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.overview?.totalUpper || 0)}</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Upper</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.overview?.totalUpper || 0)}</p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Attendance Status</h3>
          <PieChart data={attendanceData} />
        </div>
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Meal Preferences</h3>
          <BarChart data={mealPreferenceData} />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Guests List</h2>
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search guests..."
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
                  <td className="table-cell font-medium">{guest.name}</td>
                  <td className="table-cell">{guest.phone}</td>
                  <td className="table-cell">{guest.email || '-'}</td>
                  <td className="table-cell">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      guest.attending ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {guest.attending ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="table-cell">{guest.locationId?.name || '-'}</td>
                  <td className="table-cell">
                    <div className="text-sm">
                      <div>Upper: {formatCurrency(guest.pawo?.upper || 0)}</div>
                      <div>Awoto: {formatCurrency(guest.pawo?.awoto || 0)}</div>
                      <div>Banodo: {formatCurrency(guest.pawo?.banodo || 0)}</div>
                    </div>
                  </td>
                  <td className="table-cell font-medium text-green-600">
                    {formatCurrency(calculateNetPawo(guest.pawo))}
                  </td>
                  <td className="table-cell">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditGuest(guest)}
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteGuest(guest._id)}
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
