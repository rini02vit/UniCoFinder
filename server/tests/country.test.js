import request from 'supertest';
import app from '../app.js';
import Country from '../models/Country.js';

describe('Country API', () => {
  beforeEach(async () => {
    await Country.create([
      {
        name: 'Canada',
        currency: 'CAD',
        averageTuition: 15000,
        averageLivingCost: 10000,
        visaDifficulty: 'Medium',
        language: 'English',
        partTimeAllowed: true,
      },
      {
        name: 'Germany',
        currency: 'EUR',
        averageTuition: 2000,
        averageLivingCost: 8000,
        visaDifficulty: 'Hard',
        language: 'German',
        partTimeAllowed: true,
      }
    ]);
  });

  describe('GET /api/countries', () => {
    it('should fetch paginated countries ordered by name', async () => {
      const res = await request(app).get('/api/countries?limit=10&page=1');
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.countries.length).toBe(2);
      expect(res.body.data.countries[0].name).toBe('Canada'); // Alphabetical order
      expect(res.body.data.pagination.total).toBe(2);
    });
  });

  describe('GET /api/countries/:id', () => {
    it('should fetch a single country by valid ID', async () => {
      const countries = await Country.find();
      const countryId = countries[0]._id;

      const res = await request(app).get(`/api/countries/${countryId}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.country.name).toBe(countries[0].name);
    });

    it('should return 404 for non-existent country ID', async () => {
      // 24 character hex valid string
      const nonExistentId = '5f8d0d55b54764421b7156d9';
      const res = await request(app).get(`/api/countries/${nonExistentId}`);
      
      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid ObjectId format', async () => {
      const res = await request(app).get('/api/countries/invalid-id-format');
      
      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors[0].field).toBe('id');
    });
  });
});
