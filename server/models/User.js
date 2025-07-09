const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
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
  aadharCardUrl: { type: String }, // optional
});

module.exports = mongoose.model('User', userSchema);
