const request = require('supertest');
const app = require('../server');

describe('Server', () => {
  test('should respond to health check', async () => {
    const response = await request(app)
      .get('/')
      .expect(200);
    
    expect(response.text).toContain('Wedding Management System');
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
    
    expect(response.body).toHaveProperty('guests');
    expect(Array.isArray(response.body.guests)).toBe(true);
  });

  test('GET /api/expenses should return expenses array', async () => {
    const response = await request(app)
      .get('/api/expenses')
      .expect(200);
    
    expect(response.body).toHaveProperty('expenses');
    expect(Array.isArray(response.body.expenses)).toBe(true);
  });

  test('GET /api/food should return food items array', async () => {
    const response = await request(app)
      .get('/api/food')
      .expect(200);
    
    expect(response.body).toHaveProperty('foodItems');
    expect(Array.isArray(response.body.foodItems)).toBe(true);
  });

  test('GET /api/locations should return locations array', async () => {
    const response = await request(app)
      .get('/api/locations')
      .expect(200);
    
    expect(response.body).toHaveProperty('locations');
    expect(Array.isArray(response.body.locations)).toBe(true);
  });
});
