import mongoose from 'mongoose';

const scholarshipSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    provider: {
      type: String,
    },
    country: {
      type: String,
      index: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
    },
    description: {
      type: String,
    },
    minimumCgpa: {
      type: Number,
    },
    degreeLevels: [
      {
        type: String,
      },
    ],
    courses: [
      {
        type: String,
      },
    ],
    eligibleCountries: [
      {
        type: String,
      },
    ],
    englishExamRequirements: [
      {
        type: String,
      },
    ],
    amount: {
      type: Number,
    },
    currency: {
      type: String,
    },
    coverageType: {
      type: String,
      enum: ['Full', 'Partial', 'Tuition', 'Living'],
    },
    applicationDeadline: {
      type: Date,
      index: true,
    },
    website: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);

export default Scholarship;
