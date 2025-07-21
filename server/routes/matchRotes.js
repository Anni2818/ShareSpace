const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const matchController = require('../controllers/matchController');

// Route to get compatibility between seeker and a specific post
router.get('/compatibility/:postId', protect, matchController.getCompatibility);

module.exports = router;
