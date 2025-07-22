const express = require('express');
const {
  createRequest,
  acceptRequest,
  rejectRequest,
  getRequestsForPost,
  getMyRequests
} = require('../controllers/requestController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new request to a post
router.post('/:postId', protect, createRequest);

// Accept or reject a request (poster only)
router.patch('/:requestId/accept', protect, acceptRequest);
router.patch('/:requestId/reject', protect, rejectRequest);

// Poster gets all requests for their post
router.get('/post/:postId', protect, getRequestsForPost);

// Seeker views all their own sent requests
router.get('/my', protect, getMyRequests);

module.exports = router;
