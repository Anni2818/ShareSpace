const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ['seeker', 'poster', 'admin'],
    default: 'seeker',
  },
  hobbies: [String],
  preferences: {
    smoking: Boolean,
    pets: Boolean,
    nightOwl: Boolean,
    cleanlinessLevel: Number,
  },
  isVerified: { type: Boolean, default: false },
  aadharCardUrl: String,
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
