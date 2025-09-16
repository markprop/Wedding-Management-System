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
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pawo Tracker</h1>
        <button onClick={fetchData} className="btn-secondary self-start sm:self-auto">
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Key Metrics */}
      <div className="responsive-grid-4">
        <div className="card-hover animate-slide-in">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">💰</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Upper</p>
              <p className="text-2xl sm:text-3xl font-bold text-blue-600 mt-1">{formatCurrency(stats.overview?.totalUpper || 0)}</p>
            </div>
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">🎁</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Awoto</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{formatCurrency(stats.overview?.totalAwoto || 0)}</p>
            </div>
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">🎯</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Banodo</p>
              <p className="text-2xl sm:text-3xl font-bold text-purple-600 mt-1">{formatCurrency(stats.overview?.totalBanodo || 0)}</p>
            </div>
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-orange-100 to-orange-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">📊</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Net Contribution</p>
              <p className="text-2xl sm:text-3xl font-bold text-green-600 mt-1">{formatCurrency(stats.overview?.totalUpper || 0)}</p>
              <p className="text-xs text-gray-500 font-medium">Upper - (Awoto - Previous)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation Card */}
      <div className="card-hover animate-slide-in" style={{animationDelay: '0.4s'}}>
        <div className="flex items-center mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mr-4">
            <span className="text-2xl">💡</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold text-blue-900">Pawo System Rules</h3>
        </div>
        <div className="text-sm space-y-3">
          <div className="flex items-start space-x-3">
            <span className="text-blue-600 font-bold">💰</span>
            <p><strong className="text-blue-800">Upper Amount:</strong> <span className="text-blue-700">Direct contribution from the guest.</span></p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-green-600 font-bold">🎁</span>
            <p><strong className="text-blue-800">Awoto Amount:</strong> <span className="text-blue-700">Amount previously given to the guest (cancels out with Previous Amount).</span></p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-purple-600 font-bold">🎯</span>
            <p><strong className="text-blue-800">Banodo Amount:</strong> <span className="text-blue-700">Additional gift amount.</span></p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-orange-600 font-bold">📊</span>
            <p><strong className="text-blue-800">Previous Amount:</strong> <span className="text-blue-700">Automatically equals Awoto amount</span></p>
          </div>
          <div className="flex items-start space-x-3">
            <span className="text-green-600 font-bold">✅</span>
            <p><strong className="text-blue-800">Net Contribution:</strong> <span className="text-blue-700">Upper amount (since Previous and Awoto cancel each other out)</span></p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="responsive-grid-2">
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.5s'}}>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mr-3">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Pawo Breakdown</h3>
          </div>
          <div className="chart-container">
            <PieChart data={pawoBreakdownData} />
          </div>
        </div>
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.6s'}}>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mr-3">
              <span className="text-xl">🏆</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Top Contributors</h3>
          </div>
          <div className="chart-container">
            <BarChart data={topContributorsData} />
          </div>
        </div>
      </div>

      <div className="card-hover animate-slide-in" style={{animationDelay: '0.7s'}}>
        <div className="flex items-center mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mr-3">
            <span className="text-xl">📍</span>
          </div>
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">Contributions by Location</h3>
        </div>
        <div className="chart-container">
          <PieChart data={locationData} />
        </div>
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
