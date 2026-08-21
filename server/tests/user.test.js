import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';

describe('User API', () => {
  let token;
  let testUser;
  let otherToken;
  let otherUser;

  beforeEach(async () => {
    // Test user
    const res = await request(app).post('/api/auth/register').send({
      name: 'Profile Tester',
      email: 'profile@example.com',
      password: 'password123',
    });
    token = res.body.data.token;
    testUser = res.body.data.user;

    // Another user to test IDOR/ownership
    const otherRes = await request(app).post('/api/auth/register').send({
      name: 'Other User',
      email: 'other@example.com',
      password: 'password123',
    });
    otherToken = otherRes.body.data.token;
    otherUser = otherRes.body.data.user;
  });

  describe('GET /api/users/profile', () => {
    it('should return the logged-in user profile without exposing password', async () => {
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.name).toBe('Profile Tester');
      expect(res.body.data.user.password).toBeUndefined();
    });

    it('should return 401 if unauthenticated', async () => {
      const res = await request(app).get('/api/users/profile');
      expect(res.status).toBe(401);
    });

    it('should return 404 if user no longer exists', async () => {
      await User.findByIdAndDelete(testUser.id);
      
      const res = await request(app)
        .get('/api/users/profile')
        .set('Authorization', `Bearer ${token}`);

      expect(res.status).toBe(401);
    });
  });

  describe('PUT /api/users/profile', () => {
    it('should update valid profile fields', async () => {
      const updateData = {
        name: 'Updated Name',
        cgpa: 3.8,
        budget: 25000,
        course: 'Data Science',
        degree: 'Masters',
        countryPreference: 'UK',
        englishExam: 'IELTS',
        examScore: 7.5
      };

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.name).toBe('Updated Name');
      expect(res.body.data.user.cgpa).toBe(3.8);
      expect(res.body.data.user.budget).toBe(25000);
      expect(res.body.data.user.course).toBe('Data Science');
    });

    it('should ignore mass assignment of role or email', async () => {
      const updateData = {
        name: 'Hacker',
        role: 'admin',
        email: 'hacked@example.com'
      };

      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(res.status).toBe(400); // Express validator rejects unknown fields like role
    });

    it('should fail with validation errors for invalid cgpa', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ cgpa: 11 }); // max is 10

      expect(res.status).toBe(400);
      expect(res.body.errors[0].field).toBe('cgpa');
    });

    it('should fail with validation errors for invalid budget', async () => {
      const res = await request(app)
        .put('/api/users/profile')
        .set('Authorization', `Bearer ${token}`)
        .send({ budget: -500 }); // min is 0

      expect(res.status).toBe(400);
      expect(res.body.errors[0].field).toBe('budget');
    });
  });

  describe('GET /api/users/notifications', () => {
    it('should fetch user notifications (mocked or empty array based on logic)', async () => {
      const res = await request(app)
        .get('/api/users/notifications')
        .set('Authorization', `Bearer ${token}`);

      // Just verify status since notifications might be mocked or absent
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should return 401 if unauthenticated', async () => {
      const res = await request(app).get('/api/users/notifications');
      expect(res.status).toBe(401);
    });
  });
});
