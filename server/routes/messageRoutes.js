const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// POST /api/messages/send
router.post('/send', protect, messageController.sendMessage);

// GET /api/messages/:userId
router.get('/:userId', protect, messageController.getChatMessages);

// POST /api/messages/mark-read
router.post('/mark-read', protect, messageController.markAsRead);

module.exports = router;
