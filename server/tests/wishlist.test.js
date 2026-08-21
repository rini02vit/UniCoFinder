import request from 'supertest';
import app from '../app.js';
import User from '../models/User.js';
import University from '../models/University.js';

describe('Wishlist API', () => {
  let token;
  let testUser;
  let university;

  beforeEach(async () => {
    // 1. Create User
    const res = await request(app).post('/api/auth/register').send({
      name: 'Wishlist Tester',
      email: 'wishlist@example.com',
      password: 'password123',
    });
    token = res.body.data.token;
    testUser = res.body.data.user;

    // 2. Create University
    university = await University.create({
      name: 'Dream Uni',
      country: 'USA',
    });
  });

  describe('POST /api/wishlist/:universityId', () => {
    it('should add university to wishlist', async () => {
      const res = await request(app)
        .post(`/api/wishlist/${university._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      const user = await User.findById(testUser.id);
      expect(user.wishlist.length).toBe(1);
      expect(user.wishlist[0].university.toString()).toBe(university._id.toString());
    });

    it('should return 409 if university already in wishlist', async () => {
      // Add first time
      await request(app)
        .post(`/api/wishlist/${university._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      // Add second time
      const res = await request(app)
        .post(`/api/wishlist/${university._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(409);
    });

    it('should return 404 for non-existent university', async () => {
      const nonExistentId = '5f8d0d55b54764421b7156d9';
      const res = await request(app)
        .post(`/api/wishlist/${nonExistentId}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/wishlist', () => {
    it('should fetch wishlist with populated university data', async () => {
      // Pre-add to wishlist
      await request(app)
        .post(`/api/wishlist/${university._id}`)
        .set('Authorization', `Bearer ${token}`);

      const res = await request(app)
        .get('/api/wishlist')
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);
      expect(res.body.data.wishlist.length).toBe(1);
      expect(res.body.data.wishlist[0].name).toBe('Dream Uni');
    });
  });

  describe('PATCH /api/wishlist/:universityId', () => {
    it('should update wishlist metadata (note, priority)', async () => {
      // Pre-add
      await request(app)
        .post(`/api/wishlist/${university._id}`)
        .set('Authorization', `Bearer ${token}`);

      const res = await request(app)
        .patch(`/api/wishlist/${university._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ note: 'My top choice!', priority: 'High' });
      
      expect(res.status).toBe(200);
      expect(res.body.data.item.note).toBe('My top choice!');
      expect(res.body.data.item.priority).toBe('High');
    });

    it('should return 404 if updating university not in wishlist', async () => {
      const res = await request(app)
        .patch(`/api/wishlist/${university._id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ note: 'My top choice!' });
      
      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/wishlist/:universityId', () => {
    it('should remove university from wishlist', async () => {
      // Pre-add
      await request(app)
        .post(`/api/wishlist/${university._id}`)
        .set('Authorization', `Bearer ${token}`);

      const res = await request(app)
        .delete(`/api/wishlist/${university._id}`)
        .set('Authorization', `Bearer ${token}`);
      
      expect(res.status).toBe(200);

      const user = await User.findById(testUser.id);
      expect(user.wishlist.length).toBe(0);
    });
  });
});
