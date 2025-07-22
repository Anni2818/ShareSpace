const mongoose = require('mongoose');
const matchSchema = new mongoose.Schema({
  seeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  status: {
    type: String,
    enum: ['liked', 'rejected'],
    default: 'liked'
  }
});

