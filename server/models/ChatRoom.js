const mongoose = require('mongoose');

const chatRoomSchema = new mongoose.Schema({
  participants: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  ],
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ChatRoom', chatRoomSchema);
