import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock the API service
jest.mock('../services/api', () => ({
  getGuests: jest.fn(() => Promise.resolve({ data: { guests: [] } })),
  getExpenses: jest.fn(() => Promise.resolve({ data: { expenses: [] } })),
  getFoodItems: jest.fn(() => Promise.resolve({ data: { foodItems: [] } })),
  getLocations: jest.fn(() => Promise.resolve({ data: { locations: [] } })),
}));

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText(/Wedding Management System/i)).toBeInTheDocument();
  });

  test('renders navigation', () => {
    render(<App />);
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Guests/i)).toBeInTheDocument();
    expect(screen.getByText(/Expenses/i)).toBeInTheDocument();
  });
});
