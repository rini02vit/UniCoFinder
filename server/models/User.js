import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    cgpa: {
      type: Number,
    },
    course: {
      type: String,
    },
    degree: {
      type: String,
    },
    budget: {
      type: Number,
    },
    countryPreference: {
      type: String,
    },
    englishExam: {
      type: String,
    },
    examScore: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to hash password before saving to database
userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to compare entered password with hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;
