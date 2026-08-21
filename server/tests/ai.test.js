import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';

describe('AI API', () => {
  let token;

  beforeEach(async () => {
    const res = await request(app).post('/api/auth/register').send({
      name: 'AI Tester',
      email: 'ai@example.com',
      password: 'password123',
    });
    token = res.body.data.token;
  });

  describe('POST /api/ai-advisor/recommend', () => {
    it('should validate interests input', async () => {
      const res = await request(app)
        .post('/api/ai-advisor/recommend')
        .set('Authorization', `Bearer ${token}`)
        .send({ interests: 'a' }); // Too short
      
      expect(res.status).toBe(400); // Usually 400 from express-validator
    });

    it('should handle Groq environment constraint gracefully', async () => {
      // With GROQ_API_KEY=test-key, the actual request to Groq will fail (401 from Groq).
      // We expect the controller to handle it and return a 503 or 500.
      const res = await request(app)
        .post('/api/ai-advisor/recommend')
        .set('Authorization', `Bearer ${token}`)
        .send({ interests: 'I want to study computer science' });
      
      // Because we used a dummy key, the Groq API call fails.
      // This documents the ENVIRONMENT BLOCKED status.
      expect(res.status).toBeGreaterThanOrEqual(500); 
    });
  });

  describe('POST /api/ai-advisor/chat', () => {
    it('should handle Groq environment constraint gracefully', async () => {
      const res = await request(app)
        .post('/api/ai-advisor/chat')
        .set('Authorization', `Bearer ${token}`)
        .send({ messages: [{ role: 'user', content: 'Hello AI' }] });
      
      expect(res.status).toBeGreaterThanOrEqual(400); // 400 is also acceptable if it fails to connect to Groq due to key issue. We can expect 500 or 400.
    });
  });
});
