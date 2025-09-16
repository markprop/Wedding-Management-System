import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ImportExportModal from './ImportExportModal';

const Navbar = () => {
  const location = useLocation();
  const [showImportExport, setShowImportExport] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/guests', label: 'Guests', icon: '👥' },
    { path: '/expenses', label: 'Expenses', icon: '💰' },
    { path: '/food', label: 'Food', icon: '🍽️' },
    { path: '/pawo', label: 'Pawo', icon: '🎁' },
    { path: '/locations', label: 'Locations', icon: '📍' }
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-40">
      <div className="container mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center py-3 sm:py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <span className="text-xl sm:text-2xl">💒</span>
            <h1 className="text-lg sm:text-xl font-bold text-gray-800">Wedding Planner</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-colors duration-200 ${
                  location.pathname === item.path
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className="text-sm sm:text-base">{item.icon}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            ))}
            
            <button
              onClick={() => setShowImportExport(true)}
              className="flex items-center space-x-2 px-3 xl:px-4 py-2 rounded-lg transition-colors duration-200 text-gray-600 hover:bg-gray-100"
            >
              <span className="text-sm sm:text-base">📁</span>
              <span className="text-sm font-medium">Import/Export</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setShowImportExport(true)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              title="Import/Export"
            >
              <span className="text-lg">📁</span>
            </button>
            <button
              onClick={toggleMobileMenu}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white">
            <div className="px-2 py-2 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors duration-200 ${
                    location.pathname === item.path
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
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
