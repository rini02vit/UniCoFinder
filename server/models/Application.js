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
    course: {
      type: String,
      required: true,
    },
    term: {
      type: String,
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
    documentsCompleted: {
      type: [String],
      default: []
    },
    deadlineReminderSent: {
      type: Boolean,
      default: false
    },
    staleReminderSent: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ createdAt: -1 });

const Application = mongoose.model('Application', applicationSchema);

export default Application;
