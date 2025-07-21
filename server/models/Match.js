const mongoose = require('mongoose');

const matchSchema = new mongoose.Schema({
  seeker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['liked', 'matched', 'rejected'],
    default: 'liked'
  },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
});

// Ensure a seeker can match a post only once
matchSchema.index({ seeker: 1, post: 1 }, { unique: true });

module.exports = mongoose.model('Match', matchSchema);
