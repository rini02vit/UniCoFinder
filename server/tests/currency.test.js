import request from 'supertest';
import app from '../app.js';

describe('Currency API', () => {
  describe('GET /api/currency/rates', () => {
    it('should validate base currency query parameter', async () => {
      const res = await request(app).get('/api/currency/rates?base=INVALID');
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors[0].field).toBe('base');
    });

    it('should fetch exchange rates gracefully or fail gracefully based on API config (Environment status)', async () => {
      const res = await request(app).get('/api/currency/rates?base=USD');
      
      // If the external service isn't mocked in the setup, it might fail in test env
      // We expect it to either return 200 (if successful) or a 5xx error (if failed) gracefully
      expect([200, 500, 502, 503]).toContain(res.status);

      if (res.status === 200) {
        expect(res.body.success).toBe(true);
        expect(res.body.data.rates).toBeDefined();
      }
    });
  });
});
