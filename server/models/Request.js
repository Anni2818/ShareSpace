const mongoose = require('mongoose');

const requestSchema = new mongoose.Schema({
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  seeker: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  },
  createdAt: { type: Date, default: Date.now },
});

requestSchema.index({ post: 1, seeker: 1 }, { unique: true });

module.exports = mongoose.model('Request', requestSchema);
