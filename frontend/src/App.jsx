import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

// Components
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import GuestManagement from './pages/GuestManagement';
import ExpenseTracker from './pages/ExpenseTracker';
import FoodPlanning from './pages/FoodPlanning';
import PawoTracker from './pages/PawoTracker';
import LocationManagement from './pages/LocationManagement';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/guests" element={<GuestManagement />} />
            <Route path="/expenses" element={<ExpenseTracker />} />
            <Route path="/food" element={<FoodPlanning />} />
            <Route path="/pawo" element={<PawoTracker />} />
            <Route path="/locations" element={<LocationManagement />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
