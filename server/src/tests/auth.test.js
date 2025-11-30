/**
 * Basic tests for auth routes using supertest and jest
 */

const request = require('supertest');
const app = require('../server');

describe('Auth endpoints', () => {
  it('health check', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
  });
});
