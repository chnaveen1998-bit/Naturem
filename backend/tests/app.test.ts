import request from 'supertest';
import app from '../src/index';

describe('Health Check', () => {
  it('should return ok status', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });
});

describe('API Documentation', () => {
  it('should serve swagger UI', async () => {
    const response = await request(app)
      .get('/api-docs')
      .expect(301);
  });

  it('should return OpenAPI JSON', async () => {
    const response = await request(app)
      .get('/api-docs.json')
      .expect(200);

    expect(response.body).toHaveProperty('openapi');
    expect(response.body).toHaveProperty('info');
  });
});
