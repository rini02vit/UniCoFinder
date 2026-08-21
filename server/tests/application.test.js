import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import University from '../models/University.js';
import Application from '../models/Application.js';
import mongoose from 'mongoose';

describe('Application API', () => {
  let token;
  let testUser;
  let otherToken;
  let university;

  beforeEach(async () => {
    // 1. Create User 1
    const res1 = await request(app).post('/api/auth/register').send({
      name: 'App Tester',
      email: 'app@example.com',
      password: 'password123',
    });
    token = res1.body.data.token;
    testUser = res1.body.data.user;

    // 2. Create User 2
    const res2 = await request(app).post('/api/auth/register').send({
      name: 'Other App Tester',
      email: 'otherapp@example.com',
      password: 'password123',
    });
    otherToken = res2.body.data.token;

    // 3. Create a University
    university = await University.create({
      name: 'Test Application Uni',
      country: 'USA',
    });
  });

  describe('POST /api/applications', () => {
    it('should create an application successfully', async () => {
      const res = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${token}`)
        .send({
          universityId: university._id,
          course: 'CS',
          term: 'Fall 2027',
          status: 'Planning'
        });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.application.course).toBe('CS');
    });

    it('should return 409 for duplicate application (same course/term/uni)', async () => {
      await Application.create({
        user: testUser.id,
        university: university._id,
        course: 'CS',
        term: 'Fall 2027',
      });

      const res = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${token}`)
        .send({
          universityId: university._id,
          course: 'CS',
          term: 'Fall 2027',
        });
      
      expect(res.status).toBe(409);
    });

    it('should fail with invalid universityId', async () => {
      const res = await request(app)
        .post('/api/applications')
        .set('Authorization', `Bearer ${token}`)
        .send({
          universityId: 'invalid-id',
          course: 'CS',
          term: 'Fall 2027',
        });
      
      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/applications', () => {
    it('should fetch authenticated user applications only', async () => {
      // Create for User 1
      await Application.create({ user: testUser.id, university: university._id, course: 'CS', term: 'Fall 2027' });
      // Create for User 2
      await Application.create({ user: new mongoose.Types.ObjectId(), university: university._id, course: 'EE', term: 'Fall 2027' });

      const res = await request(app)
        .get('/api/applications')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.applications.length).toBe(1);
      expect(res.body.data.applications[0].course).toBe('CS');
    });
  });

  describe('PUT /api/applications/:id', () => {
    let appDoc;

    beforeEach(async () => {
      appDoc = await Application.create({
        user: testUser.id,
        university: university._id,
        course: 'CS',
        term: 'Fall 2027',
      });
    });

    it('should update application status and documents', async () => {
      const res = await request(app)
        .put(`/api/applications/${appDoc._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({
          status: 'Applied',
          documentsCompleted: ['passport', 'sop']
        });
      
      expect(res.status).toBe(200);
      expect(res.body.data.application.status).toBe('Applied');
      expect(res.body.data.application.documentsCompleted).toContain('passport');
    });

    it('should forbid other users from updating (IDOR protection)', async () => {
      const res = await request(app)
        .put(`/api/applications/${appDoc._id}`)
        .set('Authorization', `Bearer ${otherToken}`) // Other user
        .send({ status: 'Applied' });
      
      expect(res.status).toBe(404); // Returns 404 since it's scoped by user id
    });
  });

  describe('DELETE /api/applications/:id', () => {
    let appDoc;

    beforeEach(async () => {
      appDoc = await Application.create({
        user: testUser.id,
        university: university._id,
        course: 'CS',
        term: 'Fall 2027',
      });
    });

    it('should delete application for owner', async () => {
      const res = await request(app)
        .delete(`/api/applications/${appDoc._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      
      // Verify deletion
      const check = await Application.findById(appDoc._id);
      expect(check).toBeNull();
    });

    it('should forbid other users from deleting (IDOR protection)', async () => {
      const res = await request(app)
        .delete(`/api/applications/${appDoc._id}`)
        .set('Authorization', `Bearer ${otherToken}`); // Other user
      
      expect(res.status).toBe(404);
    });
  });
});
