import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const API_URL = 'http://localhost:5005/api';

const fetchApi = async (endpoint, method = 'GET', body = null, token = null) => {
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const options = {
    method,
    headers,
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch(`${API_URL}${endpoint}`, options);
  const data = await res.json();
  if (!res.ok) {
    throw { response: { status: res.status, data } };
  }
  return { data };
};

const runTests = async () => {
  let token;
  let testUniversityId;
  let testUserId;

  console.log('--- STARTING WISHLIST API TESTS ---');

  try {
    const testEmail = `testuser_${Date.now()}@example.com`;
    const testPassword = 'Password123!';
    
    console.log('[1] Registering test user...');
    const regRes = await fetchApi('/auth/register', 'POST', {
      name: 'Test User',
      email: testEmail,
      password: testPassword
    });
    
    token = regRes.data.data.token;
    testUserId = regRes.data.data.user._id;
    console.log(`✅ Registered and authenticated user: ${testUserId}`);

    console.log('[2] Connecting to DB to find a University...');
    await mongoose.connect(process.env.MONGO_URI);
    const University = (await import('../models/University.js')).default;
    const testUni = await University.findOne({});
    if (!testUni) {
      throw new Error("No universities found in the database. Cannot run tests.");
    }
    testUniversityId = testUni._id.toString();
    console.log(`✅ Found University: ${testUni.name} (${testUniversityId})`);
    
    await mongoose.connection.close(); 

    console.log('[3] Testing GET empty wishlist...');
    const getRes1 = await fetchApi('/wishlist', 'GET', null, token);
    if (getRes1.data.data.wishlist.length !== 0) throw new Error("Expected empty wishlist");
    console.log(`✅ GET wishlist returned empty array`);

    console.log('[4] Testing POST add to wishlist...');
    const postRes = await fetchApi(`/wishlist/${testUniversityId}`, 'POST', null, token);
    if (!postRes.data.success) throw new Error("Add failed");
    console.log(`✅ Successfully added to wishlist`);

    console.log('[5] Testing POST duplicate...');
    try {
      await fetchApi(`/wishlist/${testUniversityId}`, 'POST', null, token);
      throw new Error("Duplicate POST should have thrown 409");
    } catch (err) {
      if (err.response && err.response.status === 409) {
        console.log(`✅ Duplicate correctly rejected with 409`);
      } else {
        throw err;
      }
    }

    console.log('[6] Testing GET populated wishlist...');
    const getRes2 = await fetchApi('/wishlist', 'GET', null, token);
    const wishlist = getRes2.data.data.wishlist;
    if (wishlist.length !== 1) throw new Error("Expected 1 item");
    if (wishlist[0]._id.toString() !== testUniversityId) throw new Error("Mismatched university ID");
    if (wishlist[0].note !== '') throw new Error("Expected empty note");
    if (wishlist[0].priority !== 'Medium') throw new Error("Expected Medium priority");
    console.log(`✅ GET wishlist returned correctly formatted subdocument items`);

    console.log('[7] Testing PATCH note only...');
    const patchRes1 = await fetchApi(`/wishlist/${testUniversityId}`, 'PATCH', {
      note: 'My test note'
    }, token);
    if (patchRes1.data.data.item.note !== 'My test note') throw new Error("Note not updated");
    if (patchRes1.data.data.item.priority !== 'Medium') throw new Error("Priority was incorrectly overwritten");
    console.log(`✅ PATCH correctly updated note and preserved priority`);

    console.log('[8] Testing PATCH priority only...');
    const patchRes2 = await fetchApi(`/wishlist/${testUniversityId}`, 'PATCH', {
      priority: 'High'
    }, token);
    if (patchRes2.data.data.item.priority !== 'High') throw new Error("Priority not updated");
    if (patchRes2.data.data.item.note !== 'My test note') throw new Error("Note was incorrectly overwritten");
    console.log(`✅ PATCH correctly updated priority and preserved note`);

    console.log('[9] Testing PATCH invalid priority (validation check)...');
    try {
      await fetchApi(`/wishlist/${testUniversityId}`, 'PATCH', { priority: 'SuperHigh' }, token);
      throw new Error("Invalid priority should have been rejected");
    } catch (err) {
      if (err.response && err.response.status === 400) {
        console.log(`✅ Invalid priority correctly rejected with 400`);
      } else {
        throw err;
      }
    }

    console.log('[10] Testing DELETE wishlist item...');
    const delRes = await fetchApi(`/wishlist/${testUniversityId}`, 'DELETE', null, token);
    if (!delRes.data.success) throw new Error("Delete failed");
    console.log(`✅ Successfully deleted item`);

    console.log('[11] Testing GET after DELETE...');
    const getRes3 = await fetchApi('/wishlist', 'GET', null, token);
    if (getRes3.data.data.wishlist.length !== 0) throw new Error("Expected empty wishlist after delete");
    console.log(`✅ Wishlist correctly emptied`);
    
    console.log('\n=======================================');
    console.log('🎉 ALL API TESTS PASSED SUCCESSFULLY! 🎉');
    console.log('=======================================\n');

  } catch (error) {
    console.error('\n❌ API TEST FAILED ❌');
    if (error.response) {
      console.error(`Status: ${error.response.status}`);
      console.error(error.response.data);
    } else {
      console.error(error.message);
    }
    process.exit(1);
  }
};

runTests();
