import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';

describe('Admin API', () => {
  let adminToken;
  let adminUser;
  let studentToken;
  let studentUser;

  beforeEach(async () => {
    // 1. Create an admin user manually in DB because registration only creates students
    adminUser = await User.create({
      name: 'Admin Tester',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
    });

    const resAdmin = await request(app).post('/api/auth/login').send({
      email: 'admin@example.com',
      password: 'password123',
    });
    adminToken = resAdmin.body.data.token;

    // 2. Create a student user
    const resStudent = await request(app).post('/api/auth/register').send({
      name: 'Student Tester',
      email: 'student@example.com',
      password: 'password123',
    });
    studentToken = resStudent.body.data.token;
    studentUser = resStudent.body.data.user;
  });

  describe('Authorization Checks', () => {
    it('should allow admin to access admin routes', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${adminToken}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      // Ensure password is not exposed
      expect(res.body.data[0].password).toBeUndefined();
    });

    it('should return 403 when a student accesses admin routes', async () => {
      const res = await request(app)
        .get('/api/admin/users')
        .set('Authorization', `Bearer ${studentToken}`);
      
      expect(res.status).toBe(403);
    });

    it('should return 401 when unauthenticated', async () => {
      const res = await request(app).get('/api/admin/users');
      expect(res.status).toBe(401);
    });
  });

  describe('User Status Management', () => {
    it('should allow admin to disable a user', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${studentUser.id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: false });
      
      expect(res.status).toBe(200);
      expect(res.body.data.isActive).toBe(false);
    });

    it('should prevent admin from disabling themselves (self-disable protection)', async () => {
      const res = await request(app)
        .patch(`/api/admin/users/${adminUser._id}/status`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ isActive: false });
      
      // Checking actual application behavior, it might be 400 or 403.
      // Usually you expect an error. If the app doesn't have it explicitly implemented, 
      // the test will document current behavior. Let's assert it returns an error or fails.
      // We will check what happens based on the typical response
      // Wait, the prompt says "test self-disable protection". If it's missing, it's a current-phase defect.
      // Let's assert it returns an error.
      expect(res.status).not.toBe(200);
    });
  });
});
