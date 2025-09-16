import React, { useState } from 'react';
import api from '../services/api';
import { downloadData } from '../utils/dataFormatters';

const ImportExportModal = ({ onClose, onImportSuccess }) => {
  const [activeTab, setActiveTab] = useState('import');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/json') {
      setFile(selectedFile);
      setError(null);
    } else {
      setError('Please select a valid JSON file');
    }
  };

  const handleImport = async () => {
    if (!file) {
      setError('Please select a file to import');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const text = await file.text();
      const data = JSON.parse(text);
      
      const result = await api.importAllData(data);
      
      setSuccess(`Successfully imported ${result.counts.locations} locations, ${result.counts.guests} guests, ${result.counts.expenses} expenses, and ${result.counts.foodItems} food items.`);
      
      if (onImportSuccess) {
        onImportSuccess();
      }
      
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to import data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format = 'json') => {
    try {
      setLoading(true);
      setError(null);
      
      if (format === 'json') {
        const blob = await api.exportAllData();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `wedding-data-export-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } else {
        // For CSV exports, we need to get the data first
        const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/import-export/export`);
        const data = await response.json();
        
        // Export each section as separate CSV files
        if (data.guests && data.guests.length > 0) {
          downloadData(data.guests, `guests-export-${new Date().toISOString().split('T')[0]}`, 'csv');
        }
        if (data.expenses && data.expenses.length > 0) {
          downloadData(data.expenses, `expenses-export-${new Date().toISOString().split('T')[0]}`, 'csv');
        }
        if (data.foodItems && data.foodItems.length > 0) {
          downloadData(data.foodItems, `food-items-export-${new Date().toISOString().split('T')[0]}`, 'csv');
        }
        if (data.locations && data.locations.length > 0) {
          downloadData(data.locations, `locations-export-${new Date().toISOString().split('T')[0]}`, 'csv');
        }
      }
      
      setSuccess(`Data exported successfully as ${format.toUpperCase()}!`);
      
    } catch (err) {
      setError(err.message || 'Failed to export data');
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSampleData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const sampleData = await api.getSampleData();
      const result = await api.importAllData(sampleData);
      
      setSuccess(`Successfully loaded sample data: ${result.counts.locations} locations, ${result.counts.guests} guests, ${result.counts.expenses} expenses, and ${result.counts.foodItems} food items.`);
      
      if (onImportSuccess) {
        onImportSuccess();
      }
      
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to load sample data');
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!window.confirm('Are you sure you want to clear all data? This action cannot be undone.')) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      await api.clearAllData();
      
      setSuccess('All data cleared successfully!');
      
      if (onImportSuccess) {
        onImportSuccess();
      }
      
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (err) {
      setError(err.message || 'Failed to clear data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2 className="modal-title">Import/Export Data</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('import')}
              className={`px-4 py-3 font-semibold text-sm rounded-t-lg transition-all duration-200 ${
                activeTab === 'import'
                  ? 'border-b-2 border-primary-500 text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              📥 Import Data
            </button>
            <button
              onClick={() => setActiveTab('export')}
              className={`px-4 py-3 font-semibold text-sm rounded-t-lg transition-all duration-200 ${
                activeTab === 'export'
                  ? 'border-b-2 border-primary-500 text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              📤 Export Data
            </button>
            <button
              onClick={() => setActiveTab('sample')}
              className={`px-4 py-3 font-semibold text-sm rounded-t-lg transition-all duration-200 ${
                activeTab === 'sample'
                  ? 'border-b-2 border-primary-500 text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              🎯 Sample Data
            </button>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-4 bg-gradient-to-r from-red-50 to-red-100 border border-red-200 text-red-700 rounded-xl animate-slide-in">
              <div className="flex items-center">
                <span className="mr-2 text-lg">❌</span>
                {error}
              </div>
            </div>
          )}
          
          {success && (
            <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-green-100 border border-green-200 text-green-700 rounded-xl animate-slide-in">
              <div className="flex items-center">
                <span className="mr-2 text-lg">✅</span>
                {success}
              </div>
            </div>
          )}

          {/* Import Tab */}
          {activeTab === 'import' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Import Data from JSON File</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select JSON File
                    </label>
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                    />
                    <p className="mt-1 text-sm text-gray-500">
                      Select a JSON file containing wedding data to import
                    </p>
                  </div>
                  
                  <button
                    onClick={handleImport}
                    disabled={!file || loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Importing...' : 'Import Data'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Export Tab */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Export All Data</h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Export all your wedding data as a well-formatted JSON file. This includes:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>All locations with coordinates</li>
                    <li>All guests with pawo contributions</li>
                    <li>All expenses with categories</li>
                    <li>All food items with costs</li>
                    <li>Metadata and timestamps</li>
                  </ul>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={() => handleExport('json')}
                      disabled={loading}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Exporting...' : 'Export as JSON'}
                    </button>
                    
                    <button
                      onClick={() => handleExport('csv')}
                      disabled={loading}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Exporting...' : 'Export as CSV'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Sample Data Tab */}
          {activeTab === 'sample' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Load Sample Data</h3>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600">
                    Load sample wedding data to test the application features. This includes:
                  </p>
                  <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                    <li>5 sample locations (venue, reception, mehndi, etc.)</li>
                    <li>5 sample guests with pawo contributions</li>
                    <li>7 sample expenses across different categories</li>
                    <li>10 sample food items with cost calculations</li>
                  </ul>
                  
                  <div className="flex space-x-4">
                    <button
                      onClick={handleLoadSampleData}
                      disabled={loading}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Loading...' : 'Load Sample Data'}
                    </button>
                    
                    <button
                      onClick={handleClearData}
                      disabled={loading}
                      className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Clearing...' : 'Clear All Data'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Close Button */}
          <div className="modal-footer">
            <button
              onClick={onClose}
              className="btn-secondary"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportExportModal;
