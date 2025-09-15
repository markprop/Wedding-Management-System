import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Navbar from '../../components/Navbar';

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Navbar Component', () => {
  test('renders navigation links', () => {
    renderWithRouter(<Navbar />);
    
    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
    expect(screen.getByText(/Guests/i)).toBeInTheDocument();
    expect(screen.getByText(/Expenses/i)).toBeInTheDocument();
    expect(screen.getByText(/Food/i)).toBeInTheDocument();
    expect(screen.getByText(/Pawo/i)).toBeInTheDocument();
    expect(screen.getByText(/Locations/i)).toBeInTheDocument();
  });

  test('has proper navigation structure', () => {
    renderWithRouter(<Navbar />);
    
    const navElement = screen.getByRole('navigation');
    expect(navElement).toBeInTheDocument();
  });
});
