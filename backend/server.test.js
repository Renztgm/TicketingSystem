import {jest} from '@jest/globals';
import request from 'supertest';
import express from 'express';
import bcrypt from 'bcrypt';

// 1. MOCK THE DATABASE (ESM STYLE)
// We use unstable_mockModule instead of jest.mock for pure ES Modules
jest.unstable_mockModule('@prisma/client', () => {
  const mPrismaClient = {
    user: {
      findUnique: jest.fn(), 
    },
  };
  return { PrismaClient: jest.fn(() => mPrismaClient) };
});

// 2. DYNAMICALLY IMPORT AFTER MOCKING
// In ESM, the mock must happen before we import the app and Prisma!
const { PrismaClient } = await import('@prisma/client');
const serverModule = await import('./server.js');
const app = serverModule.default || serverModule.app;

if (!app) {
  throw new Error("TEST CRASH: 'app' is undefined! You must add 'export default app;' to the very bottom of your server.js file.");
}

const prisma = new PrismaClient();
describe('Backend API Status', () => {
    it('should return a 200 status code and Online message', async () => {
        // Supertest acts like Postman, automatically sending a GET request
        const response = await request(app).get('/api/status');
        
        // Jest checks if the results match what we expect
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Ticketing Backend is running on port 5000!');
    });
});

describe('Auth API - Login (/api/auth/login)', () => {
  
  // Clear any fake data between tests so they don't interfere with each other
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ---------------------------------------------------------
  // TEST 1: Missing Credentials (Sad Path)
  // ---------------------------------------------------------
  it('should return 400 if email or password is missing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'test@example.com' }); // Notice we forgot the password!

    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBe('Email and password are required.');
  });

  // ---------------------------------------------------------
  // TEST 2: Invalid Credentials (Sad Path)
  // ---------------------------------------------------------
  it('should return 401 if user does not exist', async () => {
    // Trick the database into returning "null" (meaning no user was found)
    prisma.user.findUnique.mockResolvedValue(null);

    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'wrong@example.com', password: 'password123' });

    expect(response.statusCode).toBe(401);
    expect(response.body.error).toBe('Invalid email or password.');
  });

  // ---------------------------------------------------------
  // TEST 3: Successful Login (Happy Path)
  // ---------------------------------------------------------
  it('should return 200 and a token on successful login', async () => {
    // 1. Generate a real hashed password for our fake user
    const hashedPassword = await bcrypt.hash('correctpassword', 10);
    
    // 2. Trick the database into returning a valid user object
    prisma.user.findUnique.mockResolvedValue({
      id: '12345-abcde',
      name: 'Test Admin',
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'ADMIN',
    });

    // 3. Send the request with the correct matching password
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@example.com', password: 'correctpassword' });

    // 4. Verify the results
    expect(response.statusCode).toBe(200);
    expect(response.body.message).toBe('Login successful.');
    
    // The most important part: Did we get a token back?
    expect(response.body).toHaveProperty('token'); 
    expect(response.body.user.email).toBe('admin@example.com');
  });
});