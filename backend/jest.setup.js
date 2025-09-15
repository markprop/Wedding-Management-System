// Jest setup file
process.env.NODE_ENV = 'test';
process.env.MONGODB_URI = 'mongodb://localhost:27017/wedding_planner_test';

// Mock MongoDB connection
jest.mock('./config/db', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve())
}));
