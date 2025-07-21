const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  rent: { type: Number, required: true },
  tags: [String],
  hobbies: [String], // Preferred roommate hobbies
  description: String,
  images: [String], // URLs to room photos
  genderPreference: {
    type: String,
    enum: ['male', 'female', 'any'],
    default: 'any',
  },
  roomType: {
    type: String,
    enum: ['private', 'shared'],
    default: 'private',
  },
  availabilityFrom: { type: Date, default: Date.now },
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
