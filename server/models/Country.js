import mongoose from 'mongoose';

const countrySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    code: {
      type: String,
      index: true,
    },
    capital: {
      type: String,
    },
    currency: {
      type: String,
    },
    language: {
      type: String,
    },
    continent: {
      type: String,
      index: true,
    },
    averageTuitionFee: {
      type: Number,
    },
    averageLivingCost: {
      type: Number,
    },
    visaRequirements: {
      type: String,
    },
    workPermit: {
      type: Boolean,
    },
    postStudyWorkVisa: {
      type: Boolean,
    },
    popularUniversities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
      },
    ],
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Country = mongoose.model('Country', countrySchema);

export default Country;
