const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  getMyPosts,
} = require('../controllers/postController');

const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllPosts)        // public
  .post(protect, createPost); // only logged-in users

router.route('/my')
  .get(protect, getMyPosts); // only for logged-in user

router.route('/:id')
  .get(getPostById)
  .put(protect, updatePost)
  .delete(protect, deletePost);

module.exports = router;
