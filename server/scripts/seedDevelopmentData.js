import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import University from '../models/University.js';
import Country from '../models/Country.js';
import Scholarship from '../models/Scholarship.js';
import Application from '../models/Application.js';

dotenv.config();

// Fail-closed protection
if (process.env.ALLOW_DEV_SEED !== 'true') {
  console.error('ABORT: Development seeding requires ALLOW_DEV_SEED=true in environment.');
  process.exit(1);
}

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected.');

    // 1. Countries
    const countries = [
      {
        name: 'United States',
        code: 'US',
        capital: 'Washington, D.C.',
        currency: 'USD',
        language: 'English',
        continent: 'North America',
        averageTuitionFee: 35000,
        averageLivingCost: 15000,
        visaRequirements: 'F1 Visa required. Must show proof of funds.',
        workPermit: true,
        postStudyWorkVisa: true,
        visaFriendlinessScore: 6,
        safetyIndex: 70,
        description: 'A top destination for international students with diverse programs.'
      },
      {
        name: 'United Kingdom',
        code: 'UK',
        capital: 'London',
        currency: 'GBP',
        language: 'English',
        continent: 'Europe',
        averageTuitionFee: 25000,
        averageLivingCost: 14000,
        visaRequirements: 'Tier 4 (General) student visa required.',
        workPermit: true,
        postStudyWorkVisa: true,
        visaFriendlinessScore: 7,
        safetyIndex: 75,
        description: 'Home to some of the oldest and most prestigious universities in the world.'
      },
      {
        name: 'Canada',
        code: 'CA',
        capital: 'Ottawa',
        currency: 'CAD',
        language: 'English, French',
        continent: 'North America',
        averageTuitionFee: 20000,
        averageLivingCost: 12000,
        visaRequirements: 'Study permit required.',
        workPermit: true,
        postStudyWorkVisa: true,
        visaFriendlinessScore: 9,
        safetyIndex: 85,
        description: 'Known for its high quality of life, safety, and welcoming immigration policies.'
      },
      {
        name: 'Australia',
        code: 'AU',
        capital: 'Canberra',
        currency: 'AUD',
        language: 'English',
        continent: 'Oceania',
        averageTuitionFee: 28000,
        averageLivingCost: 18000,
        visaRequirements: 'Student visa (subclass 500) required.',
        workPermit: true,
        postStudyWorkVisa: true,
        visaFriendlinessScore: 8,
        safetyIndex: 80,
        description: 'Offers a world-class education system with a relaxed lifestyle.'
      }
    ];

    console.log('Seeding Countries...');
    for (const c of countries) {
      const exists = await Country.findOne({ name: c.name });
      if (!exists) {
        await Country.create(c);
        console.log(`  Inserted country: ${c.name}`);
      } else {
        console.log(`  Skipped country: ${c.name} (already exists)`);
      }
    }

    // 2. Universities
    const universities = [
      {
        name: 'Harvard University',
        country: 'United States',
        city: 'Cambridge',
        degreeLevels: ['Bachelors', 'Masters', 'PhD'],
        courses: ['Computer Science', 'Business', 'Law', 'Medicine'],
        tuitionFee: 54000,
        currency: 'USD',
        ranking: 1,
        cgpaRequirement: 3.9,
        acceptanceRate: 4,
        livingCost: 20000,
        englishExamRequirements: ['IELTS', 'TOEFL'],
        intakeMonths: ['September'],
        applicationDeadline: new Date('2024-12-31'),
        website: 'https://www.harvard.edu',
        description: 'Ivy league research university.'
      },
      {
        name: 'Massachusetts Institute of Technology (MIT)',
        country: 'United States',
        city: 'Cambridge',
        degreeLevels: ['Bachelors', 'Masters', 'PhD'],
        courses: ['Computer Science', 'Engineering', 'Mathematics', 'Physics'],
        tuitionFee: 55000,
        currency: 'USD',
        ranking: 2,
        cgpaRequirement: 3.9,
        acceptanceRate: 5,
        livingCost: 21000,
        englishExamRequirements: ['IELTS', 'TOEFL'],
        intakeMonths: ['September'],
        applicationDeadline: new Date('2024-12-15'),
        website: 'https://www.mit.edu',
        description: 'World-renowned for its science and engineering programs.'
      },
      {
        name: 'University of Oxford',
        country: 'United Kingdom',
        city: 'Oxford',
        degreeLevels: ['Bachelors', 'Masters', 'PhD'],
        courses: ['Humanities', 'Sciences', 'Law', 'Business'],
        tuitionFee: 35000,
        currency: 'GBP',
        ranking: 3,
        cgpaRequirement: 3.8,
        acceptanceRate: 17,
        livingCost: 15000,
        englishExamRequirements: ['IELTS'],
        intakeMonths: ['October'],
        applicationDeadline: new Date('2024-10-15'),
        website: 'https://www.ox.ac.uk',
        description: 'The oldest university in the English-speaking world.'
      },
      {
        name: 'University of Cambridge',
        country: 'United Kingdom',
        city: 'Cambridge',
        degreeLevels: ['Bachelors', 'Masters', 'PhD'],
        courses: ['Engineering', 'Sciences', 'Humanities', 'Mathematics'],
        tuitionFee: 34000,
        currency: 'GBP',
        ranking: 4,
        cgpaRequirement: 3.8,
        acceptanceRate: 20,
        livingCost: 14000,
        englishExamRequirements: ['IELTS'],
        intakeMonths: ['October'],
        applicationDeadline: new Date('2024-10-15'),
        website: 'https://www.cam.ac.uk',
        description: 'Rich history and outstanding academic achievement.'
      },
      {
        name: 'University of Toronto',
        country: 'Canada',
        city: 'Toronto',
        degreeLevels: ['Bachelors', 'Masters', 'PhD'],
        courses: ['Computer Science', 'Business', 'Engineering', 'Arts'],
        tuitionFee: 45000,
        currency: 'CAD',
        ranking: 21,
        cgpaRequirement: 3.5,
        acceptanceRate: 43,
        livingCost: 16000,
        englishExamRequirements: ['IELTS', 'TOEFL'],
        intakeMonths: ['September', 'January'],
        applicationDeadline: new Date('2025-01-15'),
        website: 'https://www.utoronto.ca',
        description: 'Canada’s leading institution of learning, discovery and knowledge creation.'
      },
      {
        name: 'University of British Columbia (UBC)',
        country: 'Canada',
        city: 'Vancouver',
        degreeLevels: ['Bachelors', 'Masters', 'PhD'],
        courses: ['Computer Science', 'Engineering', 'Business', 'Life Sciences'],
        tuitionFee: 42000,
        currency: 'CAD',
        ranking: 34,
        cgpaRequirement: 3.3,
        acceptanceRate: 52,
        livingCost: 18000,
        englishExamRequirements: ['IELTS', 'TOEFL'],
        intakeMonths: ['September', 'January'],
        applicationDeadline: new Date('2025-01-15'),
        website: 'https://www.ubc.ca',
        description: 'A global centre for teaching, learning and research.'
      },
      {
        name: 'University of Melbourne',
        country: 'Australia',
        city: 'Melbourne',
        degreeLevels: ['Bachelors', 'Masters', 'PhD'],
        courses: ['Business', 'Engineering', 'Law', 'Medicine'],
        tuitionFee: 46000,
        currency: 'AUD',
        ranking: 14,
        cgpaRequirement: 3.4,
        acceptanceRate: 70,
        livingCost: 24000,
        englishExamRequirements: ['IELTS', 'TOEFL'],
        intakeMonths: ['February', 'July'],
        applicationDeadline: new Date('2024-11-30'),
        website: 'https://www.unimelb.edu.au',
        description: 'Australia’s leading university.'
      },
      {
        name: 'University of Sydney',
        country: 'Australia',
        city: 'Sydney',
        degreeLevels: ['Bachelors', 'Masters', 'PhD'],
        courses: ['Arts', 'Business', 'Engineering', 'Science'],
        tuitionFee: 48000,
        currency: 'AUD',
        ranking: 19,
        cgpaRequirement: 3.4,
        acceptanceRate: 30,
        livingCost: 26000,
        englishExamRequirements: ['IELTS', 'TOEFL'],
        intakeMonths: ['February', 'August'],
        applicationDeadline: new Date('2024-11-30'),
        website: 'https://www.sydney.edu.au',
        description: 'The first university in Australia.'
      }
    ];

    console.log('Seeding Universities...');
    for (const u of universities) {
      const exists = await University.findOne({ name: u.name });
      if (!exists) {
        await University.create(u);
        console.log(`  Inserted university: ${u.name}`);
      } else {
        console.log(`  Skipped university: ${u.name} (already exists)`);
      }
    }

    // 3. Link Universities to Countries (popularUniversities)
    console.log('Linking Universities to Countries...');
    for (const c of countries) {
      const countryDoc = await Country.findOne({ name: c.name });
      if (countryDoc) {
        const popularUnis = await University.find({ country: c.name }).limit(2);
        const uniIds = popularUnis.map(uni => uni._id);
        
        // Only update if it's currently empty (don't overwrite admin edits)
        if (countryDoc.popularUniversities && countryDoc.popularUniversities.length === 0 && uniIds.length > 0) {
          countryDoc.popularUniversities = uniIds;
          await countryDoc.save();
          console.log(`  Linked ${uniIds.length} universities to ${c.name}`);
        }
      }
    }

    // 4. Scholarships
    const scholarships = [
      {
        name: 'Fulbright Foreign Student Program',
        provider: 'U.S. Department of State',
        country: 'United States',
        universityName: null,
        description: 'Enables graduate students, young professionals and artists from abroad to study and conduct research in the US.',
        minimumCgpa: 3.5,
        degreeLevels: ['Masters', 'PhD'],
        courses: ['Computer Science', 'Business', 'Engineering', 'Arts', 'Sciences'],
        eligibleCountries: ['Global'],
        englishExamRequirements: ['TOEFL', 'IELTS'],
        amount: 50000,
        currency: 'USD',
        coverageType: 'Full',
        applicationDeadline: new Date('2024-10-15'),
        website: 'https://foreign.fulbrightonline.org/'
      },
      {
        name: 'Chevening Scholarship',
        provider: 'UK Government',
        country: 'United Kingdom',
        universityName: null,
        description: 'Funded by the Foreign, Commonwealth and Development Office and partner organisations.',
        minimumCgpa: 3.3,
        degreeLevels: ['Masters'],
        courses: ['Business', 'Law', 'Public Policy', 'Humanities'],
        eligibleCountries: ['Global'],
        englishExamRequirements: ['IELTS'],
        amount: 30000,
        currency: 'GBP',
        coverageType: 'Full',
        applicationDeadline: new Date('2024-11-07'),
        website: 'https://www.chevening.org/'
      },
      {
        name: 'Vanier Canada Graduate Scholarships',
        provider: 'Government of Canada',
        country: 'Canada',
        universityName: 'University of Toronto',
        description: 'To attract and retain world-class doctoral students.',
        minimumCgpa: 3.7,
        degreeLevels: ['PhD'],
        courses: ['Health Research', 'Natural Sciences', 'Engineering', 'Social Sciences'],
        eligibleCountries: ['Global'],
        englishExamRequirements: ['IELTS', 'TOEFL'],
        amount: 50000,
        currency: 'CAD',
        coverageType: 'Full',
        applicationDeadline: new Date('2024-11-01'),
        website: 'https://vanier.gc.ca/'
      },
      {
        name: 'Australia Awards Scholarships',
        provider: 'Department of Foreign Affairs and Trade',
        country: 'Australia',
        universityName: null,
        description: 'Long-term awards administered by the Department of Foreign Affairs and Trade.',
        minimumCgpa: 3.0,
        degreeLevels: ['Bachelors', 'Masters', 'PhD'],
        courses: ['Development', 'Health', 'Education', 'Engineering'],
        eligibleCountries: ['Developing Countries'],
        englishExamRequirements: ['IELTS', 'TOEFL'],
        amount: 40000,
        currency: 'AUD',
        coverageType: 'Full',
        applicationDeadline: new Date('2024-04-30'),
        website: 'https://www.dfat.gov.au/people-to-people/australia-awards/australia-awards-scholarships'
      }
    ];

    console.log('Seeding Scholarships...');
    for (const s of scholarships) {
      const exists = await Scholarship.findOne({ name: s.name });
      if (!exists) {
        let uniId = null;
        if (s.universityName) {
          const uni = await University.findOne({ name: s.universityName });
          if (uni) {
            uniId = uni._id;
          }
        }
        
        const scholarshipData = { ...s };
        delete scholarshipData.universityName;
        if (uniId) {
          scholarshipData.university = uniId;
        }

        await Scholarship.create(scholarshipData);
        console.log(`  Inserted scholarship: ${s.name}`);
      } else {
        console.log(`  Skipped scholarship: ${s.name} (already exists)`);
      }
    }

    // 5. Synthetic User
    console.log('Seeding Synthetic User...');
    const testEmail = 'teststudent@unicofinder.local';
    let testUser = await User.findOne({ email: testEmail });
    
    if (!testUser) {
      // Mongoose pre-save hook on User model hashes the password.
      // We pass plaintext and save().
      testUser = new User({
        name: 'Test Student',
        email: testEmail,
        password: 'password123',
        cgpa: 3.6,
        course: 'Computer Science',
        degree: 'Masters',
        budget: 40000,
        countryPreference: 'United States',
        englishExam: 'IELTS',
        examScore: 7.5,
        role: 'student',
        isActive: true,
        wishlist: [],
        applications: []
      });
      await testUser.save();
      console.log(`  Inserted user: ${testEmail}`);
    } else {
      console.log(`  Skipped user: ${testEmail} (already exists)`);
    }

    // 6. Applications and Wishlist
    console.log('Seeding Applications & Wishlist...');
    const harvard = await University.findOne({ name: 'Harvard University' });
    const ubc = await University.findOne({ name: 'University of British Columbia (UBC)' });
    const cambridge = await University.findOne({ name: 'University of Cambridge' });
    const mit = await University.findOne({ name: 'Massachusetts Institute of Technology (MIT)' });
    
    if (testUser && harvard && ubc && cambridge && mit) {
      // Create applications if none exist for this user
      const existingApps = await Application.find({ user: testUser._id });
      
      if (existingApps.length === 0) {
        // App 1: Harvard - Applied
        const app1 = await Application.create({
          user: testUser._id,
          university: harvard._id,
          course: 'Computer Science',
          term: 'Fall 2025',
          status: 'Applied',
          applicationDate: new Date('2024-08-01')
        });

        // App 2: MIT - Planning
        const app2 = await Application.create({
          user: testUser._id,
          university: mit._id,
          course: 'Computer Science',
          term: 'Fall 2025',
          status: 'Planning'
        });

        // App 3: Cambridge - Waitlisted
        const app3 = await Application.create({
          user: testUser._id,
          university: cambridge._id,
          course: 'Computer Science',
          term: 'Fall 2025',
          status: 'Waitlisted',
          applicationDate: new Date('2024-07-15')
        });

        console.log(`  Inserted 3 applications for user: ${testEmail}`);

        // Update User's application array
        testUser.applications = [app1._id, app2._id, app3._id];
        
        // Seed Wishlist
        testUser.wishlist = [
          { university: ubc._id, priority: 'High', note: 'Great campus in Vancouver.' },
          { university: mit._id, priority: 'Medium', note: 'Need to improve my GRE.' }
        ];

        // Need to run save() to persist array changes, but we don't want password re-hashing if not modified. 
        // The pre-save hook handles isModified('password'), so this is safe.
        await testUser.save();
        console.log(`  Updated user's wishlist and applications arrays.`);
      } else {
         console.log(`  Skipped applications/wishlist (user already has applications).`);
      }
    }

    console.log('Seeding completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

seedData();
