import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;
    const adminName = process.env.ADMIN_NAME || 'Admin User';

    if (!adminEmail || !adminPassword) {
      console.error('Error: ADMIN_EMAIL and ADMIN_PASSWORD must be provided in environment variables.');
      process.exit(1);
    }

    const existingUser = await User.findOne({ email: adminEmail });

    if (existingUser) {
      if (existingUser.role === 'admin') {
        console.log(`User ${adminEmail} is already an admin.`);
      } else {
        console.error(`Error: User ${adminEmail} already exists but is not an admin. Aborting to prevent silent escalation.`);
        process.exit(1);
      }
    } else {
      const user = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
        isActive: true,
      });
      console.log(`Created new admin user: ${user.email}`);
    }

    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedAdmin();
