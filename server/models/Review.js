import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
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
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      required: true,
      maxlength: 1000,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Enforce one review per user per university
reviewSchema.index({ user: 1, university: 1 }, { unique: true });

// Support fast retrieval and sorting of reviews for a university
reviewSchema.index({ university: 1, createdAt: -1 });

const Review = mongoose.model('Review', reviewSchema);

export default Review;
