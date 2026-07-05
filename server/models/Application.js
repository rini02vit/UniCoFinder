import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    status: {
      type: String,
      enum: [
        'Planning',
        'Applied',
        'Under Review',
        'Accepted',
        'Rejected',
        'Waitlisted',
      ],
      default: 'Planning',
    },
    applicationDate: {
      type: Date,
    },
    notes: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);

export default Application;
