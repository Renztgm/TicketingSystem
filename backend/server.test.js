import request from 'supertest';
import express from 'express';

// We create a mini-version of your app just for testing
const app = express();
app.get('/api/status', (req, res) => {
    res.status(200).json({ status: 'Online' });
});

describe('Backend API Status', () => {
    it('should return a 200 status code and Online message', async () => {
        // Supertest acts like Postman, automatically sending a GET request
        const response = await request(app).get('/api/status');
        
        // Jest checks if the results match what we expect
        expect(response.statusCode).toBe(200);
        expect(response.body.status).toBe('Online');
    });
});