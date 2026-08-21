import request from 'supertest';
import app from '../app.js';
import Scholarship from '../models/Scholarship.js';

describe('Scholarship API', () => {
  beforeEach(async () => {
    await Scholarship.create([
      {
        name: 'Global Tech Grant',
        country: 'USA',
        provider: 'TechOrg',
        amount: 10000,
        deadline: new Date(Date.now() + 86400000), // tomorrow
        minimumCGPA: 3.5,
        eligibleCourses: ['Computer Science'],
      },
      {
        name: 'Arts Foundation Scholarship',
        country: 'UK',
        provider: 'ArtsOrg',
        amount: 5000,
        deadline: new Date(Date.now() + 86400000),
        minimumCGPA: 3.0,
        eligibleCourses: ['Fine Arts'],
      }
    ]);
  });

  describe('GET /api/scholarships', () => {
    it('should fetch paginated scholarships', async () => {
      const res = await request(app).get('/api/scholarships?limit=10&page=1');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.scholarships.length).toBe(2);
      expect(res.body.data.pagination.total).toBe(2);
    });
  });

  describe('GET /api/scholarships/:id', () => {
    it('should fetch a single scholarship by valid ID', async () => {
      const scholarships = await Scholarship.find();
      const scholarshipId = scholarships[0]._id;

      const res = await request(app).get(`/api/scholarships/${scholarshipId}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.scholarship.name).toBe(scholarships[0].name);
    });

    it('should return 404 for non-existent scholarship ID', async () => {
      const nonExistentId = '5f8d0d55b54764421b7156d9';
      const res = await request(app).get(`/api/scholarships/${nonExistentId}`);
      
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid ObjectId format', async () => {
      const res = await request(app).get('/api/scholarships/invalid-id-format');
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors[0].field).toBe('id');
    });
  });
});
