import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';

describe('Dashboard API', () => {
  let adminToken;
  let studentToken;

  beforeEach(async () => {
    await User.create({
      name: 'Admin User',
      email: 'admindash@example.com',
      password: 'password123',
      role: 'admin',
    });
    const resAdmin = await request(app).post('/api/auth/login').send({
      email: 'admindash@example.com',
      password: 'password123',
    });
    adminToken = resAdmin.body.data.token;

    const resStudent = await request(app).post('/api/auth/register').send({
      name: 'Student User',
      email: 'studentdash@example.com',
      password: 'password123',
    });
    studentToken = resStudent.body.data.token;
  });

  describe('GET /api/admin/dashboard/stats', () => {
    it('should return admin dashboard stats', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.counts).toHaveProperty('users');
      expect(res.body.data.counts).toHaveProperty('universities');
    });

    it('should return 403 for students', async () => {
      const res = await request(app)
        .get('/api/admin/dashboard/stats')
        .set('Authorization', `Bearer ${studentToken}`);
      
      expect(res.status).toBe(403);
    });
  });
});
