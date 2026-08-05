import mongoose from 'mongoose';

const universitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    country: {
      type: String,
      required: true,
      index: true,
    },
    city: {
      type: String,
    },
    degreeLevels: {
      type: [String],
      index: true,
    },
    courses: [
      {
        type: String,
        trim: true,
      },
    ],
    tuitionFee: {
      type: Number,
      index: true,
    },
    currency: {
      type: String,
      default: 'USD',
    },
    ranking: {
      type: Number,
      index: true,
    },
    cgpaRequirement: {
      type: Number,
      index: true,
    },
    acceptanceRate: {
      type: Number,
    },
    livingCost: {
      type: Number,
    },
    englishExamRequirements: [
      {
        type: String,
      },
    ],
    intakeMonths: [
      {
        type: String,
      },
    ],
    applicationDeadline: {
      type: Date,
    },
    website: {
      type: String,
      validate: {
        validator: function (v) {
          const urlRegex = new RegExp('^(https?:\\\\/\\\\/)?([\\\\da-z.-]+)\\\\.([a-z.]{2,6})([/\\\\w .-]*)*\\\\/?$');
          return urlRegex.test(v);
        },
        message: (props) => `${props.value} is not a valid URL!`,
      },
    },
    description: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const University = mongoose.model('University', universitySchema);

export default University;
