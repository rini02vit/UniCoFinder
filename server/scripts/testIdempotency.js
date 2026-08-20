import mongoose from 'mongoose';
import dotenv from 'dotenv';
import University from '../models/University.js';

dotenv.config();

const test = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    
    const harvard = await University.findOne({ name: 'Harvard University' });
    if (!harvard) {
      console.log('Harvard University not found!');
      process.exit(1);
    }

    console.log(`Current Harvard livingCost: ${harvard.livingCost}`);
    
    // Modify to 99999
    harvard.livingCost = 99999;
    await harvard.save();
    console.log('Successfully updated livingCost to 99999.');
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

test();
