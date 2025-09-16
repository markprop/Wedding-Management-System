import React, { useState, useEffect, useMemo, useCallback } from 'react';
import api from '../services/api';
import { formatCurrency, calculateTotalPawo, calculateTotalExpenses, calculatePaidExpenses, calculateUnpaidExpenses, calculateTotalFoodCost } from '../utils/formatters';
import PieChart from '../components/PieChart';
import BarChart from '../components/BarChart';
import LineChart from '../components/LineChart';

const Dashboard = () => {
  const [stats, setStats] = useState({
    guests: { total: 0, attending: 0 },
    expenses: { total: 0, paid: 0, unpaid: 0 },
    pawo: { total: 0 },
    food: { total: 0 },
    expenseStats: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate pawo breakdown from actual guest data
  const pawoBreakdownData = useMemo(() => {
    if (!stats.guests.total) return [];
    
    // This would need to be calculated from actual guest pawo data
    // For now, using sample breakdown based on total
    const upperTotal = stats.pawo.total * 0.6;
    const awotoTotal = stats.pawo.total * 0.3;
    const banodoTotal = stats.pawo.total * 0.1;
    
    return [
      { label: 'Upper', value: upperTotal },
      { label: 'Awoto', value: awotoTotal },
      { label: 'Banodo', value: banodoTotal }
    ];
  }, [stats.pawo.total, stats.guests.total]);

  const netBalance = stats.pawo.total - stats.expenses.total;

  // Prepare chart data
  const expenseDistributionData = stats.expenseStats?.byCategory?.map(item => ({
    label: item._id,
    value: item.totalAmount
  })) || [];

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [guests, expenses, food, expenseStats] = await Promise.all([
        api.getGuests(),
        api.getExpenses(),
        api.getFoodItems(),
        api.getExpenseStats()
      ]);

      // Check if database is empty and load sample data
      if (guests.length === 0 && expenses.length === 0 && food.length === 0) {
        console.log('Database is empty, loading sample data...');
        const sampleData = await api.getSampleData();
        await api.importAllData(sampleData);
        // Recursively call fetchDashboardData after loading sample data
        await fetchDashboardData();
        return;
      }

      const totalPawo = calculateTotalPawo(guests);
      const totalExpenses = calculateTotalExpenses(expenses);
      const paidExpenses = calculatePaidExpenses(expenses);
      const unpaidExpenses = calculateUnpaidExpenses(expenses);
      const totalFoodCost = calculateTotalFoodCost(food);

      setStats({
        guests: {
          total: guests.length,
          attending: guests.filter(g => g.attending).length
        },
        expenses: {
          total: totalExpenses,
          paid: paidExpenses,
          unpaid: unpaidExpenses
        },
        pawo: {
          total: totalPawo
        },
        food: {
          total: totalFoodCost
        },
        expenseStats: expenseStats
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadSampleData = useCallback(async () => {
    try {
      const sampleData = await api.getSampleData();
      await api.importAllData(sampleData);
      // Refresh data after loading sample data
      await fetchDashboardData();
    } catch (err) {
      console.error('Error loading sample data:', err);
    }
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading dashboard: {error}</p>
        <button onClick={fetchDashboardData} className="btn-primary mt-4">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
        <div className="flex gap-2">
          <button onClick={loadSampleData} className="btn-outline self-start sm:self-auto">
            Load Sample Data
          </button>
          <button onClick={fetchDashboardData} className="btn-secondary self-start sm:self-auto">
            Refresh
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="responsive-grid-4">
        <div className="card-hover animate-slide-in">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">👥</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Guests</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.guests.total}</p>
              <p className="text-xs sm:text-sm text-green-600 font-medium">{stats.guests.attending} attending</p>
            </div>
          </div>
        </div>

        <div className="card-hover animate-slide-in" style={{animationDelay: '0.1s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-red-100 to-red-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">💰</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Expenses</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{formatCurrency(stats.expenses.total)}</p>
              <p className="text-xs sm:text-sm text-red-600 font-medium">{formatCurrency(stats.expenses.unpaid)} unpaid</p>
            </div>
          </div>
        </div>

        <div className="card-hover animate-slide-in" style={{animationDelay: '0.2s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">🎁</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Net Pawo</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{formatCurrency(stats.pawo.total)}</p>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Contributions</p>
            </div>
          </div>
        </div>

        <div className="card-hover animate-slide-in" style={{animationDelay: '0.3s'}}>
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-xl flex-shrink-0 shadow-lg">
              <span className="text-2xl sm:text-3xl animate-bounce-slow">🍽️</span>
            </div>
            <div className="ml-4 sm:ml-6 min-w-0">
              <p className="text-xs sm:text-sm font-semibold text-gray-600 uppercase tracking-wide">Food Cost</p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{formatCurrency(stats.food.total)}</p>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Status */}
      <div className="card-hover animate-slide-in" style={{animationDelay: '0.4s'}}>
        <div className="flex items-center mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg mr-4">
            <span className="text-2xl">📊</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Budget Status</h2>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Net Balance</p>
            <p className={`text-3xl sm:text-4xl font-bold mt-2 ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netBalance)}
            </p>
          </div>
          <div className="text-center sm:text-right">
            <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Pawo - Expenses</p>
            <p className="text-lg sm:text-xl text-gray-900 break-all mt-2">
              {formatCurrency(stats.pawo.total)} - {formatCurrency(stats.expenses.total)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="responsive-grid-2">
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.5s'}}>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg mr-3">
              <span className="text-xl">📈</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Expense Distribution</h3>
          </div>
          <div className="chart-container">
            <PieChart data={expenseDistributionData} />
          </div>
        </div>
        
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.6s'}}>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-green-100 to-green-200 rounded-lg mr-3">
              <span className="text-xl">🎯</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Pawo Breakdown</h3>
          </div>
          <div className="chart-container">
            <PieChart data={pawoBreakdownData} />
          </div>
        </div>
      </div>

      <div className="responsive-grid-2">
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.7s'}}>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg mr-3">
              <span className="text-xl">📊</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Monthly Trends</h3>
          </div>
          <div className="chart-container">
            <LineChart data={[]} />
          </div>
        </div>
        
        <div className="card-hover animate-slide-in" style={{animationDelay: '0.8s'}}>
          <div className="flex items-center mb-6">
            <div className="p-2 bg-gradient-to-br from-pink-100 to-pink-200 rounded-lg mr-3">
              <span className="text-xl">📋</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900">Category Comparison</h3>
          </div>
          <div className="chart-container">
            <BarChart data={[]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
