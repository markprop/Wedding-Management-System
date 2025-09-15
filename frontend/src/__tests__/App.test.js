import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock Mapbox GL JS
jest.mock('mapbox-gl', () => ({
  Map: jest.fn(() => ({
    on: jest.fn(),
    addSource: jest.fn(),
    addLayer: jest.fn(),
    remove: jest.fn(),
  })),
  Marker: jest.fn(() => ({
    setLngLat: jest.fn().mockReturnThis(),
    addTo: jest.fn().mockReturnThis(),
    remove: jest.fn(),
  })),
  Popup: jest.fn(() => ({
    setLngLat: jest.fn().mockReturnThis(),
    setHTML: jest.fn().mockReturnThis(),
    addTo: jest.fn().mockReturnThis(),
  })),
  accessToken: '',
}));

// Mock the API service
jest.mock('../services/api', () => ({
  getGuests: jest.fn(() => Promise.resolve({ data: { guests: [] } })),
  getExpenses: jest.fn(() => Promise.resolve({ data: { expenses: [] } })),
  getFoodItems: jest.fn(() => Promise.resolve({ data: { foodItems: [] } })),
  getLocations: jest.fn(() => Promise.resolve({ data: { locations: [] } })),
  getGuestStats: jest.fn(() => Promise.resolve({ data: { totalGuests: 0, confirmedGuests: 0, totalPawo: 0 } })),
  getExpenseStats: jest.fn(() => Promise.resolve({ data: { totalExpenses: 0, paidExpenses: 0, pendingExpenses: 0 } })),
  getFoodStats: jest.fn(() => Promise.resolve({ data: { totalCost: 0, totalItems: 0 } })),
  getLocationStats: jest.fn(() => Promise.resolve({ data: { totalLocations: 0 } })),
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Wedding Planner/i)).toBeInTheDocument();
  });

  test('renders navigation', () => {
    render(<App />);
    expect(screen.getAllByText(/Dashboard/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Guests/i)).toBeInTheDocument();
    expect(screen.getByText(/Expenses/i)).toBeInTheDocument();
  });
});
