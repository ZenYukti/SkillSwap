/**
 * Basic tests for deals routes (placeholder)
 */

const request = require('supertest');
const app = require('../server');

describe('Deal endpoints', () => {
  it('GET /api/deals (unauthorized) should return 401', async () => {
    const res = await request(app).get('/api/deals');
    expect(res.statusCode).toBe(401);
  });
});