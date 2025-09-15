const request = require('supertest');

// Mock the database connection before importing the server
jest.mock('../config/db', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve())
}));

// Mock the models
jest.mock('../models/Guest', () => ({
  find: jest.fn(() => ({
    populate: jest.fn(() => ({
      sort: jest.fn(() => Promise.resolve([]))
    }))
  }))
}));

jest.mock('../models/Expense', () => ({
  find: jest.fn(() => ({
    populate: jest.fn(() => ({
      sort: jest.fn(() => Promise.resolve([]))
    }))
  }))
}));

jest.mock('../models/FoodItem', () => ({
  find: jest.fn(() => ({
    sort: jest.fn(() => Promise.resolve([]))
  }))
}));

jest.mock('../models/Location', () => ({
  find: jest.fn(() => ({
    sort: jest.fn(() => Promise.resolve([]))
  }))
}));

const app = require('../server');

describe('Server', () => {
  test('should respond to health check', async () => {
    const response = await request(app)
      .get('/api/health')
      .expect(200);
    
    expect(response.body.message).toContain('Wedding Planner API is running');
  });

  test('should handle 404 for unknown routes', async () => {
    const response = await request(app)
      .get('/unknown-route')
      .expect(404);
  });
});

describe('API Routes', () => {
  test('GET /api/guests should return guests array', async () => {
    const response = await request(app)
      .get('/api/guests')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /api/expenses should return expenses array', async () => {
    const response = await request(app)
      .get('/api/expenses')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /api/food should return food items array', async () => {
    const response = await request(app)
      .get('/api/food')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /api/locations should return locations array', async () => {
    const response = await request(app)
      .get('/api/locations')
      .expect(200);
    
    expect(Array.isArray(response.body)).toBe(true);
  });
});
