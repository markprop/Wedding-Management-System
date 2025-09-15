import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { formatCurrency, calculateNetPawo } from '../utils/formatters';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';

const PawoTracker = () => {
  const [guests, setGuests] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [guestsData, statsData] = await Promise.all([
        api.getGuests(),
        api.getGuestStats()
      ]);
      
      setGuests(guestsData);
      setStats(statsData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const filteredGuests = guests.filter(guest =>
    guest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guest.phone.includes(searchTerm)
  );

  // Calculate pawo breakdown data
  const pawoBreakdownData = [
    { label: 'Upper', value: stats.overview?.totalUpper || 0 },
    { label: 'Awoto', value: stats.overview?.totalAwoto || 0 },
    { label: 'Banodo', value: stats.overview?.totalBanodo || 0 }
  ];

  // Calculate top contributors
  const topContributors = guests
    .map(guest => ({
      name: guest.name,
      netContribution: calculateNetPawo(guest.pawo),
      upper: guest.pawo?.upper || 0,
      awoto: guest.pawo?.awoto || 0,
      banodo: guest.pawo?.banodo || 0
    }))
    .sort((a, b) => b.netContribution - a.netContribution)
    .slice(0, 10);

  const topContributorsData = topContributors.map(contributor => ({
    label: contributor.name,
    value: contributor.netContribution
  }));

  // Calculate contributions by location
  const contributionsByLocation = guests.reduce((acc, guest) => {
    const locationName = guest.locationId?.name || 'No Location';
    if (!acc[locationName]) {
      acc[locationName] = 0;
    }
    acc[locationName] += calculateNetPawo(guest.pawo);
    return acc;
  }, {});

  const locationData = Object.entries(contributionsByLocation).map(([location, amount]) => ({
    label: location,
    value: amount
  }));

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
        <h1 className="text-3xl font-bold text-gray-900">Pawo Tracker</h1>
        <button onClick={fetchData} className="btn-secondary">
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Upper</p>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(stats.overview?.totalUpper || 0)}</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Awoto</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.overview?.totalAwoto || 0)}</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Total Banodo</p>
            <p className="text-2xl font-bold text-purple-600">{formatCurrency(stats.overview?.totalBanodo || 0)}</p>
          </div>
        </div>
        <div className="card">
          <div className="text-center">
            <p className="text-sm text-gray-600">Net Contribution</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(stats.overview?.totalUpper || 0)}</p>
            <p className="text-xs text-gray-500">Upper - (Awoto - Previous)</p>
          </div>
        </div>
      </div>

      {/* Explanation Card */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-bold text-blue-900 mb-2">Pawo System Explanation</h3>
        <div className="text-sm text-blue-800 space-y-2">
          <p><strong>Upper:</strong> Direct contribution from the guest</p>
          <p><strong>Awoto:</strong> Amount given to the guest in previous events</p>
          <p><strong>Banodo:</strong> Additional gift amount</p>
          <p><strong>Previous Amount:</strong> Automatically equals Awoto amount</p>
          <p><strong>Net Contribution:</strong> Upper amount (since Previous and Awoto cancel each other out)</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Pawo Breakdown</h3>
          <PieChart data={pawoBreakdownData} />
        </div>
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Top Contributors</h3>
          <BarChart data={topContributorsData} />
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Contributions by Location</h3>
        <PieChart data={locationData} />
      </div>

      {/* Detailed Pawo List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-gray-900">Detailed Pawo Contributions</h2>
          <input
            type="text"
            placeholder="Search guests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field w-64"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="table-header">Guest Name</th>
                <th className="table-header">Phone</th>
                <th className="table-header">Location</th>
                <th className="table-header">Upper</th>
                <th className="table-header">Awoto</th>
                <th className="table-header">Banodo</th>
                <th className="table-header">Previous</th>
                <th className="table-header">Net Contribution</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredGuests.map((guest) => {
                const netContribution = calculateNetPawo(guest.pawo);
                return (
                  <tr key={guest._id} className="hover:bg-gray-50">
                    <td className="table-cell font-medium">{guest.name}</td>
                    <td className="table-cell">{guest.phone}</td>
                    <td className="table-cell">{guest.locationId?.name || '-'}</td>
                    <td className="table-cell text-blue-600 font-medium">
                      {formatCurrency(guest.pawo?.upper || 0)}
                    </td>
                    <td className="table-cell text-green-600">
                      {formatCurrency(guest.pawo?.awoto || 0)}
                    </td>
                    <td className="table-cell text-purple-600">
                      {formatCurrency(guest.pawo?.banodo || 0)}
                    </td>
                    <td className="table-cell text-gray-600">
                      {formatCurrency(guest.previousAmount || 0)}
                    </td>
                    <td className="table-cell font-bold text-green-600">
                      {formatCurrency(netContribution)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Summary Row */}
        <div className="mt-4 pt-4 border-t">
          <div className="flex justify-between items-center text-lg font-bold">
            <span>Total Net Contribution:</span>
            <span className="text-green-600">
              {formatCurrency(guests.reduce((total, guest) => total + calculateNetPawo(guest.pawo), 0))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PawoTracker;
