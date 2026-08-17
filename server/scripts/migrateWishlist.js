import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env vars
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const migrateWishlist = async () => {
  try {
    await connectDB();

    // Import models locally to ensure they use the established connection
    const User = (await import('../models/User.js')).default;
    const University = (await import('../models/University.js')).default;

    // Fetch all users with a non-empty wishlist
    const users = await User.find({ 'wishlist.0': { $exists: true } });
    
    console.log(`Found ${users.length} users with wishlists to process...`);

    // Fetch all valid university IDs for cross-referencing
    const validUniversities = await University.find({}).select('_id').lean();
    const validUniversityIds = new Set(validUniversities.map(u => u._id.toString()));

    let migratedUsersCount = 0;
    let skippedUsersCount = 0;
    let staleReferencesRemovedCount = 0;

    for (const user of users) {
      let needsMigration = false;
      const seenIds = new Set();
      const newWishlist = [];

      for (const item of user.wishlist) {
        // Idempotency: check if already a subdocument
        if (item && item.university) {
          // Already migrated, just check validity/duplicates
          const uniId = item.university.toString();
          if (!validUniversityIds.has(uniId)) {
            staleReferencesRemovedCount++;
            needsMigration = true;
          } else if (!seenIds.has(uniId)) {
            seenIds.add(uniId);
            newWishlist.push(item);
          } else {
            // Duplicate
            needsMigration = true;
          }
        } else {
          // Legacy ObjectId
          needsMigration = true;
          const uniId = item.toString();
          
          if (!validUniversityIds.has(uniId)) {
            staleReferencesRemovedCount++;
            continue;
          }

          if (!seenIds.has(uniId)) {
            seenIds.add(uniId);
            newWishlist.push({
              university: item, // ObjectId
              note: '',
              priority: 'Medium'
            });
          }
        }
      }

      if (needsMigration) {
        user.wishlist = newWishlist;
        await user.save();
        migratedUsersCount++;
      } else {
        skippedUsersCount++;
      }
    }

    console.log('--- Migration Complete ---');
    console.log(`Migrated Users: ${migratedUsersCount}`);
    console.log(`Skipped Users (Already migrated): ${skippedUsersCount}`);
    console.log(`Stale References Removed: ${staleReferencesRemovedCount}`);
    
    process.exit(0);
  } catch (error) {
    console.error(`Migration Error: ${error.message}`);
    process.exit(1);
  }
};

migrateWishlist();
