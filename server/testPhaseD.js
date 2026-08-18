import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import User from './models/User.js';
import Application from './models/Application.js';
import Review from './models/Review.js';
import { getUsers, getUserById, updateUserStatus } from './controllers/adminUserController.js';
import { validateUserStatusUpdate } from './validators/adminValidator.js';
import { validationResult } from 'express-validator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

const mockRes = () => {
  const res = {};
  res.status = (code) => { res.statusCode = code; return res; };
  res.json = (data) => { res.data = data; return res; };
  return res;
};

async function runTests() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');

    // Setup Test Data
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      adminUser = new User({
        name: 'Test Admin',
        email: 'admin_test@example.com',
        password: 'password123',
        role: 'admin'
      });
      await adminUser.save();
    }

    let testStudent = await User.findOne({ email: 'test_student_d@example.com' });
    if (!testStudent) {
      testStudent = new User({
        name: 'Test Student D',
        email: 'test_student_d@example.com',
        password: 'password123',
        role: 'student'
      });
      await testStudent.save();
    }

    console.log('--------------------------------------------------');
    console.log('TESTING GET /api/admin/users');
    let req = { query: { page: 1, limit: 5 } };
    let res = mockRes();
    await getUsers(req, res);
    console.log('Status:', res.statusCode);
    console.log('Pagination:', res.data.pagination);
    console.log('First user keys:', Object.keys(res.data.data[0].toObject ? res.data.data[0].toObject() : res.data.data[0]));

    console.log('--------------------------------------------------');
    console.log('TESTING GET /api/admin/users/:id');
    req = { params: { id: testStudent._id.toString() } };
    res = mockRes();
    await getUserById(req, res);
    console.log('Status:', res.statusCode);
    if (res.statusCode !== 200) {
      console.log('Response:', res.data);
    } else {
      console.log('Profile keys:', Object.keys(res.data.data.profile.toObject ? res.data.data.profile.toObject() : res.data.data.profile));
      console.log('Has password hash?', res.data.data.profile.password !== undefined);
    }

    console.log('--------------------------------------------------');
    console.log('TESTING GET /api/admin/users/:id (Invalid ID)');
    req = { params: { id: 'invalid-id' } };
    res = mockRes();
    await getUserById(req, res);
    console.log('Status:', res.statusCode);
    console.log('Message:', res.data.message);

    console.log('--------------------------------------------------');
    console.log('TESTING PATCH /api/admin/users/:id/status (Disable Student)');
    req = { params: { id: testStudent._id.toString() }, body: { isActive: false } };
    res = mockRes();
    await updateUserStatus(req, res);
    console.log('Status:', res.statusCode);
    console.log('IsActive:', res.data.data.isActive);

    console.log('--------------------------------------------------');
    console.log('TESTING PATCH /api/admin/users/:id/status (Re-enable Student)');
    req = { params: { id: testStudent._id.toString() }, body: { isActive: true } };
    res = mockRes();
    await updateUserStatus(req, res);
    console.log('Status:', res.statusCode);
    console.log('IsActive:', res.data.data.isActive);

    console.log('--------------------------------------------------');
    console.log('TESTING PATCH /api/admin/users/:id/status (Attempt Disable Admin)');
    req = { params: { id: adminUser._id.toString() }, body: { isActive: false } };
    res = mockRes();
    await updateUserStatus(req, res);
    console.log('Status:', res.statusCode);
    console.log('Message:', res.data.message);

    console.log('--------------------------------------------------');
    console.log('TESTING PATCH /api/admin/users/:id/status (Unknown Field Injection)');
    req = { params: { id: testStudent._id.toString() }, body: { isActive: false, role: 'admin' } };
    res = mockRes();
    await updateUserStatus(req, res);
    console.log('Status:', res.statusCode);
    console.log('Message:', res.data.message);

    // Cleanup
    await User.findByIdAndDelete(testStudent._id);
    console.log('Cleanup complete.');

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

runTests();
