const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: String,
  location: String,
  rent: Number,
  tags: [String],
  hobbies: [String], // Preferred roommate hobbies
  description: String,
  isAvailable: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', postSchema);
