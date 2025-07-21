const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createOrGetChatRoom,
  getUserChatRooms
} = require('../controllers/chatRoomController');

router.post('/create-or-get', protect, createOrGetChatRoom);
router.get('/my-rooms', protect, getUserChatRooms);

module.exports = router;
