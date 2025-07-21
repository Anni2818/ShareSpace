const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  reviewee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true
  },
  comment: {
    type: String,
    maxlength: 1000
  },
  isAnonymous: { type: Boolean, default: false },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// One reviewer can review one reviewee per post
reviewSchema.index({ reviewer: 1, reviewee: 1, post: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);
