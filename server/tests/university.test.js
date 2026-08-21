import request from 'supertest';
import app from '../app.js';
import University from '../models/University.js';
import User from '../models/User.js';

describe('University API', () => {
  let token;
  let testUser;
  let testUniversity;

  beforeEach(async () => {
    // Create test user
    const res = await request(app).post('/api/auth/register').send({
      name: 'Test Student',
      email: 'student@example.com',
      password: 'password123',
    });
    token = res.body.data.token;
    testUser = res.body.data.user;

    // Create a test university
    testUniversity = await University.create({
      name: 'Test University',
      country: 'Test Country',
      city: 'Test City',
      courseOffered: ['Computer Science', 'Business'],
      minimumCGPA: 3.0,
      averageCGPA: 3.5,
      tuitionFee: 15000,
      livingCost: 10000,
      worldRanking: 100,
      acceptanceRate: 70,
      employmentRate: 90,
      description: 'A test university',
    });
  });

  describe('GET /api/universities', () => {
    it('should return a list of universities', async () => {
      const res = await request(app).get('/api/universities');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.universities)).toBe(true);
      expect(res.body.data.universities.length).toBeGreaterThan(0);
    });
  });

  describe('GET /api/universities/:id', () => {
    it('should return a university by valid ID', async () => {
      const res = await request(app).get(`/api/universities/${testUniversity._id}`);
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.university.name).toBe('Test University');
    });

    it('should return 404 for non-existent valid ObjectId', async () => {
      const res = await request(app).get('/api/universities/507f1f77bcf86cd799439011');
      expect(res.status).toBe(404);
    });

    it('should return 400 for invalid ObjectId format', async () => {
      const res = await request(app).get('/api/universities/invalid-id');
      expect(res.status).toBe(400); // Or 500 depending on actual error handling
    });
  });

  describe('GET /api/universities/search', () => {
    it('should return universities matching query', async () => {
      const res = await request(app).get('/api/universities/search?q=Test');
      expect(res.status).toBe(200);
      expect(res.body.data.universities.some((u) => u.name === 'Test University')).toBe(true);
    });

    it('should return empty array for no match', async () => {
      const res = await request(app).get('/api/universities/search?q=NonExistent');
      expect(res.status).toBe(200);
      expect(res.body.data.universities.length).toBe(0);
    });
  });

  describe('GET /api/universities/recommend', () => {
    it('should return recommendations for authenticated user', async () => {
      // Need to ensure the user has profile data
      await User.findByIdAndUpdate(testUser.id, {
        cgpa: 3.5,
        budget: 20000,
        course: 'Computer Science',
        countryPreference: 'Test Country'
      });

      const res = await request(app)
        .get('/api/universities/recommend')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data.universities)).toBe(true);
    });

    it('should return 401 if unauthenticated', async () => {
      const res = await request(app).get('/api/universities/recommend');
      expect(res.status).toBe(401);
    });
  });

  describe('GET /api/universities/filter', () => {
    it('should filter universities by country', async () => {
      const res = await request(app).get('/api/universities/filter?country=Test%20Country');
      expect(res.status).toBe(200);
      expect(res.body.data.universities.length).toBeGreaterThan(0);
    });

    it('should filter universities by tuition bounds', async () => {
      const res = await request(app).get('/api/universities/filter?minTuition=10000&maxTuition=20000');
      expect(res.status).toBe(200);
      expect(res.body.data.universities.length).toBeGreaterThan(0);
    });

    it('should return empty if bounds are strict', async () => {
      const res = await request(app).get('/api/universities/filter?maxTuition=1000');
      expect(res.status).toBe(200);
      expect(res.body.data.universities.length).toBe(0);
    });
  });

  describe('Reviews API', () => {
    let reviewId;

    it('should allow user to create a review', async () => {
      const res = await request(app)
        .post(`/api/universities/${testUniversity._id}/reviews`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 4, comment: 'Great university' });
      
      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      reviewId = res.body.data.review._id;
    });

    it('should forbid duplicate review from same user', async () => {
      await request(app)
        .post(`/api/universities/${testUniversity._id}/reviews`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 4, comment: 'First review' });

      const res = await request(app)
        .post(`/api/universities/${testUniversity._id}/reviews`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 5, comment: 'Trying to review again' });
      
      expect(res.status).toBe(400);
    });

    it('should fetch reviews for a university', async () => {
      await request(app)
        .post(`/api/universities/${testUniversity._id}/reviews`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 4, comment: 'Great university' });

      const res = await request(app).get(`/api/universities/${testUniversity._id}/reviews`);
      expect(res.status).toBe(200);
      expect(res.body.data.reviews.length).toBe(1);
      expect(res.body.data.stats.averageRating).toBe(4);
    });

    it('should allow owner to delete review', async () => {
      const createRes = await request(app)
        .post(`/api/universities/${testUniversity._id}/reviews`)
        .set('Authorization', `Bearer ${token}`)
        .send({ rating: 4, comment: 'Delete me' });
      const createdReviewId = createRes.body.data.review._id;

      const res = await request(app)
        .delete(`/api/universities/${testUniversity._id}/reviews/${createdReviewId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
    });
  });

  describe('GET /api/universities/trending', () => {
    it('should fetch trending universities gracefully', async () => {
      const res = await request(app).get('/api/universities/trending');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.data.universities)).toBe(true);
    });
  });

  describe('GET /api/universities/search edge cases', () => {
    it('should return 400 for empty query string', async () => {
      const res = await request(app).get('/api/universities/search?q=');
      expect(res.status).toBe(400);
    });

    it('should be case-insensitive', async () => {
      const res = await request(app).get('/api/universities/search?q=test');
      expect(res.status).toBe(200);
      expect(res.body.data.universities.length).toBeGreaterThan(0);
    });
  });
});
