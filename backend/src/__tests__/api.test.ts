import request from 'supertest';
import app from '../index';

describe('API Health Check', () => {
  it('should return ok status', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.status).toBe('ok');
  });
});

describe('Auth Endpoints', () => {
  it('should require email and password for login', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({});
    expect(response.status).toBe(400);
  });

  it('should require all fields for registration', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({ email: 'test@test.com' });
    expect(response.status).toBe(400);
  });
});
