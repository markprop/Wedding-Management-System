import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ImportExportModal from './ImportExportModal';

const Navbar = () => {
  const location = useLocation();
  const [showImportExport, setShowImportExport] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/guests', label: 'Guests', icon: '👥' },
    { path: '/expenses', label: 'Expenses', icon: '💰' },
    { path: '/food', label: 'Food', icon: '🍽️' },
    { path: '/pawo', label: 'Pawo', icon: '🎁' },
    { path: '/locations', label: 'Locations', icon: '📍' }
  ];

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">💒</span>
            <h1 className="text-xl font-bold text-gray-800">Wedding Planner</h1>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span>{item.icon}</span>
                <span className="hidden sm:inline">{item.label}</span>
              </Link>
            ))}
            
            <button
              onClick={() => setShowImportExport(true)}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100"
            >
              <span>📁</span>
              <span className="hidden sm:inline">Import/Export</span>
            </button>
          </div>
        </div>
      </div>
      
      {showImportExport && (
        <ImportExportModal
          onClose={() => setShowImportExport(false)}
          onImportSuccess={() => {
            setShowImportExport(false);
            // Refresh the page to show updated data
            window.location.reload();
          }}
        />
      )}
    </nav>
  );
};

export default Navbar;
