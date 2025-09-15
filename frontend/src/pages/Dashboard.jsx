import React, { useState, useEffect } from 'react';
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
    food: { total: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [guests, expenses, food, guestStats, expenseStats, foodStats] = await Promise.all([
        api.getGuests(),
        api.getExpenses(),
        api.getFoodItems(),
        api.getGuestStats(),
        api.getExpenseStats(),
        api.getFoodStats()
      ]);

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
        }
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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

  const netBalance = stats.pawo.total - stats.expenses.total;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button onClick={fetchDashboardData} className="btn-secondary">
          Refresh
        </button>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">👥</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Guests</p>
              <p className="text-2xl font-bold text-gray-900">{stats.guests.total}</p>
              <p className="text-sm text-green-600">{stats.guests.attending} attending</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Expenses</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.expenses.total)}</p>
              <p className="text-sm text-red-600">{formatCurrency(stats.expenses.unpaid)} unpaid</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">🎁</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Net Pawo</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.pawo.total)}</p>
              <p className="text-sm text-gray-600">Contributions</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <span className="text-2xl">🍽️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Food Cost</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.food.total)}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
        </div>
      </div>

      {/* Budget Status */}
      <div className="card">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Budget Status</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Net Balance</p>
            <p className={`text-3xl font-bold ${netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netBalance)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Pawo - Expenses</p>
            <p className="text-lg text-gray-900">
              {formatCurrency(stats.pawo.total)} - {formatCurrency(stats.expenses.total)}
            </p>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Expense Distribution</h3>
          <PieChart data={[]} />
        </div>
        
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Pawo Breakdown</h3>
          <PieChart data={[]} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Monthly Trends</h3>
          <LineChart data={[]} />
        </div>
        
        <div className="card">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Category Comparison</h3>
          <BarChart data={[]} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
