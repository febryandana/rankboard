// Test setup file - runs before all tests
import { beforeAll, afterAll, afterEach } from '@jest/globals';

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.SESSION_SECRET = 'test-secret-key-at-least-32-chars-long';
process.env.ROOT_ADMIN_USERNAME = 'testadmin';
process.env.ROOT_ADMIN_EMAIL = 'admin@test.com';
process.env.ROOT_ADMIN_PASSWORD = 'Test@123456';

// Global test timeout
jest.setTimeout(10000);

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Global setup
beforeAll(() => {
  console.log('Starting test suite...');
});

// Global teardown
afterAll(() => {
  console.log('Test suite completed.');
});
